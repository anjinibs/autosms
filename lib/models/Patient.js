import mongoose from 'mongoose';

const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  channel: { type: String, enum: ['email','sms'], required: true },
  preferredTime: { type: String, required: true }, // format "HH:MM"
  lastSentDate: { type: Date, default: null },
  active: { type: Boolean, default: true },
  templateName: { type: String, default: 'defaultReminder' } // optional template reference
}, { timestamps: true });

export default mongoose.models.Patient || mongoose.model('Patient', PatientSchema);
