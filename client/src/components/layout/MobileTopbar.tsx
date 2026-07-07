'use client';

import React, { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Shield, AlertTriangle, FileText, MapPin, GraduationCap, BarChart3, Database, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';

interface MobileTopbarProps {
  activeRoute: string;
}

const mobileNavGroups = [
  {
    label: 'OVERVIEW',
    items: [
      { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    ]
  },
  {
    label: 'PROTECTION',
    items: [
      { href: '/analyze', icon: Shield, label: 'AI Scam Analyzer' },
      { href: '/emergency', icon: AlertTriangle, label: 'Emergency Mode' },
      { href: '/complaint', icon: FileText, label: 'Complaint Generator' },
      { href: '/evidence', icon: Database, label: 'Evidence Locker' },
    ],
  },
  {
    label: 'COMMUNITY',
    items: [
      { href: '/heatmap', icon: MapPin, label: 'Scam Heatmap' },
      { href: '/learning', icon: GraduationCap, label: 'Cyber Learning' },
    ],
  },
  {
    label: 'ADMIN',
    items: [
      { href: '/police-dashboard', icon: BarChart3, label: 'Police Dashboard' },
    ],
  },
];

export default function MobileTopbar({ activeRoute }: MobileTopbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="lg:hidden sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white/90 px-4 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon-sm" className="h-9 w-9 text-gray-500 hover:bg-gray-100">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            }
          />
          <SheetContent side="left" className="w-64 p-0 bg-white border-r border-gray-200">
            <div className="flex flex-col h-full">
              {/* Mobile Logo */}
              <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-200">
                <AppLogo size={28} />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-gray-900 truncate">SafeClick</span>
                  <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">Guardian AI</span>
                </div>
              </div>

              {/* Navigation Links inside Sheet */}
              <nav className="flex-1 py-4 overflow-y-auto px-3 space-y-4">
                {mobileNavGroups.map((group) => (
                  <div key={`mobile-group-${group.label}`} className="space-y-1">
                    <p className="px-3 mb-2 text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                      {group.label}
                    </p>
                    {group.items.map((item) => {
                      const isActive = activeRoute === item.href;
                      return (
                        <Link
                          key={`mobile-nav-${item.href}`}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                            isActive
                              ? 'bg-blue-50 text-blue-600 font-semibold border-l-2 border-blue-600'
                              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <item.icon
                            size={16}
                            className={isActive ? 'text-blue-600' : 'text-gray-400'}
                          />
                          <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="flex items-center gap-2">
          <AppLogo size={24} />
          <span className="text-sm font-bold text-gray-900">
            SafeClick
          </span>
        </div>
      </div>
    </header>
  );
}
