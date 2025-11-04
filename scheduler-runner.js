// scheduler-runner.js
import cron from 'node-cron';
import { runReminderJob } from './lib/scheduler.js';

console.log('🕒 Starting reminder scheduler...');
// Schedule to run every minute
cron.schedule('* * * * *', () => {
  runReminderJob().catch(err => {
    console.error('Scheduler job failed:', err);
  });
});
