'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('[PROTECTED ROUTE GUARD] User:', user ? user.email : 'NONE', '| Loading:', isLoading);
    // TEMPORARILY DISABLED: Allow access without login
    /*
    if (!isLoading && !user) {
      console.log('[PROTECTED ROUTE GUARD] Unauthorized! Redirecting to /login...');
      router.push('/login');
    }
    */
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAF8] text-gray-900">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono">Verifying Session...</p>
        </div>
      </div>
    );
  }

  // TEMPORARILY DISABLED: Allow rendering without user
  /*
  if (!user) {
    return null;
  }
  */

  return <>{children}</>;
}
