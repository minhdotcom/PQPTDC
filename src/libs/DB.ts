// /src/libs/DB.ts
// import path from 'node:path';
import { PGlite } from '@electric-sql/pglite';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
// import { migrate as migratePg } from 'drizzle-orm/node-postgres/migrator';
import { drizzle as drizzlePglite, type PgliteDatabase } from 'drizzle-orm/pglite';
// import { migrate as migratePglite } from 'drizzle-orm/pglite/migrator';
import { PHASE_PRODUCTION_BUILD } from 'next/dist/shared/lib/constants';
import { Client } from 'pg';

import * as schema from '@/models/Schema';

import { Env } from './Env';

let client: Client | undefined;
let drizzleInstance: ReturnType<typeof drizzlePg> | PgliteDatabase<typeof schema> | undefined;

async function initializeDatabase() {
  if (drizzleInstance) {
    return drizzleInstance;
  }

  if (process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD && Env.DATABASE_URL) {
    client = new Client({
      connectionString: Env.DATABASE_URL,
    });
    await client.connect();
    drizzleInstance = drizzlePg(client, { schema });
  } else {
    // Stores the db connection in the global scope to prevent multiple instances due to hot reloading with Next.js
    const global = globalThis as unknown as { client: PGlite; drizzle: PgliteDatabase<typeof schema> };
    if (!global.client) {
      global.client = new PGlite();
      await global.client.waitReady;
      global.drizzle = drizzlePglite(global.client, { schema });
    }
    drizzleInstance = global.drizzle;
  }

  return drizzleInstance;
}

// Export function để seed script dùng
export const getDb = initializeDatabase;

// Export db như proxy object cho Next.js app (backwards compatible)
export const db = new Proxy({} as any, {
  get(prop) {
    if (!drizzleInstance) {
      throw new Error('Database not initialized. Call getDb() first or wait for initialization.');
    }
    return drizzleInstance[prop as keyof typeof drizzleInstance];
  },
});

// Auto-initialize for Next.js app
initializeDatabase();
