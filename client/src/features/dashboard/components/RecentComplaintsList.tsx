'use client';

import React, { useEffect } from 'react';
import { ArrowRight, Clock, CheckCircle, Eye, Loader2, FileText } from 'lucide-react';
import Link from 'next/link';
import { useComplaintHistory } from '@/hooks/useComplaint';

export default function RecentComplaintsList() {
  const { history, fetchHistory, isLoading } = useComplaintHistory();

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

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
          {isLoading ? (
            <div className="py-8 flex justify-center items-center text-muted-foreground">
              <Loader2 size={24} className="animate-spin text-primary" />
            </div>
          ) : history.length === 0 ? (
            <div className="py-8 flex flex-col justify-center items-center text-muted-foreground text-xs">
              <FileText size={24} className="mb-2 opacity-50" />
              <p>No recent complaints filed.</p>
            </div>
          ) : (
            history.slice(0, 3).map((comp, idx) => (
              <div key={comp._id || `comp-${idx}`} className="p-3 bg-zinc-950/40 border border-border/50 rounded-lg flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono-data font-bold text-foreground">
                      {comp._id.substring(0, 12)}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {new Date(comp.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-foreground mt-1 truncate">{comp.category}</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Financial Loss: <span className="text-danger font-semibold">₹{comp.lossAmount?.toLocaleString() || '0'}</span></p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider text-success bg-success/10 border-success/20`}>
                    Filed
                  </span>
                  <button className="p-1 rounded bg-zinc-900 border border-border/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="View details">
                    <Eye size={12} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
