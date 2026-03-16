import 'dotenv/config';
import { Pool } from 'pg';

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('POSTGRES_URL or DATABASE_URL env var not set');
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

await pool.query(`
  CREATE TABLE IF NOT EXISTS referrals (
    code TEXT PRIMARY KEY,
    points INTEGER NOT NULL DEFAULT 0,
    emails TEXT[] NOT NULL DEFAULT '{}'::TEXT[]
  );

  CREATE TABLE IF NOT EXISTS rsvps (
    email TEXT PRIMARY KEY,
    ref TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS verifications (
    email TEXT PRIMARY KEY,
    code TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    verified_at TIMESTAMPTZ
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value BOOLEAN NOT NULL
  );
`);

console.log('schema pushed');

await pool.end();
