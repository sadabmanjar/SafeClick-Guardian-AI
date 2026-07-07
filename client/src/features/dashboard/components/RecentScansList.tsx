'use client';

import React from 'react';
import StatusBadge from '@/components/ui/StatusBadge';
import { Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const scans = [
  {
    source: 'SMS Alert',
    detail: 'Urgent: SBI account verify OTP code...',
    risk: 'high' as const,
    label: '91% Scam',
    date: 'Today, 2:14 PM',
  },
  {
    source: 'URL Link',
    detail: 'https://hdfc-netbanking-verify.info',
    risk: 'high' as const,
    label: '97% Phishing',
    date: 'Today, 11:05 AM',
  },
  {
    source: 'Screenshot',
    detail: 'WhatsApp: part-time job offer earn...',
    risk: 'medium' as const,
    label: '54% Suspect',
    date: 'Yesterday',
  },
  {
    source: 'URL Link',
    detail: 'https://www.irctc.co.in/nget/train-search',
    risk: 'safe' as const,
    label: 'Safe Site',
    date: '2 days ago',
  },
];

export default function RecentScansList() {
  return (
    <div className="glass-card rounded-xl border border-border p-5 flex flex-col justify-between h-full">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Audit Feed</h3>
            <p className="text-sm text-foreground font-semibold mt-0.5">Recent Threat Scans</p>
          </div>
          <Link href="/analyze" className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1">
            View All <ArrowRight size={10} />
          </Link>
        </div>

        <div className="divide-y divide-border/50">
          {scans.map((scan, idx) => (
            <div key={`scan-${idx}`} className="py-3 flex items-start justify-between gap-3 first:pt-0 last:pb-0">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-bold text-muted-foreground bg-zinc-900 border border-border/50 px-1.5 py-0.5 rounded font-mono uppercase">
                    {scan.source}
                  </span>
                  <span className="text-[9px] text-muted-foreground font-mono ml-auto">{scan.date}</span>
                </div>
                <p className="text-xs text-foreground truncate leading-normal">{scan.detail}</p>
              </div>
              <StatusBadge variant={scan.risk} label={scan.label} dot className="flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
