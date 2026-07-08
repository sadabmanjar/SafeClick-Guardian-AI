export type NotificationType = 'success' | 'warning' | 'error' | 'info' | 'security' | 'ai' | 'complaint' | 'emergency' | 'admin';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';

export interface INotification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  icon?: string;
  redirectUrl?: string;
  metadata?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetNotificationsFilters {
  unreadOnly?: boolean;
  readOnly?: boolean;
  type?: NotificationType | 'all';
  priority?: NotificationPriority;
  limit?: number;
  page?: number;
}

export interface GetNotificationsResponse {
  notifications: INotification[];
  total: number;
}
