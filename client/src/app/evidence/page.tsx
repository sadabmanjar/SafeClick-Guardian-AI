import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import EvidenceLockerScreen from '@/features/evidence/components/EvidenceLockerScreen';

export default function EvidencePage() {
  return (
    <AppLayout activeRoute="/evidence">
      <EvidenceLockerScreen />
    </AppLayout>
  );
}
