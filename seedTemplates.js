// seedTemplates.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './.env.local' });
 // Load environment variables from .env/.env.local

import Template from './lib/models/Template.js';
import Patient   from './lib/models/Patient.js';

async function seed() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('Missing MONGODB_URI in environment');
    }

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB for seeding');

    // Seed templates
    const templates = [
      {
        name: 'defaultReminder',
        channel: 'sms',
        textBody: 'Hello {{name}}, this is your reminder for {{preferredTime}}.',
      },
      {
        name: 'defaultReminder',
        channel: 'email',
        subject: 'Appointment Reminder',
        htmlBody: '<p>Dear {{name}},</p><p>This is a reminder for your appointment at <strong>{{preferredTime}}</strong>.</p>',
        textBody: 'Dear {{name}}, this is a reminder for your appointment at {{preferredTime}}.',
      },
    ];

    await Template.deleteMany({});
    console.log('Cleared old templates');

    await Template.insertMany(templates);
    console.log('Inserted default templates');

    // Optional: sample patients
    const samplePatients = [
      {
        name: 'Test User One',
        email: 'test1@example.com',
        phone: '+910000000001',
        channel: 'sms',
        preferredTime: '10:00',
        active: true,
        templateName: 'defaultReminder',
      },
      {
        name: 'Test User Two',
        email: 'test2@example.com',
        phone: '+910000000002',
        channel: 'email',
        preferredTime: '14:30',
        active: true,
        templateName: 'defaultReminder',
      },
    ];

    await Patient.deleteMany({});
    console.log('Cleared old patients');

    await Patient.insertMany(samplePatients);
    console.log('Inserted sample patients');

    await mongoose.disconnect();
    console.log('Seed completed and disconnected');
    process.exit(0);

  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
