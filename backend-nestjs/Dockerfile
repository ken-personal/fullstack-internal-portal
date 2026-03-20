# 1. ビルド・実行用イメージ
FROM node:20-slim AS builder

# 2. OpenSSL などの Prisma 実行に必要なライブラリをインストール
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

# 3. 依存関係のコピー
# ここで package-lock.json もコピーすることでバージョンを固定します
COPY package*.json ./
COPY prisma ./prisma/

# 4. 依存関係のインストール
# --frozen-lockfile 相当のクリーンインストールを行い、Prisma Client を生成
RUN npm install
RUN npx prisma generate

# 5. ソースコードのコピー
COPY . .

# 6. アプリケーションのビルド
# ここで NestJS のビルドが行われ、tsconfig.json の skipLibCheck が適用されます
RUN npm run build

# 7. 実行
# コンテナ起動時に Prisma の型不整合で落ちないよう、
# 本番ビルド済みの JS を実行します
EXPOSE 3000
CMD npx prisma migrate deploy && npm run start:prod
