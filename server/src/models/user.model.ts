import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  supabaseUserId: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'citizen' | 'admin' | 'police';
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  supabaseUserId: { type: String, required: true, unique: true, index: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  phone: { type: String },
  avatar: { type: String },
  role: { type: String, enum: ['citizen', 'admin', 'police'], default: 'citizen' },
  isVerified: { type: Boolean, default: false },
}, {
  timestamps: true, // auto creates createdAt and updatedAt
});

export default mongoose.model<IUser>('User', UserSchema);
