# 1. Node イメージを指定
FROM node:20-alpine

# 2. 作業ディレクトリを作成
WORKDIR /app

# 3. package.json と package-lock.json をコピー
COPY package*.json ./

# 4. 依存関係をインストール
RUN npm install

# 5. ソースコードをコピー
COPY . .

# 6. ポート 3000 を公開
EXPOSE 3000

# 7. Next.js 開発サーバー起動
CMD ["npm", "run", "dev"]
