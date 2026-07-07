'use client';

import React from 'react';
import { ArrowRight, Clock, CheckCircle, Eye } from 'lucide-react';
import Link from 'next/link';

const complaints = [
  {
    id: 'CMP-2026-904',
    type: 'UPI Impersonation Fraud',
    loss: '₹25,000',
    status: 'Investigation',
    statusColor: 'text-warning bg-warning/10 border-warning/20',
    date: '30 Jun 2026',
  },
  {
    id: 'CMP-2026-871',
    type: 'Phishing NetBanking Spoofing',
    loss: '₹84,000',
    status: 'Filed / Sent',
    statusColor: 'text-success bg-success/10 border-success/20',
    date: '24 Jun 2026',
  },
  {
    id: 'CMP-2026-802',
    type: 'Part-Time Job Task Scam',
    loss: '₹1,50,000',
    status: 'Resolved',
    statusColor: 'text-primary bg-primary/10 border-primary/20',
    date: '18 Jun 2026',
  },
];

export default function RecentComplaintsList() {
  return (
    <div className="glass-card rounded-xl border border-border p-5 flex flex-col justify-between h-full">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Legal Ledger</h3>
            <p className="text-sm text-foreground font-semibold mt-0.5">Filed Police Complaints</p>
          </div>
          <Link href="/complaint-generator" className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1">
            View All Ledger <ArrowRight size={10} />
          </Link>
        </div>

        <div className="space-y-3">
          {complaints.map((comp, idx) => (
            <div key={`comp-${idx}`} className="p-3 bg-zinc-950/40 border border-border/50 rounded-lg flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono-data font-bold text-foreground">{comp.id}</span>
                  <span className="text-[10px] text-muted-foreground font-mono">{comp.date}</span>
                </div>
                <h4 className="text-xs font-semibold text-foreground mt-1 truncate">{comp.type}</h4>
                <p className="text-[10px] text-muted-foreground mt-0.5">Financial Loss: <span className="text-danger font-semibold">{comp.loss}</span></p>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${comp.statusColor}`}>
                  {comp.status}
                </span>
                <button className="p-1 rounded bg-zinc-900 border border-border/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="View details">
                  <Eye size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
