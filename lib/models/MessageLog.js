import mongoose from 'mongoose';

const MessageLogSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  channel: { type: String, enum: ['email','sms'], required: true },
  status: { type: String, enum: ['sent','failed'], required: true },
  timestamp: { type: Date, default: Date.now },
  details: { type: String },
}, { timestamps: true });

export default mongoose.models.MessageLog || mongoose.model('MessageLog', MessageLogSchema);
