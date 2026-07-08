'use client';

import React, { useEffect } from 'react';
import StatusBadge from '@/components/ui/StatusBadge';
import { Shield, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useScanHistory } from '@/hooks/useScan';

export default function RecentScansList() {
  const { history, fetchHistory, isLoading } = useScanHistory();

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col justify-between h-full shadow-sm">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Audit Feed</h3>
            <p className="text-sm text-gray-900 font-semibold mt-0.5">Recent Threat Scans</p>
          </div>
          <Link href="/analyze" className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1">
            View All <ArrowRight size={10} />
          </Link>
        </div>

        <div className="divide-y divide-gray-100">
          {isLoading ? (
            <div className="py-8 flex justify-center items-center text-muted-foreground">
              <Loader2 size={24} className="animate-spin text-primary" />
            </div>
          ) : history.length === 0 ? (
            <div className="py-8 flex flex-col justify-center items-center text-muted-foreground text-xs">
              <Shield size={24} className="mb-2 opacity-50" />
              <p>No recent scans found.</p>
            </div>
          ) : (
            history.slice(0, 4).map((scan, idx) => (
              <div key={scan._id || `scan-${idx}`} className="py-3 flex items-start justify-between gap-3 first:pt-0 last:pb-0">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-bold text-muted-foreground bg-zinc-900 border border-border/50 px-1.5 py-0.5 rounded font-mono uppercase">
                      {scan.inputType}
                    </span>
                    <span className="text-[9px] text-muted-foreground font-mono ml-auto">
                      {new Date(scan.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-foreground truncate leading-normal">{scan.input}</p>
                </div>
                <StatusBadge 
                  variant={scan.riskLevel === 'safe' || scan.riskLevel === 'low' ? 'safe' : scan.riskLevel === 'medium' ? 'medium' : 'high'} 
                  label={`${scan.confidence}% ${scan.riskLevel}`} 
                  dot 
                  className="flex-shrink-0" 
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
