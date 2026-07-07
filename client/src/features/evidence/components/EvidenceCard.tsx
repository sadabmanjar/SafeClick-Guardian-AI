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
      iconColor = 'text-cyan-400';
      break;
    case 'video':
      TypeIcon = Video;
      iconColor = 'text-warning';
      break;
    case 'audio':
      TypeIcon = Music;
      iconColor = 'text-success';
      break;
    case 'pdf':
      TypeIcon = FileText;
      iconColor = 'text-danger';
      break;
  }

  return (
    <div className="glass-card rounded-xl border border-border p-4 flex flex-col justify-between hover:border-primary/30 transition-all duration-200 group relative">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-border/50 flex items-center justify-center flex-shrink-0 mt-0.5">
          <TypeIcon size={16} className={iconColor} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors" title={item.name}>
            {item.name}
          </h4>
          <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">{item.size} • {item.date}</p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-1 text-[9px] font-mono text-muted-foreground bg-zinc-900 border border-border/30 px-2 py-0.5 rounded" title={`SHA-256 Integrity Hash: ${item.hash}`}>
          <Shield size={10} className="text-success" />
          <span className="truncate max-w-[120px]">{item.hash.substring(0, 16)}...</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPreview(item)}
            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Preview Evidence"
          >
            <Eye size={13} />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-1 rounded hover:bg-danger/20 text-muted-foreground hover:text-danger transition-colors"
            title="Delete Evidence"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
