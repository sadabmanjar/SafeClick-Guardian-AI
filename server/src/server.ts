import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { errorHandler } from './middlewares/error.middleware';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import scanRoutes from './routes/scan.routes';
import complaintRoutes from './routes/complaint.routes';
import emergencyRoutes from './routes/emergency.routes';
import adminRoutes from './routes/admin.routes';
import notificationRoutes from './routes/notification.routes';
import heatmapRoutes from './routes/heatmap.routes';
import { initializeDistricts, ingestNews } from './services/newsIngestion.service';


dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Step 13: Security Hardening Middlewares
app.use(helmet()); // Secure HTTP headers
app.use(compression()); // Compress responses payload size
app.use(cors()); // Allow cross-origin requests
app.use(express.json({ limit: '2mb' })); // Cap raw JSON payloads size to protect against DoS

// Execution logging
app.use(morgan('dev'));

// Rate Limiter to prevent brute force spamming
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // limit each IP to 150 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'fail',
    message: 'Rate limit exceeded. Too many connections from this IP.',
  },
});
app.use('/api', apiLimiter);

// Register API Route handlers
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/scans', scanRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/heatmap', heatmapRoutes);


// Base route path
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'SafeClick Guardian Hybrid AI Threat API operating securely',
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
    ingestNews().catch((err: unknown) => {
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
