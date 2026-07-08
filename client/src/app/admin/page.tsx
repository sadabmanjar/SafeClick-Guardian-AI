'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Shield, ShieldX, Loader2 } from 'lucide-react';
import Link from 'next/link';

/**
 * Admin Dashboard
 * Only accessible to users with role: 'admin' or 'super_admin'.
 * Role is read from the `profiles` database table — NEVER from email string.
 */
export default function AdminPage() {
  const { user, profile, role, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-primary h-8 w-8" />
          <p className="text-xs text-muted-foreground">Verifying security clearance...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 rounded-2xl border border-danger/30 bg-zinc-950/80 backdrop-blur-xl shadow-[0_0_50px_rgba(255,0,0,0.1)] space-y-4 text-center">
          <ShieldX className="mx-auto text-danger" size={40} />
          <h1 className="text-xl font-extrabold text-danger">Access Denied</h1>
          <p className="text-xs text-muted-foreground">
            You must be logged in to access this area.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 mt-2 text-xs font-semibold text-primary hover:underline"
          >
            Log In →
          </Link>
        </div>
      </div>
    );
  }

  // Role-based access: only admin and super_admin are permitted
  if (role !== 'admin' && role !== 'super_admin') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 rounded-2xl border border-danger/30 bg-zinc-950/80 backdrop-blur-xl shadow-[0_0_50px_rgba(255,0,0,0.1)] space-y-4 text-center">
          <ShieldX className="mx-auto text-danger" size={40} />
          <div>
            <p className="text-xs font-mono text-danger/70 uppercase tracking-widest mb-1">Error 403</p>
            <h1 className="text-xl font-extrabold text-danger">Unauthorized Access</h1>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            This section requires <span className="text-foreground font-semibold">Admin</span> or{' '}
            <span className="text-foreground font-semibold">Super Admin</span> clearance.
            Your current role is:{' '}
            <span className="px-1.5 py-0.5 rounded bg-zinc-800 border border-border font-mono text-foreground text-[11px]">
              {role || 'citizen'}
            </span>
          </p>
          <p className="text-[11px] text-muted-foreground">
            If you believe this is an error, contact your system administrator.
          </p>
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 mt-2 text-xs font-semibold text-primary hover:underline"
          >
            Return to Dashboard →
          </Link>
        </div>
      </div>
    );
  }

  // Authorized admin view
  return (
    <div className="min-h-screen bg-black p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Shield className="text-primary" size={24} />
          </div>
          <div>
            <p className="text-[11px] font-mono text-primary/70 uppercase tracking-widest">
              Clearance: {role === 'super_admin' ? 'Super Administrator' : 'Administrator'}
            </p>
            <h1 className="text-2xl font-extrabold bg-gradient-to-b from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
              Admin Control Center
            </h1>
          </div>
        </div>

        {/* Session info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Email', value: user?.email || '—' },
            { label: 'Full Name', value: profile?.full_name || '—' },
            { label: 'Role', value: role || '—' },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="p-4 rounded-xl bg-zinc-950 border border-border space-y-1"
            >
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{label}</p>
              <p className="text-sm font-semibold text-foreground truncate">{value}</p>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-xs text-muted-foreground">
          Admin management panels (user management, scan logs, complaint reviews) will be integrated here.
        </div>
      </div>
    </div>
  );
}
