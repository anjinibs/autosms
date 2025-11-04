// lib/mailer.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM } = process.env;

if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !EMAIL_FROM) {
  throw new Error('Missing one or more SMTP environment variables: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM');
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: Number(SMTP_PORT) === 465,  // true if port 465
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export async function sendEmail(to, subject, htmlBody) {
  try {
    const mailOptions = {
      from: EMAIL_FROM,
      to,
      subject,
      html: htmlBody,
      text: htmlBody.replace(/<[^>]+>/g, ''),  // plain text fallback
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent: messageId=${info.messageId} to=${to}`);
    return info;
  } catch (err) {
    console.error('❌ Error sending email:', err);
    throw err;
  }
}
