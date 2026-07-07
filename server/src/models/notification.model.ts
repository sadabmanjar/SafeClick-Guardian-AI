import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  userId: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info' | 'security' | 'ai' | 'complaint' | 'emergency' | 'admin';
  priority: 'low' | 'medium' | 'high' | 'critical';
  icon?: string;
  redirectUrl?: string;
  metadata?: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['success', 'warning', 'error', 'info', 'security', 'ai', 'complaint', 'emergency', 'admin'],
      required: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'low',
    },
    icon: { type: String },
    redirectUrl: { type: String },
    metadata: { type: Schema.Types.Mixed },
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<INotification>('Notification', NotificationSchema);
