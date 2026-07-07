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
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col justify-between h-full shadow-sm">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-blue-600" />
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Threat Index</h3>
              <p className="text-sm text-gray-900 font-semibold mt-0.5">Active Community Threat Feed</p>
            </div>
          </div>
          <Link href="/heatmap" className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1">
            Open Heatmap <ArrowUpRight size={10} />
          </Link>
        </div>

        <div className="space-y-2.5">
          {threatFeeds.map((feed, idx) => (
            <div key={`feed-${idx}`} className="p-3 bg-gray-50/50 border border-gray-150 rounded-lg flex items-start gap-3">
              <div className={`p-1.5 rounded-lg flex-shrink-0 mt-0.5 ${
                feed.trend === 'critical' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
              }`}>
                <AlertCircle size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded font-mono border ${
                    feed.trend === 'critical' ? 'text-red-600 bg-red-50 border-red-100' : 'text-amber-600 bg-amber-50 border-amber-100'
                  }`}>
                    {feed.trend}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono ml-auto">{feed.category}</span>
                </div>
                <h4 className="text-xs font-semibold text-gray-900 mt-1.5 truncate">{feed.title}</h4>
                <p className="text-[10px] text-gray-500 mt-0.5">{feed.incidents}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
