# 社内管理ポータルシステム

Next.js（Frontend）と NestJS（Backend）を分離構成で実装したフルスタック社内管理システムです。
Docker Compose により開発環境を統合管理しています。

UIは Tailwind + admin-one-react-tailwind をベースにしていますが、API設計・認証ロジック・DB設計は独自実装です。

---

## Overview

- JWTを用いた認証設計
- フロント / バックエンド分離構成
- Prisma + PostgreSQLによるデータ設計
- Dockerによる開発環境構築
- AWS本番環境移行を想定した構造

---

## Architecture

![Architecture](./docs/architecture.png)

構成概要:
- Next.js → API通信（JWT付与）
- NestJS → 認証Guardで保護
- Prisma → PostgreSQL接続
- Docker内部ネットワークでサービス間通信

---

## Features

- JWT認証（Login / Signup）
- ダッシュボード（売上・経費自動集計）
- 社員名簿（検索機能付き）
- 問い合わせデータの永続化

---

## Tech Stack

Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS

Backend
- NestJS
- Prisma ORM
- JWT / bcrypt

Database
- PostgreSQL

Infrastructure
- Docker / Docker Compose

---

## Technical Challenges

- Docker内部ネットワークとPrisma接続エラーの解決
- ビルドキャッシュ問題の原因特定と再構築フロー確立
- パスワード二重ハッシュ化の設計修正
- フロント依存だった認証構造をバックエンド保護へ改善
- Prisma Schema・型・実DBの不整合問題の解決

---

## Setup

```bash
docker-compose down
docker-compose up --build
docker-compose exec backend-nestjs npx prisma migrate dev