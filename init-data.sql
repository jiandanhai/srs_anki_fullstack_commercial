-- ============================================
-- 初始化示例用户（开发环境用）
-- ============================================
-- 密码示例使用 bcrypt 生成哈希
-- Alice 密码: password123
-- Bob 密码: mysecurepwd
INSERT INTO users (username, password_hash, is_active, email)
VALUES
('alice', '$2b$10$abcdefghijklmnopqrstuv', TRUE, 'alice@example.com'),
('bob', '$2b$10$1234567890abcdefghijk', TRUE, 'bob@example.com');

-- ============================================
-- 初始化示例卡片（开发环境用）
-- ============================================
INSERT INTO cards (question, answer, owner_id, tags, difficulty, ef, repetition, interval, next_review_at)
VALUES
('欢迎使用艾森复习（示例卡）', '这是一张示例卡片，帮助你熟悉复习流程。', 1, 'welcome,intro', 3, 2.5, 0, 0, NOW()),
('如何开始复习？', '打开“复习”页面，系统会自动按记忆曲线给出今日到期卡片。', 1, 'intro,guide', 3, 2.5, 0, 0, NOW()),
('关于 SM-2 算法', '系统使用 SM-2 算法（或其变体）安排复习间隔与难度。', 1, 'sm2,algorithm', 3, 2.5, 0, 0, NOW());
