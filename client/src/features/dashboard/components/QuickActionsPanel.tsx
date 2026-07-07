'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, AlertTriangle, FileText, MapPin, ArrowRight } from 'lucide-react';

const actions = [
  {
    title: 'Scan Message / Link',
    description: 'Assess chat screenshot, link, or text for phishing indicators.',
    href: '/analyze',
    icon: ShieldAlert,
    color: 'text-primary border-primary/20 hover:bg-primary/5',
  },
  {
    title: 'Emergency SOS Mode',
    description: 'Notify trusted circles and trigger panic protocols instantly.',
    href: '/emergency-mode',
    icon: AlertTriangle,
    color: 'text-danger border-danger/20 hover:bg-danger/5',
  },
  {
    title: 'Generate Complaint',
    description: 'Auto-package incident evidence for legal cyber cell dispatch.',
    href: '/complaint-generator',
    icon: FileText,
    color: 'text-primary border-primary/20 hover:bg-primary/5',
  },
  {
    title: 'Danger Heatmap',
    description: 'Investigate localized scam hotspots in real-time.',
    href: '/heatmap',
    icon: MapPin,
    color: 'text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/5',
  },
];

export default function QuickActionsPanel() {
  return (
    <div className="glass-card rounded-xl border border-border p-5 space-y-4">
      <div>
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Operational Console</h3>
        <p className="text-sm text-foreground font-semibold mt-0.5">Quick Incident Actions</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((act, idx) => (
          <Link
            key={`action-${idx}`}
            href={act.href}
            className={`p-3.5 border rounded-lg flex flex-col justify-between text-left transition-all duration-150 group ${act.color}`}
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <act.icon size={16} className="flex-shrink-0" />
                <span className="text-xs font-bold text-foreground">{act.title}</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-snug">{act.description}</p>
            </div>
            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-primary hover:underline mt-4">
              Access Console <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
