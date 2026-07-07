import { Router } from 'express';
import { createScan, getScans } from '../controllers/scan.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { createScanSchema } from '../validators/schema';

const router = Router();

// Apply auth protection middleware to all scan endpoints
router.use(authenticateJWT as any);

router.post('/', validateBody(createScanSchema), createScan);
router.get('/', getScans);

export default router;
