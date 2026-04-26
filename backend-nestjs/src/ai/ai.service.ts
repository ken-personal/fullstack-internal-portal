import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaService } from '../database/prisma.service';

interface EmbeddingRow {
  id: number;
  sourceType: string;
  sourceId: number;
  content: string;
  similarity: number;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly genAI: GoogleGenerativeAI;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    this.genAI = new GoogleGenerativeAI(
      this.config.getOrThrow<string>('GEMINI_API_KEY'),
    );
  }

  // ─── ベクトル埋め込み生成 ───────────────────────────────────────────────

  private async embedText(text: string): Promise<number[]> {
    const model = this.genAI.getGenerativeModel({
      model: 'text-embedding-004',
    });
    const result = await model.embedContent(text);
    return result.embedding.values;
  }

  /** 埋め込みベクトルを SQL の vector リテラルに変換 */
  private toVectorLiteral(values: number[]): string {
    return `[${values.join(',')}]`;
  }

  // ─── インデックス管理 ───────────────────────────────────────────────────

  /**
   * 社内データ（お知らせ・ユーザー・問い合わせ）を全件埋め込んで保存する。
   * ADMIN ロールの API から呼び出す想定。
   */
  async indexAllData(): Promise<{ indexed: number }> {
    let indexed = 0;

    // お知らせ
    const announcements = await this.prisma.announcement.findMany();
    for (const a of announcements) {
      const text = `[お知らせ] タイトル: ${a.title}\n内容: ${a.content}\n投稿者: ${a.author}`;
      await this.upsertEmbedding('announcement', a.id, text);
      indexed++;
    }

    // ユーザー
    const users = await this.prisma.user.findMany();
    for (const u of users) {
      const text = `[社員] 名前: ${u.name} / 役職: ${u.title} / ロール: ${u.role} / メール: ${u.email}`;
      await this.upsertEmbedding('user', u.id, text);
      indexed++;
    }

    // 問い合わせ
    const inquiries = await this.prisma.inquiry.findMany();
    for (const i of inquiries) {
      const text = `[問い合わせ] タイトル: ${i.title}\n内容: ${i.message}`;
      await this.upsertEmbedding('inquiry', i.id, text);
      indexed++;
    }

    this.logger.log(`Indexed ${indexed} documents`);
    return { indexed };
  }

  private async upsertEmbedding(
    sourceType: string,
    sourceId: number,
    content: string,
  ): Promise<void> {
    const values = await this.embedText(content);
    const vectorLiteral = this.toVectorLiteral(values);

    // 既存レコードがあれば更新、なければ挿入
    const existing = await this.prisma.$queryRaw<{ id: number }[]>`
      SELECT id FROM "DocumentEmbedding"
      WHERE "sourceType" = ${sourceType} AND "sourceId" = ${sourceId}
      LIMIT 1
    `;

    if (existing.length > 0) {
      await this.prisma.$executeRaw`
        UPDATE "DocumentEmbedding"
        SET content = ${content},
            embedding = ${vectorLiteral}::vector,
            "updatedAt" = NOW()
        WHERE "sourceType" = ${sourceType} AND "sourceId" = ${sourceId}
      `;
    } else {
      await this.prisma.$executeRaw`
        INSERT INTO "DocumentEmbedding" ("sourceType", "sourceId", content, embedding, "createdAt", "updatedAt")
        VALUES (${sourceType}, ${sourceId}, ${content}, ${vectorLiteral}::vector, NOW(), NOW())
      `;
    }
  }

  // ─── RAG チャット ───────────────────────────────────────────────────────

  /**
   * ユーザーの質問に対して RAG で回答する。
   * 1. 質問をベクトル化
   * 2. pgvector でコサイン類似度検索（上位 5 件）
   * 3. 取得したコンテキストを Gemini に渡して回答生成
   */
  async chat(message: string): Promise<{ answer: string; sources: string[] }> {
    // ① 質問をベクトル化
    const queryEmbedding = await this.embedText(message);
    const vectorLiteral = this.toVectorLiteral(queryEmbedding);

    // ② pgvector でコサイン類似度検索
    const rows = await this.prisma.$queryRaw<EmbeddingRow[]>`
      SELECT
        id,
        "sourceType",
        "sourceId",
        content,
        1 - (embedding <=> ${vectorLiteral}::vector) AS similarity
      FROM "DocumentEmbedding"
      ORDER BY embedding <=> ${vectorLiteral}::vector
      LIMIT 5
    `;

    // 類似度が低すぎる場合はコンテキストなしで回答
    const relevantRows = rows.filter((r) => r.similarity > 0.6);

    // ③ プロンプト構築
    const contextBlock =
      relevantRows.length > 0
        ? relevantRows.map((r) => `- ${r.content}`).join('\n')
        : '（関連する社内情報は見つかりませんでした）';

    const prompt = `あなたは社内ポータルの AIアシスタントです。
以下の社内情報をもとに、ユーザーの質問に日本語で簡潔に回答してください。
社内情報に記載のない内容については「その情報は持ち合わせていません」と答えてください。

【社内情報】
${contextBlock}

【質問】
${message}

【回答】`;

    // ④ Gemini で回答生成
    const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const answer = result.response.text();

    // ⑤ ソース情報（どの種別データを参照したか）を返す
    const sources = [
      ...new Set(relevantRows.map((r) => r.sourceType)),
    ];

    return { answer, sources };
  }
}
