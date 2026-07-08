'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NotificationContextType {
  isDropdownOpen: boolean;
  openDropdown: () => void;
  closeDropdown: () => void;
  toggleDropdown: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const openDropdown = () => setIsDropdownOpen(true);
  const closeDropdown = () => setIsDropdownOpen(false);
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  return (
    <NotificationContext.Provider
      value={{
        isDropdownOpen,
        openDropdown,
        closeDropdown,
        toggleDropdown,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};
