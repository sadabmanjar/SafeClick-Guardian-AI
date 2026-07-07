import { Request, Response, NextFunction } from 'express';

/**
 * Supabase handles all authentication — auth controller is no longer needed.
 * Signup, login, logout, password reset, email verification are all managed
 * via the Supabase client SDK on the frontend.
 *
 * This backend only:
 * 1. Verifies Supabase JWTs via auth.middleware.ts
 * 2. Reads user roles from the `profiles` MongoDB/Supabase table
 * 3. Protects /api/scans, /api/complaints, /api/emergency routes
 *
 * This file is intentionally a minimal health-check route handler.
 */

export const getAuthStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.status(200).json({
      status: 'success',
      message: 'Authentication is handled by Supabase. Use Supabase client SDK on the frontend.',
    });
  } catch (error) {
    next(error);
  }
};
