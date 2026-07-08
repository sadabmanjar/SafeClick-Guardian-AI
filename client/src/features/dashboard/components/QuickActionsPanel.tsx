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
    color: 'text-blue-600 border-blue-100 bg-blue-50/30 hover:bg-blue-50',
    linkColor: 'text-blue-600',
  },
  {
    title: 'Emergency SOS Mode',
    description: 'Notify trusted circles and trigger panic protocols instantly.',
    href: '/emergency',
    icon: AlertTriangle,
    color: 'text-red-600 border-red-100 bg-red-50/30 hover:bg-red-50',
    linkColor: 'text-red-600',
  },
  {
    title: 'Generate Complaint',
    description: 'Auto-package incident evidence for legal cyber cell dispatch.',
    href: '/complaint',
    icon: FileText,
    color: 'text-green-600 border-green-100 bg-green-50/30 hover:bg-green-50',
    linkColor: 'text-green-600',
  },
  {
    title: 'Danger Heatmap',
    description: 'Investigate localized scam hotspots in real-time.',
    href: '/heatmap',
    icon: MapPin,
    color: 'text-indigo-600 border-indigo-100 bg-indigo-50/30 hover:bg-indigo-50',
    linkColor: 'text-indigo-600',
  },
];

export default function QuickActionsPanel() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4 shadow-sm">
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Operational Console</h3>
        <p className="text-sm text-gray-900 font-semibold mt-0.5">Quick Incident Actions</p>
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
                <span className="text-xs font-bold text-gray-900">{act.title}</span>
              </div>
              <p className="text-[10px] text-gray-500 leading-snug">{act.description}</p>
            </div>
            <span className={`inline-flex items-center gap-1 text-[9px] font-bold ${act.linkColor} hover:underline mt-4`}>
              Access Console <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
