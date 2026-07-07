'use client';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  AlertTriangle,
  CheckCircle,
  Brain,
  Flag,
  ChevronRight,
  Copy,
  FileText,
  Share2,
} from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import { toast } from 'sonner';
import type { AnalysisResult } from './AnalyzerInputPanel';

const RiskGaugeChart = dynamic(() => import('./RiskGaugeChart'), { ssr: false });

export default function AnalyzerResultPanel() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeSection, setActiveSection] = useState<'overview' | 'tricks' | 'flags' | 'actions'>('overview');

  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<AnalysisResult | null>;
      setResult(custom.detail);
      setActiveSection('overview');
    };
    window.addEventListener('scam-analysis-result', handler);
    return () => window.removeEventListener('scam-analysis-result', handler);
  }, []);

  if (!result) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 flex flex-col items-center justify-center text-center min-h-[220px] shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center mb-4">
          <Brain size={20} className="text-gray-400" />
        </div>
        <h3 className="text-sm font-bold text-gray-900 mb-1">Awaiting Scan Input</h3>
        <p className="text-xs text-gray-400 max-w-sm font-medium">
          Paste content or upload a threat screenshot above and click <strong className="text-blue-600">Analyze Now</strong> to trigger AI evaluation.
        </p>
      </div>
    );
  }

  const riskLevelConfig = {
    safe: { label: 'Safe', color: 'text-green-600', bg: 'bg-green-50 border-green-200', icon: CheckCircle, iconColor: 'text-green-600' },
    low: { label: 'Low Risk', color: 'text-green-600', bg: 'bg-green-50 border-green-200', icon: CheckCircle, iconColor: 'text-green-600' },
    medium: { label: 'Medium Risk', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', icon: AlertTriangle, iconColor: 'text-amber-600' },
    high: { label: 'High Risk', color: 'text-red-600', bg: 'bg-red-50 border-red-200', icon: AlertTriangle, iconColor: 'text-red-600' },
    critical: { label: 'CRITICAL', color: 'text-red-600', bg: 'bg-red-50 border-red-300', icon: AlertTriangle, iconColor: 'text-red-600' },
  };

  const config = riskLevelConfig[result.riskLevel];
  const ResultIcon = config.icon;

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'tricks', label: `Tactics (${result.psychologicalTricks.length})` },
    { id: 'flags', label: `Red Flags (${result.redFlags.length})` },
    { id: 'actions', label: 'Recommended Actions' },
  ];

  const handleCopyReport = () => {
    const report = `SafeClick Guardian AI — Scam Analysis Report
Analysis ID: ${result.analysisId}
Risk Score: ${result.riskScore}/100 (${result.riskLevel.toUpperCase()})
Scam Type: ${result.scamType}
AI Confidence: ${result.confidence}%

${result.explanation}

Red Flags: ${result.redFlags.join(', ')}
Recommended Actions: ${result.recommendedActions.join(' | ')}`;
    navigator.clipboard.writeText(report);
    toast.success('Analysis report copied to clipboard');
  };

  const handleExportPDF = () => {
    const content = `==================================================
SAFECLICK GUARDIAN AI - INCIDENT REPORT
==================================================
Analysis ID: ${result.analysisId}
Scam Category: ${result.scamType}
Risk Assessment: ${result.riskScore}/100 (${result.riskLevel.toUpperCase()})
AI Confidence Score: ${result.confidence}%
--------------------------------------------------
EXPLANATION:
${result.explanation}
--------------------------------------------------
RED FLAGS DETECTED:
${result.redFlags.map((flag, i) => `${i + 1}. ${flag}`).join('\n')}
--------------------------------------------------
PSYCHOLOGICAL TACTICS:
${result.psychologicalTricks.map((trick, i) => `${i + 1}. ${trick}`).join('\n')}
--------------------------------------------------
RECOMMENDED CONTAINMENT ACTIONS:
${result.recommendedActions.map((action, i) => `${i + 1}. ${action}`).join('\n')}
==================================================
Report Generated on ${new Date().toLocaleString()}
SafeClick Security National Hackathon Project
==================================================`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `safeclick-report-${result.analysisId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Security report downloaded successfully (TXT format)');
  };

  return (
    <div className={`bg-white rounded-xl border shadow-sm overflow-hidden text-gray-900 ${config.bg}`}>
      {/* Header section */}
      <div className="px-5 py-4 border-b border-gray-150 bg-white flex items-center gap-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border ${config.bg}`}>
          <ResultIcon size={18} className={config.iconColor} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-sm font-bold text-gray-900">Security Assessment</h2>
            <StatusBadge
              variant={result.riskLevel === 'safe' || result.riskLevel === 'low' ? 'safe' : result.riskLevel === 'medium' ? 'medium' : 'high'}
              label={config.label}
              dot
            />
          </div>
          <p className="text-xs text-gray-400 mt-0.5 font-medium">
            {result.scamType} · Ref: <span className="font-mono">{result.analysisId}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleCopyReport}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors"
            title="Copy Report"
          >
            <Copy size={14} />
          </button>
          <button
            onClick={handleExportPDF}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors"
            title="Download Report"
          >
            <FileText size={14} />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 border-b border-gray-150 bg-white">
        <div className="p-5 flex flex-col items-center justify-center bg-gray-50/30">
          <RiskGaugeChart score={result.riskScore} riskLevel={result.riskLevel} />
        </div>
        <div className="sm:col-span-2 grid grid-cols-2 divide-x divide-y divide-gray-100">
          <div className="p-4 flex flex-col justify-center bg-white">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Confidence</p>
            <p className={`text-2xl font-bold font-mono mt-0.5 ${config.color}`}>{result.confidence}%</p>
            <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  result.confidence > 85 ? 'bg-green-600' : result.confidence > 65 ? 'bg-amber-500' : 'bg-red-600'
                }`}
                style={{ width: `${result.confidence}%` }}
              />
            </div>
          </div>
          <div className="p-4 flex flex-col justify-center bg-white">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Threat Vector</p>
            <p className="text-xs font-bold text-gray-900 mt-1 leading-snug">{result.scamType}</p>
          </div>
          <div className="p-4 flex flex-col justify-center bg-white">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Red Flags</p>
            <p className={`text-2xl font-bold font-mono mt-0.5 ${result.redFlags.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {result.redFlags.length}
            </p>
          </div>
          <div className="p-4 flex flex-col justify-center bg-white">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Manipulation Tactics</p>
            <p className={`text-2xl font-bold font-mono mt-0.5 ${result.psychologicalTricks.length > 0 ? 'text-amber-500' : 'text-green-600'}`}>
              {result.psychologicalTricks.length}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 bg-gray-50/50 overflow-x-auto scrollbar-cyber">
        {sections.map((section) => (
          <button
            key={`result-section-${section.id}`}
            onClick={() => setActiveSection(section.id as typeof activeSection)}
            className={`px-4 py-3 text-xs font-bold whitespace-nowrap transition-all duration-150 border-b-2 ${
              activeSection === section.id
                ? 'border-blue-600 text-blue-600 bg-white' 
                : 'border-transparent text-gray-400 hover:text-gray-900'
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Sections Body */}
      <div className="p-5 bg-white">
        {activeSection === 'overview' && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Detailed Explanation</p>
              <p className="text-xs text-gray-700 leading-relaxed font-medium">{result.explanation}</p>
            </div>
            {result.riskLevel !== 'safe' && result.riskLevel !== 'low' && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-100 text-red-700">
                <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                <p className="text-xs font-bold">
                  DO NOT share OTP codes, input account passkeys, or execute transfers. Report this immediately to the National Cyber Cell helpline (1930).
                </p>
              </div>
            )}
          </div>
        )}

        {activeSection === 'tricks' && (
          <div className="space-y-2.5">
            {result.psychologicalTricks.length === 0 ? (
              <div className="text-center py-6">
                <CheckCircle size={24} className="text-green-600 mx-auto mb-2" />
                <p className="text-xs text-gray-400 font-bold">No psychological manipulation tactics detected</p>
              </div>
            ) : (
              result.psychologicalTricks.map((trick, i) => (
                <div
                  key={`trick-${result.analysisId}-${i}`}
                  className="flex items-start gap-3 p-3 rounded-lg bg-amber-50/50 border border-amber-100"
                >
                  <div className="w-5 h-5 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-amber-700 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-xs text-gray-750 font-medium leading-relaxed">{trick}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeSection === 'flags' && (
          <div className="space-y-2.5">
            {result.redFlags.length === 0 ? (
              <div className="text-center py-6">
                <CheckCircle size={24} className="text-green-600 mx-auto mb-2" />
                <p className="text-xs text-gray-400 font-bold">No security red flags detected</p>
              </div>
            ) : (
              result.redFlags.map((flag, i) => (
                <div
                  key={`flag-${result.analysisId}-${i}`}
                  className="flex items-start gap-3 p-3 rounded-lg bg-red-50/50 border border-red-100"
                >
                  <Flag size={13} className="text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-750 font-medium leading-relaxed">{flag}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeSection === 'actions' && (
          <div className="space-y-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Security Recommendations</p>
            {result.recommendedActions.map((action, i) => (
              <div
                key={`action-${result.analysisId}-${i}`}
                className="flex items-start gap-3 p-3 rounded-lg bg-blue-50/30 border border-blue-100 hover:bg-blue-50 transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-blue-600 mt-0.5">
                  {i + 1}
                </div>
                <p className="text-xs text-gray-800 font-semibold leading-relaxed flex-1">{action}</p>
                <ChevronRight size={13} className="text-gray-400 flex-shrink-0 mt-0.5" />
              </div>
            ))}

            <div className="flex gap-3 mt-4 pt-4 border-t border-gray-150">
              <Link
                href="/complaint"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
              >
                <FileText size={14} />
                Draft Police Complaint
              </Link>
              <Link
                href="/emergency"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold transition-all"
              >
                <AlertTriangle size={14} />
                Emergency Lockdown SOS
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}