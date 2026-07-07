import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import ComplaintGeneratorScreen from '@/features/complaint/components/ComplaintGeneratorScreen';

export default function ComplaintPage() {
  return (
    <AppLayout activeRoute="/complaint">
      <ComplaintGeneratorScreen />
    </AppLayout>
  );
}
