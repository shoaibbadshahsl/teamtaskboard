import { Request, Response, NextFunction } from 'express';
import { AppError, isAppError, createValidationError } from '../utils/errors';
import { ZodError } from 'zod';
import { logger } from '../utils/logger';

export const errorMiddleware = (
  err: Error | AppError | unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error with context
  logger.error('Error occurred', {
    error: err instanceof Error ? err.message : 'Unknown error',
    path: req.path,
    method: req.method,
    body: req.body,
    stack: err instanceof Error ? err.stack : undefined
  });

  if (isAppError(err)) {
    const response = err.details 
      ? { message: err.message, details: err.details }
      : { message: err.message };
    return res.status(err.httpStatus).json(response);
  }

  if (err instanceof ZodError) {
    const validationError = createValidationError('Validation failed', 
      err.issues.map(e => ({ field: e.path.join('.'), message: e.message }))
    );
    return res.status(validationError.httpStatus).json({
      message: validationError.message,
      details: validationError.details
    });
  }

  // Handle mongoose CastError (e.g., invalid ObjectId)
  if (err instanceof Error && err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  // Generic fallback for unexpected errors
  return res.status(500).json({ message: 'Something went wrong!' });
};