import React from 'react';
import AnalyzerInputPanel from './AnalyzerInputPanel';
import AnalyzerResultPanel from './AnalyzerResultPanel';
import AnalyzerHistory from './AnalyzerHistory';
import AnalyzerStats from './AnalyzerStats';

export default function AIScamAnalyzerScreen() {
  return (
    <div className="space-y-6 pb-24 lg:pb-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            AI Scam Analyzer
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Paste suspicious content or upload a screenshot — get an instant AI risk assessment
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 glass-card rounded-lg border border-success/20">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs font-medium text-success">AI Engine Online</span>
        </div>
      </div>

      {/* Stats row */}
      <AnalyzerStats />

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Input + Result — spans 2 cols */}
        <div className="xl:col-span-2 space-y-6">
          <AnalyzerInputPanel />
          <AnalyzerResultPanel />
        </div>

        {/* History sidebar */}
        <div className="xl:col-span-1">
          <AnalyzerHistory />
        </div>
      </div>
    </div>
  );
}