import { Router } from 'express';
import { triggerAlert, getAlerts } from '../controllers/emergency.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { triggerAlertSchema } from '../validators/schema';

const router = Router();

// Apply auth protection middleware to all emergency endpoints
router.use(authenticateJWT as any);

router.post('/trigger', validateBody(triggerAlertSchema), triggerAlert);
router.get('/alerts', getAlerts);

export default router;
