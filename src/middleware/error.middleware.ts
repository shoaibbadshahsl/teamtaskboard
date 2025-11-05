import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { ZodError } from 'zod';

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Log the full error for debugging

  if (err instanceof AppError) {
    return res.status(err.httpStatus).json({ message: err.message });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: err.issues.map(e => ({ path: e.path, message: e.message })), // Corrected from err.errors to err.issues
    });
  }

  // Handle mongoose CastError (e.g., invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  // Generic fallback for unexpected errors
  return res.status(500).json({ message: 'Something went wrong!' });
};