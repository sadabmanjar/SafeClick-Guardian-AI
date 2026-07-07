import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// True when MongoDB is NOT connected — controllers fall back to in-memory arrays.
export let isMockMode = true;

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/safeclick-guardian';
    await mongoose.connect(mongoUri);
    isMockMode = false;
    console.log('MongoDB Secure Connection Established.');
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('[DATABASE WARNING] Failed to establish MongoDB Secure Connection:', errorMsg);
    console.warn('Backend server running in fallback simulation mode (isMockMode = true).');
  }
};
