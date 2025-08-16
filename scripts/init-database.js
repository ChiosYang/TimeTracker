/**
 * 数据库初始化脚本
 * 运行: node scripts/init-database.js
 */

const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

// 手动读取 .env.local 文件
function loadEnv() {
  try {
    const envPath = path.join(__dirname, '..', '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        process.env[key] = value;
      }
    });
  } catch (error) {
    console.warn('⚠️ 无法读取 .env.local 文件:', error.message);
  }
}

loadEnv();

async function initDatabase() {
  console.log('🚀 开始初始化数据库...');
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL 环境变量未配置');
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    console.log('📦 启用 pgvector 扩展...');
    await sql`CREATE EXTENSION IF NOT EXISTS vector`;
    console.log('✅ pgvector 扩展已启用');

    console.log('📋 创建 game_details 表...');
    await sql`
      CREATE TABLE IF NOT EXISTS game_details (
        app_id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        short_description TEXT,
        genres TEXT,
        tags TEXT,
        developer TEXT,
        publisher TEXT,
        metacritic_score INTEGER,
        release_date TEXT,
        header_image TEXT,
        last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        embedding vector(768)
      )
    `;
    console.log('✅ game_details 表已创建');

    console.log('🔍 创建向量索引...');
    await sql`
      CREATE INDEX IF NOT EXISTS idx_game_details_embedding 
      ON game_details USING ivfflat (embedding vector_cosine_ops) 
      WITH (lists = 100)
    `;
    console.log('✅ 向量索引已创建');

    console.log('📝 创建文本索引...');
    await sql`CREATE INDEX IF NOT EXISTS idx_game_details_name ON game_details(name)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_game_details_genres ON game_details(genres)`;
    console.log('✅ 文本索引已创建');

    console.log('🔍 验证表结构...');
    const tableInfo = await sql`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'game_details' 
      ORDER BY ordinal_position
    `;
    
    console.log('📊 表结构:');
    tableInfo.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });

    console.log('\n🎉 数据库初始化完成！');
    console.log('💡 下一步: 配置 API 密钥并测试同步功能');

  } catch (error) {
    console.error('❌ 初始化失败:', error.message);
    process.exit(1);
  }
}

initDatabase();