import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import AIScamAnalyzerScreen from '@/features/analyzer/components/AIScamAnalyzerScreen';

export default function AIScamAnalyzerPage() {
  return (
    <AppLayout activeRoute="/analyze">
      <AIScamAnalyzerScreen />
    </AppLayout>
  );
}
