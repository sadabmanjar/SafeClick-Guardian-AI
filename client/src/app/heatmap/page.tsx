import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import HeatmapScreen from '@/features/heatmap/components/HeatmapScreen';

export default function HeatmapPage() {
  return (
    <AppLayout activeRoute="/heatmap">
      <HeatmapScreen />
    </AppLayout>
  );
}
