import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { errorHandler } from './middlewares/error.middleware';
import authRoutes from './routes/auth.routes';
import scanRoutes from './routes/scan.routes';
import complaintRoutes from './routes/complaint.routes';
import emergencyRoutes from './routes/emergency.routes';
import heatmapRoutes from './routes/heatmap.routes';
import { initializeDistricts, ingestNews } from './services/newsIngestion.service';

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
app.use('/api/heatmap', heatmapRoutes);

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
  
  // Seed districts on start
  await initializeDistricts();

  // Background cron to ingest news every hour (3600000 ms)
  setInterval(() => {
    ingestNews().catch((err) => {
      console.error('[SAFECLICK BACKGROUND WORKER ERROR]:', err);
    });
  }, 3600000);

  app.listen(port, () => {
    console.log(`[SAFECLICK BACKEND] Operating on secure channel: http://localhost:${port}`);
  });
};

startServer().catch((err) => {
  console.error('[CRITICAL] SafeClick Backend Initialization Failure:', err);
});
