# 社内管理ポータルシステム

<div align="center">

**Next.js × NestJS × AWS × AI によるプロダクションレディなフルスタック社内管理システム**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?style=for-the-badge&logo=nestjs)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![AWS](https://img.shields.io/badge/AWS-ECS_Fargate-FF9900?style=for-the-badge&logo=amazon-aws)](https://aws.amazon.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Terraform](https://img.shields.io/badge/Terraform-IaC-7B42BC?style=for-the-badge&logo=terraform)](https://www.terraform.io/)

🔗 **[デモを見る](https://frontend-seven-mu-71.vercel.app)** | 📖 **[Zenn記事](https://zenn.dev/kenpersonal2507/articles/ecs-fargate-terraform-cicd)**

> ⚠️ デモ環境はバックエンド未接続。ログイン画面まで確認可能。

</div>

---

## 📌 プロジェクト概要

通信キャリア向けAWS監視システムの**実務2年6ヶ月**の経験をベースに、
**「本番稼働を前提とした設計」** を徹底して構築したフルスタック社内管理システムです。

フロントエンド・バックエンド・インフラ・CI/CDまで**一気通貫で実装**し、
AI機能・決済機能・全文検索・ファイル管理など、実務で求められる機能を網羅しています。

---

## 🖥 スクリーンショット

### ログイン・ダッシュボード
| ログイン | ダッシュボード |
|---------|------------|
| ![Login](./docs/screenshots/login.png) | ![Dashboard](./docs/screenshots/dashboard.png) |

### AI・検索・決済
| AIチャットボット | 全文検索 |
|---------------|--------|
| ![Chat](./docs/screenshots/chat.png) | ![Search](./docs/screenshots/search.png) |

| 資料管理 | 料金プラン（Stripe） |
|--------|-----------------|
| ![Documents](./docs/screenshots/documents.png) | ![Stripe](./docs/screenshots/stripe.png) |

---

## ⚡ 主な機能

| 機能 | 概要 | 技術 |
|-----|------|------|
| 🔐 JWT認証 | ログイン・サインアップ・Guard保護 | NestJS / bcrypt |
| 👥 RBAC権限管理 | ADMIN / MANAGER / USERの3ロール制御 | NestJS RolesGuard |
| 📊 ダッシュボード | 売上・経費・KPI・グラフ可視化 | Recharts |
| 🤖 AIチャットボット | 社内FAQに特化したAIアシスタント | Gemini API |
| 📁 資料アップロード | S3へのセキュアなファイル管理 | AWS S3 / Presigned URL |
| 🔍 全文検索 | 社員・お知らせ・問い合わせ横断検索 | PostgreSQL pg_trgm / GIN |
| 💳 決済機能 | サブスクリプションプラン管理 | Stripe Checkout |
| 📧 メール通知 | ログイン時の自動メール送信 | SendGrid API |
| 🚀 CI/CD | 自動テスト・脆弱性スキャン・ECSデプロイ | GitHub Actions / Trivy |
| 🏗 IaC | 本番AWSインフラの完全コード化 | Terraform |

---

## 🛠 技術スタック

```
Frontend         │ Next.js 15 (App Router) / TypeScript / Recharts
Backend          │ NestJS / Prisma ORM / JWT / bcrypt
Database         │ PostgreSQL 16 / pg_trgm（全文検索）
Infrastructure   │ AWS ECS Fargate / ALB / RDS Multi-AZ / S3
IaC              │ Terraform（モジュール分割構成）
CI/CD            │ GitHub Actions / OIDC / Trivy / ECR
AI               │ Gemini API（Google AI Studio）
Payment          │ Stripe Checkout（サブスクリプション）
Notification     │ SendGrid / react-hot-toast
Monitoring       │ CloudWatch / EventBridge / SNS / CloudTrail
Container        │ Docker / Docker Compose
```

---

## 🏗 アーキテクチャ

```
┌─────────────────────────────────────────────────────────┐
│                    フロントエンド                          │
│              Next.js (App Router / Vercel)               │
└────────────────────────┬────────────────────────────────┘
                         │ JWT付きAPIリクエスト
┌────────────────────────▼────────────────────────────────┐
│                    バックエンド                            │
│         NestJS (ECS Fargate / Private Subnet)            │
│   JwtAuthGuard / RolesGuard / ビジネスロジック             │
└──────────┬──────────────────────────┬───────────────────┘
           │                          │
┌──────────▼──────────┐   ┌──────────▼──────────┐
│    PostgreSQL        │   │      AWS S3          │
│  (RDS Multi-AZ)      │   │  (資料ファイル管理)   │
│  pg_trgm 全文検索    │   │  Presigned URL       │
└─────────────────────┘   └─────────────────────┘

外部サービス連携
├── Gemini API（AIチャットボット）
├── Stripe（サブスクリプション決済）
├── SendGrid（メール通知）
└── CloudWatch / SNS（監視・アラート）
```

---

## ☁ 本番インフラ構成（AWS / Terraform）

| リソース | 構成内容 |
|---------|---------|
| ECS Fargate | フロント・バックをPrivate Subnetに配置 |
| ALB + ACM | HTTPS対応・ヘルスチェック |
| RDS PostgreSQL | Multi-AZ・自動フェイルオーバー |
| S3 | 資料ファイルのセキュアストレージ |
| CloudWatch | CPU / メモリ / ALB 5xxエラー監視 |
| EventBridge | ECSタスク停止・RDSイベント検知 |
| SNS + SQS | アラート通知基盤 |
| CloudTrail | 操作ログ・改ざん検知 |
| WAF | 不正アクセス防御 |

---

## 🔄 CI/CDパイプライン

| ワークフロー | トリガー | 内容 |
|-----------|--------|------|
| frontend-ci | PR時 | ESLint / 型チェック / Jest |
| backend-ci | PR時 | ESLint / 型チェック / Jest / Prisma検証 |
| frontend-cd | mainへのpush | ECRビルド / Trivyスキャン / ECSデプロイ |
| backend-cd | mainへのpush | ECRビルド / Trivyスキャン / マイグレーション / ECSデプロイ |

- **OIDC認証** — AWSアクセスキー不要のセキュアな認証
- **Trivyスキャン** — HIGH / CRITICAL脆弱性検出時はデプロイ自動停止
- **SNS通知** — デプロイ成功・失敗をメールで通知

---

## 🔍 全文検索（PostgreSQL pg_trgm）

```sql
-- GINインデックスによる高速あいまい検索
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX idx_user_name_trgm ON "User" USING GIN (name gin_trgm_ops);

-- 社員・お知らせ・問い合わせの横断検索
SELECT * FROM "User"
WHERE name % $1 OR name ILIKE '%' || $1 || '%'
ORDER BY similarity(name, $1) DESC;
```

---

## 💳 Stripe決済機能

```typescript
// サブスクリプションセッション作成
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  mode: 'subscription',
  line_items: [{ price_data: { currency: 'jpy', ... }, quantity: 1 }],
  success_url: `${BASE_URL}/stripe/success`,
  cancel_url: `${BASE_URL}/stripe/cancel`,
});
```

---

## 📁 資料アップロード（AWS S3 Presigned URL）

```typescript
// クライアントから直接S3にアップロード（セキュアな設計）
const { uploadUrl, key } = await s3Service.generateUploadUrl(fileName, contentType);
// フロントエンドからPresigned URLに直接PUT
await fetch(uploadUrl, { method: 'PUT', body: file });
```

---

## 🚀 ローカル起動

```bash
# リポジトリのクローン
git clone https://github.com/ken-personal/fullstack-internal-portal
cd fullstack-internal-portal

# Docker起動
docker-compose up --build

# DBマイグレーション
docker-compose exec backend-nestjs npx prisma db push

# アクセス
# フロントエンド: http://localhost:3000
# バックエンド:   http://localhost:3001
```

### 環境変数

```env
# backend-nestjs/.env
DATABASE_URL="postgresql://devuser:devpass@postgres:5432/devdb"
JWT_SECRET="your_jwt_secret"
SENDGRID_API_KEY="your_sendgrid_key"
AWS_REGION="ap-northeast-1"
AWS_ACCESS_KEY_ID="your_access_key"
AWS_SECRET_ACCESS_KEY="your_secret_key"
AWS_S3_BUCKET_NAME="your_bucket_name"
STRIPE_SECRET_KEY="sk_test_..."

# frontend/.env.local
NEXT_PUBLIC_GEMINI_API_KEY="your_gemini_key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

---

## 📁 ディレクトリ構成

```
fullstack-internal-portal/
├── frontend/                    # Next.js (App Router)
│   └── src/app/
│       ├── dashboard/           # ダッシュボード
│       ├── chat/                # AIチャットボット
│       ├── documents/           # 資料管理
│       ├── search/              # 全文検索
│       └── stripe/              # 決済
├── backend-nestjs/              # NestJS
│   └── src/
│       ├── auth/                # JWT認証
│       ├── documents/           # S3ファイル管理
│       ├── search/              # pg_trgm検索
│       ├── stripe/              # Stripe決済
│       └── database/            # Prisma
├── AWS_Terraform/               # インフラIaC
│   ├── modules/
│   │   ├── ecs/
│   │   ├── rds/
│   │   ├── alb/
│   │   └── monitoring/
└── .github/workflows/           # CI/CD
    ├── frontend-ci.yml
    ├── backend-ci.yml
    ├── frontend-cd.yml
    └── backend-cd.yml
```

---

## 🔧 工夫した点・技術的チャレンジ

| 課題 | 対応内容 |
|-----|---------|
| 認証セキュリティ | フロント依存の認証をNestJS Guardに移行 |
| S3セキュリティ | Presigned URLで直接アップロード（バックエンド経由なし） |
| 検索パフォーマンス | GINインデックス + pg_trgmであいまい検索を高速化 |
| CI/CDセキュリティ | OIDCでAWSアクセスキーをゼロに |
| インフラ監視 | CloudWatch + EventBridge + SNSで障害を即時検知 |
| 決済セキュリティ | Stripe Webhookで支払い状態をサーバーサイドで検証 |
| コンテナセキュリティ | Trivyで毎デプロイ時に脆弱性スキャン |

---

## 👨‍💻 作者

**茂木 健一**

- 本業：通信キャリア向けAWS監視システム運用・障害対応（2年6ヶ月）
- CloudWatchアラーム・通知フロー・自動化ロジックの改善提案が本番反映3件
- AWS SAA取得済み / AWS SAP学習中

[![Zenn](https://img.shields.io/badge/Zenn-技術記事-3EA8FF?style=flat-square&logo=zenn)](https://zenn.dev/kenpersonal2507/articles/ecs-fargate-terraform-cicd)

---

<div align="center">

**副業・業務委託での参画を希望しています。**
週20〜30時間 / フルリモート / 平日日中帯対応可 / 即参画可能

</div>
