import { registerSchema } from './schema';
import { loginSchema } from './schema';
import { z } from 'zod';

export const validateRegister = (data: unknown) => {
    return registerSchema.parse(data);
};

export const validateLogin = (data: unknown) => {
    return loginSchema.parse(data);
};