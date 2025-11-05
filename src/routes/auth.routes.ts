import { Router } from 'express';
import * as authController from '../controllers/auth/controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { registerSchema, loginSchema } from '../controllers/auth/schema';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/users', authMiddleware, authController.getUsers);

export default router;
