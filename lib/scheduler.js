// lib/scheduler.js
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
  const hours   = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const nowTimeString = `${hours}:${minutes}`;
  const startOfToday  = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  console.log(`🔔 Running reminder job at time: ${nowTimeString}`);

  const allActive = await Patient.find({ active: true });
  console.log(`Total active patients: ${allActive.length}`);
  console.log(
    allActive.map(p => ({
      id:           p._id.toString(),
      name:         p.name,
      preferredTime:p.preferredTime,
      lastSentDate: p.lastSentDate,
      channel:      p.channel,
      phone:        p.phone,
      email:        p.email,
    }))
  );

  const patients = await Patient.find({
    active: true,
    preferredTime: nowTimeString,
    $or: [
      { lastSentDate: { $lt: startOfToday } },
      { lastSentDate: null }
    ]
  });

  console.log(`Found ${patients.length} patient(s) matching preferredTime=${nowTimeString}`);

  for (const p of patients) {
    console.log(`→ Processing patient: ${p.name} [${p.channel}]`);

    try {
      const variables = {
        name: p.name,
        preferredTime: p.preferredTime,
      };

      // SMS send
      if (p.phone) {
        const smsBody = fillTemplate(
          `Hello ${p.name}, this is your reminder for ${p.preferredTime}.`,
          variables
        );
        await sendSms(p.phone, smsBody);
        console.log(`✔️ SMS sent to ${p.phone}`);
      } else {
        console.warn(`⚠️ No phone number for patient ${p.name}, skipping SMS`);
      }

      // Email send
      if (p.email) {
        const subject  = `Reminder for your appointment at ${p.preferredTime}`;
        const htmlBody = `<p>Hello ${p.name},</p><p>This is your reminder for your appointment at <strong>${p.preferredTime}</strong>.</p>`;
        await sendEmail(p.email, subject, htmlBody);
        console.log(`✔️ Email sent to ${p.email}`);
      } else {
        console.warn(`⚠️ No email address for patient ${p.name}, skipping Email`);
      }

      p.lastSentDate = new Date();
      await p.save();

      console.log(`✔️ Successfully processed reminder for patient ${p.name}`);
    } catch (err) {
      console.error(`❌ Error processing reminder for patient ${p.name}:`, err.message);
    }
  }

  console.log('🔔 Reminder job complete');
}
