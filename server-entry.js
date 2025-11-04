// server-entry.js (or index.js)
import { runReminderJob } from './lib/scheduler.js';
import cron from 'node-cron';

cron.schedule('* * * * *', () => {
  runReminderJob().catch(err => console.error(err));
});
