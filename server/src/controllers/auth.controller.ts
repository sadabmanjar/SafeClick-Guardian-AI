import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Mock authentication logic with JWT emission
export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Simulate database user creation
    const userId = 'usr_' + Math.floor(100000 + Math.random() * 900000);
    const jwtSecret = process.env.JWT_SECRET || 'safeclick-guardian-secret-key';

    const token = jwt.sign({ userId, email }, jwtSecret, { expiresIn: '7d' });

    res.status(201).json({
      status: 'success',
      data: {
        token,
        user: { id: userId, name, email },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Simulate database user lookup
    const userId = 'usr_492048';
    const name = 'Rahul Sharma';
    const jwtSecret = process.env.JWT_SECRET || 'safeclick-guardian-secret-key';

    const token = jwt.sign({ userId, email }, jwtSecret, { expiresIn: '7d' });

    res.status(200).json({
      status: 'success',
      data: {
        token,
        user: { id: userId, name, email },
      },
    });
  } catch (error) {
    next(error);
  }
};
