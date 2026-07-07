'use client';

import React from 'react';
import { Shield, FileText, Database, AlertCircle } from 'lucide-react';

interface Stat {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
}

const mockStats: Stat[] = [
  {
    label: 'Total Scans',
    value: '42',
    change: '+12 this week',
    isPositive: true,
    icon: <Shield size={18} className="text-primary" />,
  },
  {
    label: 'Evidence Locker',
    value: '8 Items',
    change: '2.4 GB used',
    isPositive: true,
    icon: <Database size={18} className="text-cyan-400" />,
  },
  {
    label: 'Filed Complaints',
    value: '3 Reports',
    change: '1 Under Investigation',
    isPositive: true,
    icon: <FileText size={18} className="text-primary" />,
  },
  {
    label: 'Emergency SOS Calls',
    value: '1 Trigger',
    change: '0 active threats',
    isPositive: false,
    icon: <AlertCircle size={18} className="text-danger" />,
  },
];

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {mockStats.map((stat, idx) => (
        <div key={`stat-${idx}`} className="glass-card rounded-xl border border-border p-4 flex items-center gap-4 hover:border-primary/30 transition-all duration-200">
          <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-border/50 flex items-center justify-center flex-shrink-0">
            {stat.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            <h4 className="text-lg font-bold text-foreground mt-0.5">{stat.value}</h4>
            <p className={`text-[10px] mt-0.5 truncate ${stat.isPositive ? 'text-success' : 'text-danger'}`}>
              {stat.change}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
