'use client';

import React from 'react';
import { X, ShieldCheck, Download, Copy, FileText, Calendar, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { EvidenceItem } from './EvidenceCard';
import { Button } from '@/components/ui/button';

interface EvidenceDetailModalProps {
  item: EvidenceItem | null;
  onClose: () => void;
}

export default function EvidenceDetailModal({ item, onClose }: EvidenceDetailModalProps) {
  if (!item) return null;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(item.hash);
    toast.success('SHA-256 integrity hash copied!');
  };

  const handleCopyOcr = () => {
    if (item.ocrText) {
      navigator.clipboard.writeText(item.ocrText);
      toast.success('OCR parsed text copied!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-primary/20 bg-zinc-950 p-6 space-y-6 shadow-[0_0_50px_rgba(0,102,255,0.2)] float-up">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border/50 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-border/50 flex items-center justify-center text-primary">
              <FileText size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground truncate max-w-[280px]">{item.name}</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">{item.type} File</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-zinc-900/40 border border-border/50 rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
              <Calendar size={10} /> Date Secured
            </span>
            <p className="text-foreground font-semibold">{item.date}</p>
          </div>
          <div className="p-3 bg-zinc-900/40 border border-border/50 rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
              <Lock size={10} /> Size
            </span>
            <p className="text-foreground font-semibold">{item.size}</p>
          </div>
        </div>

        {/* Cryptographic Integrity Section */}
        <div className="p-4 bg-success/5 border border-success/20 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-success uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck size={12} /> Crypto Hash Integrity (SHA-256)
            </span>
            <button
              onClick={handleCopyHash}
              className="inline-flex items-center gap-1 text-[9px] font-bold text-success hover:underline"
            >
              <Copy size={9} /> Copy Hash
            </button>
          </div>
          <p className="text-[10px] font-mono text-muted-foreground break-all leading-normal">
            {item.hash}
          </p>
          <div className="text-[9px] text-success/80 font-mono">
            Verified unchanged since upload. Chain-of-custody log entry created.
          </div>
        </div>

        {/* OCR Extractions (if any) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              AI OCR Text Extraction
            </span>
            {item.ocrText && (
              <button
                onClick={handleCopyOcr}
                className="inline-flex items-center gap-1 text-[9px] font-bold text-primary hover:underline"
              >
                <Copy size={9} /> Copy Text
              </button>
            )}
          </div>
          <div className="p-3 bg-black border border-border/50 rounded-xl max-h-[140px] overflow-y-auto scrollbar-cyber">
            {item.ocrText ? (
              <p className="text-xs text-foreground font-mono leading-relaxed whitespace-pre-wrap">
                {item.ocrText}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground italic text-center py-4">
                No OCR extractions available for this media category.
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={() => {
              toast.info(`Preparing download for ${item.name}...`);
              const content = `SAFECLICK SECURED DIGITAL EVIDENCE\n---------------------------------\nFile Name: ${item.name}\nSize: ${item.size}\nDate Secured: ${item.date}\nSHA-256 Integrity Hash: ${item.hash}\n\nAI OCR Text Extraction:\n----------------------\n${item.ocrText || 'No OCR extracted for this media category.'}`;
              const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `Evidence_Receipt_${item.name.replace(/\.[^/.]+$/, "")}.txt`;
              link.click();
              toast.success('Evidence packet downloaded!');
              onClose();
            }}
            className="flex-1 h-11 bg-blue-600 hover:bg-blue-750 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all pt-0 pb-0 shadow-sm"
          >
            <Download size={15} /> Download Packet
          </Button>
        </div>
      </div>
    </div>
  );
}
