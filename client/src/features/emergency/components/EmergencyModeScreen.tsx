import React from 'react';
import EmergencyHeroButton from './EmergencyHeroButton';
import EmergencyChecklist from './EmergencyChecklist';
import EmergencyStationCard from './EmergencyStationCard';
import EmergencyQuickForm from './EmergencyQuickForm';
import TrustedContactsPanel from './TrustedContactsPanel';
import PageHeader from '@/components/ui/PageHeader';

export default function EmergencyModeScreen() {
  return (
    <div className="space-y-6 pb-24 lg:pb-8">
      {/* Emergency banner */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-danger/15 border border-danger/30">
        <div className="w-2 h-2 rounded-full bg-danger animate-pulse flex-shrink-0" />
        <p className="text-sm font-semibold text-danger">
          EMERGENCY MODE ACTIVE — If you are currently experiencing cyber fraud, act immediately
        </p>
      </div>

      <PageHeader
        title="Emergency Response"
        subtitle="Immediate help for active cyber fraud — every second counts"
        backHref="/dashboard"
        backLabel="Dashboard"
      />

      {/* Primary emergency action + checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Hero emergency button — takes more space */}
        <div className="lg:col-span-2">
          <EmergencyHeroButton />
        </div>

        {/* Emergency checklist */}
        <div className="lg:col-span-3">
          <EmergencyChecklist />
        </div>
      </div>

      {/* Station + quick form + trusted contacts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <EmergencyStationCard />
        </div>
        <div className="lg:col-span-1">
          <TrustedContactsPanel />
        </div>
        <div className="lg:col-span-1">
          <EmergencyQuickForm />
        </div>
      </div>
    </div>
  );
}