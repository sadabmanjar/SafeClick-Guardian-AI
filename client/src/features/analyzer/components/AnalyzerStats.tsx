import React from 'react';
import { Shield, AlertTriangle, TrendingUp, Users } from 'lucide-react';

const stats = [
  {
    id: 'stat-scans',
    label: 'Scans Today',
    value: '1,847',
    delta: '+12% vs yesterday',
    positive: true,
    icon: Shield,
    color: 'text-blue-600',
    bg: 'bg-blue-50 border-blue-100',
  },
  {
    id: 'stat-threats',
    label: 'Threats Caught',
    value: '312',
    delta: '17% of today\'s scans',
    positive: false,
    icon: AlertTriangle,
    color: 'text-red-600',
    bg: 'bg-red-50 border-red-100',
  },
  {
    id: 'stat-accuracy',
    label: 'AI Accuracy',
    value: '96.4%',
    delta: 'Based on 28K samples',
    positive: true,
    icon: TrendingUp,
    color: 'text-green-600',
    bg: 'bg-green-50 border-green-100',
  },
  {
    id: 'stat-users',
    label: 'Protected Citizens',
    value: '43,210',
    delta: 'Across Madhya Pradesh',
    positive: true,
    icon: Users,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50 border-indigo-100',
  },
];

export default function AnalyzerStats() {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {stats?.map((stat) => (
        <div
          key={stat?.id}
          className="bg-white rounded-xl p-4 border border-gray-200 flex items-start gap-3 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${stat?.bg} border`}>
            <stat.icon size={16} className={stat?.color} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide truncate">
              {stat?.label}
            </p>
            <p className="text-xl font-bold font-mono text-gray-900 mt-0.5">{stat?.value}</p>
            <p className={`text-[10px] mt-0.5 truncate font-medium ${stat?.positive ? 'text-green-600' : 'text-gray-400'}`}>
              {stat?.delta}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}