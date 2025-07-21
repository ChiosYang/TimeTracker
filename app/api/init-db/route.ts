import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function POST() {
  try {
    // 分别执行每个SQL语句
    await sql`
      CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
          email TEXT UNIQUE NOT NULL,
          name TEXT,
          image TEXT,
          provider TEXT, -- 新增字段
          email_verified TIMESTAMPTZ,
          password_hash TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS sessions (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          expires TIMESTAMPTZ NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS accounts (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          type TEXT NOT NULL,
          provider TEXT NOT NULL,
          provider_account_id TEXT NOT NULL,
          refresh_token TEXT,
          access_token TEXT,
          expires_at INTEGER,
          token_type TEXT,
          scope TEXT,
          id_token TEXT,
          session_state TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          UNIQUE(provider, provider_account_id)
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS user_steam_configs (
          id SERIAL PRIMARY KEY,
          user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          steam_api_key TEXT NOT NULL,
          steam_id VARCHAR(20) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id)
      )
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_user_steam_configs_user_id ON user_steam_configs(user_id)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id)
    `;

    await sql`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql'
    `;

    await sql`
      DO $$
      BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_steam_configs_updated_at') THEN
              CREATE TRIGGER update_user_steam_configs_updated_at
                  BEFORE UPDATE ON user_steam_configs
                  FOR EACH ROW
                  EXECUTE FUNCTION update_updated_at_column();
          END IF;
      END;
      $$
    `;
    
    return NextResponse.json({ 
      message: '数据库表结构创建成功！',
      success: true 
    });
  } catch (error) {
    console.error('数据库初始化失败:', error);
    return NextResponse.json(
      { 
        error: '数据库初始化失败',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}