import mongoose, { Schema, Document } from 'mongoose';

export interface IAlert extends Document {
  userId?: string;
  location?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
  contactsNotified: string[];
  alertType: 'SOS_BUTTON' | 'SMS_DISPATCH' | 'MANUAL_TRIGGER';
  resolved: boolean;
  createdAt: Date;
}

const AlertSchema: Schema = new Schema({
  userId: { type: String, required: false },
  location: {
    latitude: { type: Number },
    longitude: { type: Number },
    accuracy: { type: Number },
  },
  contactsNotified: { type: [String], default: [] },
  alertType: {
    type: String,
    enum: ['SOS_BUTTON', 'SMS_DISPATCH', 'MANUAL_TRIGGER'],
    default: 'SOS_BUTTON',
  },
  resolved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IAlert>('Alert', AlertSchema);
