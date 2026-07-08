import Notification, { INotification } from '../models/notification.model';
import User from '../models/user.model';
import { AppError } from '../middlewares/error.middleware';

export const getNotifications = async (
  userId: string,
  filters: { unreadOnly?: boolean; readOnly?: boolean; type?: string; priority?: string },
  limit: number = 20,
  page: number = 1
): Promise<{ notifications: INotification[]; total: number }> => {
  const query: any = { userId };

  if (filters.unreadOnly) query.isRead = false;
  if (filters.readOnly) query.isRead = true;
  if (filters.type) query.type = filters.type;
  if (filters.priority) query.priority = filters.priority;

  const skip = (page - 1) * limit;

  const [notifications, total] = await Promise.all([
    Notification.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Notification.countDocuments(query),
  ]);

  return { notifications, total };
};

export const getUnreadCount = async (userId: string): Promise<number> => {
  return Notification.countDocuments({ userId, isRead: false });
};

export const markAsRead = async (id: string, userId: string): Promise<INotification> => {
  const notification = await Notification.findOneAndUpdate(
    { _id: id, userId },
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    const err: AppError = new Error('Notification not found');
    err.statusCode = 404;
    throw err;
  }

  return notification;
};

export const markAllAsRead = async (userId: string): Promise<void> => {
  await Notification.updateMany({ userId, isRead: false }, { isRead: true });
};

export const deleteNotification = async (id: string, userId: string): Promise<void> => {
  const notification = await Notification.findOneAndDelete({ _id: id, userId });
  
  if (!notification) {
    const err: AppError = new Error('Notification not found');
    err.statusCode = 404;
    throw err;
  }
};

export const deleteAllNotifications = async (userId: string): Promise<void> => {
  await Notification.deleteMany({ userId });
};

export const createSystemNotification = async (data: Partial<INotification>): Promise<INotification> => {
  const notification = new Notification(data);
  await notification.save();
  return notification;
};

export const createBroadcast = async (data: Partial<INotification>, target: 'Everyone' | 'Admins' | 'Citizens' | 'Emergency Team'): Promise<void> => {
  let userQuery: any = {};
  
  if (target === 'Admins') {
    userQuery.role = { $in: ['admin', 'super_admin'] };
  } else if (target === 'Citizens') {
    userQuery.role = 'citizen';
  } else if (target === 'Emergency Team') {
    userQuery.role = 'police';
  }

  const users = await User.find(userQuery).select('supabaseUserId');
  
  const notifications = users.map((user) => ({
    userId: user.supabaseUserId,
    title: data.title,
    message: data.message,
    type: data.type || 'admin',
    priority: data.priority || 'medium',
    icon: data.icon,
    redirectUrl: data.redirectUrl,
    metadata: data.metadata,
  }));

  if (notifications.length > 0) {
    await Notification.insertMany(notifications);
  }
};
