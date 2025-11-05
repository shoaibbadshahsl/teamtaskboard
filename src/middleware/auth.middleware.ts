import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication failed: No token provided' });
  }

  try {
    const decoded = verifyToken(token) as { id: string };
    (req as any).userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed: Invalid token' });
  }
};
