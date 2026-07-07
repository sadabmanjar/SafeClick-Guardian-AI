import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/safeclick-guardian';
    await mongoose.connect(mongoUri);
    console.log('MongoDB Secure Connection Established.');
  } catch (error) {
    console.error('Failed to establish MongoDB Secure Connection:', error);
    process.exit(1);
  }
};
