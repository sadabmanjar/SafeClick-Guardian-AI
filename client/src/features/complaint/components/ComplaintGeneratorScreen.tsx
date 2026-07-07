import React from 'react';
import ComplaintWizard from './ComplaintWizard';
import PageHeader from '@/components/ui/PageHeader';
import { Info, FileText, Mail, Globe } from 'lucide-react';

export default function ComplaintGeneratorScreen() {
  return (
    <div className="space-y-6 pb-24 lg:pb-8">
      <PageHeader
        title="Complaint Generator"
        subtitle="Generate a professional, police-ready cyber fraud complaint in 4 steps"
        actions={
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2">
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Exports:</span>
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-white border border-blue-200 px-2 py-0.5 rounded-full">
                <FileText size={9} /> PDF
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-white border border-indigo-200 px-2 py-0.5 rounded-full">
                <Mail size={9} /> Email
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-white border border-green-200 px-2 py-0.5 rounded-full">
                <Globe size={9} /> NCRP
              </span>
            </div>
          </div>
        }
      />

      {/* Legal info banner */}
      <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl bg-blue-50 border border-blue-200">
        <div className="w-6 h-6 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Info size={13} className="text-blue-600" />
        </div>
        <p className="text-xs text-blue-800 leading-relaxed">
          This complaint references{' '}
          <strong className="font-bold">Section 66C and 66D of the IT Act 2000</strong> and follows the{' '}
          <strong className="font-bold">NCRP (National Cybercrime Reporting Portal)</strong> format.
          The generated document can be submitted directly to Cyber Police or uploaded on{' '}
          <span className="font-bold underline decoration-dotted">cybercrime.gov.in</span>.
        </p>
      </div>

      {/* Wizard */}
      <ComplaintWizard />
    </div>
  );
}