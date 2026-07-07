'use client';
import React, { useState } from 'react';
import { FileText, Eye, EyeOff, RefreshCw } from 'lucide-react';
import type { ComplaintFormData } from './ComplaintWizard';

interface Props {
  formData: ComplaintFormData;
  generatedComplaint: string | null;
  currentStep: number;
}

export default function ComplaintPreviewPanel({ formData, generatedComplaint, currentStep }: Props) {
  const [previewVisible, setPreviewVisible] = useState(true);

  const hasData = formData.complainantName || formData.fraudType || formData.amountLost;

  return (
    <div className="glass-card rounded-xl border border-border flex flex-col sticky top-6 max-h-[calc(100vh-8rem)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-primary" />
          <h3 className="text-sm font-bold text-foreground">Complaint Preview</h3>
        </div>
        <div className="flex items-center gap-2">
          {generatedComplaint && (
            <span className="text-[10px] font-bold text-success bg-success/15 border border-success/30 px-2 py-0.5 rounded-full">
              Generated
            </span>
          )}
          <button
            onClick={() => setPreviewVisible(!previewVisible)}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            title={previewVisible ? 'Hide preview' : 'Show preview'}
          >
            {previewVisible
              ? <EyeOff size={14} className="text-muted-foreground" />
              : <Eye size={14} className="text-muted-foreground" />
            }
          </button>
        </div>
      </div>

      {previewVisible && (
        <div className="flex-1 overflow-y-auto scrollbar-cyber">
          {generatedComplaint ? (
            /* Full generated complaint */
            <div className="p-5">
              <pre className="text-[11px] text-foreground font-mono-data leading-relaxed whitespace-pre-wrap break-words">
                {generatedComplaint}
              </pre>
            </div>
          ) : hasData ? (
            /* Live preview as user fills form */
            <div className="p-5 space-y-4">
              {/* Live preview header */}
              <div className="flex items-center gap-2 mb-3">
                <RefreshCw size={12} className="text-primary animate-spin" />
                <span className="text-[10px] text-muted-foreground font-medium">Live preview — updates as you type</span>
              </div>

              {/* Draft complaint */}
              <div className="space-y-3 text-[11px] text-foreground font-mono-data leading-relaxed">
                <p className="font-bold text-center text-xs">CYBER FRAUD COMPLAINT</p>
                <p className="text-center text-muted-foreground text-[10px]">Draft — Complete all steps to generate final document</p>
                <div className="h-px bg-border my-2" />

                {formData.complainantName && (
                  <p><span className="text-muted-foreground">Complainant:</span> {formData.complainantName}</p>
                )}
                {formData.complainantPhone && (
                  <p><span className="text-muted-foreground">Phone:</span> {formData.complainantPhone}</p>
                )}
                {formData.fraudType && (
                  <p><span className="text-muted-foreground">Fraud Type:</span> {formData.fraudType}</p>
                )}
                {formData.platform && (
                  <p><span className="text-muted-foreground">Platform:</span> {formData.platform}</p>
                )}
                {formData.incidentDate && (
                  <p><span className="text-muted-foreground">Date:</span> {formData.incidentDate}</p>
                )}
                {formData.amountLost && (
                  <p className="text-danger font-bold">
                    <span className="text-muted-foreground font-normal">Amount Lost:</span> ₹{Number(formData.amountLost).toLocaleString('en-IN')}
                  </p>
                )}
                {formData.transactionId && (
                  <p><span className="text-muted-foreground">Transaction ID:</span> {formData.transactionId}</p>
                )}
                {formData.bankName && (
                  <p><span className="text-muted-foreground">Bank:</span> {formData.bankName}</p>
                )}
                {formData.description && (
                  <div>
                    <p className="text-muted-foreground mb-1">Description:</p>
                    <p className="text-[10px] leading-relaxed line-clamp-6">{formData.description}</p>
                  </div>
                )}

                {/* Fields still needed */}
                <div className="mt-4 pt-3 border-t border-border">
                  <p className="text-[10px] text-muted-foreground mb-2 font-sans">
                    Step {currentStep} of 4 — {4 - currentStep} step{4 - currentStep !== 1 ? 's' : ''} remaining to complete
                  </p>
                  <div className="h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center mb-4">
                <FileText size={24} className="text-muted-foreground" />
              </div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Complaint Preview</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Start filling the form on the left — your complaint will appear here in real time and update with every field you complete
              </p>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-border px-5 py-3 flex-shrink-0">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span>Follows NCRP + IT Act 2000 format</span>
          <span className="text-primary font-medium">Section 66C / 66D</span>
        </div>
      </div>
    </div>
  );
}