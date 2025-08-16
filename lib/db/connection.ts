import { neon } from '@neondatabase/serverless';
import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

// Neon serverless SQL 连接
export const sql = neon(process.env.DATABASE_URL);

// PostgreSQL Pool 连接（用于 PGVectorStore）
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});