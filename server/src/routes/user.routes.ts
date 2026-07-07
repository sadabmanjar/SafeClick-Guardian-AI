import { Router } from 'express';
import { syncUserController, getProfileController } from '../controllers/user.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();

router.post('/sync', authenticateJWT, syncUserController);
router.get('/profile', authenticateJWT, getProfileController);

export default router;
