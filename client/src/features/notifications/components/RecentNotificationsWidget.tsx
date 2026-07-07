'use client';

import React from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationCard } from './NotificationCard';
import { EmptyState } from './EmptyState';
import { NotificationSkeleton } from './NotificationSkeleton';
import Link from 'next/link';

export const RecentNotificationsWidget = () => {
  const { data, isLoading, isError } = useNotifications({ limit: 5 });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-full">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-semibold text-slate-800">Recent Notifications</h3>
        <Link href="/notifications" className="text-sm font-medium text-blue-600 hover:text-blue-700">
          View All
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading && <NotificationSkeleton />}
        {isError && <div className="p-4 text-center text-sm text-red-500">Failed to load notifications.</div>}
        
        {!isLoading && !isError && data?.notifications.length === 0 && (
          <EmptyState />
        )}

        {!isLoading && !isError && (data?.notifications || []).map((notification) => (
          <NotificationCard key={notification._id} notification={notification} />
        ))}
      </div>
    </div>
  );
};
