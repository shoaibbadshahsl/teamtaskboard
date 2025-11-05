import { createTaskSchema, updateTaskSchema } from './schema';
import { z } from 'zod';

export const validateCreateTask = (data: unknown) => {
    return createTaskSchema.parse(data);
};

export const validateUpdateTask = (data: unknown) => {
    return updateTaskSchema.parse(data);
};