import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { getDashboardStats, getAnalytics } from '../services/admin.service';
import { sendSuccess } from '../utils/response.util';

export const getStatsController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const stats = await getDashboardStats();
    sendSuccess(res, 200, 'Dashboard stats retrieved', stats);
  } catch (error) {
    next(error);
  }
};

export const getAnalyticsController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const analytics = await getAnalytics();
    sendSuccess(res, 200, 'Analytics retrieved', analytics);
  } catch (error) {
    next(error);
  }
};
