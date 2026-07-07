
import React from 'react';
import ComplaintWizard from './ComplaintWizard';

export default function ComplaintGeneratorScreen() {
  return (
    <div className="space-y-6 pb-24 lg:pb-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Complaint Generator</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Generate a professional, police-ready cyber fraud complaint in 4 steps
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 glass-card rounded-lg border border-primary/20">
            <span className="text-xs font-medium text-muted-foreground">Formats:</span>
            <span className="text-xs font-bold text-primary">PDF</span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs font-bold text-primary">Email</span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs font-bold text-primary">NCRP</span>
          </div>
        </div>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-primary/5 border border-primary/20">
        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-[10px] font-bold text-primary">i</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          This complaint references <strong className="text-foreground">Section 66C and 66D of the IT Act 2000</strong> and follows the <strong className="text-foreground">NCRP (National Cybercrime Reporting Portal)</strong> format. The generated document can be submitted directly to Cyber Police or uploaded on cybercrime.gov.in.
        </p>
      </div>

      {/* Wizard */}
      <ComplaintWizard />
    </div>
  );
}