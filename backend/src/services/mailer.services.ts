import 'dotenv/config';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function send(to: string, subject: string, html: string) {
  try {
    const info = await transporter.sendMail({
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error('Error while sending mail:', err);
  }
}

async function sendActivationToken(to: string, token: string) {
  if (!process.env.CLIENT_HOST || !process.env.CLIENT_BASE_PATH) {
    console.error(
      'In function sendActivationToken does not process.env.CLIENT_HOST or process.env.CLIENT_BASE_PATH',
    );
    return;
  }

  const html = `<a href=${process.env.CLIENT_HOST + process.env.CLIENT_BASE_PATH + 'activation/' + token}>Activation link</a>`;
  return send(to, 'Activation email', html);
}

export const mailer = { sendActivationToken };
