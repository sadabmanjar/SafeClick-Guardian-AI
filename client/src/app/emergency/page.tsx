import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import EmergencyModeScreen from '@/features/emergency/components/EmergencyModeScreen';

export default function EmergencyPage() {
  return (
    <AppLayout activeRoute="/emergency">
      <EmergencyModeScreen />
    </AppLayout>
  );
}
