// lib/scheduler.js
import dbConnect from './dbConnect.js';
import Patient from './models/Patient.js';
import MessageLog from './models/MessageLog.js';
import Template from './models/Template.js';
import { sendEmail } from './mailer.js';
import { sendSms } from './sms.js';

/**
 * Replace {{variable}} placeholders with actual values
 */
function fillTemplate(templateString, variables) {
  if (!templateString) return '';
  return templateString.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return variables[key] !== undefined ? variables[key] : '';
  });
}

/**
 * Main scheduled job that runs every minute
 */
export async function runReminderJob() {
  await dbConnect();

  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const nowTimeString = `${hours}:${minutes}`;
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  console.log(`\n🔔 Running reminder job at time: ${nowTimeString}`);

  // Debugging info — all active patients
  const allActivePatients = await Patient.find({ active: true });
  console.log(`[INFO] Total active patients: ${allActivePatients.length}`);
  console.log(
    allActivePatients.map((p) => ({
      id: p._id.toString(),
      name: p.name,
      preferredTime: p.preferredTime,
      lastSentDate: p.lastSentDate,
      channel: p.channel,
      phone: p.phone,
      email: p.email,
    }))
  );

  // Patients who should receive reminders now
  const patients = await Patient.find({
    active: true,
    preferredTime: nowTimeString,
    $or: [{ lastSentDate: { $lt: startOfToday } }, { lastSentDate: null }],
  });

  console.log(`[INFO] Found ${patients.length} patient(s) matching preferredTime=${nowTimeString}`);

  // Loop through patients
  for (const p of patients) {
    console.log(`→ Processing patient: ${p.name} [${p.channel}]`);

    try {
      // Fetch template
      const tpl = await Template.findOne({
        name: p.templateName || 'defaultReminder',
        channel: p.channel,
      });

      const variables = {
        name: p.name,
        preferredTime: p.preferredTime,
      };

      // Send based on channel
      if (p.channel === 'email') {
        if (!p.email) throw new Error('Missing email address');
        const subject = fillTemplate(tpl?.subject || 'Reminder', variables);
        const htmlBody = fillTemplate(
          tpl?.htmlBody || `<p>Hello {{name}}, this is your reminder for {{preferredTime}}.</p>`,
          variables
        );
        await sendEmail(p.email, subject, htmlBody);
      } else if (p.channel === 'sms') {
        if (!p.phone) throw new Error('Missing phone number');
        const textBody = fillTemplate(
          tpl?.textBody || `Hello {{name}}, this is your reminder for {{preferredTime}}.`,
          variables
        );
        await sendSms(p.phone, textBody);
      } else {
        console.warn(`⚠️ Unknown channel for patient id=${p._id}: ${p.channel}`);
        continue;
      }

      // Update last sent time
      p.lastSentDate = new Date();
      await p.save();

      // Log success
      await MessageLog.create({
        patientId: p._id,
        channel: p.channel,
        status: 'sent',
        details: `Success (template: ${tpl?.name || 'defaultReminder'})`,
      });

      console.log(`✔️ Successfully sent reminder to ${p.name}`);
    } catch (err) {
      console.error(`❌ Error sending to ${p.name}:`, err.message);

      await MessageLog.create({
        patientId: p._id,
        channel: p.channel,
        status: 'failed',
        details: err.message,
      });
    }
  }

  console.log('🔔 Reminder job complete');
}
