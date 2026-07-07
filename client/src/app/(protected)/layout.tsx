'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import MobileTopbar from '@/components/layout/MobileTopbar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#FAFAF8] flex text-foreground">
        {/* Sidebar — desktop */}
        <Sidebar activeRoute={pathname} />

        {/* Main content container */}
        <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
          {/* Mobile topbar */}
          <MobileTopbar activeRoute={pathname} />

          <main className="flex-1 px-4 py-8 lg:px-8 xl:px-10 max-w-screen-xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
