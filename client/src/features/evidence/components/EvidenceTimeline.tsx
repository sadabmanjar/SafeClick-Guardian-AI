'use client';

import React from 'react';
import { Calendar, ShieldAlert } from 'lucide-react';
import { EvidenceItem } from './EvidenceCard';

interface EvidenceTimelineProps {
  items: EvidenceItem[];
}

export default function EvidenceTimeline({ items }: EvidenceTimelineProps) {
  if (items.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-6 shadow-xs">
      <div>
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Secured Logbook</h3>
        <p className="text-sm text-gray-900 font-bold mt-0.5">Custody Timeline</p>
      </div>

      <div className="relative border-l border-gray-200 pl-5 ml-2.5 space-y-6 text-left">
        {items.map((item, idx) => (
          <div key={`timeline-${item.id}`} className="relative">
            {/* Timeline Dot Indicator */}
            <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full border-2 border-blue-600 bg-white flex items-center justify-center flex-shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-400 font-mono uppercase tracking-wider flex items-center gap-1">
                  <Calendar size={10} /> {item.date}
                </span>
                <span className="text-[9px] font-mono font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.25 rounded">
                  SECURED
                </span>
              </div>
              <h4 className="text-xs font-bold text-gray-900 leading-normal mt-1">{item.name}</h4>
              <p className="text-[10px] text-gray-500 leading-normal max-w-md font-medium">
                Crypto package compiled and integrity verified. Unique footprint: <code className="text-blue-600 font-mono text-[9px]">{item.hash.substring(0, 16)}</code>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
