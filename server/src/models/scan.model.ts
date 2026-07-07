import mongoose, { Schema, Document } from 'mongoose';

export interface IScan extends Document {
  userId?: string;
  content: string;
  contentType: 'text' | 'url' | 'image';
  riskScore: number;
  riskLevel: 'safe' | 'low' | 'medium' | 'high' | 'critical';
  scamType: string;
  confidence: number;
  explanation: string;
  redFlags: string[];
  psychologicalTricks: string[];
  recommendedActions: string[];
  createdAt: Date;
}

const ScanSchema: Schema = new Schema({
  userId: { type: String, required: false },
  content: { type: String, required: true },
  contentType: { type: String, enum: ['text', 'url', 'image'], required: true },
  riskScore: { type: Number, required: true },
  riskLevel: { type: String, enum: ['safe', 'low', 'medium', 'high', 'critical'], required: true },
  scamType: { type: String, required: true },
  confidence: { type: Number, required: true },
  explanation: { type: String, required: true },
  redFlags: { type: [String], default: [] },
  psychologicalTricks: { type: [String], default: [] },
  recommendedActions: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IScan>('Scan', ScanSchema);
