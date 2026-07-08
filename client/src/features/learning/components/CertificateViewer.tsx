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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/35 backdrop-blur-xs">
      <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 space-y-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150 print:border-none print:shadow-none">
        {/* Header toolbar */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 print:hidden">
          <span className="text-xs font-bold text-gray-400 uppercase">Secured Credential Portal</span>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Certificate Frame Canvas */}
        <div className="relative border-4 border-double border-blue-600/35 p-8 rounded-xl bg-gray-50 text-center space-y-6 overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

          {/* Logo badge */}
          <div className="mx-auto w-16 h-16 rounded-full bg-blue-50 border-2 border-blue-200 flex items-center justify-center text-blue-600 mb-2">
            <Award size={32} className="animate-pulse" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-gray-900 flex items-center justify-center gap-2">
              <Shield size={16} className="text-blue-600" /> CERTIFICATE OF COMPLETION
            </h2>
            <p className="text-[10px] text-gray-400 font-bold font-mono uppercase tracking-widest">SAFECLICK CYBER ACADEMY</p>
          </div>

          <p className="text-xs text-gray-400 font-semibold">This credential certifies that</p>
          
          <h3 className="text-2xl font-black text-gray-900 italic tracking-wide">Rahul Sharma</h3>
          
          <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed font-semibold">
            has successfully completed the cybersecurity training program and passed the assessments covering **UPI Scams, Phishing links detection, and credentials protection**.
          </p>

          <div className="grid grid-cols-2 pt-6 text-[10px] font-mono border-t border-gray-200 max-w-sm mx-auto text-left gap-4">
            <div>
              <span className="text-gray-400 uppercase block text-[8px] font-bold">ISSUED DATE</span>
              <span className="text-gray-900 font-bold">{issueDate}</span>
            </div>
            <div>
              <span className="text-gray-400 uppercase block text-[8px] font-bold">CREDENTIAL ID</span>
              <span className="text-blue-600 font-bold">{certId}</span>
            </div>
          </div>
        </div>

        {/* Tool actions */}
        <div className="flex gap-3 pt-2 print:hidden">
          <Button
            onClick={handleDownload}
            className="flex-1 h-11 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-all pt-0 pb-0 shadow-sm"
          >
            <Download size={15} /> Download Credential Packet
          </Button>
          <Button
            onClick={handlePrint}
            variant="ghost"
            className="flex-1 h-11 border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold rounded-xl flex items-center justify-center gap-2 transition-all pt-0 pb-0"
          >
            <Printer size={15} /> Print Certificate
          </Button>
        </div>
      </div>
    </div>
  );
}
