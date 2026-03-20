# 社内管理ポータルシステム
> Next.js × NestJS × AWS を用いたフルスタック社内管理システム

🔗 **デモURL**: https://frontend-seven-mu-71.vercel.app
（※ デモ環境のためバックエンド未接続。ログイン画面まで確認可能）

![Login](./docs/screenshots/login.png)

---

## 概要

携帯キャリア向けAWS監視システムの運用経験をもとに、
**「本番稼働を前提とした設計」** を意識して構築したフルスタック社内管理システムです。

JWT認証・ダッシュボード・社員名簿・問い合わせ管理をフロントからインフラまで一気通貫で実装しています。

---

## スクリーンショット

### ログイン画面
![Login](./docs/screenshots/login.png)

### ダッシュボード
![Dashboard](./docs/screenshots/dashboard.png)

---

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| Frontend | Next.js (App Router) / TypeScript / Tailwind CSS / shadcn/ui / Recharts |
| Backend | NestJS / Node.js / Prisma ORM / JWT / bcrypt |
| Database | PostgreSQL |
| Infrastructure | Docker / Docker Compose |
| IaC | Terraform（モジュール分割構成） |
| CI/CD | GitHub Actions（OIDC認証 / Trivy / ECSデプロイ） |
| 本番環境 | AWS ECS Fargate / ALB / RDS Multi-AZ / CloudWatch / SNS |

---

## 主な機能

- **JWT認証** — ログイン・サインアップ・バックエンドGuardによる保護
- **ダッシュボード** — 売上・経費・利益のグラフ可視化・KPIカード・アクティビティフィード
- **社員名簿** — 検索・フィルター機能付き
- **問い合わせ管理** — データの永続化・ステータス管理

---

## アーキテクチャ
```
Next.js (Frontend)
  └─ JWT付きAPIリクエスト
      └─ NestJS (Backend)
          └─ 認証Guard / ビジネスロジック
              └─ Prisma ORM
                  └─ PostgreSQL
```

- フロント / バックエンド完全分離構成
- Docker内部ネットワークでサービス間通信
- AWS本番環境移行を想定した構造

---

## CI/CD パイプライン

`.github/workflows/` に Frontend / Backend それぞれCI・CDを実装。

| ワークフロー | トリガー | 内容 |
|------------|--------|------|
| frontend-ci | PR時（frontend/変更） | ESLint / 型チェック / Jest |
| backend-ci | PR時（backend/変更） | ESLint / 型チェック / Jest / Prismaバリデーション |
| frontend-cd | mainへのpush | ECRビルド / Trivyスキャン / ECSデプロイ / SNS通知 |
| backend-cd | mainへのpush | ECRビルド / Trivyスキャン / Prismaマイグレーション / ECSデプロイ / SNS通知 |

- **OIDC認証** — AWSアクセスキー不要のセキュアな認証方式
- **Trivyスキャン** — HIGH・CRITICAL脆弱性検出時はデプロイ自動停止
- **SNS通知** — デプロイ成功・失敗をメール通知

---

## 本番インフラ構成（`AWS_Terraform/`）

| リソース | 構成内容 |
|---------|---------|
| ECS Fargate | フロント・バックエンドをPrivate Subnetに配置 |
| ALB + ACM + Route53 | HTTPS対応・カスタムドメイン |
| RDS PostgreSQL | Multi-AZ・自動フェイルオーバー |
| CloudWatch | ECS CPU / RDS CPU・メモリ / ALB 5xxエラー監視 |
| EventBridge | ECSタスク停止・RDSイベント検知 |
| SNS + SQS | アラート通知基盤 |
| CloudTrail | 操作ログ・改ざん検知 |

---

## 工夫した点・技術的チャレンジ

| 課題 | 対応内容 |
|-----|---------|
| 認証セキュリティ | フロント依存だった認証構造をバックエンドGuard保護へ改善 |
| パスワード管理 | bcryptによる二重ハッシュ化の設計修正 |
| DB整合性 | Prisma Schema・型・実DBの不整合問題を解決 |
| 開発環境 | Docker内部ネットワークとPrisma接続エラーの解決 |
| ビルド最適化 | ビルドキャッシュ問題の原因特定と再構築フロー確立 |
| CI/CDセキュリティ | OIDCによるAWSアクセスキーレス認証を実装 |
| インフラ監視 | CloudWatch・EventBridge・SNSによるアラート基盤を構築 |

---

## セットアップ
```bash
# 起動
docker-compose down
docker-compose up --build

# DBマイグレーション
docker-compose exec backend-nestjs npx prisma migrate dev
```