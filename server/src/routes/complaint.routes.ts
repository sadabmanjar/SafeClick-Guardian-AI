import { Router } from 'express';
import { createComplaint, generateComplaint, getComplaints, getComplaintById } from '../controllers/complaint.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { createComplaintSchema } from '../validators/schema';

const router = Router();

// Apply auth protection middleware to all complaint endpoints
router.use(authenticateJWT);

router.post('/', validateBody(createComplaintSchema), createComplaint);
router.post('/generate', generateComplaint);
router.get('/', getComplaints);
router.get('/history', getComplaints);
router.get('/:id', getComplaintById);

export default router;
