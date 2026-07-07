'use client';

import React from 'react';
import { ArrowRight, Eye } from 'lucide-react';
import Link from 'next/link';

const complaints = [
  {
    id: 'CMP-2026-904',
    type: 'UPI Impersonation Fraud',
    loss: '₹25,000',
    status: 'Investigation',
    statusColor: 'text-amber-600 bg-amber-50 border-amber-100',
    date: '30 Jun 2026',
  },
  {
    id: 'CMP-2026-871',
    type: 'Phishing NetBanking Spoofing',
    loss: '₹84,000',
    status: 'Filed / Sent',
    statusColor: 'text-green-600 bg-green-50 border-green-100',
    date: '24 Jun 2026',
  },
  {
    id: 'CMP-2026-802',
    type: 'Part-Time Job Task Scam',
    loss: '₹1,50,000',
    status: 'Resolved',
    statusColor: 'text-blue-600 bg-blue-50 border-blue-100',
    date: '18 Jun 2026',
  },
];

export default function RecentComplaintsList() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col justify-between h-full shadow-sm">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Legal Ledger</h3>
            <p className="text-sm text-gray-900 font-semibold mt-0.5">Filed Police Complaints</p>
          </div>
          <Link href="/complaint" className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1">
            View All Ledger <ArrowRight size={10} />
          </Link>
        </div>

        <div className="space-y-3">
          {complaints.map((comp, idx) => (
            <div key={`comp-${idx}`} className="p-3 bg-gray-50/50 border border-gray-150 rounded-lg flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-800">{comp.id}</span>
                  <span className="text-[10px] text-gray-400 font-medium">{comp.date}</span>
                </div>
                <h4 className="text-xs font-semibold text-gray-900 mt-1 truncate">{comp.type}</h4>
                <p className="text-[10px] text-gray-500 mt-0.5">Financial Loss: <span className="text-red-600 font-semibold">{comp.loss}</span></p>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${comp.statusColor}`}>
                  {comp.status}
                </span>
                <button className="p-1 rounded bg-white border border-gray-200 hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-colors" title="View details">
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
