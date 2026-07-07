'use client';

import React from 'react';
import { INotification } from '../../types';
import { getTypeStyles, PriorityBadge } from './NotificationBadge';
import { formatDistanceToNow } from 'date-fns';
import { Bell, CheckCircle2, AlertTriangle, XCircle, Info, ShieldAlert, Cpu, FileWarning, Crown, Trash2, Check, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMarkAsRead, useDeleteNotification } from '../hooks/useNotifications';
import Link from 'next/link';

interface Props {
  notification: INotification;
  onClose?: () => void;
}

const getIcon = (type: INotification['type']) => {
  switch (type) {
    case 'success': return <CheckCircle2 size={20} />;
    case 'warning': return <AlertTriangle size={20} />;
    case 'error': return <XCircle size={20} />;
    case 'info': return <Info size={20} />;
    case 'security': return <ShieldAlert size={20} />;
    case 'ai': return <Cpu size={20} />;
    case 'complaint': return <FileWarning size={20} />;
    case 'emergency': return <AlertTriangle size={20} />;
    case 'admin': return <Crown size={20} />;
    default: return <Bell size={20} />;
  }
};

export const NotificationCard = ({ notification, onClose }: Props) => {
  const markAsRead = useMarkAsRead();
  const deleteNotif = useDeleteNotification();

  const handleMarkRead = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    markAsRead.mutate(notification._id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    deleteNotif.mutate(notification._id);
  };

  const Wrapper = notification.redirectUrl ? Link : 'div';
  const wrapperProps = notification.redirectUrl 
    ? { href: notification.redirectUrl, onClick: onClose } 
    : {};

  return (
    <Wrapper 
      {...wrapperProps as any}
      className={cn(
        "group relative flex gap-4 p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer",
        !notification.isRead && "bg-blue-50/30"
      )}
    >
      {/* Unread Indicator */}
      {!notification.isRead && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full" />
      )}

      {/* Icon */}
      <div className={cn(
        "flex shrink-0 items-center justify-center h-10 w-10 rounded-full",
        getTypeStyles(notification.type)
      )}>
        {getIcon(notification.type)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className={cn(
            "text-sm truncate",
            notification.isRead ? "font-medium text-slate-700" : "font-semibold text-slate-900"
          )}>
            {notification.title}
          </h4>
          <span className="text-[10px] whitespace-nowrap text-slate-400 shrink-0 mt-0.5">
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
          </span>
        </div>
        
        <p className="text-xs text-slate-600 line-clamp-2 mb-2 leading-relaxed">
          {notification.message}
        </p>

        <div className="flex items-center gap-2">
          {notification.priority !== 'low' && (
            <PriorityBadge priority={notification.priority} />
          )}
          {notification.redirectUrl && (
            <span className="text-[10px] flex items-center text-blue-600 font-medium">
              View Details <ExternalLink size={10} className="ml-1" />
            </span>
          )}
        </div>
      </div>

      {/* Actions Hover (Desktop) */}
      <div className="absolute right-4 top-4 hidden group-hover:flex items-center gap-1 bg-white/90 shadow-sm border border-slate-100 rounded-md px-1 py-0.5 backdrop-blur-sm">
        {!notification.isRead && (
          <button 
            onClick={handleMarkRead}
            disabled={markAsRead.isPending}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Mark as read"
          >
            <Check size={14} />
          </button>
        )}
        <button 
          onClick={handleDelete}
          disabled={deleteNotif.isPending}
          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          title="Delete"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </Wrapper>
  );
};
