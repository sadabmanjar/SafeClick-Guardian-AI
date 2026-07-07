'use client';

import React from 'react';
import { AlertCircle, ArrowUpRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const threatFeeds = [
  {
    title: 'Electricity Bill Cut-off Spoofing',
    category: 'SMS Phishing',
    incidents: '18 reports in last 24h',
    trend: 'critical',
  },
  {
    title: 'Part-Time Telegram Tasks Spoofing',
    category: 'Investment Scam',
    incidents: '32 reports in last 24h',
    trend: 'critical',
  },
  {
    title: 'Fake Speed Post Delivery Spams',
    category: 'Delivery Spoofing',
    incidents: '14 reports in last 24h',
    trend: 'moderate',
  },
];

export default function ThreatFeedsList() {
  return (
    <div className="glass-card rounded-xl border border-border p-5 flex flex-col justify-between h-full">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-primary animate-pulse" />
            <div>
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Threat Index</h3>
              <p className="text-sm text-foreground font-semibold mt-0.5">Active Community Threat Feed</p>
            </div>
          </div>
          <Link href="/heatmap" className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1">
            Open Heatmap <ArrowUpRight size={10} />
          </Link>
        </div>

        <div className="space-y-2.5">
          {threatFeeds.map((feed, idx) => (
            <div key={`feed-${idx}`} className="p-3 bg-zinc-950/40 border border-border/50 rounded-lg flex items-start gap-3">
              <div className="p-1 rounded bg-danger/10 border border-danger/20 text-danger mt-0.5 flex-shrink-0">
                <AlertCircle size={14} className={feed.trend === 'critical' ? 'animate-bounce' : ''} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold uppercase text-danger bg-danger/15 px-1 rounded font-mono border border-danger/20">
                    {feed.trend} threat
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono ml-auto">{feed.category}</span>
                </div>
                <h4 className="text-xs font-bold text-foreground mt-1.5 truncate">{feed.title}</h4>
                <p className="text-[10px] text-muted-foreground mt-0.5">{feed.incidents}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
