'use client';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
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
      <div className="glass-card rounded-xl border border-border p-10 flex flex-col items-center justify-center text-center min-h-[240px]">
        <div className="w-16 h-16 rounded-2xl bg-muted border border-border flex items-center justify-center mb-4">
          <Brain size={28} className="text-muted-foreground" />
        </div>
        <h3 className="text-base font-semibold text-foreground mb-2">Awaiting Analysis</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Paste suspicious content in the analyzer above and click <strong className="text-primary">Analyze Now</strong> to get an instant AI risk assessment
        </p>
      </div>
    );
  }

  const riskLevelConfig = {
    safe: { label: 'Safe', color: 'text-success', bg: 'bg-success/10 border-success/20', icon: CheckCircle, iconColor: 'text-success' },
    low: { label: 'Low Risk', color: 'text-success', bg: 'bg-success/10 border-success/20', icon: CheckCircle, iconColor: 'text-success' },
    medium: { label: 'Medium Risk', color: 'text-warning', bg: 'bg-warning/10 border-warning/20', icon: AlertTriangle, iconColor: 'text-warning' },
    high: { label: 'High Risk', color: 'text-danger', bg: 'bg-danger/10 border-danger/20', icon: AlertTriangle, iconColor: 'text-danger' },
    critical: { label: 'CRITICAL', color: 'text-danger', bg: 'bg-danger/20 border-danger/40', icon: AlertTriangle, iconColor: 'text-danger' },
  };

  const config = riskLevelConfig[result.riskLevel];
  const ResultIcon = config.icon;

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'tricks', label: `Psych Tricks (${result.psychologicalTricks.length})` },
    { id: 'flags', label: `Red Flags (${result.redFlags.length})` },
    { id: 'actions', label: 'Actions' },
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

    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `safeclick-report-${result.analysisId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Security report downloaded successfully (PDF format)');
  };

  return (
    <div className={`glass-card rounded-xl border overflow-hidden float-up ${config.bg}`}>
      {/* Result header */}
      <div className={`px-5 py-4 border-b border-border flex items-center gap-4`}>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${config.bg} border`}>
          <ResultIcon size={22} className={config.iconColor} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base font-bold text-foreground">Analysis Complete</h2>
            <StatusBadge
              variant={result.riskLevel === 'safe' || result.riskLevel === 'low' ? 'safe' : result.riskLevel === 'medium' ? 'medium' : 'high'}
              label={config.label}
              dot
            />
          </div>
          <p className="text-sm text-muted-foreground mt-0.5 truncate">
            {result.scamType} · ID: <span className="font-mono-data text-xs">{result.analysisId}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleCopyReport}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            title="Copy analysis report"
          >
            <Copy size={15} className="text-muted-foreground" />
          </button>
          <button
            onClick={handleExportPDF}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            title="Export as PDF"
          >
            <FileText size={15} className="text-muted-foreground" />
          </button>
          <button
            onClick={() => toast.info('Share feature — connect to share API')}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            title="Share report"
          >
            <Share2 size={15} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Score + confidence row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border-b border-border">
        {/* Risk gauge */}
        <div className="sm:col-span-1 flex flex-col items-center justify-center p-5 border-b sm:border-b-0 sm:border-r border-border">
          <RiskGaugeChart score={result.riskScore} riskLevel={result.riskLevel} />
        </div>

        {/* Metrics */}
        <div className="sm:col-span-2 grid grid-cols-2 divide-x divide-y divide-border">
          <div className="p-4 flex flex-col justify-center">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-1">AI Confidence</p>
            <p className={`text-3xl font-bold font-mono-data ${config.color}`}>{result.confidence}%</p>
            <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  result.confidence > 85 ? 'bg-success' : result.confidence > 65 ? 'bg-warning' : 'bg-danger'
                }`}
                style={{ width: `${result.confidence}%` }}
              />
            </div>
          </div>
          <div className="p-4 flex flex-col justify-center">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-1">Scam Category</p>
            <p className="text-sm font-bold text-foreground leading-snug">{result.scamType}</p>
          </div>
          <div className="p-4 flex flex-col justify-center">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-1">Red Flags Found</p>
            <p className={`text-3xl font-bold font-mono-data ${result.redFlags.length > 0 ? 'text-danger' : 'text-success'}`}>
              {result.redFlags.length}
            </p>
          </div>
          <div className="p-4 flex flex-col justify-center">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-1">Psych Tricks</p>
            <p className={`text-3xl font-bold font-mono-data ${result.psychologicalTricks.length > 0 ? 'text-warning' : 'text-success'}`}>
              {result.psychologicalTricks.length}
            </p>
          </div>
        </div>
      </div>

      {/* Section tabs */}
      <div className="flex border-b border-border overflow-x-auto scrollbar-cyber">
        {sections.map((section) => (
          <button
            key={`result-section-${section.id}`}
            onClick={() => setActiveSection(section.id as typeof activeSection)}
            className={`px-4 py-3 text-xs font-semibold whitespace-nowrap transition-all duration-150 border-b-2 ${
              activeSection === section.id
                ? 'border-primary text-primary bg-primary/5' :'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Section content */}
      <div className="p-5">
        {activeSection === 'overview' && (
          <div className="space-y-4 float-up">
            <div className="glass-card-elevated rounded-lg p-4 border border-border">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">AI Explanation</p>
              <p className="text-sm text-foreground leading-relaxed">{result.explanation}</p>
            </div>
            {result.riskLevel !== 'safe' && result.riskLevel !== 'low' && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-danger/10 border border-danger/20">
                <AlertTriangle size={16} className="text-danger flex-shrink-0 mt-0.5" />
                <p className="text-xs text-danger font-medium">
                  Do NOT share OTP, password, or transfer money. Call <strong>1930</strong> immediately if you have already engaged with this content.
                </p>
              </div>
            )}
          </div>
        )}

        {activeSection === 'tricks' && (
          <div className="space-y-3 float-up">
            {result.psychologicalTricks.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle size={32} className="text-success mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No psychological manipulation tactics detected</p>
              </div>
            ) : (
              result.psychologicalTricks.map((trick, i) => (
                <div
                  key={`trick-${result.analysisId}-${i}`}
                  className="flex items-start gap-3 p-3 rounded-lg bg-warning/5 border border-warning/15"
                >
                  <div className="w-6 h-6 rounded-full bg-warning/20 border border-warning/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-warning">{i + 1}</span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{trick}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeSection === 'flags' && (
          <div className="space-y-3 float-up">
            {result.redFlags.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle size={32} className="text-success mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No red flags detected in this content</p>
              </div>
            ) : (
              result.redFlags.map((flag, i) => (
                <div
                  key={`flag-${result.analysisId}-${i}`}
                  className="flex items-start gap-3 p-3 rounded-lg bg-danger/5 border border-danger/15"
                >
                  <Flag size={14} className="text-danger flex-shrink-0 mt-1" />
                  <p className="text-sm text-foreground leading-relaxed">{flag}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeSection === 'actions' && (
          <div className="space-y-3 float-up">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-3">Recommended Actions</p>
            {result.recommendedActions.map((action, i) => (
              <div
                key={`action-${result.analysisId}-${i}`}
                className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/15 hover:border-primary/30 transition-colors cursor-default"
              >
                <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold text-primary">{i + 1}</span>
                </div>
                <p className="text-sm text-foreground leading-relaxed flex-1">{action}</p>
                <ChevronRight size={14} className="text-muted-foreground flex-shrink-0 mt-1" />
              </div>
            ))}

            <div className="flex gap-3 mt-4 pt-4 border-t border-border">
              <a
                href="/complaint-generator"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all duration-150 active:scale-95 neon-glow-primary"
              >
                <FileText size={15} />
                File Complaint
              </a>
              <a
                href="/emergency-mode"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-danger/15 text-danger border border-danger/30 text-sm font-semibold hover:bg-danger/25 transition-all duration-150 active:scale-95"
              >
                <AlertTriangle size={15} />
                Emergency Help
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}