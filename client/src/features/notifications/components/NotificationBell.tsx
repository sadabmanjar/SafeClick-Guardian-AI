'use client';

import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { useUnreadCount } from '../hooks/useNotifications';
import { useNotificationContext } from '../context/NotificationProvider';
import { NotificationDropdown } from './NotificationDropdown';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

export const NotificationBell = () => {
  const { data: unreadCount = 0 } = useUnreadCount();
  const { toggleDropdown, isDropdownOpen } = useNotificationContext();
  const [hasNew, setHasNew] = useState(false);

  // Trigger brief animation when count goes up
  useEffect(() => {
    if (unreadCount > 0) {
      setHasNew(true);
      const timer = setTimeout(() => setHasNew(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [unreadCount]);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className={cn(
          "relative p-2 rounded-full transition-colors",
          isDropdownOpen ? "bg-slate-100 text-blue-600" : "text-slate-500 hover:bg-slate-100 hover:text-slate-700",
          hasNew && "animate-pulse text-blue-600"
        )}
      >
        <Bell size={20} className={cn(hasNew && "animate-bounce")} />
        
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white shadow-sm"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      <NotificationDropdown />
    </div>
  );
};
