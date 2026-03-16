import { env } from '$env/dynamic/private';
import { Pool, type QueryResultRow } from 'pg';

function shouldUseSsl(url: string): boolean {
  return !url.includes('localhost') && !url.includes('127.0.0.1');
}

let pool: Pool | null = null;
let initPromise: Promise<void> | null = null;

function getPool(): Pool {
  if (!pool) {
    const connectionString = env.POSTGRES_URL || env.DATABASE_URL;

    if (!connectionString) {
      throw new Error('POSTGRES_URL or DATABASE_URL env var not set');
    }

    pool = new Pool({
      connectionString,
      ssl: shouldUseSsl(connectionString) ? { rejectUnauthorized: false } : undefined,
      max: 5
    });
  }

  return pool;
}

async function initSchema(): Promise<void> {
  const db = getPool();

  await db.query(`
    CREATE TABLE IF NOT EXISTS rsvps (
      email TEXT PRIMARY KEY,
      timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS verifications (
      email TEXT PRIMARY KEY,
      code TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      verified BOOLEAN NOT NULL DEFAULT FALSE,
      verified_at TIMESTAMPTZ
    );
  `);
}

export async function query<T extends QueryResultRow>(
  text: string,
  params: unknown[] = []
) {
  if (!initPromise) {
    initPromise = initSchema().catch((error) => {
      initPromise = null;
      throw error;
    });
  }

  await initPromise;

  return getPool().query<T>(text, params);
}
