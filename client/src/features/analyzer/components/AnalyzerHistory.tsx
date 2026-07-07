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
    <div className="bg-white rounded-xl border border-gray-200 h-full flex flex-col shadow-sm text-gray-900">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-250">
        <div className="flex items-center gap-2">
          <Clock size={15} className="text-blue-600" />
          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide">Recent Scan Logs</h3>
        </div>
        <span className="text-[10px] font-bold text-gray-400">{items.length} records</span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-cyber divide-y divide-gray-100">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <Clock size={24} className="text-gray-300 mb-3" />
            <p className="text-xs font-bold text-gray-900 mb-1">No Scans Cached</p>
            <p className="text-[10px] text-gray-400 font-medium max-w-xs">Your future scanner runs will appear in this history list.</p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="px-4 py-3.5 hover:bg-gray-50 transition-colors group cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border ${
                  item.riskLevel === 'safe' 
                    ? 'bg-green-50 border-green-100 text-green-600'
                    : item.riskLevel === 'medium' 
                      ? 'bg-amber-50 border-amber-100 text-amber-600' 
                      : 'bg-red-50 border-red-100 text-red-600'
                }`}>
                  {item.riskLevel === 'safe' ? (
                    <CheckCircle size={13} />
                  ) : (
                    <AlertTriangle size={13} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[8px] font-bold text-gray-500 bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded font-mono uppercase">
                      {item.type}
                    </span>
                    <span className="text-[9px] text-gray-400 font-medium ml-auto">{item.time}</span>
                  </div>
                  <p className="text-xs text-gray-800 truncate leading-snug font-medium mb-1.5">{item.preview}</p>
                  <div className="flex items-center gap-2">
                    <StatusBadge
                      variant={
                        item.riskLevel === 'safe' ? 'safe' :
                        item.riskLevel === 'medium' ? 'medium' : 'high'
                      }
                      label={`${item.riskScore}/100`}
                    />
                    <span className="text-[9px] font-semibold text-gray-400 truncate">{item.scamType}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete Entry"
                  >
                    <Trash2 size={12} />
                  </button>
                  <ChevronRight size={12} className="text-gray-400" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary footer */}
      <div className="border-t border-gray-150 px-5 py-3 bg-gray-50/50">
        <div className="flex items-center justify-between text-[10px] text-gray-400 font-semibold">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
            {items.filter(i => i.riskLevel === 'high' || i.riskLevel === 'critical').length} threats
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
            {items.filter(i => i.riskLevel === 'safe').length} safe
          </span>
          <button className="text-blue-600 hover:underline font-bold">Clear All Logs</button>
        </div>
      </div>
    </div>
  );
}