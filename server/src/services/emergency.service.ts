import Alert, { IAlert } from '../models/alert.model';
import { AppError } from '../middlewares/error.middleware';
import { createSystemNotification } from './notification.service';

export const createAlert = async (data: Partial<IAlert>): Promise<IAlert> => {
  const newAlert = new Alert(data);
  await newAlert.save();

  if (newAlert.userId) {
    await createSystemNotification({
      userId: newAlert.userId,
      title: 'Emergency SOS Triggered',
      message: 'Your emergency alert has been securely dispatched. Help is on the way.',
      type: 'emergency',
      priority: 'critical',
      redirectUrl: `/dashboard/emergency`,
    });
  }

  return newAlert;
};

export const getAlertsHistory = async (userId: string): Promise<IAlert[]> => {
  return Alert.find({ userId }).sort({ createdAt: -1 });
};
