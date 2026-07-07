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

export type AnalysisResult = {
  riskScore: number;
  riskLevel: 'safe' | 'low' | 'medium' | 'high' | 'critical';
  scamType: string;
  confidence: number;
  explanation: string;
  psychologicalTricks: string[];
  redFlags: string[];
  recommendedActions: string[];
  analysisId: string;
};

// Mock analysis results for demo
const mockResults: Record<string, AnalysisResult> = {
  high: {
    riskScore: 87,
    riskLevel: 'high',
    scamType: 'UPI / Banking Phishing',
    confidence: 94,
    explanation: 'This message exhibits multiple high-risk indicators of a banking phishing scam. The message uses urgency tactics ("claim now"), contains a suspicious non-official domain (sbi-reward.xyz instead of sbi.co.in), and requests sensitive action (OTP sharing). The URL pattern matches known phishing infrastructure targeting Indian banking customers.',
    psychologicalTricks: [
      'False urgency — "claim now" creates time pressure to bypass rational thinking',
      'Authority impersonation — claims to be from SBI (trusted institution)',
      'Reward baiting — large cashback amount triggers greed response',
      'Social proof — "selected" implies exclusivity and legitimacy',
    ],
    redFlags: [
      'Non-official domain: sbi-reward.xyz (official: sbi.co.in)',
      'Unsolicited cashback offer with no prior transaction',
      'OTP included in message — banks never send OTPs unsolicited',
      'Clickable link leading to unknown domain',
      'No official SBI branding or reference number',
    ],
    recommendedActions: [
      'Do NOT click the link or share the OTP',
      'Block and report the sender number immediately',
      'Report to SBI Cyber Cell: 1800-11-2211',
      'File complaint on cybercrime.gov.in (NCRP portal)',
      'Call 1930 if you have already clicked or shared details',
    ],
    analysisId: 'SCAN-2026-001847',
  },
  medium: {
    riskScore: 54,
    riskLevel: 'medium',
    scamType: 'Fake Job Offer',
    confidence: 78,
    explanation: 'This message shows characteristics of a fake job offer scam. While some elements appear legitimate, the offer of high salary with minimal qualifications and request for upfront fees are classic indicators of employment fraud.',
    psychologicalTricks: [
      'Financial desperation exploitation — targets job seekers',
      'Too-good-to-be-true salary offer to bypass critical thinking',
      'Urgency — "limited positions" creates artificial scarcity',
    ],
    redFlags: [
      'Salary offer significantly above market rate',
      'Request for registration fee or security deposit',
      'Generic job description with no company verification',
    ],
    recommendedActions: [
      'Verify company on MCA21 portal (mca.gov.in)',
      'Never pay any upfront fees for job offers',
      'Check company reviews on LinkedIn/Glassdoor',
      'Report suspicious job offers to police',
    ],
    analysisId: 'SCAN-2026-001848',
  },
  safe: {
    riskScore: 8,
    riskLevel: 'safe',
    scamType: 'No Threat Detected',
    confidence: 91,
    explanation: 'This content appears to be legitimate. No phishing patterns, suspicious domains, urgency manipulation, or known scam signatures were detected. The message follows normal communication patterns.',
    psychologicalTricks: [],
    redFlags: [],
    recommendedActions: [
      'Content appears safe — no immediate action required',
      'Always verify sender identity for financial messages',
      'Keep your SafeClick app updated for latest threat patterns',
    ],
    analysisId: 'SCAN-2026-001849',
  },
};

export default function AnalyzerInputPanel() {
  const [activeTab, setActiveTab] = useState('sms');
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
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

    setIsAnalyzing(true);

    // Simulate AI analysis delay — backend integration point
    await new Promise((r) => setTimeout(r, 1800));

    // Determine mock result based on input content
    let result: AnalysisResult;
    const lowerInput = inputText.toLowerCase();
    if (lowerInput.includes('otp') || lowerInput.includes('click') || lowerInput.includes('reward') || lowerInput.includes('cashback') || uploadedFile) {
      result = mockResults.high;
    } else if (lowerInput.includes('job') || lowerInput.includes('salary') || lowerInput.includes('work from home')) {
      result = mockResults.medium;
    } else {
      result = mockResults.safe;
    }

    setIsAnalyzing(false);

    // Dispatch result to sibling via custom event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('scam-analysis-result', { detail: result }));
    }

    toast.success(`Analysis complete — Risk Score: ${result.riskScore}/100`, {
      description: `Scam Type: ${result.scamType}`,
    });
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
    <div className="bg-white rounded-xl border border-gray-250 shadow-sm overflow-hidden text-gray-900">
      {/* Tabs list */}
      <div className="flex items-center gap-0 border-b border-gray-200 bg-gray-50/50 overflow-x-auto scrollbar-cyber">
        {inputTabs.map((tab) => (
          <button
            key={`tab-${tab.id}`}
            onClick={() => { setActiveTab(tab.id); setInputText(''); setUploadedFile(null); }}
            className={`flex items-center gap-2 px-5 py-3.5 text-xs font-bold whitespace-nowrap transition-all duration-150 border-b-2 flex-shrink-0 ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600 bg-white' 
                : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Input area body */}
      <div className="p-5">
        {activeTab === 'screenshot' || activeTab === 'qr' ? (
          <div
            className={`relative border border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer group ${
              uploadedFile
                ? 'border-blue-300 bg-blue-50/10' 
                : 'border-gray-300 hover:border-blue-500 hover:bg-gray-50'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
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
                  className="max-h-48 mx-auto rounded-lg object-contain border border-gray-200"
                />
                <p className="text-xs text-blue-600 font-bold">{uploadedFileName}</p>
                <button
                  onClick={(e) => { e.stopPropagation(); setUploadedFile(null); setUploadedFileName(''); }}
                  className="text-xs text-gray-400 hover:text-red-600 transition-colors"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center mx-auto group-hover:border-blue-400 transition-colors">
                  <Upload size={18} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">
                    {activeTab === 'screenshot' ? 'Upload Screenshot' : 'Upload QR Code Image'}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1 font-medium">
                    Drag & drop or click to browse — PNG, JPG up to 10MB
                  </p>
                </div>
                <div className="flex items-center justify-center gap-4 text-[10px] text-gray-400 font-semibold pt-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    OCR Text Extraction
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
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
              rows={5}
              className="w-full bg-white border border-gray-250 rounded-xl px-4 py-3 text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 resize-none transition-all scrollbar-cyber"
              aria-label={`Enter ${activeTabData.label} content for analysis`}
            />
            {inputText && (
              <button
                onClick={handleClear}
                className="absolute top-3 right-3 p-1 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Clear input"
              >
                <X size={14} className="text-gray-400 hover:text-gray-800" />
              </button>
            )}
            <div className="flex items-center justify-between mt-2 text-[10px] text-gray-400 font-semibold">
              <span>{inputText.length} characters</span>
              <span>Minimum 10 characters required</span>
            </div>
          </div>
        )}

        {/* Try example button */}
        {(activeTab === 'sms' || activeTab === 'url') && !inputText && (
          <button
            onClick={() => setInputText(activeTab === 'sms' 
              ? 'Congratulations! Your SBI account has been selected for ₹50,000 cashback. Click http://sbi-reward.xyz to claim now. Your OTP is 847291. Do not share with anyone.'
              : 'https://sbi-netbanking-secure-login.xyz/verify?token=abc123'
            )}
            className="mt-3 text-xs text-blue-600 hover:underline font-bold transition-colors block text-left"
          >
            Try a demo example →
          </button>
        )}

        {/* Analyze button */}
        <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-100">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              isAnalyzing
                ? 'bg-blue-300 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
            }`}
          >
            {isAnalyzing ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span className="w-28">Analyzing text...</span>
              </>
            ) : (
              <>
                <Zap size={14} />
                Analyze Now
              </>
            )}
          </button>

          {inputText && !isAnalyzing && (
            <button
              onClick={handleClear}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-100 border border-gray-200 transition-colors"
            >
              Clear
            </button>
          )}

          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-[10px] text-gray-400 font-semibold">Powered by</span>
            <span className="text-xs font-bold text-blue-600">Gemini AI</span>
          </div>
        </div>

        {/* Security note */}
        <p className="text-[10px] text-gray-400 font-medium mt-3.5 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
          Government standard zero-storage privacy policy applies.
        </p>
      </div>
    </div>
  );
}