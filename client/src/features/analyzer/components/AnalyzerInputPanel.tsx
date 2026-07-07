'use client';
import React, { useState, useRef } from 'react';
import {
  MessageSquare,
  Link2,
  Image as ImageIcon,
  Mail,
  QrCode,
  Upload,
  Loader2,
  Zap,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

const inputTabs = [
  { id: 'sms', label: 'SMS / Chat', icon: MessageSquare, placeholder: 'Paste the suspicious SMS, WhatsApp message, or chat here...\n\nExample: "Congratulations! Your SBI account has been selected for ₹50,000 cashback. Click http://sbi-reward.xyz to claim now. OTP: 847291"' },
  { id: 'url', label: 'URL', icon: Link2, placeholder: 'Paste the suspicious URL or link here...\n\nExample: https://sbi-netbanking-secure.xyz/login' },
  { id: 'email', label: 'Email', icon: Mail, placeholder: 'Paste the suspicious email content here (subject + body)...' },
  { id: 'screenshot', label: 'Screenshot', icon: ImageIcon, placeholder: '' },
  { id: 'qr', label: 'QR Code', icon: QrCode, placeholder: '' },
];

import { ScanResult } from '@/types/common';
import { useScan } from '@/hooks/useScan';

interface AnalyzerInputPanelProps {
  onResult?: (result: ScanResult | null) => void;
}

// We use a global event approach via CustomEvent to communicate result to sibling
export default function AnalyzerInputPanel() {
  const [activeTab, setActiveTab] = useState('sms');
  const [inputText, setInputText] = useState('');
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const { analyze, isLoading: isAnalyzing } = useScan();
  const [uploadedFileName, setUploadedFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeTabData = inputTabs.find((t) => t.id === activeTab)!;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large — maximum 10MB allowed');
      return;
    }
    setUploadedFileName(file.name);
    setUploadedFile(URL.createObjectURL(file));
    toast.success(`File "${file.name}" uploaded — ready to analyze`);
  };

  const handleAnalyze = async () => {
    const hasInput = activeTab === 'screenshot' || activeTab === 'qr' ? !!uploadedFile : inputText.trim().length > 10;
    if (!hasInput) {
      toast.error('Please enter content to analyze — minimum 10 characters required');
      return;
    }

    const contentType = activeTab === 'screenshot' || activeTab === 'qr' ? 'image' : activeTab === 'url' ? 'url' : 'text';
    const content = hasInput && (activeTab === 'screenshot' || activeTab === 'qr') ? uploadedFileName : inputText;

    const result = await analyze({ content, contentType });

    if (result) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('scam-analysis-result', { detail: result }));
      }
      toast.success(`Analysis complete — Risk Score: ${result.riskScore}/100`, {
        description: `Scam Type: ${result.scamType}`,
      });
    }
  };

  const handleClear = () => {
    setInputText('');
    setUploadedFile(null);
    setUploadedFileName('');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('scam-analysis-result', { detail: null }));
    }
  };

  return (
    <div className="glass-card rounded-xl border border-border overflow-hidden">
      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-border overflow-x-auto scrollbar-cyber">
        {inputTabs.map((tab) => (
          <button
            key={`tab-${tab.id}`}
            onClick={() => { setActiveTab(tab.id); setInputText(''); setUploadedFile(null); }}
            className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium whitespace-nowrap transition-all duration-150 border-b-2 flex-shrink-0 ${
              activeTab === tab.id
                ? 'border-primary text-primary bg-primary/5' :'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Input area */}
      <div className="p-5">
        {activeTab === 'screenshot' || activeTab === 'qr' ? (
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer group ${
              uploadedFile
                ? 'border-primary/40 bg-primary/5' :'border-border hover:border-primary/40 hover:bg-primary/5'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={activeTab === 'screenshot' ? 'image/*' : 'image/*'}
              onChange={handleFileUpload}
              className="hidden"
              aria-label="Upload file for analysis"
            />
            {uploadedFile ? (
              <div className="space-y-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={uploadedFile}
                  alt={`Uploaded ${activeTab} for analysis`}
                  className="max-h-48 mx-auto rounded-lg object-contain border border-border"
                />
                <p className="text-sm text-primary font-medium">{uploadedFileName}</p>
                <button
                  onClick={(e) => { e.stopPropagation(); setUploadedFile(null); setUploadedFileName(''); }}
                  className="text-xs text-muted-foreground hover:text-danger transition-colors"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-14 h-14 rounded-xl bg-muted border border-border flex items-center justify-center mx-auto group-hover:border-primary/40 transition-colors">
                  <Upload size={22} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {activeTab === 'screenshot' ? 'Upload Screenshot' : 'Upload QR Code Image'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Drag & drop or click to browse — PNG, JPG up to 10MB
                  </p>
                </div>
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-success" />
                    OCR Text Extraction
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    AI Pattern Detection
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={activeTabData.placeholder}
              rows={6}
              className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 resize-none transition-all duration-150 scrollbar-cyber"
              aria-label={`Enter ${activeTabData.label} content for analysis`}
            />
            {inputText && (
              <button
                onClick={handleClear}
                className="absolute top-3 right-3 p-1 rounded-md hover:bg-muted transition-colors"
                aria-label="Clear input"
              >
                <X size={14} className="text-muted-foreground" />
              </button>
            )}
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-muted-foreground">{inputText.length} characters</span>
              <span className="text-xs text-muted-foreground">Minimum 10 characters required</span>
            </div>
          </div>
        )}

        {/* Try example button */}
        {(activeTab === 'sms' || activeTab === 'url') && !inputText && (
          <button
            onClick={() => setInputText(activeTab === 'sms' ?'Congratulations! Your SBI account has been selected for ₹50,000 cashback. Click http://sbi-reward.xyz to claim now. Your OTP is 847291. Do not share with anyone.'
              : 'https://sbi-netbanking-secure-login.xyz/verify?token=abc123'
            )}
            className="mt-3 text-xs text-primary/70 hover:text-primary underline underline-offset-2 transition-colors"
          >
            Try a demo example →
          </button>
        )}

        {/* Analyze button */}
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-150 active:scale-95 ${
              isAnalyzing
                ? 'bg-primary/50 text-primary-foreground cursor-not-allowed'
                : 'bg-primary text-primary-foreground hover:bg-primary/90 neon-glow-primary'
            }`}
          >
            {isAnalyzing ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span className="w-32">Analyzing with AI...</span>
              </>
            ) : (
              <>
                <Zap size={16} />
                Analyze Now
              </>
            )}
          </button>

          {inputText && !isAnalyzing && (
            <button
              onClick={handleClear}
              className="px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted border border-border transition-all duration-150"
            >
              Clear
            </button>
          )}

          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-xs text-muted-foreground">Powered by</span>
            <span className="text-xs font-semibold text-primary">Gemini AI</span>
          </div>
        </div>

        {/* Security note */}
        <p className="text-[11px] text-muted-foreground mt-3 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-success flex-shrink-0" />
          Your content is analyzed securely and never stored without your consent
        </p>
      </div>
    </div>
  );
}