import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import LearningScreen from '@/features/learning/components/LearningScreen';

export default function LearningPage() {
  return (
    <AppLayout activeRoute="/learning">
      <LearningScreen />
    </AppLayout>
  );
}
