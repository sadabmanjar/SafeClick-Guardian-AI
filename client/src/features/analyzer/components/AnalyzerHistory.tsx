'use client';
import React, { useState } from 'react';
import { Clock, AlertTriangle, CheckCircle, ChevronRight, Trash2 } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';

const historyItems = [
  {
    id: 'hist-001',
    type: 'SMS',
    preview: 'Congratulations! Your SBI account has been selected for ₹50,000...',
    scamType: 'UPI Phishing',
    riskScore: 87,
    riskLevel: 'high' as const,
    time: '2 min ago',
    date: '30/06/2026',
  },
  {
    id: 'hist-002',
    type: 'URL',
    preview: 'https://hdfc-loan-offer-apply.net/quick-loan',
    scamType: 'Fake Loan',
    riskScore: 74,
    riskLevel: 'high' as const,
    time: '18 min ago',
    date: '30/06/2026',
  },
  {
    id: 'hist-003',
    type: 'Screenshot',
    preview: 'WhatsApp screenshot — job offer message',
    scamType: 'Fake Job Offer',
    riskScore: 54,
    riskLevel: 'medium' as const,
    time: '1 hr ago',
    date: '30/06/2026',
  },
  {
    id: 'hist-004',
    type: 'Email',
    preview: 'Dear Customer, your KYC is pending. Update now to avoid...',
    scamType: 'KYC Fraud',
    riskScore: 91,
    riskLevel: 'critical' as const,
    time: '3 hrs ago',
    date: '30/06/2026',
  },
  {
    id: 'hist-005',
    type: 'URL',
    preview: 'https://www.amazon.in/deals/prime-sale-2026',
    scamType: 'No Threat',
    riskScore: 6,
    riskLevel: 'safe' as const,
    time: 'Yesterday',
    date: '29/06/2026',
  },
  {
    id: 'hist-006',
    type: 'SMS',
    preview: 'Your IRCTC ticket PNR 4521839 confirmed for 02-Jul...',
    scamType: 'No Threat',
    riskScore: 4,
    riskLevel: 'safe' as const,
    time: 'Yesterday',
    date: '29/06/2026',
  },
];

export default function AnalyzerHistory() {
  const [items, setItems] = useState(historyItems);

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="glass-card rounded-xl border border-border h-full flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Recent Scans</h3>
        </div>
        <span className="text-xs text-muted-foreground">{items.length} scans</span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-cyber">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <Clock size={28} className="text-muted-foreground mb-3" />
            <p className="text-sm font-medium text-foreground mb-1">No scan history yet</p>
            <p className="text-xs text-muted-foreground">Your recent analyses will appear here after your first scan</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {items.map((item) => (
              <div
                key={item.id}
                className="px-4 py-3.5 hover:bg-muted/30 transition-colors group cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    item.riskLevel === 'safe' ? 'bg-success/10 border border-success/20'
                      : item.riskLevel === 'medium' ? 'bg-warning/10 border border-warning/20' : 'bg-danger/10 border border-danger/20'
                  }`}>
                    {item.riskLevel === 'safe' ? (
                      <CheckCircle size={14} className="text-success" />
                    ) : (
                      <AlertTriangle size={14} className={item.riskLevel === 'medium' ? 'text-warning' : 'text-danger'} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded uppercase">
                        {item.type}
                      </span>
                      <span className="text-[10px] font-mono-data text-muted-foreground ml-auto">{item.time}</span>
                    </div>
                    <p className="text-xs text-foreground truncate leading-snug mb-1.5">{item.preview}</p>
                    <div className="flex items-center gap-2">
                      <StatusBadge
                        variant={
                          item.riskLevel === 'safe' ? 'safe' :
                          item.riskLevel === 'medium' ? 'medium' :
                          item.riskLevel === 'critical' ? 'high' : 'high'
                        }
                        label={`${item.riskScore}/100`}
                      />
                      <span className="text-[10px] text-muted-foreground truncate">{item.scamType}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1 rounded hover:bg-danger/20 transition-colors"
                      title="Remove from history"
                    >
                      <Trash2 size={12} className="text-muted-foreground hover:text-danger transition-colors" />
                    </button>
                    <ChevronRight size={12} className="text-muted-foreground" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary footer */}
      <div className="border-t border-border px-5 py-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-danger" />
            {items.filter(i => i.riskLevel === 'high' || i.riskLevel === 'critical').length} threats found
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-success" />
            {items.filter(i => i.riskLevel === 'safe').length} safe
          </span>
          <button className="text-primary hover:underline text-[11px]">View all</button>
        </div>
      </div>
    </div>
  );
}