'use client';

import React from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationCard } from './NotificationCard';
import { EmptyState } from './EmptyState';
import { NotificationSkeleton } from './NotificationSkeleton';
import { GetNotificationsFilters } from '../types';

interface Props {
  filters: GetNotificationsFilters;
  onClose?: () => void;
}

export const NotificationList = ({ filters, onClose }: Props) => {
  const { data, isLoading, isError } = useNotifications(filters);

  if (isLoading) {
    return <NotificationSkeleton />;
  }

  if (isError) {
    return (
      <div className="p-4 text-center text-sm text-red-500">
        Failed to load notifications.
      </div>
    );
  }

  const notifications = data?.notifications || [];

  if (notifications.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col">
      {notifications.map((notification) => (
        <NotificationCard 
          key={notification._id} 
          notification={notification} 
          onClose={onClose}
        />
      ))}
    </div>
  );
};
