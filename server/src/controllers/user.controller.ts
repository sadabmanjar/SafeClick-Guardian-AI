import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { syncUser, getUserProfile } from '../services/user.service';
import { sendSuccess } from '../utils/response.util';

export const syncUserController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const supabaseUserId = req.user?.userId; // Assuming auth.middleware sets this to the sub claim
    const { email, fullName, phone, avatar } = req.body;

    if (!supabaseUserId) {
      throw new Error('Supabase User ID not found in token');
    }

    const user = await syncUser(supabaseUserId, email, fullName, phone, avatar);
    
    sendSuccess(res, 200, 'User synced successfully', user);
  } catch (error) {
    next(error);
  }
};

export const getProfileController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const supabaseUserId = req.user?.userId;
    if (!supabaseUserId) {
      throw new Error('Supabase User ID not found in token');
    }

    const user = await getUserProfile(supabaseUserId);
    
    sendSuccess(res, 200, 'Profile retrieved', user);
  } catch (error) {
    next(error);
  }
};
