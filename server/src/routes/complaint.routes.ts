import { Router } from 'express';
import { createComplaint, getComplaints, generateComplaint } from '../controllers/complaint.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { createComplaintSchema } from '../validators/schema';

const router = Router();

// Apply auth protection middleware to all complaint endpoints
router.use(authenticateJWT as any);

router.post('/', validateBody(createComplaintSchema), createComplaint);
router.post('/generate', generateComplaint);
router.get('/', getComplaints);

export default router;
