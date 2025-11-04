// app/api/run-job/route.js
import { runReminderJob } from '../../../lib/scheduler';

export async function GET(request) {
  try {
    await runReminderJob();
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
