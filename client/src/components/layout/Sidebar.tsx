'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { Shield, AlertTriangle, FileText, MapPin, GraduationCap, BarChart3, ChevronLeft, ChevronRight, Bell, User, Database } from 'lucide-react';

const navGroups = [
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
      className={`hidden lg:flex flex-col fixed top-0 left-0 h-full z-40 transition-all duration-300 ease-in-out glass-card border-r border-border ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-border ${collapsed ? 'justify-center' : ''}`}>
        <AppLogo size={32} />
        {!collapsed && (
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-primary truncate">SafeClick</span>
            <span className="text-xs text-muted-foreground truncate">Guardian AI</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto scrollbar-cyber">
        {navGroups.map((group) => (
          <div key={`group-${group.label}`} className="mb-6">
            {!collapsed && (
              <p className="px-4 mb-2 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
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
                  className={`flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg mb-1 transition-all duration-150 group relative ${
                    isActive
                      ? 'bg-primary/10 text-primary border border-primary/20 neon-glow-primary' : 'text-secondary-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <item.icon
                    size={18}
                    className={`flex-shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`}
                  />
                  {!collapsed && (
                    <>
                      <span className="text-sm font-medium truncate flex-1">{item.label}</span>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                            item.badge === 'SOS' ? 'bg-danger/20 text-danger border border-danger/30' : 'bg-primary/20 text-primary border border-primary/30'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {collapsed && item.badge && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-danger" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="border-t border-border py-3 px-2">
        {!collapsed && (
          <div className="flex items-center gap-2 px-3 py-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
              <User size={13} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">Rahul Sharma</p>
              <p className="text-[10px] text-muted-foreground truncate">Citizen • MP</p>
            </div>
            <Bell size={14} className="text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-150 text-xs"
        >
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
}
