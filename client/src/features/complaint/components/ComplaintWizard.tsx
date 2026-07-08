'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useComplaint } from '@/hooks/useComplaint';
import { CreateComplaintRequest } from '@/types/common';
import {
  Calendar,
  CreditCard,
  Paperclip,
  FileCheck,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Check,
} from 'lucide-react';
import ComplaintPreviewPanel from './ComplaintPreviewPanel';
import StepIncidentDetails from './StepIncidentDetails';
import StepFinancialLoss from './StepFinancialLoss';
import StepEvidence from './StepEvidence';
import StepReviewExport from './StepReviewExport';

export interface ComplaintFormData {
  incidentDate: string;
  incidentTime: string;
  platform: string;
  fraudType: string;
  suspectPhone: string;
  suspectEmail: string;
  suspectAccountNo: string;
  description: string;
  amountLost: string;
  transactionId: string;
  transactionDate: string;
  bankName: string;
  accountNumber: string;
  upiId: string;
  paymentMode: string;
  evidenceDescription: string;
  ncrpComplaintNo: string;
  complainantName: string;
  complainantPhone: string;
  complainantEmail: string;
  complainantAddress: string;
  complainantAadhaarLast4: string;
}

const steps = [
  { id: 1, label: 'Incident Details',  icon: Calendar,  description: 'When & how it happened',         color: 'blue' },
  { id: 2, label: 'Financial Loss',    icon: CreditCard, description: 'Transaction & payment details',  color: 'orange' },
  { id: 3, label: 'Evidence',          icon: Paperclip,  description: 'Attach proof & documents',       color: 'purple' },
  { id: 4, label: 'Review & Export',   icon: FileCheck,  description: 'Preview & download complaint',   color: 'green' },
];

const stepColors: Record<string, { ring: string; bg: string; text: string; activeBg: string }> = {
  blue:   { ring: 'ring-blue-500',   bg: 'bg-blue-600',   text: 'text-blue-600',   activeBg: 'bg-blue-50 border-blue-200' },
  orange: { ring: 'ring-orange-500', bg: 'bg-orange-500', text: 'text-orange-600', activeBg: 'bg-orange-50 border-orange-200' },
  purple: { ring: 'ring-purple-500', bg: 'bg-purple-600', text: 'text-purple-600', activeBg: 'bg-purple-50 border-purple-200' },
  green:  { ring: 'ring-green-500',  bg: 'bg-green-600',  text: 'text-green-600',  activeBg: 'bg-green-50 border-green-200' },
};

export default function ComplaintWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [generatedComplaint, setGeneratedComplaint] = useState<string | null>(null);
  const { submit, isLoading: isGenerating } = useComplaint();

  const form = useForm<ComplaintFormData>({
    defaultValues: {
      incidentDate: '', incidentTime: '', platform: '', fraudType: '',
      suspectPhone: '', suspectEmail: '', suspectAccountNo: '', description: '',
      amountLost: '', transactionId: '', transactionDate: '', bankName: '',
      accountNumber: '', upiId: '', paymentMode: '',
      evidenceDescription: '', ncrpComplaintNo: '',
      complainantName: '', complainantPhone: '', complainantEmail: '',
      complainantAddress: '', complainantAadhaarLast4: '',
    },
    mode: 'onBlur',
  });

  const watchedValues = form.watch();

  const handleNext = async () => {
    const fieldsToValidate: Record<number, (keyof ComplaintFormData)[]> = {
      1: ['incidentDate', 'platform', 'fraudType', 'description'],
      2: ['amountLost', 'transactionId', 'bankName', 'paymentMode'],
      3: ['evidenceDescription'],
    };
    const fields = fieldsToValidate[currentStep];
    if (fields) {
      const valid = await form.trigger(fields);
      if (!valid) return;
    }
    if (currentStep === 3) {
      const payload: CreateComplaintRequest = {
        category: watchedValues.fraudType || 'Financial Fraud',
        incidentDate: watchedValues.incidentDate || new Date().toISOString(),
        platform: watchedValues.platform || 'Other',
        lossAmount: watchedValues.amountLost ? parseFloat(watchedValues.amountLost) : 0,
        transactionId: watchedValues.transactionId,
        bankName: watchedValues.bankName,
        victimDetails: {
          name: watchedValues.complainantName || 'Anonymous',
          phone: watchedValues.complainantPhone || '0000000000',
          email: watchedValues.complainantEmail,
          address: watchedValues.complainantAddress,
        },
        suspectDetails: {
          phone: watchedValues.suspectPhone,
          email: watchedValues.suspectEmail,
          bankAccount: watchedValues.suspectAccountNo,
          upiId: watchedValues.upiId,
        },
        narrative: watchedValues.description || 'No description provided.',
      };

      const result = await submit(payload);
      if (result) {
        setGeneratedComplaint(buildComplaintText(watchedValues));
      } else {
        return; // Stop if failed
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const activeStep = steps[currentStep - 1];
  const activeColor = stepColors[activeStep.color];
  const progressPct = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
      {/* ── Main Wizard ── */}
      <div className="xl:col-span-3 space-y-5">

        {/* Step Tracker */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Progress</p>
              <p className="text-sm font-bold text-gray-800 mt-0.5">
                Step {currentStep} of {steps.length} — {activeStep.label}
              </p>
            </div>
            <span className={`text-xs font-black px-3 py-1 rounded-full border ${activeColor.activeBg} ${activeColor.text}`}>
              {Math.round(progressPct)}% done
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${activeColor.bg}`}
              style={{ width: `${progressPct || 4}%` }}
            />
          </div>

          {/* Step pills */}
          <div className="flex items-start gap-2">
            {steps.map((step) => {
              const isCompleted = currentStep > step.id;
              const isActive    = currentStep === step.id;
              const c = stepColors[step.color];
              return (
                <button
                  key={`step-${step.id}`}
                  onClick={() => isCompleted && setCurrentStep(step.id)}
                  disabled={!isCompleted}
                  className={`flex-1 flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all duration-200 text-center ${
                    isCompleted
                      ? `${c.activeBg} cursor-pointer hover:opacity-80`
                      : isActive
                      ? `${c.activeBg} ring-2 ${c.ring}`
                      : 'bg-gray-50 border-gray-200 cursor-default opacity-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted ? c.bg : isActive ? c.bg : 'bg-gray-200'
                  }`}>
                    {isCompleted
                      ? <Check size={14} className="text-white" />
                      : <step.icon size={14} className="text-white" />
                    }
                  </div>
                  <p className={`text-[10px] font-bold leading-tight hidden sm:block ${
                    isActive ? c.text : isCompleted ? 'text-gray-600' : 'text-gray-400'
                  }`}>{step.label}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step Content Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Step header */}
          <div className={`px-6 py-4 border-b border-gray-100 flex items-center gap-3 ${activeColor.activeBg}`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${activeColor.bg}`}>
              {React.createElement(activeStep.icon, { size: 16, className: 'text-white' })}
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">{activeStep.label}</h3>
              <p className="text-xs text-gray-500">{activeStep.description}</p>
            </div>
          </div>

          <div className="p-6">
            {currentStep === 1 && <StepIncidentDetails form={form} />}
            {currentStep === 2 && <StepFinancialLoss form={form} />}
            {currentStep === 3 && <StepEvidence form={form} />}
            {currentStep === 4 && <StepReviewExport form={form} generatedComplaint={generatedComplaint} />}
          </div>

          {/* Navigation */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              <ChevronLeft size={15} /> Previous
            </button>

            {currentStep < 4 && (
              <button
                onClick={handleNext}
                disabled={isGenerating}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all active:scale-95 shadow-sm ${
                  isGenerating ? 'opacity-60 cursor-not-allowed' : ''
                } ${activeColor.bg} hover:opacity-90`}
              >
                {isGenerating
                  ? <><Loader2 size={15} className="animate-spin" /> Generating...</>
                  : <>{currentStep === 3 ? 'Generate Complaint' : 'Continue'}<ChevronRight size={15} /></>
                }
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Preview Panel ── */}
      <div className="xl:col-span-2">
        <ComplaintPreviewPanel
          formData={watchedValues}
          generatedComplaint={generatedComplaint}
          currentStep={currentStep}
        />
      </div>
    </div>
  );
}

function buildComplaintText(data: ComplaintFormData): string {
  return `TO,
THE STATION HOUSE OFFICER,
CYBER CRIME POLICE STATION,
MADHYA PRADESH POLICE

SUBJECT: Complaint regarding Cyber Fraud / Online Financial Fraud under Section 66C and 66D of the Information Technology Act, 2000

Respected Sir/Madam,

I, ${data.complainantName || '[Complainant Name]'}, residing at ${data.complainantAddress || '[Address]'}, Mobile: ${data.complainantPhone || '[Phone]'}, Email: ${data.complainantEmail || '[Email]'}, hereby lodge this formal complaint regarding a cyber fraud incident that occurred on ${data.incidentDate || '[Date]'} at approximately ${data.incidentTime || '[Time]'}.

1. NATURE OF FRAUD:
Type of Fraud: ${data.fraudType || '[Fraud Type]'}
Platform/Medium Used: ${data.platform || '[Platform]'}

2. INCIDENT DESCRIPTION:
${data.description || '[Description of incident]'}

3. FINANCIAL DETAILS:
Amount Defrauded: ₹${data.amountLost || '[Amount]'}
Transaction ID / UTR Number: ${data.transactionId || '[Transaction ID]'}
Date of Transaction: ${data.transactionDate || '[Transaction Date]'}
Bank Name: ${data.bankName || '[Bank Name]'}
Account Number: XXXX-XXXX-${data.accountNumber?.slice(-4) || 'XXXX'}
UPI ID (if applicable): ${data.upiId || 'N/A'}
Mode of Payment: ${data.paymentMode || '[Payment Mode]'}

4. SUSPECT DETAILS (if known):
Phone Number: ${data.suspectPhone || 'Unknown'}
Email ID: ${data.suspectEmail || 'Unknown'}
Bank Account: ${data.suspectAccountNo || 'Unknown'}

5. EVIDENCE:
${data.evidenceDescription || '[Evidence description]'}
NCRP Complaint Number: ${data.ncrpComplaintNo || 'To be filed'}

6. PRAYER:
I request your kind intervention to:
a) Register an FIR under Section 66C and 66D of the IT Act 2000
b) Trace and freeze the fraudulent account(s)
c) Initiate recovery proceedings for the defrauded amount of ₹${data.amountLost || '[Amount]'}
d) Take appropriate legal action against the perpetrators

I declare that the information provided above is true and correct to the best of my knowledge.

Yours faithfully,
${data.complainantName || '[Your Name]'}
Date: ${new Date().toLocaleDateString('en-IN')}
Mobile: ${data.complainantPhone || '[Your Phone]'}
Aadhaar (Last 4 digits): XXXX-${data.complainantAadhaarLast4 || 'XXXX'}`;
}