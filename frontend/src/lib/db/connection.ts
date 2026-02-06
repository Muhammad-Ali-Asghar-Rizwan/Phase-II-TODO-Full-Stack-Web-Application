import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

// Create a single connection pool for production
const globalForPool = global as unknown as { pool: Pool };

let pool: Pool;

if (process.env.NODE_ENV === 'production') {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
} else {
  if (!globalForPool.pool) {
    globalForPool.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }
  pool = globalForPool.pool;
}

export const db = drizzle(pool, { schema });