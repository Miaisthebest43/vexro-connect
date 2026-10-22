import pg from 'pg';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });

async function seed() {
  await client.connect();
  console.log('Connected to DB. Generating 40,000 records (This will take a minute)...');

  // 1. Generate 10,000 Users
  const users = [];
  for (let i = 0; i < 10000; i++) {
    users.push(`('user${i}@vexro.com', 'user_${i}', 'dummyhash')`);
  }
  await client.query(`INSERT INTO users (email, username, password_hash) VALUES ${users.join(',')} ON CONFLICT DO NOTHING`);
  console.log('✅ 10,000 Users inserted.');

  // 2. Get User IDs for messages
  const userRes = await client.query('SELECT id FROM users LIMIT 100');
  const userIds = userRes.rows.map(r => r.id);

  // 3. Generate 10,000 Messages
  const messages = [];
  for (let i = 0; i < 10000; i++) {
    const uid = userIds[Math.floor(Math.random() * userIds.length)];
    messages.push(`('general', '${uid}', 'This is a test message #${i}')`);
  }
  await client.query(`INSERT INTO messages (channel_id, user_id, content) VALUES ${messages.join(',')}`);
  console.log('✅ 10,000 Messages inserted.');

  // 4. Generate 10,000 Communities (Dummy table needed first)
  await client.query(`CREATE TABLE IF NOT EXISTS communities (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT, description TEXT)`);
  const communities = [];
  for (let i = 0; i < 10000; i++) {
    communities.push(`('Community ${i}', 'Generated community description')`);
  }
  await client.query(`INSERT INTO communities (name, description) VALUES ${communities.join(',')}`);
  console.log('✅ 10,000 Communities inserted.');

  // 5. Generate 10,000 Notifications (Dummy table needed first)
  await client.query(`CREATE TABLE IF NOT EXISTS notifications (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID, title TEXT, body TEXT)`);
  const notifs = [];
  for (let i = 0; i < 10000; i++) {
    const uid = userIds[Math.floor(Math.random() * userIds.length)];
    notifs.push(`('${uid}', 'Notification ${i}', 'You have a new alert')`);
  }
  await client.query(`INSERT INTO notifications (user_id, title, body) VALUES ${notifs.join(',')}`);
  console.log('✅ 10,000 Notifications inserted.');

  console.log('🎉 ALL 40,000+ RECORDS GENERATED SUCCESSFULLY.');
  await client.end();
}

seed().catch(console.error);