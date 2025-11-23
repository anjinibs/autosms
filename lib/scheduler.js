import dbConnect from './dbConnect.js';
import Patient from './models/Patient.js';
import { sendEmail } from './mailer.js';
import { sendSms } from './sms.js';

function fillTemplate(templateString, variables) {
  if (!templateString) return '';
  return templateString.replace(/\{\{(\w+)\}\}/g, (_, key) =>
    variables[key] !== undefined ? variables[key] : ''
  );
}

export async function runReminderJob() {
  await dbConnect();

  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const nowTimeString = `${hours}:${minutes}`;
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  console.log(`🔔 Scheduler running @ ${nowTimeString}`);

  const patients = await Patient.find({
    active: true,
    preferredTime: nowTimeString,
    $or: [
      { lastSentDate: { $lt: startOfToday } },
      { lastSentDate: null }
    ]
  });

  console.log(`⏳ Found ${patients.length} patients to notify`);

  for (const p of patients) {
    try {
      const variables = { name: p.name, preferredTime: p.preferredTime };

      // 1. Send SMS
      if (p.phone) {
        const smsTemplate = `Hello {{name}}, this is your reminder for {{preferredTime}}.`;
        const msg = fillTemplate(smsTemplate, variables);
        await sendSms(p.phone, msg);
        console.log(`📤 SMS sent to ${p.phone}`);
      }

      // 2. Send Email
      if (p.email) {
        const subjectTemplate = `Reminder for {{preferredTime}}`;
        const subject = fillTemplate(subjectTemplate, variables);

        const htmlTemplate = `<p>Hello {{name}}, this is your reminder for <b>{{preferredTime}}</b>.</p>`;
        const html = fillTemplate(htmlTemplate, variables);

        await sendEmail(p.email, subject, html);
        console.log(`📧 Email sent to ${p.email}`);
      }

      // 3. Trigger alarm page using POST
      // Note: Node 18+ has global fetch. If using older Node, ensure a fetch polyfill is available.
      await fetch('http://localhost:3000/api/reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: p.name,
          time: p.preferredTime
        })
      });

      console.log('🔔 Alarm event triggered');

      // update record
      p.lastSentDate = new Date();
      await p.save();

    } catch (err) {
      console.error(`❌ Error sending reminder to ${p?.name ?? 'unknown'}:`, err);
    }
  }

  console.log('✅ Scheduler job finished');
}
