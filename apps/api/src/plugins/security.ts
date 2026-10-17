import type { FastifyInstance } from 'fastify';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import cookie from '@fastify/cookie';
import csrf from '@fastify/csrf-protection';

export async function registerSecurity(app: FastifyInstance) {
  await app.register(cookie, {
    secret: process.env.COOKIE_SECRET ?? 'dev-only-change-me',
    parseOptions: {},
  });

  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        // Allow images from anywhere (our server, local, data URIs)
        imgSrc: ["'self'", 'data:', 'blob:', '*'],
        connectSrc: ["'self'", '*'],
        frameAncestors: ["'none'"],
        objectSrc: ["'none'"],
      },
    },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginEmbedderPolicy: false,
  });

  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
    errorResponseBuilder: () => ({
      statusCode: 429,
      error: 'Too Many Requests',
      message: 'Slow down. Try again shortly.',
    }),
  });

  await app.register(csrf, {
    sessionPlugin: '@fastify/cookie',
    cookieOpts: {
      signed: true,
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    },
  });
}