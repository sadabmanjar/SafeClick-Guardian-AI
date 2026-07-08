'use client';

import React, { useState } from 'react';
import { Search, Filter, Database, ShieldAlert } from 'lucide-react';
import EvidenceUploadZone from './EvidenceUploadZone';
import EvidenceCard, { EvidenceItem } from './EvidenceCard';
import EvidenceDetailModal from './EvidenceDetailModal';
import EvidenceTimeline from './EvidenceTimeline';

const initialEvidence: EvidenceItem[] = [
  {
    id: 'ev-001',
    name: 'WhatsApp-Chat-Threat-Screen.png',
    type: 'image',
    size: '842 KB',
    hash: '8f9c12b3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1',
    date: '02 Jul 2026',
    ocrText: `[OCR PARSED TEXT] - TRANSACTION ID: TXN4958102482\nSender Number: +91 98765 43210\nMessage Details: "Dear customer, your bank account is blocked. Verify KYC immediately at https://hdfc-kyc-verify.net"`,
  },
  {
    id: 'ev-002',
    name: 'Transaction-Logs-BankStatement.pdf',
    type: 'pdf',
    size: '2.4 MB',
    hash: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
    date: '28 Jun 2026',
    ocrText: `[PDF TEXT EXTRACTION] - bank statement containing transaction logs showing fraudulent UPI debit of ₹45,000 on 2026-07-02 to suspect UPI ID: scammer@upi`,
  },
  {
    id: 'ev-003',
    name: 'Threat-Threatening-Call-Audio.mp3',
    type: 'audio',
    size: '4.8 MB',
    hash: 'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4',
    date: '18 Jun 2026',
  },
];

export default function EvidenceLockerScreen() {
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>(initialEvidence);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'image' | 'video' | 'audio' | 'pdf'>('all');
  const [previewItem, setPreviewItem] = useState<EvidenceItem | null>(null);

  const handleUploadSuccess = (file: { name: string; type: 'image' | 'video' | 'audio' | 'pdf'; size: string; hash: string; ocrText?: string }) => {
    const newItem: EvidenceItem = {
      id: `ev-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      type: file.type,
      size: file.size,
      hash: file.hash,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      ocrText: file.ocrText,
    };
    setEvidenceList((prev) => [newItem, ...prev]);
  };

  const handleDelete = (id: string) => {
    setEvidenceList((prev) => prev.filter((item) => item.id !== id));
  };

  // Filter & Search logic
  const filteredEvidence = evidenceList.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (item.ocrText && item.ocrText.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = activeFilter === 'all' || item.type === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 pb-24 lg:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Evidence Locker</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Store, audit, and mathematically sign evidence for legal submissions
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 glass-card rounded-lg border border-primary/20">
          <Database size={14} className="text-primary" />
          <span className="text-xs font-semibold text-foreground">
            {evidenceList.length} secure hashes registered
          </span>
        </div>
      </div>

      {/* Main Grid: Upload zone & filters + timeline */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Side: Upload zone + List */}
        <div className="xl:col-span-2 space-y-6">
          {/* Upload Vault dropzone */}
          <EvidenceUploadZone onUploadSuccess={handleUploadSuccess} />

          {/* Search + Filter toolbar */}
          <div className="glass-card border border-border p-4 rounded-xl space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search file name or OCR text content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-lg bg-black border border-border/80 text-xs focus:outline-none focus:border-primary/50 transition-all placeholder:text-zinc-600"
                />
              </div>

              {/* Category selector */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-cyber pb-1 sm:pb-0">
                {(['all', 'image', 'video', 'audio', 'pdf'] as const).map((filter) => (
                  <button
                    key={`filter-${filter}`}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all whitespace-nowrap border ${
                      activeFilter === filter
                        ? 'bg-primary/10 text-primary border-primary/20 neon-glow-primary'
                        : 'bg-zinc-900 border-border/50 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid List */}
          {filteredEvidence.length === 0 ? (
            <div className="glass-card border border-border p-12 text-center rounded-xl flex flex-col items-center justify-center">
              <Database size={28} className="text-muted-foreground mb-3" />
              <h3 className="text-sm font-semibold text-foreground mb-1">Locker is Empty</h3>
              <p className="text-xs text-muted-foreground max-w-xs">
                No matching evidence items detected. Securely drag & drop media into the vault to generate SHA-256 footprints.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredEvidence.map((item) => (
                <EvidenceCard
                  key={item.id}
                  item={item}
                  onPreview={setPreviewItem}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Custody Timeline */}
        <div className="xl:col-span-1">
          <EvidenceTimeline items={evidenceList} />
        </div>
      </div>

      {/* Detail Modal Preview */}
      {previewItem && (
        <EvidenceDetailModal
          item={previewItem}
          onClose={() => setPreviewItem(null)}
        />
      )}
    </div>
  );
}
