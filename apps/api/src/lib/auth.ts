import type { FastifyReply, FastifyRequest } from 'fastify';
import { validateSession } from './sessions.js';

declare module 'fastify' {
  interface FastifyRequest {
    user?: { id: string; email: string; username: string };
    sessionId?: string;
  }
}

export async function requireAuth(req: FastifyRequest, reply: FastifyReply) {
  const token = req.cookies.session;
  if (!token) return reply.code(401).send({ error: 'Unauthorized' });
  const result = await validateSession(req.server.pg, token);
  if (!result) return reply.code(401).send({ error: 'Unauthorized' });
  req.user = result.user;
  req.sessionId = result.sessionId;
}