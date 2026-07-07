'use client';
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Download, Mail, Copy, CheckCircle, Share2, Printer, ExternalLink,  } from 'lucide-react';
import { toast } from 'sonner';
import type { ComplaintFormData } from './ComplaintWizard';

interface Props {
  form: UseFormReturn<ComplaintFormData>;
  generatedComplaint: string | null;
}

export default function StepReviewExport({ form, generatedComplaint }: Props) {
  const [copied, setCopied] = useState(false);
  const data = form.getValues();

  const handleCopy = () => {
    if (!generatedComplaint) return;
    navigator.clipboard.writeText(generatedComplaint);
    setCopied(true);
    toast.success('Complaint text copied to clipboard');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownloadPDF = () => {
    // TODO: Connect to PDF generation service (jsPDF or backend PDF endpoint)
    toast.success('PDF generation — connect to PDF export service', {
      description: 'Integrate jsPDF or backend /api/complaints/export-pdf',
    });
  };

  const handleEmailDraft = () => {
    if (!generatedComplaint) return;
    const subject = encodeURIComponent(`Cyber Fraud Complaint — ${data.fraudType || 'Online Fraud'} — ₹${data.amountLost || '0'}`);
    const body = encodeURIComponent(generatedComplaint);
    window.open(`mailto:cybercrime@mppolice.gov.in?subject=${subject}&body=${body}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  const exportActions = [
    {
      id: 'export-pdf',
      icon: Download,
      label: 'Download PDF',
      description: 'Police-ready formatted document',
      color: 'text-primary',
      bg: 'bg-primary/10 border-primary/20 hover:bg-primary/20',
      onClick: handleDownloadPDF,
    },
    {
      id: 'export-email',
      icon: Mail,
      label: 'Send via Email',
      description: 'Opens email to cyber police',
      color: 'text-success',
      bg: 'bg-success/10 border-success/20 hover:bg-success/20',
      onClick: handleEmailDraft,
    },
    {
      id: 'export-copy',
      icon: copied ? CheckCircle : Copy,
      label: copied ? 'Copied!' : 'Copy Text',
      description: 'Copy complaint to clipboard',
      color: copied ? 'text-success' : 'text-warning',
      bg: copied ? 'bg-success/10 border-success/20' : 'bg-warning/10 border-warning/20 hover:bg-warning/20',
      onClick: handleCopy,
    },
    {
      id: 'export-print',
      icon: Printer,
      label: 'Print',
      description: 'Print physical copy for police',
      color: 'text-muted-foreground',
      bg: 'bg-muted/30 border-border hover:bg-muted/50',
      onClick: handlePrint,
    },
  ];

  return (
    <div className="space-y-5 float-up">
      {/* Success header */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-success/10 border border-success/20">
        <CheckCircle size={18} className="text-success flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-success">Complaint Generated Successfully</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your formal complaint is ready. Download, email, or copy it below.
          </p>
        </div>
      </div>

      {/* Complaint summary */}
      <div className="glass-card-elevated rounded-xl border border-border p-4 space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Complaint Summary</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Complainant', value: data.complainantName || '—' },
            { label: 'Fraud Type', value: data.fraudType || '—' },
            { label: 'Amount Lost', value: data.amountLost ? `₹${Number(data.amountLost).toLocaleString('en-IN')}` : '—' },
            { label: 'Platform', value: data.platform || '—' },
            { label: 'Transaction ID', value: data.transactionId || '—' },
            { label: 'Bank', value: data.bankName || '—' },
            { label: 'Incident Date', value: data.incidentDate || '—' },
            { label: 'NCRP No.', value: data.ncrpComplaintNo || 'Not filed yet' },
          ].map((item) => (
            <div key={`summary-${item.label}`}>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">{item.label}</p>
              <p className="text-xs font-semibold text-foreground truncate">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Export actions */}
      <div>
        <p className="text-xs font-semibold text-foreground mb-3">Export Formats</p>
        <div className="grid grid-cols-2 gap-3">
          {exportActions.map((action) => (
            <button
              key={action.id}
              onClick={action.onClick}
              className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all duration-150 active:scale-95 ${action.bg}`}
            >
              <action.icon size={18} className={`${action.color} flex-shrink-0 mt-0.5`} />
              <div>
                <p className={`text-xs font-bold ${action.color}`}>{action.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{action.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Next steps */}
      <div className="glass-card-elevated rounded-xl border border-border p-4 space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Next Steps After Filing</p>
        {[
          { step: '1', text: 'Submit complaint at nearest Cyber Police Station with this document', link: null },
          { step: '2', text: 'File on NCRP portal at cybercrime.gov.in', link: 'https://cybercrime.gov.in' },
          { step: '3', text: 'Notify your bank and request account freeze / chargeback', link: null },
          { step: '4', text: 'Keep your complaint ID and all evidence safe', link: null },
        ].map((item) => (
          <div key={`next-step-${item.step}`} className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[9px] font-bold text-primary">{item.step}</span>
            </div>
            <div className="flex items-center gap-2 flex-1">
              <p className="text-xs text-foreground">{item.text}</p>
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0"
                >
                  <ExternalLink size={11} className="text-primary" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Share */}
      <button
        onClick={() => toast.info('Share — connect to Web Share API')}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-all duration-150 active:scale-95"
      >
        <Share2 size={15} className="text-muted-foreground" />
        Share Complaint with Family / Lawyer
      </button>
    </div>
  );
}