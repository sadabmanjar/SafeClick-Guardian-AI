'use client';

import React from 'react';
import { Shield, FileText, Database, AlertCircle } from 'lucide-react';

interface Stat {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
  iconBg: string;
}

const mockStats: Stat[] = [
  {
    label: 'Total Scans',
    value: '42',
    change: '+12 this week',
    isPositive: true,
    icon: <Shield size={16} className="text-blue-600" />,
    iconBg: 'bg-blue-50 border-blue-100',
  },
  {
    label: 'Evidence Locker',
    value: '8 Items',
    change: '2.4 GB used',
    isPositive: true,
    icon: <Database size={16} className="text-indigo-600" />,
    iconBg: 'bg-indigo-50 border-indigo-100',
  },
  {
    label: 'Filed Complaints',
    value: '3 Reports',
    change: '1 Under Investigation',
    isPositive: true,
    icon: <FileText size={16} className="text-green-600" />,
    iconBg: 'bg-green-50 border-green-100',
  },
  {
    label: 'Emergency SOS Calls',
    value: '1 Trigger',
    change: '0 active threats',
    isPositive: false,
    icon: <AlertCircle size={16} className="text-red-600" />,
    iconBg: 'bg-red-50 border-red-100',
  },
];

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {mockStats.map((stat, idx) => (
        <div key={`stat-${idx}`} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className={`w-9 h-9 rounded-lg border ${stat.iconBg} flex items-center justify-center flex-shrink-0`}>
            {stat.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{stat.label}</p>
            <h4 className="text-lg font-bold text-gray-900 mt-0.5">{stat.value}</h4>
            <p className={`text-[10px] mt-0.5 truncate font-medium ${stat.isPositive ? 'text-green-600' : 'text-gray-500'}`}>
              {stat.change}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
