import mongoose, { Schema, Document } from 'mongoose';

export interface IEvidence extends Document {
  fileName: string;
  fileUrl: string;
  size: string;
  type: 'image' | 'video' | 'audio' | 'pdf' | 'other';
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EvidenceSchema: Schema = new Schema({
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  size: { type: String, required: true },
  type: { type: String, enum: ['image', 'video', 'audio', 'pdf', 'other'], default: 'other' },
  userId: { type: String, index: true },
}, {
  timestamps: true,
});

export default mongoose.model<IEvidence>('Evidence', EvidenceSchema);
