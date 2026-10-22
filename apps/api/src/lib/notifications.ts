import nodemailer from 'nodemailer';
import twilio from 'twilio';
import crypto from 'node:crypto';

// 1. Email Setup (Nodemailer + SendGrid SMTP)
export const mailer = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY || 'SG.dummy_key_replace_me',
  },
});

// 2. SMS Setup (Twilio Verify)
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID || 'AC_dummy',
  process.env.TWILIO_AUTH_TOKEN || 'dummy'
);

export async function sendVerificationEmail(toEmail: string, code: string) {
  await mailer.sendMail({
    from: '"VEXRO Connect" <noreply@vexro.com>',
    to: toEmail,
    subject: 'Your VEXRO Verification Code',
    text: `Your verification code is: ${code}. It expires in 10 minutes.`,
    html: `<b>Your VEXRO verification code is: <h2>${code}</h2></b><p>It expires in 10 minutes.</p>`,
  });
}

export async function sendVerificationSMS(toPhone: string, code: string) {
  // If you are using Twilio Verify, you can use this instead:
  // await twilioClient.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID!).verifications.create({ to: toPhone, channel: 'sms' });
  
  // For standard SMS:
  await twilioClient.messages.create({
    body: `Your VEXRO verification code is: ${code}`,
    from: process.env.TWILIO_PHONE_NUMBER || '+15005550006', // Twilio magic test number
    to: toPhone,
  });
}

export function generateOTP(): string {
  return crypto.randomInt(100000, 999999).toString();
}