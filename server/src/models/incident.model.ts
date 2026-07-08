import mongoose, { Schema, Document } from 'mongoose';

export interface IIncident extends Document {
  title: string;
  district: string;
  source: 'User Report' | 'News Ingestion';
  date: Date;
  scamType: string;
  financialLoss: number;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

const IncidentSchema: Schema = new Schema({
  title: { type: String, required: true },
  district: { type: String, required: true },
  source: { type: String, enum: ['User Report', 'News Ingestion'], default: 'User Report' },
  date: { type: Date, default: Date.now },
  scamType: { type: String, required: true },
  financialLoss: { type: Number, default: 0 },
  description: { type: String, required: true },
  priority: { type: String, enum: ['critical', 'high', 'medium', 'low'], default: 'medium' },
});

export default mongoose.model<IIncident>('Incident', IncidentSchema);
