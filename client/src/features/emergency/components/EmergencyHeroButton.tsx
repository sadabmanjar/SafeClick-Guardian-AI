'use client';
import React, { useState } from 'react';
import { Phone, Shield, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export default function EmergencyHeroButton() {
  const [calling, setCalling] = useState(false);

  const handleCall = () => {
    setCalling(true);
    toast?.success('Dialing 1930 — National Cybercrime Helpline', {
      description: 'Available 24/7 · Free call · All operators',
      duration: 5000,
    });
    setTimeout(() => setCalling(false), 3000);
    // Trigger tel: link programmatically
    if (typeof window !== 'undefined') {
      window.location.href = 'tel:1930';
    }
  };

  return (
    <div className="glass-card rounded-2xl border border-danger/30 p-6 flex flex-col items-center text-center h-full min-h-[320px] justify-between neon-glow-danger">
      {/* Top label */}
      <div className="space-y-1">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Shield size={16} className="text-danger" />
          <span className="text-xs font-bold text-danger uppercase tracking-widest">National Cybercrime Helpline</span>
        </div>
        <p className="text-4xl font-bold font-mono-data text-danger">1930</p>
        <p className="text-xs text-muted-foreground">Available 24×7 · Free · All Networks</p>
      </div>

      {/* Emergency call button */}
      <button
        onClick={handleCall}
        disabled={calling}
        className={`relative w-36 h-36 rounded-full flex flex-col items-center justify-center transition-all duration-200 active:scale-95 ${
          calling
            ? 'bg-danger/40 border-2 border-danger/60' :'bg-danger border-4 border-danger/30 pulse-ring hover:bg-danger/90'
        }`}
        aria-label="Call 1930 National Cybercrime Helpline"
      >
        {/* Outer pulse rings */}
        {!calling && (
          <>
            <span className="absolute inset-0 rounded-full border-2 border-danger/40 animate-ping" />
            <span className="absolute inset-[-8px] rounded-full border border-danger/20 animate-ping" style={{ animationDelay: '0.3s' }} />
          </>
        )}
        <Phone size={36} className="text-white mb-1" />
        <span className="text-white text-xs font-bold">
          {calling ? 'CALLING...' : 'CALL NOW'}
        </span>
      </button>

      {/* Secondary actions */}
      <div className="space-y-2 w-full">
        <a
          href="https://cybercrime.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted hover:border-primary/30 transition-all duration-150"
        >
          <ExternalLink size={14} className="text-primary" />
          NCRP Portal — cybercrime.gov.in
        </a>
        <a
          href="/complaint-generator"
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-sm font-medium text-primary hover:bg-primary/20 transition-all duration-150"
        >
          <Shield size={14} />
          Generate Complaint Now
        </a>
      </div>
    </div>
  );
}