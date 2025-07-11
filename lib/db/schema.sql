-- 用户Steam配置表
CREATE TABLE IF NOT EXISTS user_steam_configs (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL UNIQUE,
    steam_api_key TEXT NOT NULL,
    steam_id VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_user_steam_configs_user_id ON user_steam_configs(user_id);

-- 添加更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER IF NOT EXISTS update_user_steam_configs_updated_at
    BEFORE UPDATE ON user_steam_configs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();