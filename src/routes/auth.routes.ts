import { Router } from 'express';
import * as authController from '../controllers/auth/controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { registerSchema, loginSchema, updateUserSchema } from '../controllers/auth/schema';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);

// Protected routes - require authentication
router.use(authMiddleware);
router.get('/users', authController.getUsers);
router.get('/users/:id', authController.getUserById);
router.put('/users/:id', validate(updateUserSchema), authController.updateUser);
router.delete('/users/:id', authController.deleteUser);

export default router;
