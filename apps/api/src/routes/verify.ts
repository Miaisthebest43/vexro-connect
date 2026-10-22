import type { FastifyInstance } from 'fastify';
import { requireAuth } from '../lib/auth.js';
import { sendVerificationEmail, sendVerificationSMS, generateOTP } from '../lib/notifications.js';

export async function verifyRoutes(app: FastifyInstance) {
  
  // 1. Send Email Code
  app.post('/verify/email/send', { preHandler: requireAuth }, async (req, reply) => {
    const user = req.user!;
    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await app.pg.query(
      `INSERT INTO verification_codes (identifier, code, type, expires_at) VALUES ($1, $2, 'email', $3)`,
      [user.email, code, expiresAt]
    );

    try {
      await sendVerificationEmail(user.email, code);
      return { success: true, message: 'Verification code sent to email.' };
    } catch (err) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Failed to send email. Check server logs.' });
    }
  });

  // 2. Verify Email Code
  app.post('/verify/email/check', { preHandler: requireAuth }, async (req, reply) => {
    const { code } = req.body as { code: string };
    const user = req.user!;

    const { rows } = await app.pg.query(
      `SELECT * FROM verification_codes WHERE identifier = $1 AND code = $2 AND type = 'email' AND expires_at > now()`,
      [user.email, code]
    );

    if (rows.length === 0) {
      return reply.code(400).send({ error: 'Invalid or expired code.' });
    }

    await app.pg.query(`UPDATE users SET email_verified = true WHERE id = $1`, [user.id]);
    await app.pg.query(`DELETE FROM verification_codes WHERE identifier = $1 AND type = 'email'`, [user.email]);

    return { success: true, message: 'Email verified successfully!' };
  });

  // 3. Send SMS Code
  app.post('/verify/phone/send', { preHandler: requireAuth }, async (req, reply) => {
    const { phoneNumber } = req.body as { phoneNumber: string };
    if (!phoneNumber) return reply.code(400).send({ error: 'Phone number required' });
    const user = req.user!;
    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await app.pg.query(
      `INSERT INTO verification_codes (identifier, code, type, expires_at) VALUES ($1, $2, 'phone', $3)`,
      [phoneNumber, code, expiresAt]
    );

    try {
      await sendVerificationSMS(phoneNumber, code);
      return { success: true, message: 'Verification code sent to phone.' };
    } catch (err) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Failed to send SMS. Check server logs.' });
    }
  });

  // 4. Verify Phone Code
  app.post('/verify/phone/check', { preHandler: requireAuth }, async (req, reply) => {
    const { phoneNumber, code } = req.body as { phoneNumber: string, code: string };
    const user = req.user!;

    const { rows } = await app.pg.query(
      `SELECT * FROM verification_codes WHERE identifier = $1 AND code = $2 AND type = 'phone' AND expires_at > now()`,
      [phoneNumber, code]
    );

    if (rows.length === 0) {
      return reply.code(400).send({ error: 'Invalid or expired code.' });
    }

    await app.pg.query(`UPDATE users SET phone_number = $1, phone_verified = true WHERE id = $2`, [phoneNumber, user.id]);
    await app.pg.query(`DELETE FROM verification_codes WHERE identifier = $1 AND type = 'phone'`, [phoneNumber]);

    return { success: true, message: 'Phone verified successfully!' };
  });
}