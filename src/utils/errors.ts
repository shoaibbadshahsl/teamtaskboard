export interface AppError {
  message: string;
  httpStatus: number;
  name: string;
  details?: ValidationErrorDetail[];
}

export interface ValidationErrorDetail {
  field: string;
  message: string;
}

export const createError = (
  message: string,
  httpStatus: number,
  name: string,
  details?: ValidationErrorDetail[]
): AppError => ({
  message,
  httpStatus,
  name,
  details
});

export const createNotFoundError = (
  message: string = 'Resource not found'
): AppError => createError(message, 404, 'NotFoundError');

export const createBadRequestError = (
  message: string = 'Bad Request'
): AppError => createError(message, 400, 'BadRequestError');

export const createUnauthorizedError = (
  message: string = 'Unauthorized'
): AppError => createError(message, 401, 'UnauthorizedError');

export const createValidationError = (
  message: string = 'Validation failed',
  details: ValidationErrorDetail[] = []
): AppError => createError(message, 400, 'ValidationError', details);

export const isAppError = (error: unknown): error is AppError => {
  if (!error || typeof error !== 'object') return false;
  return 'httpStatus' in error && 'message' in error && 'name' in error;
};
