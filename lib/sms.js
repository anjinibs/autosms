// lib/sms.js
import Twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken  = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken || !fromNumber) {
  throw new Error('Twilio configuration missing: please set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER in .env');
}

const client = Twilio(accountSid, authToken);

export async function sendSms(to, body) {
  try {
    const message = await client.messages.create({
      body,
      from: fromNumber,
      to,
    });
    console.log(`📤 SMS sent: SID=${message.sid} from=${fromNumber} to=${to}`);
    return { success: true, sid: message.sid };
  } catch (err) {
    console.error('❌ Error sending SMS via Twilio:', err);
    return { success: false, error: err.message };
  }
}
