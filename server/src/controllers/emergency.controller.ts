import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { createAlert, getAlertsHistory } from '../services/emergency.service';
import { sendSuccess } from '../utils/response.util';

export const triggerAlert = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { location, contactsNotified, alertType } = req.body;

    const newAlert = await createAlert({
      userId,
      location,
      contactsNotified,
      alertType,
    });

    console.log(`[SOS TRIGGERED] User ${userId} active alert dispatched to: ${(contactsNotified || []).join(', ')}`);

    sendSuccess(res, 201, 'Emergency SOS Broadcast Dispatched Securely', newAlert);
  } catch (error) {
    next(error);
  }
};

export const getAlerts = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new Error('User ID required');

    const alerts = await getAlertsHistory(userId);
    sendSuccess(res, 200, 'Emergency alerts retrieved successfully', alerts);
  } catch (error) {
    next(error);
  }
};
