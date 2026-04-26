-- pgvector 拡張
CREATE EXTENSION IF NOT EXISTS vector;

-- pg_trgm 拡張（全文検索用）
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ユーザーテーブル（Prisma が管理するが初期化用に定義）
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(10) DEFAULT 'user'
);

-- RAG 用ベクトル埋め込みテーブル
-- Gemini text-embedding-004 は 768 次元
CREATE TABLE IF NOT EXISTS "DocumentEmbedding" (
    id          SERIAL PRIMARY KEY,
    "sourceType" TEXT NOT NULL,   -- 'announcement' | 'user' | 'inquiry'
    "sourceId"   INTEGER NOT NULL,
    content     TEXT NOT NULL,    -- 埋め込んだテキスト本文
    embedding   vector(768),
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- HNSW インデックス（高速コサイン類似度検索）
CREATE INDEX IF NOT EXISTS idx_doc_embedding_hnsw
    ON "DocumentEmbedding" USING hnsw (embedding vector_cosine_ops);

-- ソース別検索用インデックス
CREATE INDEX IF NOT EXISTS idx_doc_embedding_source
    ON "DocumentEmbedding" ("sourceType", "sourceId");
