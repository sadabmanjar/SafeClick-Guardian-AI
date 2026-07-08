'use client';

import React from 'react';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

interface CyberScoreCardProps {
  score: number;
}

export default function CyberScoreCard({ score }: CyberScoreCardProps) {
  let statusText = '';
  let statusColor = '';
  let statusBg = '';
  let statusBorder = '';
  let statusIcon = null;

  if (score >= 80) {
    statusText = 'Secure Environment';
    statusColor = 'text-green-600';
    statusBg = 'bg-green-50';
    statusBorder = 'border-green-100';
    statusIcon = <ShieldCheck className="text-green-600 h-4.5 w-4.5" />;
  } else if (score >= 50) {
    statusText = 'Moderate Vulnerability';
    statusColor = 'text-amber-600';
    statusBg = 'bg-amber-50';
    statusBorder = 'border-amber-100';
    statusIcon = <ShieldAlert className="text-amber-600 h-4.5 w-4.5" />;
  } else {
    statusText = 'Critical Risk Level';
    statusColor = 'text-red-600';
    statusBg = 'bg-red-50';
    statusBorder = 'border-red-100';
    statusIcon = <ShieldAlert className="text-red-600 h-4.5 w-4.5" />;
  }

  // Calculate rotation for gauge (from -90deg to +90deg based on score 0-100)
  const rotation = -90 + (score / 100) * 180;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col items-center justify-between text-center relative shadow-sm h-full">
      <div className="w-full text-left mb-4">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Cyber Security Score</h3>
        <p className="text-sm text-gray-900 font-semibold mt-0.5">Real-time Guard Status</p>
      </div>

      {/* Radial Gauge Meter */}
      <div className="relative w-44 h-24 flex items-end justify-center mb-6 overflow-hidden">
        {/* Gauge Background track */}
        <div className="absolute w-44 h-44 rounded-full border-[10px] border-gray-100 top-0 left-0" />
        
        {/* Gauge fill track (simulated active arc segment) */}
        <div 
          className="absolute w-44 h-44 rounded-full border-[10px] border-transparent border-t-blue-600 border-r-blue-600/70 top-0 left-0 transition-transform duration-1000 ease-out" 
          style={{ transform: `rotate(${rotation - 45}deg)` }}
        />

        {/* Center Text */}
        <div className="relative z-10 flex flex-col items-center mb-1">
          <span className="text-4xl font-extrabold tracking-tight text-gray-900">{score}</span>
          <span className="text-[9px] font-bold text-gray-400 uppercase">OF 100</span>
        </div>
      </div>

      {/* Guard Status Badge */}
      <div className={`w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border ${statusBg} ${statusBorder} ${statusColor}`}>
        {statusIcon}
        <span className="text-xs font-bold tracking-wide uppercase">{statusText}</span>
      </div>
    </div>
  );
}
