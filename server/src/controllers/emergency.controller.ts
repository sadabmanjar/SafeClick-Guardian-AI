import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import Alert from '../models/alert.model';

export const triggerAlert = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { location, contactsNotified, alertType } = req.body;

    const newAlert = new Alert({
      userId,
      location,
      contactsNotified,
      alertType,
    });

    await newAlert.save();

    console.log(`[SOS TRIGGERED] User ${userId} active alert dispatched to: ${contactsNotified.join(', ')}`);

    res.status(201).json({
      status: 'success',
      message: 'Emergency SOS Broadcast Dispatched Securely',
      data: newAlert,
    });
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
    const alerts = await Alert.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: alerts.length,
      data: alerts,
    });
  } catch (error) {
    next(error);
  }
};
