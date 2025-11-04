// send-test-email.js
import { sendEmail } from './lib/mailer.js';

async function test() {
  try {
    await sendEmail('your-recipient@example.com', 'Test Email from Reminder App', '<p>This is a test email.</p>');
    console.log('✅ Test email sent successfully');
  } catch (err) {
    console.error('❌ Test email failed:', err);
  }
}
test();
