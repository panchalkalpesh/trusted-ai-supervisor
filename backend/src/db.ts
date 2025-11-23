import postgres from 'postgres';

// Format for Postgres DATABASE_URL:
// 'postgres://username:password@host:port/database'
// for example: 'postgres://tms:tms123@db:5432/tmsdb'

// Fallback URL
const DATABASE_URL = 'postgres://tms:tms123@db:5432/tmsdb'
export const sql = postgres(process.env.DATABASE_URL || DATABASE_URL);