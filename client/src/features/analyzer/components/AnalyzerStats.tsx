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
    color: 'text-primary',
    bg: 'bg-primary/10 border-primary/20',
  },
  {
    id: 'stat-threats',
    label: 'Threats Caught',
    value: '312',
    delta: '17% of today\'s scans',
    positive: false,
    icon: AlertTriangle,
    color: 'text-danger',
    bg: 'bg-danger/10 border-danger/20',
  },
  {
    id: 'stat-accuracy',
    label: 'AI Accuracy',
    value: '96.4%',
    delta: 'Based on 28K samples',
    positive: true,
    icon: TrendingUp,
    color: 'text-success',
    bg: 'bg-success/10 border-success/20',
  },
  {
    id: 'stat-users',
    label: 'Protected Citizens',
    value: '43,210',
    delta: 'Across Madhya Pradesh',
    positive: true,
    icon: Users,
    color: 'text-warning',
    bg: 'bg-warning/10 border-warning/20',
  },
];

export default function AnalyzerStats() {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {stats?.map((stat) => (
        <div
          key={stat?.id}
          className={`glass-card rounded-xl p-4 border ${stat?.bg} flex items-start gap-3`}
        >
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${stat?.bg} border`}>
            <stat.icon size={16} className={stat?.color} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide truncate">
              {stat?.label}
            </p>
            <p className={`text-xl font-bold font-mono-data ${stat?.color}`}>{stat?.value}</p>
            <p className={`text-[10px] mt-0.5 truncate ${stat?.positive ? 'text-success' : 'text-muted-foreground'}`}>
              {stat?.delta}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}