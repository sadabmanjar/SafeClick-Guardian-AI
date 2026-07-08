import mongoose, { Schema, Document } from 'mongoose';

export interface IScan extends Document {
  userId?: string;
  input: string;
  inputType: 'text' | 'url' | 'image';
  keywords: string[];
  urls: string[];
  emails: string[];
  phones: string[];
  domainRisk: number;
  riskScore: number;
  confidence: number;
  scamType: string;
  riskLevel: 'safe' | 'low' | 'medium' | 'high' | 'critical';
  explanation: string;
  redFlags: string[];
  psychologicalTricks: string[];
  victimImpact: string;
  recommendedActions: string[];
  legalAdvice: string;
  reportImmediately: boolean;
  governmentPortal: string;
  helpline: string;
  similarScams: string[];
  country: string;
  ipAddress?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ScanSchema: Schema = new Schema({
  userId: { type: String, required: false, index: true },
  input: { type: String, required: true },
  inputType: { type: String, enum: ['text', 'url', 'image'], required: true },
  keywords: { type: [String], default: [] },
  urls: { type: [String], default: [] },
  emails: { type: [String], default: [] },
  phones: { type: [String], default: [] },
  domainRisk: { type: Number, default: 0 },
  riskScore: { type: Number, required: true },
  confidence: { type: Number, required: true },
  scamType: { type: String, required: true },
  riskLevel: { type: String, enum: ['safe', 'low', 'medium', 'high', 'critical'], required: true },
  explanation: { type: String, required: true },
  redFlags: { type: [String], default: [] },
  psychologicalTricks: { type: [String], default: [] },
  victimImpact: { type: String, default: '' },
  recommendedActions: { type: [String], default: [] },
  legalAdvice: { type: String, default: '' },
  reportImmediately: { type: Boolean, default: false },
  governmentPortal: { type: String, default: 'https://www.cybercrime.gov.in' },
  helpline: { type: String, default: '1930' },
  similarScams: { type: [String], default: [] },
  country: { type: String, default: 'India' },
  ipAddress: { type: String },
  location: {
    latitude: { type: Number },
    longitude: { type: Number },
  }
}, {
  timestamps: true,
});

export default mongoose.model<IScan>('Scan', ScanSchema);
