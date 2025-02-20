# ベースイメージ
FROM node:22

# 作業ディレクトリを設定
WORKDIR /app

# パッケージファイルをコピー
COPY package*.json ./ 
COPY prisma ./prisma

# 依存関係をインストール
RUN npm install

RUN npx prisma generate