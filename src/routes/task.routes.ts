import { Router } from 'express';
import * as taskController from '../controllers/tasks/controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { createTaskSchema, updateTaskSchema } from '../controllers/tasks/schema';

const router = Router();

router.use(authMiddleware);

router.get('/dashboard', taskController.getDashboardStats);
router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTaskById);
router.post('/', validate(createTaskSchema), taskController.createTask);
router.put('/:id', validate(updateTaskSchema), taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

export default router;
