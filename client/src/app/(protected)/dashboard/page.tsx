import React from 'react';
import StatsGrid from '@/features/dashboard/components/StatsGrid';
import CyberScoreCard from '@/features/dashboard/components/CyberScoreCard';
import QuickActionsPanel from '@/features/dashboard/components/QuickActionsPanel';
import RecentScansList from '@/features/dashboard/components/RecentScansList';
import RecentComplaintsList from '@/features/dashboard/components/RecentComplaintsList';
import ThreatFeedsList from '@/features/dashboard/components/ThreatFeedsList';

export default function DashboardPage() {
  return (
    <div className="space-y-6 pb-12 text-gray-900">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Security Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Hi Rahul Sharma • System status online & monitoring threat feeds.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg text-green-700">
          <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider">Shield Active</span>
        </div>
      </div>

      {/* Core Stats Row */}
      <StatsGrid />

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Cyber score and Quick actions */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          <CyberScoreCard score={82} />
          <QuickActionsPanel />
        </div>

        {/* Audit Feed (Recent Scans) */}
        <div className="xl:col-span-2">
          <RecentScansList />
        </div>
      </div>

      {/* Bottom Ledger Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentComplaintsList />
        <ThreatFeedsList />
      </div>
    </div>
  );
}
