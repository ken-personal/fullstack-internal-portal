# 社内管理ポータルシステム

> Next.js × NestJS × AWS を用いたフルスタック社内管理システム

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
| Frontend | Next.js (App Router) / TypeScript / Tailwind CSS / shadcn/ui |
| Backend | NestJS / Node.js / Prisma ORM / JWT / bcrypt |
| Database | PostgreSQL |
| Infrastructure | Docker / Docker Compose |
| 本番想定 | AWS ECS Fargate / ALB / RDS Multi-AZ / Terraform / GitHub Actions |

---

## 主な機能

- **JWT認証** — ログイン・サインアップ・バックエンドGuardによる保護
- **ダッシュボード** — 売上・経費・問い合わせデータのリアルタイム集計
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

## 工夫した点・技術的チャレンジ

| 課題 | 対応内容 |
|-----|---------|
| 認証セキュリティ | フロント依存だった認証構造をバックエンドGuard保護へ改善 |
| パスワード管理 | bcryptによる二重ハッシュ化の設計修正 |
| DB整合性 | Prisma Schema・型・実DBの不整合問題を解決 |
| 開発環境 | Docker内部ネットワークとPrisma接続エラーの解決 |
| ビルド最適化 | ビルドキャッシュ問題の原因特定と再構築フロー確立 |

---

## セットアップ
```bash
# 起動
docker-compose down
docker-compose up --build

# DBマイグレーション
docker-compose exec backend-nestjs npx prisma migrate dev
```

---

## 本番インフラ構成（別リポジトリで実装済み）

本システムのAWS本番インフラは以下の構成で別途設計・構築済みです。

- **AWS ECS Fargate** — コンテナをPrivate Subnetに配置したセキュア構成
- **ALB + ACM + Route53** — HTTPS対応
- **RDS PostgreSQL Multi-AZ** — 自動フェイルオーバー
- **Terraform** — モジュール分割によるIaC化
- **GitHub Actions** — OIDC認証 / Trivyセキュリティスキャン / ECSローリングデプロイ
- **CloudWatch / EventBridge / SNS** — 監視・アラート基盤