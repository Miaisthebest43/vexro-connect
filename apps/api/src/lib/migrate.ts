import 'dotenv/config';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from './db.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationsDir = join(__dirname, '..', '..', 'migrations');

async function migrate() {
  const files = readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();
  for (const file of files) {
    const sql = readFileSync(join(migrationsDir, file), 'utf8');
    console.log('Running migration:', file);
    await pool.query(sql);
    console.log('  Done.');
  }
  await pool.end();
  console.log('All migrations complete.');
}

migrate().catch((err) => {
  console.error('Migration failed:', err.message);
  if (err.code) console.error('  code:', err.code);
  process.exit(1);
});