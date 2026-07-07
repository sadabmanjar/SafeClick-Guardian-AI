'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
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
  // Step 1 — Incident
  incidentDate: string;
  incidentTime: string;
  platform: string;
  fraudType: string;
  suspectPhone: string;
  suspectEmail: string;
  suspectAccountNo: string;
  description: string;
  // Step 2 — Financial
  amountLost: string;
  transactionId: string;
  transactionDate: string;
  bankName: string;
  accountNumber: string;
  upiId: string;
  paymentMode: string;
  // Step 3 — Evidence
  evidenceDescription: string;
  ncrpComplaintNo: string;
  // Step 4 — Personal
  complainantName: string;
  complainantPhone: string;
  complainantEmail: string;
  complainantAddress: string;
  complainantAadhaarLast4: string;
}

const steps = [
  { id: 1, label: 'Incident Details', icon: Calendar, description: 'When and how it happened' },
  { id: 2, label: 'Financial Loss', icon: CreditCard, description: 'Transaction and payment details' },
  { id: 3, label: 'Evidence', icon: Paperclip, description: 'Attach proof and documents' },
  { id: 4, label: 'Review & Export', icon: FileCheck, description: 'Preview and download complaint' },
];

export default function ComplaintWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedComplaint, setGeneratedComplaint] = useState<string | null>(null);

  const form = useForm<ComplaintFormData>({
    defaultValues: {
      incidentDate: '',
      incidentTime: '',
      platform: '',
      fraudType: '',
      suspectPhone: '',
      suspectEmail: '',
      suspectAccountNo: '',
      description: '',
      amountLost: '',
      transactionId: '',
      transactionDate: '',
      bankName: '',
      accountNumber: '',
      upiId: '',
      paymentMode: '',
      evidenceDescription: '',
      ncrpComplaintNo: '',
      complainantName: '',
      complainantPhone: '',
      complainantEmail: '',
      complainantAddress: '',
      complainantAadhaarLast4: '',
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
      setIsGenerating(true);
      // TODO: Replace with POST /api/complaints/generate — Gemini API integration point
      await new Promise((r) => setTimeout(r, 2200));
      setGeneratedComplaint(buildComplaintText(watchedValues));
      setIsGenerating(false);
    }

    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
      {/* Main wizard panel */}
      <div className="xl:col-span-3 space-y-6">
        {/* Step progress */}
        <div className="glass-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Step {currentStep} of {steps.length}
            </p>
            <p className="text-xs text-muted-foreground">
              {Math.round(((currentStep - 1) / (steps.length - 1)) * 100)}% complete
            </p>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />
          </div>

          {/* Step indicators */}
          <div className="flex items-center justify-between">
            {steps.map((step, idx) => {
              const isCompleted = currentStep > step.id;
              const isActive = currentStep === step.id;
              return (
                <div key={`step-indicator-${step.id}`} className="flex flex-col items-center gap-1.5 flex-1">
                  <button
                    onClick={() => isCompleted && setCurrentStep(step.id)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isCompleted
                        ? 'bg-success border-2 border-success cursor-pointer hover:scale-105'
                        : isActive
                        ? 'bg-primary/20 border-2 border-primary neon-glow-primary' :'bg-muted border-2 border-border cursor-default'
                    }`}
                    disabled={!isCompleted}
                    aria-label={`Go to step ${step.id}: ${step.label}`}
                  >
                    {isCompleted ? (
                      <Check size={14} className="text-background" />
                    ) : (
                      <step.icon size={14} className={isActive ? 'text-primary' : 'text-muted-foreground'} />
                    )}
                  </button>
                  <div className="text-center hidden sm:block">
                    <p className={`text-[10px] font-semibold ${isActive ? 'text-primary' : isCompleted ? 'text-success' : 'text-muted-foreground'}`}>
                      {step.label}
                    </p>
                    <p className="text-[9px] text-muted-foreground hidden md:block">{step.description}</p>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`hidden sm:block absolute`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step content */}
        <div className="glass-card rounded-xl border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center gap-3">
            {React.createElement(steps[currentStep - 1].icon, { size: 16, className: 'text-primary' })}
            <div>
              <h3 className="text-sm font-bold text-foreground">{steps[currentStep - 1].label}</h3>
              <p className="text-xs text-muted-foreground">{steps[currentStep - 1].description}</p>
            </div>
          </div>

          <div className="p-6">
            {currentStep === 1 && <StepIncidentDetails form={form} />}
            {currentStep === 2 && <StepFinancialLoss form={form} />}
            {currentStep === 3 && <StepEvidence form={form} />}
            {currentStep === 4 && <StepReviewExport form={form} generatedComplaint={generatedComplaint} />}
          </div>

          {/* Navigation buttons */}
          <div className="px-6 py-4 border-t border-border flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 active:scale-95 ${
                currentStep === 1
                  ? 'opacity-40 cursor-not-allowed text-muted-foreground border border-border'
                  : 'text-foreground border border-border hover:bg-muted'
              }`}
            >
              <ChevronLeft size={15} />
              Back
            </button>

            {currentStep < 4 && (
              <button
                onClick={handleNext}
                disabled={isGenerating}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-150 active:scale-95 ${
                  isGenerating
                    ? 'bg-primary/50 text-primary-foreground cursor-not-allowed'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90 neon-glow-primary'
                }`}
              >
                {isGenerating ? (
                  <><Loader2 size={15} className="animate-spin" /> Generating Complaint...</>
                ) : (
                  <>{currentStep === 3 ? 'Generate Complaint' : 'Continue'}<ChevronRight size={15} /></>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Preview panel */}
      <div className="xl:col-span-2">
        <ComplaintPreviewPanel formData={watchedValues} generatedComplaint={generatedComplaint} currentStep={currentStep} />
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