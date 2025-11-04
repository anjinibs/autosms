// app/api/logs/route.js
import dbConnect from '../../../lib/dbConnect';
import MessageLog from '../../../lib/models/MessageLog';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const patientId = searchParams.get('patientId');

    const filter = {};
    if (status) filter.status = status;
    if (patientId) filter.patientId = patientId;

    const logs = await MessageLog.find(filter).sort({ timestamp: -1 });
    return new Response(JSON.stringify({ success: true, data: logs }), {
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
