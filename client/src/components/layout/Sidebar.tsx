'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useSidebar } from '@/context/SidebarContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  Shield,
  AlertTriangle,
  FileText,
  MapPin,
  GraduationCap,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Bell,
  User,
  Database,
  LayoutDashboard,
  LogOut,
  Loader2,
  ChevronUp,
} from 'lucide-react';

const navGroups = [
  {
    label: 'OVERVIEW',
    items: [
      { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', badge: null },
    ]
  },
  {
    label: 'PROTECTION',
    items: [
      { href: '/analyze', icon: Shield, label: 'AI Scam Analyzer', badge: null },
      { href: '/emergency', icon: AlertTriangle, label: 'Emergency Mode', badge: 'SOS' },
      { href: '/complaint', icon: FileText, label: 'Complaint Generator', badge: null },
      { href: '/evidence', icon: Database, label: 'Evidence Locker', badge: null },
    ],
  },
  {
    label: 'COMMUNITY',
    items: [
      { href: '/heatmap', icon: MapPin, label: 'Scam Heatmap', badge: '12' },
      { href: '/learning', icon: GraduationCap, label: 'Cyber Learning', badge: null },
    ],
  },
  {
    label: 'ADMIN',
    items: [
      { href: '/police-dashboard', icon: BarChart3, label: 'Police Dashboard', badge: '3' },
    ],
  },
];

interface SidebarProps {
  activeRoute: string;
}

export default function Sidebar({ activeRoute }: SidebarProps) {
  const { collapsed, toggle } = useSidebar();
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (!confirmLogout) return;

    setSigningOut(true);
    try {
      await signOut();
      router.push('/login');
    } finally {
      setSigningOut(false);
    }
  };

  // Display name: prefer fullName metadata, then email prefix, then fallback
  const displayName = user?.user_metadata?.fullName
    || user?.user_metadata?.full_name
    || user?.email?.split('@')[0]
    || 'User';
  const displayEmail = user?.email || 'citizen@safeguard.mp';

  return (
    <aside
      className={`hidden lg:flex flex-col fixed top-0 left-0 h-full z-40 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo Header */}
      <div className={`flex items-center border-b border-gray-200 overflow-hidden ${collapsed ? 'justify-center px-2 py-4' : 'gap-2.5 px-4 py-4'}`}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-sm">
          <Shield size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-black text-gray-900 tracking-tight leading-none">SafeClick</p>
            <p className="text-[10px] text-cyan-600 font-bold tracking-widest uppercase mt-0.5">AI Guardian</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto px-2 space-y-5">
        {navGroups.map((group) => (
          <div key={`group-${group.label}`} className="space-y-0.5">
            {!collapsed && (
              <p className="px-3 mb-1.5 text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                {group.label}
              </p>
            )}
            {group.items.map((item) => {
              const isActive = activeRoute === item.href;
              return (
                <Link
                  key={`nav-${item.href}`}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group relative ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                  } ${collapsed ? 'justify-center' : ''}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-bar"
                      className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-blue-600 rounded-r-md"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <item.icon
                    size={18}
                    className={`flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-700'}`}
                  />
                  {!collapsed && (
                    <>
                      <span className="text-sm font-medium truncate flex-1">{item.label}</span>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                            item.badge === 'SOS'
                              ? 'bg-red-50 text-red-600 border border-red-100'
                              : 'bg-blue-50 text-blue-600 border border-blue-100'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {collapsed && item.badge && (
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom: profile + logout dropdown + collapse toggle */}
      <div className="border-t border-gray-200 p-2 bg-gray-50/50 relative">
        {/* Profile Card (Clickable to show logout) */}
        {!collapsed ? (
          <div className="relative">
            <button
              onClick={() => setShowLogoutMenu(prev => !prev)}
              className="w-full flex items-center gap-2.5 px-2 py-2 mb-2 bg-white hover:bg-gray-100/50 rounded-lg border border-gray-100 shadow-2xs text-left transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                <User size={14} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-900 truncate capitalize">{displayName}</p>
                <p className="text-[10px] text-gray-400 font-medium truncate">{displayEmail}</p>
              </div>
              <ChevronUp size={14} className={`text-gray-400 transition-transform ${showLogoutMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Logout sub-menu option */}
            {showLogoutMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-gray-200 rounded-lg shadow-md p-1 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
                <button
                  onClick={handleLogout}
                  disabled={signingOut}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors text-xs font-semibold text-left disabled:opacity-50"
                >
                  {signingOut ? <Loader2 size={13} className="animate-spin" /> : <LogOut size={13} />}
                  <span>{signingOut ? 'Logging out...' : 'Log Out'}</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Collapsed mode profile icon toggler */
          <div className="relative flex justify-center mb-2">
            <button
              onClick={() => setShowLogoutMenu(prev => !prev)}
              title="Profile Options"
              className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 hover:bg-blue-100 transition-colors"
            >
              <User size={14} className="text-blue-600" />
            </button>

            {/* Collapsed logout menu overlay */}
            {showLogoutMenu && (
              <div className="absolute bottom-full left-full ml-2 mb-1 w-28 bg-white border border-gray-200 rounded-lg shadow-md p-1 z-50 animate-in fade-in slide-in-from-left-2 duration-150">
                <button
                  onClick={handleLogout}
                  disabled={signingOut}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors text-xs font-semibold text-left disabled:opacity-50"
                >
                  {signingOut ? <Loader2 size={13} className="animate-spin" /> : <LogOut size={13} />}
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={toggle}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors text-xs font-medium ${collapsed ? 'justify-center' : ''}`}
        >
          {collapsed ? <ChevronRight size={16} /> : (
            <>
              <ChevronLeft size={16} />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
