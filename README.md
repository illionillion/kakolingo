# 環境構築

1. `.env`ファイルを作成し必要な環境変数を設定

```env
MYSQL_USER=root
MYSQL_PORT=3306
MYSQL_PASSWORD=password
MYSQL_DATABASE=my_db
NEXTJS_PORT=8080
ADMIN_PORT=9090
API_KEY=your-api-key
```

2. 必要なライブラリをインストール

```bash
docker compose run --rm app npm i
```

3. コンテナの起動

```bash
docker compose up -d
```

4. コンテナの終了

```bash
docker compose down
```