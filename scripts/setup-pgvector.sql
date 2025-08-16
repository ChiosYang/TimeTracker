-- 启用pgvector扩展（在Neon控制台的SQL Editor中执行）
CREATE EXTENSION IF NOT EXISTS vector;

-- 检查扩展是否成功安装
SELECT * FROM pg_extension WHERE extname = 'vector';