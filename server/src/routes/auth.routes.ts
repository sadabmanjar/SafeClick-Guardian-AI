import { Router } from 'express';
import { signup, login } from '../controllers/auth.controller';
import { validateBody } from '../middlewares/validate.middleware';
import { signupSchema, loginSchema } from '../validators/schema';

const router = Router();

router.post('/signup', validateBody(signupSchema), signup);
router.post('/login', validateBody(loginSchema), login);

export default router;
