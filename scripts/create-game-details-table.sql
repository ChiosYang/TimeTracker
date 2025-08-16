-- 创建game_details表，用于存储游戏详情和向量
CREATE TABLE IF NOT EXISTS game_details (
  app_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  genres TEXT, -- 存储为 JSON 字符串
  tags TEXT, -- 存储为 JSON 字符串
  developer TEXT,
  publisher TEXT,
  metacritic_score INTEGER,
  release_date TEXT,
  header_image TEXT,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- 维度为768，对应Gemini embedding-001模型
  embedding vector(768)
);

-- 创建索引以优化向量搜索性能
CREATE INDEX IF NOT EXISTS idx_game_details_embedding 
ON game_details USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);

-- 创建文本搜索索引
CREATE INDEX IF NOT EXISTS idx_game_details_name ON game_details(name);
CREATE INDEX IF NOT EXISTS idx_game_details_genres ON game_details(genres);

-- 检查表是否创建成功
\d game_details;