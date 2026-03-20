# 1. Node イメージを指定
FROM node:20-alpine

# 2. 作業ディレクトリを作成
WORKDIR /app

# 3. 依存関係をコピー
COPY package*.json ./

# 4. 依存関係をインストール
RUN npm install

# 5. ソースコードをコピー
COPY . .

# 6. 【重要】本番用にビルドする
# Next.jsはここで最適化されたファイルを作成します
RUN npm run build

# 7. ポート 3000 を公開
EXPOSE 3000

# 8. 【変更】本番サーバーを起動
# dev ではなく start を使います
CMD ["npm", "run", "start"]