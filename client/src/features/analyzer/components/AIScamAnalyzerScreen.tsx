import React from 'react';
import AnalyzerInputPanel from './AnalyzerInputPanel';
import AnalyzerResultPanel from './AnalyzerResultPanel';
import AnalyzerHistory from './AnalyzerHistory';
import AnalyzerStats from './AnalyzerStats';

export default function AIScamAnalyzerScreen() {
  return (
    <div className="space-y-6 pb-24 lg:pb-8 text-gray-900">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            AI Scam Analyzer
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Paste suspicious content or upload a screenshot — get an instant AI risk assessment
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg text-green-700">
          <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider">AI Engine Online</span>
        </div>
      </div>

      {/* Stats Row */}
      <AnalyzerStats />

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Input + Result Panel */}
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