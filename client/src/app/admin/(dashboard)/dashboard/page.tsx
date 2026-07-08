'use client';
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Users, FileSearch, AlertCircle, Activity, TrendingUp, Shield } from 'lucide-react';

export default function AdminDashboard() {
  const { user, profile, role } = useAuth();

  const stats = [
    { label: 'Total Users', value: '1,248', change: '+12%', icon: Users, color: 'text-blue-500' },
    { label: 'Scans Performed', value: '8,439', change: '+24%', icon: FileSearch, color: 'text-green-500' },
    { label: 'Complaints', value: '156', change: '-5%', icon: AlertCircle, color: 'text-amber-500' },
    { label: 'Active Threats', value: '42', change: '+2%', icon: Activity, color: 'text-red-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
          <p className="text-sm text-gray-400 mt-1">
            Welcome back, {profile?.full_name || user?.email}. Here is what's happening today.
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-[#1A1A1A] border border-[#333333] rounded-lg px-4 py-2">
          <Shield className="w-4 h-4 text-red-500" />
          <span className="text-sm font-medium text-white">
            Role: <span className="text-red-400 capitalize">{role || 'Admin'}</span>
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-[#111111] border border-[#222222] rounded-xl p-5 hover:border-[#333333] transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-400">{stat.label}</p>
                <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
              </div>
              <div className={`p-2 rounded-lg bg-[#1A1A1A] ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-sm">
              <TrendingUp className={`w-4 h-4 ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`} />
              <span className={stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500 font-medium'}>
                {stat.change}
              </span>
              <span className="text-gray-500">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#111111] border border-[#222222] rounded-xl p-5">
          <h3 className="text-base font-semibold text-white mb-4">Recent Scan Activity</h3>
          <div className="h-64 flex items-center justify-center border border-dashed border-[#333333] rounded-lg bg-[#1A1A1A]">
            <p className="text-gray-500 text-sm">Scan activity chart will be implemented here.</p>
          </div>
        </div>
        
        <div className="bg-[#111111] border border-[#222222] rounded-xl p-5">
          <h3 className="text-base font-semibold text-white mb-4">Top Threats</h3>
          <div className="h-64 flex items-center justify-center border border-dashed border-[#333333] rounded-lg bg-[#1A1A1A]">
            <p className="text-gray-500 text-sm">Threat distribution chart.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
