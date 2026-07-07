'use client';

import React from 'react';
import { X, ShieldCheck, Printer, Download, Award, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface CertificateViewerProps {
  onClose: () => void;
}

export default function CertificateViewer({ onClose }: CertificateViewerProps) {
  const certId = 'CERT-SG-' + Math.floor(100000 + Math.random() * 900000);
  const issueDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const content = `==================================================
SAFECLICK GUARDIAN AI - CERTIFICATE OF COMPLETION
==================================================
Certificate ID: ${certId}
Recipient: Rahul Sharma
Issued Date: ${issueDate}
Credential URL: https://safeclick.gov/verify/${certId}
--------------------------------------------------
This credentials verifies that Rahul Sharma has successfully 
demonstrated competency in identifying SMS Phishing, UPI Fraud, 
and Credential Spoofing attacks in the SafeClick Cyber Academy.
==================================================
Authorized Signatory: Cyber Security National Hackathon
==================================================`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `safeclick-certificate-${certId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Certificate download completed successfully!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl border border-primary/20 bg-zinc-950 p-6 space-y-6 shadow-[0_0_50px_rgba(0,102,255,0.2)] float-up print:border-none print:shadow-none">
        {/* Header toolbar */}
        <div className="flex items-center justify-between border-b border-border/50 pb-4 print:hidden">
          <span className="text-xs font-bold text-muted-foreground uppercase">Secured Credential Portal</span>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Certificate Frame Canvas */}
        <div className="relative border-4 border-double border-primary/30 p-8 rounded-xl bg-zinc-900/20 text-center space-y-6 overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Logo badge */}
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center text-primary mb-2">
            <Award size={32} className="animate-pulse" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
              <Shield size={16} className="text-primary" /> CERTIFICATE OF COMPLETION
            </h2>
            <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">SAFECLICK CYBER ACADEMY</p>
          </div>

          <p className="text-xs text-muted-foreground">This credential certifies that</p>
          
          <h3 className="text-2xl font-extrabold text-foreground font-heading italic tracking-wide">Rahul Sharma</h3>
          
          <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
            has successfully completed the cybersecurity training program and passed the assessments covering **UPI Scams, Phishing links detection, and credentials protection**.
          </p>

          <div className="grid grid-cols-2 pt-6 text-[10px] font-mono border-t border-border/40 max-w-sm mx-auto text-left gap-4">
            <div>
              <span className="text-muted-foreground uppercase block text-[8px] font-bold">ISSUED DATE</span>
              <span className="text-foreground font-bold">{issueDate}</span>
            </div>
            <div>
              <span className="text-muted-foreground uppercase block text-[8px] font-bold">CREDENTIAL ID</span>
              <span className="text-primary font-bold">{certId}</span>
            </div>
          </div>
        </div>

        {/* Tool actions */}
        <div className="flex gap-3 pt-2 print:hidden">
          <Button
            onClick={handleDownload}
            className="flex-1 h-11 bg-primary text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all pt-0 pb-0"
          >
            <Download size={15} /> Download Credential Packet
          </Button>
          <Button
            onClick={handlePrint}
            variant="ghost"
            className="flex-1 h-11 border border-border text-foreground hover:bg-muted font-bold rounded-xl flex items-center justify-center gap-2 transition-all pt-0 pb-0"
          >
            <Printer size={15} /> Print Certificate
          </Button>
        </div>
      </div>
    </div>
  );
}
