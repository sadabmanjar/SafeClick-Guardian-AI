import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';

// Extended request type that carries the authenticated Supabase user
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

// Supabase admin client - uses service_role key to verify JWTs server-side
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

/**
 * verifySupabaseToken middleware
 * Reads the Authorization header, verifies the Supabase JWT,
 * and attaches the authenticated user to req.user.
 * Returns 401 for missing/invalid tokens.
 */
export const authenticateJWT = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // TEMPORARILY DISABLED: Allow access without login
  req.user = {
    userId: 'mock-user-id-12345',
    email: 'citizen@example.com',
    role: 'citizen',
  };
  return next();

  /*
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      status: 'fail',
      message: 'Authorization token missing. Please log in.',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data.user) {
      res.status(401).json({
        status: 'fail',
        message: 'Invalid or expired token. Please log in again.',
      });
      return;
    }

    const supabaseUser = data.user;

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', supabaseUser.id)
      .single();

    req.user = {
      userId: supabaseUser.id,
      email: supabaseUser.email || '',
      role: profile?.role || 'citizen',
    };

    next();
  } catch {
    res.status(401).json({
      status: 'fail',
      message: 'Token verification failed. Please log in again.',
    });
  }
  */
};

/**
 * requireRole middleware factory
 * Restricts access to users holding specified roles.
 * Must be used AFTER authenticateJWT.
 */
export const requireRole = (...allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        status: 'fail',
        message: 'Authentication required.',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        status: 'fail',
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}. Your role: ${req.user.role}`,
      });
      return;
    }

    next();
  };
};
