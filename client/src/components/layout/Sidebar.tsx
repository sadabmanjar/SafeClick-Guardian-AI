'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { motion } from 'framer-motion';
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
  LayoutDashboard
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
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`hidden lg:flex flex-col fixed top-0 left-0 h-full z-40 transition-all duration-200 ease-in-out bg-white border-r border-gray-200 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo Header */}
      <div className={`flex items-center gap-3 px-5 py-5 border-b border-gray-200 ${collapsed ? 'justify-center' : ''}`}>
        <AppLogo size={28} />
        {!collapsed && (
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-gray-900 tracking-tight">SafeClick Guardian</span>
            <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">Government Node</span>
          </div>
        )}
      </div>

      {/* Navigation Group Items */}
      <nav className="flex-1 py-6 overflow-y-auto scrollbar-cyber px-3 space-y-6">
        {navGroups.map((group) => (
          <div key={`group-${group.label}`} className="space-y-1">
            {!collapsed && (
              <p className="px-3 mb-2 text-[10px] font-bold tracking-wider text-gray-400 uppercase">
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
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 group relative ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-semibold' 
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-bar"
                      className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-blue-600 rounded-r-md"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <item.icon
                    size={16}
                    className={`flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-900'}`}
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
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-red-500" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom Profile details & Collapse buttons */}
      <div className="border-t border-gray-200 p-3 bg-gray-50/50">
        {!collapsed && (
          <div className="flex items-center gap-3 px-2 py-2 mb-3 bg-white rounded-lg border border-gray-100 shadow-2xs">
            <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
              <User size={14} className="text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-900 truncate">Rahul Sharma</p>
              <p className="text-[10px] text-gray-400 font-medium truncate">Citizen • MP</p>
            </div>
            <button className="p-1 rounded-md hover:bg-gray-100 transition-colors" aria-label="Notifications">
              <Bell size={13} className="text-gray-400 hover:text-gray-600" />
            </button>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors text-xs font-medium"
        >
          {collapsed ? (
            <ChevronRight size={14} />
          ) : (
            <>
              <ChevronLeft size={14} />
              <span>Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
