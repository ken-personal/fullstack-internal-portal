-- pg_trgm 拡張が有効であること前提（schema.prisma で extensions = [pg_trgm] 設定済み）
-- prisma db push 後にこのファイルを手動で適用する
-- 適用コマンド: psql $DATABASE_URL -f prisma/sql/001_add_gin_trgm_indexes.sql

-- User.name への GIN インデックス（社員検索の高速化）
CREATE INDEX IF NOT EXISTS idx_user_name_trgm
  ON "User" USING GIN (name gin_trgm_ops);

-- Announcement.title / content への GIN インデックス（お知らせ全文検索の高速化）
CREATE INDEX IF NOT EXISTS idx_announcement_title_trgm
  ON "Announcement" USING GIN (title gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_announcement_content_trgm
  ON "Announcement" USING GIN (content gin_trgm_ops);

-- Inquiry.title / message への GIN インデックス（問い合わせ検索の高速化）
CREATE INDEX IF NOT EXISTS idx_inquiry_title_trgm
  ON "Inquiry" USING GIN (title gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_inquiry_message_trgm
  ON "Inquiry" USING GIN (message gin_trgm_ops);
