'use client';

import React, { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Shield, AlertTriangle, FileText, MapPin, GraduationCap, BarChart3, Database } from 'lucide-react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';

interface MobileTopbarProps {
  activeRoute: string;
}

const mobileNavGroups = [
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
    <header className="lg:hidden sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/85 px-4 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon-sm" className="h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            }
          />
          <SheetContent side="left" className="w-64 p-0 bg-background border-r border-border">
            <div className="flex flex-col h-full">
              {/* Mobile Logo */}
              <div className="flex items-center gap-3 px-4 py-5 border-b border-border">
                <AppLogo size={32} />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-primary truncate">SafeClick</span>
                  <span className="text-xs text-muted-foreground truncate">Guardian AI</span>
                </div>
              </div>

              {/* Navigation Links inside Sheet */}
              <nav className="flex-1 py-4 overflow-y-auto">
                {mobileNavGroups.map((group) => (
                  <div key={`mobile-group-${group.label}`} className="mb-6">
                    <p className="px-4 mb-2 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                      {group.label}
                    </p>
                    {group.items.map((item) => {
                      const isActive = activeRoute === item.href;
                      return (
                        <Link
                          key={`mobile-nav-${item.href}`}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg mb-1 transition-all duration-150 ${
                            isActive
                              ? 'bg-primary/10 text-primary border border-primary/20 neon-glow-primary'
                              : 'text-secondary-foreground hover:bg-muted hover:text-foreground'
                          }`}
                        >
                          <item.icon
                            size={18}
                            className={isActive ? 'text-primary' : 'text-muted-foreground'}
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
          <AppLogo size={28} />
          <span className="text-sm font-bold text-foreground">
            SafeClick
          </span>
        </div>
      </div>
    </header>
  );
}
