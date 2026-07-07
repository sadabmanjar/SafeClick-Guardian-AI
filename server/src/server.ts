import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { errorHandler } from './middlewares/error.middleware';
import authRoutes from './routes/auth.routes';
import scanRoutes from './routes/scan.routes';
import complaintRoutes from './routes/complaint.routes';
import emergencyRoutes from './routes/emergency.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS for frontend cross-origin requests
app.use(cors());

// Enable JSON bodies parsing
app.use(express.json());

// Register API Route handlers
app.use('/api/auth', authRoutes);
app.use('/api/scans', scanRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/emergency', emergencyRoutes);

// Base route path
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'SafeClick Guardian Secure Backend Core active & operating',
    timestamp: new Date(),
  });
});

// Global central Error Handler middleware
app.use(errorHandler);

// Start server listener and database connection
const startServer = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`[SAFECLICK BACKEND] Operating on secure channel: http://localhost:${port}`);
  });
};

startServer().catch((err) => {
  console.error('[CRITICAL] SafeClick Backend Initialization Failure:', err);
});
