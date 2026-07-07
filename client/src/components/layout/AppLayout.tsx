import React from 'react';
import Sidebar from './Sidebar';
import MobileTopbar from './MobileTopbar';
import { NotificationBell } from '@/features/notifications/components/NotificationBell';

interface AppLayoutProps {
  children: React.ReactNode;
  activeRoute: string;
}

export default function AppLayout({ children, activeRoute }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background cyber-grid-bg flex">
      {/* Sidebar — desktop */}
      <Sidebar activeRoute={activeRoute} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {/* Mobile topbar */}
        <MobileTopbar activeRoute={activeRoute} />

        {/* Desktop Header */}
        <header className="hidden lg:flex h-16 items-center justify-end px-8 border-b border-border/50 bg-background/50 backdrop-blur-sm sticky top-0 z-20">
          <NotificationBell />
        </header>

        <main className="flex-1 px-4 py-6 lg:px-8 xl:px-10 2xl:px-12 max-w-screen-2xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}