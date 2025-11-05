import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { z } from 'zod';
import { User } from '../models/user.model'; // Corrected import

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(3),
});

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const result = await authService.register(validatedData);
    res.status(201).json(result);
  } catch (error) { 
    next(error);
  }
};

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const result = await authService.login(validatedData);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({}, '-password'); // Exclude passwords from the result
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};