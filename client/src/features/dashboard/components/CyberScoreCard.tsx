'use client';

import React from 'react';
import { ShieldCheck, ShieldAlert, Sparkles } from 'lucide-react';

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
    statusColor = 'text-success';
    statusBg = 'bg-success/10';
    statusBorder = 'border-success/20';
    statusIcon = <ShieldCheck className="text-success h-5 w-5" />;
  } else if (score >= 50) {
    statusText = 'Moderate Vulnerability';
    statusColor = 'text-warning';
    statusBg = 'bg-warning/10';
    statusBorder = 'border-warning/20';
    statusIcon = <ShieldAlert className="text-warning h-5 w-5" />;
  } else {
    statusText = 'Critical Risk Level';
    statusColor = 'text-danger';
    statusBg = 'bg-danger/10';
    statusBorder = 'border-danger/20';
    statusIcon = <ShieldAlert className="text-danger h-5 w-5" />;
  }

  // Calculate rotation for gauge (from -90deg to +90deg based on score 0-100)
  const rotation = -90 + (score / 100) * 180;

  return (
    <div className="glass-card rounded-xl border border-border p-6 flex flex-col items-center justify-between text-center relative overflow-hidden h-full">
      <div className="absolute top-0 right-0 p-3 text-primary/30">
        <Sparkles size={18} />
      </div>

      <div className="w-full text-left mb-4">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Cyber Security Score</h3>
        <p className="text-sm text-foreground font-semibold mt-0.5">Real-time Guard Status</p>
      </div>

      {/* Radial Gauge Meter */}
      <div className="relative w-44 h-24 flex items-end justify-center mb-4 overflow-hidden">
        {/* Gauge Background track */}
        <div className="absolute w-44 h-44 rounded-full border-[10px] border-muted/20 top-0 left-0" />
        
        {/* Gauge fill track (simulated active arc segment) */}
        <div 
          className="absolute w-44 h-44 rounded-full border-[10px] border-transparent border-t-primary border-r-primary/70 top-0 left-0 transition-transform duration-1000 ease-out" 
          style={{ transform: `rotate(${rotation - 45}deg)` }}
        />

        {/* Center Text */}
        <div className="relative z-10 flex flex-col items-center mb-1">
          <span className="text-4xl font-extrabold font-mono-data tracking-tight text-white">{score}</span>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase">OF 100</span>
        </div>
      </div>

      {/* Guard Status Badge */}
      <div className={`w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border ${statusBg} ${statusBorder} ${statusColor}`}>
        {statusIcon}
        <span className="text-xs font-bold font-mono tracking-wide uppercase">{statusText}</span>
      </div>
    </div>
  );
}
