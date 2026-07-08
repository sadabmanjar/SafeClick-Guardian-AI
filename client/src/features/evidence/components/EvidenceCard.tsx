'use client';

import React from 'react';
import { FileText, Image as ImageIcon, Video, Music, Shield, Eye, Trash2 } from 'lucide-react';

export type EvidenceItem = {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'pdf';
  size: string;
  hash: string;
  date: string;
  ocrText?: string;
};

interface EvidenceCardProps {
  item: EvidenceItem;
  onPreview: (item: EvidenceItem) => void;
  onDelete: (id: string) => void;
}

export default function EvidenceCard({ item, onPreview, onDelete }: EvidenceCardProps) {
  let TypeIcon = FileText;
  let iconColor = 'text-primary';

  switch (item.type) {
    case 'image':
      TypeIcon = ImageIcon;
      iconColor = 'text-blue-600';
      break;
    case 'video':
      TypeIcon = Video;
      iconColor = 'text-amber-500';
      break;
    case 'audio':
      TypeIcon = Music;
      iconColor = 'text-emerald-500';
      break;
    case 'pdf':
      TypeIcon = FileText;
      iconColor = 'text-rose-500';
      break;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col justify-between hover:border-blue-500/35 hover:shadow-md transition-all duration-200 group relative">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-150 flex items-center justify-center flex-shrink-0 mt-0.5">
          <TypeIcon size={16} className={iconColor} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors" title={item.name}>
            {item.name}
          </h4>
          <p className="text-[10px] text-gray-400 mt-0.5 font-semibold font-mono">{item.size} • {item.date}</p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-1 text-[9px] font-semibold font-mono text-gray-500 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded" title={`SHA-256 Integrity Hash: ${item.hash}`}>
          <Shield size={10} className="text-emerald-600" />
          <span className="truncate max-w-[120px]">{item.hash.substring(0, 16)}...</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPreview(item)}
            className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors"
            title="Preview Evidence"
          >
            <Eye size={13} />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-1 rounded hover:bg-rose-50 text-gray-400 hover:text-rose-600 transition-colors"
            title="Delete Evidence"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
