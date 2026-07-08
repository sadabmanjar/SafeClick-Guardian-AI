import { Router } from 'express';
import {
  createScan,
  getScans,
  getScanById,
  deleteScan,
} from '../controllers/scan.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();

// Protect all scan routes
router.use(authenticateJWT);

router.post('/analyze', createScan);
router.get('/history', getScans);
router.get('/:id', getScanById);
router.delete('/:id', deleteScan);

export default router;
