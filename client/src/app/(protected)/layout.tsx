'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import MobileTopbar from '@/components/layout/MobileTopbar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { SidebarProvider, useSidebar } from '@/context/SidebarContext';

// Inner layout reads the context
function LayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { collapsed } = useSidebar();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#FAFAF8] flex text-foreground">
        {/* Sidebar */}
        <Sidebar activeRoute={pathname} />

        {/* Main content — shifts smoothly when sidebar collapses */}
        <div
          className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
            collapsed ? 'lg:ml-16' : 'lg:ml-64'
          }`}
        >
          {/* Mobile topbar */}
          <MobileTopbar activeRoute={pathname} />

          <main className="flex-1 px-4 py-6 lg:px-6 xl:px-8 w-full">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <LayoutInner>{children}</LayoutInner>
    </SidebarProvider>
  );
}
