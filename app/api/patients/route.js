// app/api/patients/route.js
import dbConnect from '../../../lib/dbConnect';
import Patient from '../../../lib/models/Patient';

export async function GET(request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  // If no id param → list all patients
  if (!id) {
    const allPatients = await Patient.find({});
    return new Response(
      JSON.stringify({ success: true, data: allPatients }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // If id param provided → fetch that patient
  const patient = await Patient.findById(id);
  if (!patient) {
    return new Response(
      JSON.stringify({ success: false, error: 'Patient not found' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({ success: true, data: patient }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}

export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    const patient = await Patient.create(body);
    return new Response(
      JSON.stringify({ success: true, data: patient }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function PUT(request) {
  await dbConnect();
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    if (!id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing patient id' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const patient = await Patient.findByIdAndUpdate(id, updateData, { new: true });
    if (!patient) {
      return new Response(
        JSON.stringify({ success: false, error: 'Patient not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return new Response(
      JSON.stringify({ success: true, data: patient }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
