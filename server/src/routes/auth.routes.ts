import { Router } from 'express';
import { getAuthStatus } from '../controllers/auth.controller';

const router = Router();

// Authentication is fully managed by Supabase on the frontend.
// This route only provides a status endpoint for health checks.
router.get('/status', getAuthStatus);

export default router;
