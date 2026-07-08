import { Router } from 'express';
import { getStatsController, getAnalyticsController } from '../controllers/admin.controller';
import { authenticateJWT, requireRole } from '../middlewares/auth.middleware';

const router = Router();

// Apply auth and admin authorization to all admin routes
router.use(authenticateJWT);
router.use(requireRole('admin', 'super_admin'));

router.get('/stats', getStatsController);
router.get('/analytics', getAnalyticsController);

export default router;
