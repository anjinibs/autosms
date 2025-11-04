// lib/models/Template.js
import mongoose from 'mongoose';

const TemplateSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  channel: { type: String, enum: ['email','sms'], required: true },
  subject: { type: String },          // for email
  htmlBody: { type: String },         // for email HTML
  textBody: { type: String, required: true }, // for SMS or plain-text email
}, { timestamps: true });

export default mongoose.models.Template || mongoose.model('Template', TemplateSchema);
