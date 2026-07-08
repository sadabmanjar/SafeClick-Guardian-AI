import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import * as notificationService from '../services/notification.service';
import { sendSuccess } from '../utils/response.util';

export const getNotifications = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new Error('User ID required');

    const { unreadOnly, readOnly, type, priority, limit, page } = req.query;

    const filters = {
      unreadOnly: unreadOnly === 'true',
      readOnly: readOnly === 'true',
      type: type as string,
      priority: priority as string,
    };

    const result = await notificationService.getNotifications(
      userId,
      filters,
      limit ? parseInt(limit as string) : 20,
      page ? parseInt(page as string) : 1
    );

    sendSuccess(res, 200, 'Notifications retrieved', result);
  } catch (error) {
    next(error);
  }
};

export const getUnreadCount = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new Error('User ID required');

    const count = await notificationService.getUnreadCount(userId);
    sendSuccess(res, 200, 'Unread count retrieved', { count });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    if (!userId) throw new Error('User ID required');

    const notification = await notificationService.markAsRead(id as string, userId);
    sendSuccess(res, 200, 'Notification marked as read', notification);
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new Error('User ID required');

    await notificationService.markAllAsRead(userId);
    sendSuccess(res, 200, 'All notifications marked as read', null);
  } catch (error) {
    next(error);
  }
};

export const deleteNotification = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    if (!userId) throw new Error('User ID required');

    await notificationService.deleteNotification(id as string, userId);
    sendSuccess(res, 200, 'Notification deleted', null);
  } catch (error) {
    next(error);
  }
};

export const deleteAllNotifications = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new Error('User ID required');

    await notificationService.deleteAllNotifications(userId);
    sendSuccess(res, 200, 'All notifications deleted', null);
  } catch (error) {
    next(error);
  }
};

export const createBroadcast = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, message, priority, type, target } = req.body;
    
    await notificationService.createBroadcast({
      title,
      message,
      priority,
      type
    }, target);

    sendSuccess(res, 201, 'Broadcast sent successfully', null);
  } catch (error) {
    next(error);
  }
};
