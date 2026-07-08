import { apiClient } from '@/lib/api';
import { GetNotificationsFilters, GetNotificationsResponse, INotification } from '../types';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const notificationsApi = {
  getNotifications: async (filters: GetNotificationsFilters): Promise<GetNotificationsResponse> => {
    const params = new URLSearchParams();
    if (filters.unreadOnly) params.append('unreadOnly', 'true');
    if (filters.readOnly) params.append('readOnly', 'true');
    if (filters.type && filters.type !== 'all') params.append('type', filters.type);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.page) params.append('page', filters.page.toString());

    const response = await apiClient.get<ApiResponse<GetNotificationsResponse>>(`/notifications?${params.toString()}`);
    return response.data.data;
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await apiClient.get<ApiResponse<{ count: number }>>('/notifications/unread-count');
    return response.data.data.count;
  },

  markAsRead: async (id: string): Promise<INotification> => {
    const response = await apiClient.patch<ApiResponse<INotification>>(`/notifications/${id}/read`);
    return response.data.data;
  },

  markAllAsRead: async (): Promise<void> => {
    await apiClient.patch('/notifications/read-all');
  },

  deleteNotification: async (id: string): Promise<void> => {
    await apiClient.delete(`/notifications/${id}`);
  },

  deleteAllNotifications: async (): Promise<void> => {
    await apiClient.delete('/notifications');
  }
};
