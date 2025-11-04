// lib/sms.js
import Twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken   = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

const client = new Twilio(accountSid, authToken);

export async function sendSms(to, body) {
  console.log('Sending SMS → from:', fromNumber, 'to:', to, 'body:', body);

  try {
    const message = await client.messages.create({
      body,
      from: fromNumber,
      to,
    });
    console.log('Twilio message SID:', message.sid);
    return message;
  } catch (err) {
    console.error('Error sending SMS via Twilio:', err);
    throw err;
  }
}
