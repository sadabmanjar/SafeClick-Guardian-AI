import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export const authenticateJWT = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      status: 'fail',
      message: 'Access token missing or malformed',
    });
    return;
  }

  const token = authHeader.split(' ')[1];
  const jwtSecret = process.env.JWT_SECRET || 'safeclick-guardian-secret-key';

  try {
    const decoded = jwt.verify(token, jwtSecret) as {
      userId: string;
      email: string;
    };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({
      status: 'fail',
      message: 'Invalid or expired access token',
    });
  }
};
