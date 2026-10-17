import type { FastifyInstance } from 'fastify';
import { randomBytes, createHash } from 'node:crypto';
import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { query } from '../lib/db.js';

const UPLOAD_DIR = join(process.cwd(), 'uploads');
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const ALLOWED_IMAGE = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const ALLOWED_ALL = new Set([...ALLOWED_IMAGE, 'image/png', 'application/pdf', 'text/plain']);

function pickExt(mime: string, original: string): string {
  const map: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
    'application/pdf': '.pdf',
    'text/plain': '.txt',
  };
  if (map[mime]) return map[mime];
  const m = original.match(/\.([a-zA-Z0-9]+)$/);
  return m ? '.' + m[1].toLowerCase() : '.bin';
}

export async function uploadRoutes(app: FastifyInstance) {
  await mkdir(UPLOAD_DIR, { recursive: true });

  // Upload avatar
  app.post('/upload/avatar', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    const data = await (req as any).file();
    if (!data) return reply.code(400).send({ error: 'No file' });

    if (!ALLOWED_IMAGE.has(data.mimetype)) {
      return reply.code(415).send({ error: 'Only jpeg/png/webp/gif allowed for avatars' });
    }

    const buf = await data.toBuffer();
    if (buf.length > MAX_SIZE) return reply.code(413).send({ error: 'File too large (max 10MB)' });

    const hash = createHash('sha256').update(user.id).update(String(Date.now())).digest('hex').slice(0, 16);
    const ext = pickExt(data.mimetype, data.filename);
    const filename = `avatar_${user.id}_${hash}${ext}`;
    await writeFile(join(UPLOAD_DIR, filename), buf);

    const url = `/uploads/${filename}`;
    await query(`UPDATE users SET avatar_url = $1 WHERE id = $2`, [url, user.id]);

    return reply.send({ url });
  });

  // Upload message attachment
  app.post('/upload/attachment', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    const data = await (req as any).file();
    if (!data) return reply.code(400).send({ error: 'No file' });

    if (!ALLOWED_ALL.has(data.mimetype)) {
      return reply.code(415).send({ error: 'File type not allowed' });
    }

    const buf = await data.toBuffer();
    if (buf.length > MAX_SIZE) return reply.code(413).send({ error: 'File too large (max 10MB)' });

    const hash = randomBytes(12).toString('hex');
    const ext = pickExt(data.mimetype, data.filename);
    const filename = `att_${user.id}_${hash}${ext}`;
    await writeFile(join(UPLOAD_DIR, filename), buf);

    const type = ALLOWED_IMAGE.has(data.mimetype) ? 'image' : 'file';
    return reply.send({
      url: `/uploads/${filename}`,
      type,
      mime: data.mimetype,
      size: buf.length,
    });
  });
}