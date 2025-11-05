import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';
import { createValidationError } from '../utils/errors';
import { logger } from '../utils/logger';

type ValidationTarget = 'body' | 'query' | 'params';

export const validate = (schema: ZodObject<any>, target: ValidationTarget = 'body') => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            logger.debug('Validating request', {
                target,
                path: req.path,
                method: req.method,
                data: req[target]
            });
            
            const data = await schema.parseAsync(req[target]);
            // Replace the request data with the validated data
            req[target] = data;
            
            logger.debug('Validation successful', {
                target,
                path: req.path
            });
            
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const validationErrors = error.issues.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }));
                
                logger.warn('Validation failed', {
                    path: req.path,
                    method: req.method,
                    target,
                    errors: validationErrors
                });
                
                next(createValidationError('Validation failed', validationErrors));
            } else {
                logger.error('Unexpected validation error', {
                    path: req.path,
                    method: req.method,
                    error: error instanceof Error ? error.message : 'Unknown error',
                    stack: error instanceof Error ? error.stack : undefined
                });
                
                next(error);
            }
        }
    };
};