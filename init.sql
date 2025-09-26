-- ======================================
-- 清空带依赖的数据库
--DROP SCHEMA public CASCADE;
--CREATE SCHEMA public;

-- DROP TABLE IF EXISTS review CASCADE;
-- ROP TABLE IF EXISTS cards CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

--=========================================
-- ========================================
-- 数据库: srs
-- ========================================

-- 用户表
CREATE TABLE IF NOT EXISTS "users" (
    id              SERIAL PRIMARY KEY,
    username        VARCHAR(100) UNIQUE NOT NULL,
    password_hash   VARCHAR(255),
    is_active       BOOLEAN DEFAULT TRUE,
    oauth_provider  VARCHAR(50),
    oauth_id        VARCHAR(200),
    email           VARCHAR(200),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- 卡片表
CREATE TABLE IF NOT EXISTS "cards" (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    owner_id INT NOT NULL REFERENCES "users"(id) ON DELETE CASCADE,
    tags VARCHAR(500),
    difficulty INT NOT NULL DEFAULT 3,
    ef FLOAT NOT NULL DEFAULT 2.5,       -- SM-2 算法难度系数
    repetition INT NOT NULL DEFAULT 0,
    interval INT NOT NULL DEFAULT 0,
    next_review_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 复习记录表
CREATE TABLE IF NOT EXISTS "review" (
    id              SERIAL PRIMARY KEY,
    card_id         INT NOT NULL,
    user_id         INT NOT NULL,
    rating          INT NOT NULL,   -- 用户打分 0-5
    reviewed_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_review_card FOREIGN KEY (card_id) REFERENCES "cards"(id) ON DELETE CASCADE,
    CONSTRAINT fk_review_user FOREIGN KEY (user_id) REFERENCES "users"(id) ON DELETE CASCADE
);

-- ========================================
-- 索引
-- ========================================
CREATE INDEX IF NOT EXISTS idx_user_username ON "users"(username);
CREATE INDEX IF NOT EXISTS idx_card_next_review_at ON "cards"(next_review_at);
CREATE INDEX IF NOT EXISTS idx_card_owner ON "cards"(owner_id);
CREATE INDEX IF NOT EXISTS idx_review_user ON "review"(user_id);
CREATE INDEX IF NOT EXISTS idx_review_card ON "review"(card_id);
