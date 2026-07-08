'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotificationContext } from '../context/NotificationProvider';
import { NotificationList } from './NotificationList';
import { useMarkAllAsRead, useDeleteAllNotifications } from '../hooks/useNotifications';
import { GetNotificationsFilters, NotificationType } from '../types';
import { Settings, Check, Trash2, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

export const NotificationDropdown = () => {
  const { isDropdownOpen, closeDropdown } = useNotificationContext();
  const [filter, setFilter] = useState<GetNotificationsFilters>({ limit: 10 });
  const [isFiltering, setIsFiltering] = useState(false);

  const markAllAsRead = useMarkAllAsRead();
  const deleteAll = useDeleteAllNotifications();

  const handleMarkAll = () => markAllAsRead.mutate();
  const handleDeleteAll = () => {
    if (confirm('Are you sure you want to delete all notifications?')) {
      deleteAll.mutate();
    }
  };

  const setFilterType = (type: NotificationType | 'all' | 'unread') => {
    if (type === 'all') setFilter({ limit: 10 });
    else if (type === 'unread') setFilter({ limit: 10, unreadOnly: true });
    else setFilter({ limit: 10, type });
    setIsFiltering(false);
  };

  return (
    <AnimatePresence>
      {isDropdownOpen && (
        <>
          {/* Backdrop for mobile closing */}
          <div 
            className="fixed inset-0 z-40 sm:hidden" 
            onClick={closeDropdown}
          />
          
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 sm:right-0 sm:translate-x-0 -right-16 top-[calc(100%+0.5rem)] w-screen sm:w-[400px] z-50 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[600px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-semibold text-slate-800">Notifications</h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsFiltering(!isFiltering)}
                  className={cn("p-1.5 rounded transition-colors", isFiltering ? "bg-slate-200 text-slate-800" : "text-slate-500 hover:bg-slate-100")}
                  title="Filter"
                >
                  <Filter size={16} />
                </button>
                <button 
                  onClick={handleMarkAll}
                  disabled={markAllAsRead.isPending}
                  className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Mark all as read"
                >
                  <Check size={16} />
                </button>
                <button 
                  onClick={handleDeleteAll}
                  disabled={deleteAll.isPending}
                  className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Clear all"
                >
                  <Trash2 size={16} />
                </button>
                <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded transition-colors">
                  <Settings size={16} />
                </button>
              </div>
            </div>

            {/* Filters panel */}
            <AnimatePresence>
              {isFiltering && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-b border-slate-100 bg-white overflow-hidden"
                >
                  <div className="p-3 flex flex-wrap gap-2">
                    {['all', 'unread', 'security', 'ai', 'complaint', 'emergency', 'admin'].map((t) => (
                      <button
                        key={t}
                        onClick={() => setFilterType(t as any)}
                        className={cn(
                          "px-2.5 py-1 text-[11px] font-medium rounded-full capitalize transition-colors",
                          (filter.type === t || (t === 'all' && !filter.type && !filter.unreadOnly) || (t === 'unread' && filter.unreadOnly))
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* List */}
            <div className="overflow-y-auto flex-1 custom-scrollbar">
              <NotificationList filters={filter} onClose={closeDropdown} />
            </div>

            {/* Footer */}
            <div className="p-2 border-t border-slate-100 bg-slate-50 text-center">
              <button 
                onClick={closeDropdown}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 p-2 w-full"
              >
                View all notifications
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
