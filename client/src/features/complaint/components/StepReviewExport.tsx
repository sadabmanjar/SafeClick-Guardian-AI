'use client';
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Download, Mail, Copy, CheckCircle, Share2, Printer, ExternalLink,  } from 'lucide-react';
import { toast } from 'sonner';
import type { ComplaintFormData } from './ComplaintWizard';

import { jsPDF } from 'jspdf';

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
    if (!generatedComplaint) {
      toast.error('No complaint text found to generate PDF');
      return;
    }

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Add clean security header banner
      doc.setFillColor(3, 10, 20); // Dark cyber header
      doc.rect(0, 0, 210, 30, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('SAFECLICK GUARDIAN - SECURE COMPLAINT REPORT', 12, 12);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('OFFICIAL INCIDENT REPORT DEPOSITED UNDER SECTION 66C/66D OF THE IT ACT, 2000', 12, 20);
      doc.text(`REPORT ID: MP-CY-${Date.now().toString().slice(-6)} | GENERATED ON: ${new Date().toLocaleDateString('en-IN')}`, 12, 25);

      // Body styling
      doc.setTextColor(33, 41, 54);
      let y = 42;

      // Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('TO, THE STATION HOUSE OFFICER, CYBER POLICE DIVISION, MADHYA PRADESH', 15, y);
      y += 10;

      // Subject
      doc.setFont('helvetica', 'bold');
      doc.text(`SUBJECT: Complaint for online fraud (${data.fraudType || 'Cyber Crime'}) of Rs. ${Number(data.amountLost || 0).toLocaleString('en-IN')}`, 15, y);
      y += 12;

      // Complainant Section
      doc.setFillColor(243, 244, 246);
      doc.rect(15, y, 180, 25, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('1. COMPLAINANT IDENTIFICATION DETAILS', 18, y + 5);
      doc.setFont('helvetica', 'normal');
      doc.text(`Name: ${data.complainantName || 'N/A'}`, 18, y + 10);
      doc.text(`Mobile: ${data.complainantPhone || 'N/A'}  |  Email: ${data.complainantEmail || 'N/A'}`, 18, y + 15);
      doc.text(`Address: ${data.complainantAddress || 'N/A'}`, 18, y + 20);
      y += 32;

      // Incident Details
      doc.setFillColor(243, 244, 246);
      doc.rect(15, y, 180, 22, 'F');
      doc.setFont('helvetica', 'bold');
      doc.text('2. CYBER FRAUD INCIDENT SUMMARY', 18, y + 5);
      doc.setFont('helvetica', 'normal');
      doc.text(`Incident Date/Time: ${data.incidentDate || 'N/A'} at ${data.incidentTime || 'Approx. Unknown'}`, 18, y + 10);
      doc.text(`Type of Scam: ${data.fraudType || 'N/A'}`, 18, y + 15);
      y += 29;

      // Financial Details
      doc.setFillColor(243, 244, 246);
      doc.rect(15, y, 180, 25, 'F');
      doc.setFont('helvetica', 'bold');
      doc.text('3. AUDITED TRANSACTION & FINANCIAL DETAILS', 18, y + 5);
      doc.setFont('helvetica', 'normal');
      doc.text(`Amount Defrauded: INR ${Number(data.amountLost || 0).toLocaleString('en-IN')}`, 18, y + 10);
      doc.text(`Transaction / UTR ID: ${data.transactionId || 'N/A'}`, 18, y + 15);
      doc.text(`Bank Name: ${data.bankName || 'N/A'}  |  UPI ID (if any): ${data.upiId || 'N/A'}`, 18, y + 20);
      y += 32;

      // Detailed Description
      doc.setFont('helvetica', 'bold');
      doc.text('4. DESCRIPTION OF THE INCIDENT', 15, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      
      const descLines = doc.splitTextToSize(data.description || 'No description provided.', 178);
      doc.text(descLines, 15, y);
      y += (descLines.length * 4) + 8;

      // Evidence Exhibits
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('5. DIGITAL EVIDENCE / EXHIBITS LIST', 15, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      const evidenceLines = doc.splitTextToSize(data.evidenceDescription || 'No exhibits listed.', 178);
      doc.text(evidenceLines, 15, y);
      y += (evidenceLines.length * 4) + 12;

      // Sign-off
      doc.setFont('helvetica', 'bold');
      doc.text('DECLARATION AND SIGN-OFF', 15, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text('I declare that the incident and financial records compiled in this document are true to the best of my knowledge.', 15, y);
      y += 12;
      
      doc.setFont('helvetica', 'bold');
      doc.text(`${data.complainantName || '__________________'}`.toUpperCase(), 15, y);
      doc.text('SIGNATURE OF COMPLAINANT', 15, y + 4);

      // Save PDF file
      doc.save(`Cybercrime_Complaint_${Date.now().toString().slice(-6)}.pdf`);
      toast.success('Complaint PDF exported successfully!');
    } catch (e: any) {
      console.error('[PDF EXPORT ERROR]', e);
      toast.error('Failed to generate PDF. Downloading text file instead.');
      
      // Fallback: download as text file if PDF creation throws
      const blob = new Blob([generatedComplaint], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Cybercrime_Complaint_${Date.now().toString().slice(-6)}.txt`;
      link.click();
    }
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
        onClick={async () => {
          if (!generatedComplaint) {
            toast.error('Generate a complaint first before sharing');
            return;
          }
          if (navigator.share) {
            try {
              await navigator.share({
                title: `Cyber Fraud Complaint — ${data.fraudType || 'Online Fraud'}`,
                text: generatedComplaint,
              });
              toast.success('Complaint shared successfully!');
            } catch (e: any) {
              if (e.name !== 'AbortError') {
                toast.error('Failed to share. Text copied to clipboard instead.');
                navigator.clipboard.writeText(generatedComplaint);
              }
            }
          } else {
            navigator.clipboard.writeText(generatedComplaint);
            toast.success('Web Share not supported — complaint text copied to clipboard!');
          }
        }}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-150 active:scale-95"
      >
        <Share2 size={15} className="text-gray-400" />
        Share Complaint with Family / Lawyer
      </button>
    </div>
  );
}