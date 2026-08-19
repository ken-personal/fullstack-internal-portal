# 負荷試験（k6）

## 実行方法

```bash
# smoke（動作確認: 1VU / 30秒）
k6 run k6-load-test.js

# 環境変数で接続先・認証情報を指定
BASE_URL=http://localhost:8000 \
TEST_EMAIL=admin@example.com \
TEST_PASSWORD=password123 \
k6 run k6-load-test.js

# 結果をJSONで保存
k6 run --out json=result.json k6-load-test.js
```

## シナリオ構成

| シナリオ | 開始 | 最大VU | 時間 | 目的 |
|---|---|---|---|---|
| smoke  | 0s   | 1  VU | 30s | 基本動作確認 |
| load   | 35s  | 20 VU | 2m  | 通常トラフィック想定 |
| stress | 175s | 50 VU | 3m  | 限界値・劣化確認 |

## 合格基準（thresholds）

| メトリクス | 基準 |
|---|---|
| `http_req_duration` p(95) | 500ms 以内 |
| `http_req_failed`         | 1% 未満 |
| `login_duration` p(95)    | 800ms 以内 |
| `search_duration` p(95)   | 600ms 以内 |
| `sales_duration` p(95)    | 400ms 以内 |

## 対象エンドポイント

- `POST /auth/login`
- `GET  /dashboard`
- `GET  /search?q=キーワード`
- `GET  /sales`
- `GET  /announcements`
