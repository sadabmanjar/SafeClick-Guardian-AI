'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import {
  Download, Printer, ShieldAlert, RefreshCw, AlertTriangle,
  TrendingUp, Search, FileSpreadsheet, Database, MapPin,
  Users, Activity, Shield, ChevronUp, ChevronDown, Clock
} from 'lucide-react';
import { api } from '@/lib/axios';
import { toast } from 'sonner';
import BackButton from '@/components/ui/BackButton';
import PageLoader from '@/components/ui/PageLoader';

const MpHeatmap = dynamic(() => import('../../heatmap/components/MpHeatmap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center min-h-[300px]">
      <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin" />
    </div>
  )
});

interface DistrictData {
  districtId: string; districtName: string; geoJsonId: string;
  totalCases: number; financialLoss: number; riskScore: number;
  commonScam: string; recentIncidents: number; nearbyStation: string;
  lastUpdated: string | Date;
}

interface IncidentData {
  title: string; district: string; source: string; date: string | Date;
  scamType: string; financialLoss: number; description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

interface ChartMetrics {
  topDistricts: { name: string; score: number; cases: number }[];
  casesPerDistrict: { district: string; cases: number; loss: number }[];
  scamDistribution: { category: string; count: number }[];
  casesPerMonth: { month: string; cases: number }[];
  financialLossTrend: { month: string; loss: number }[];
}

const PIE_COLORS = ['#3b82f6', '#ef4444', '#f97316', '#8b5cf6', '#10b981', '#eab308', '#ec4899'];

const RISK_CONFIG = {
  critical: { bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-700',    dot: 'bg-red-500',    badge: 'bg-red-100 text-red-700' },
  high:     { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', dot: 'bg-orange-500', badge: 'bg-orange-100 text-orange-700' },
  medium:   { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', dot: 'bg-yellow-400', badge: 'bg-yellow-100 text-yellow-700' },
  low:      { bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-700',  dot: 'bg-green-500',  badge: 'bg-green-100 text-green-700' },
};

function riskConfig(score: number) {
  if (score >= 76) return { ...RISK_CONFIG.critical, label: 'Critical' };
  if (score >= 51) return { ...RISK_CONFIG.high,     label: 'High' };
  if (score >= 31) return { ...RISK_CONFIG.medium,   label: 'Medium' };
  return { ...RISK_CONFIG.low, label: 'Low' };
}

function formatLoss(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000)     return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n}`;
}

export default function PoliceDashboardScreen() {
  const [districts, setDistricts]   = useState<DistrictData[]>([]);
  const [incidents, setIncidents]   = useState<IncidentData[]>([]);
  const [charts, setCharts]         = useState<ChartMetrics>({ topDistricts: [], casesPerDistrict: [], scamDistribution: [], casesPerMonth: [], financialLossTrend: [] });
  const [stats, setStats] = useState({ totalCases: 0, activeHighRisk: 0, totalLoss: 0, mostTargetedDistrict: '—', mostCommonScam: '—', highestRiskScore: 0 });
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [ingesting, setIngesting]   = useState(false);
  const [loading, setLoading]       = useState(true);

  const fetchAll = async () => {
    try {
      const [dRes, sRes, iRes, cRes] = await Promise.all([
        api.get('/heatmap/districts'), api.get('/heatmap/stats'),
        api.get('/heatmap/incidents'), api.get('/heatmap/charts'),
      ]);
      if (dRes.data?.status === 'success') setDistricts(dRes.data.data);
      if (sRes.data?.status === 'success') setStats(sRes.data.data);
      if (iRes.data?.status === 'success') setIncidents(iRes.data.data);
      if (cRes.data?.status === 'success') setCharts(cRes.data.data);
    } catch { toast.error('Failed to load police telemetry.'); }
    finally   { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleIngest = async () => {
    setIngesting(true);
    try {
      const res = await api.post('/heatmap/ingest');
      if (res.data?.status === 'success') {
        toast.success(`Parsed ${res.data.count} news alerts.`);
        fetchAll();
      }
    } catch { toast.error('Ingestion agent failed.'); }
    finally   { setIngesting(false); }
  };

  const sortedDistricts = useMemo(() =>
    [...districts].sort((a, b) => b.riskScore - a.riskScore), [districts]
  );

  const filteredDistricts = useMemo(() =>
    sortedDistricts.filter(d => d.districtName.toLowerCase().includes(searchQuery.toLowerCase())),
    [sortedDistricts, searchQuery]
  );

  const criticalAlerts = useMemo(() =>
    incidents.filter(i => i.priority === 'critical' || i.priority === 'high').slice(0, 6),
    [incidents]
  );

  const exportCSV = () => {
    const headers = ['Rank', 'District', 'Risk Score', 'Cases', 'Loss (INR)', 'Top Scam', 'Police Cell'];
    const rows = sortedDistricts.map((d, i) =>
      [i+1, `"${d.districtName}"`, d.riskScore, d.totalCases, d.financialLoss, `"${d.commonScam}"`, `"${d.nearbyStation}"`].join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `mp_cyber_threat_${Date.now()}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    toast.success('CSV report downloaded.');
  };

  const kpis = [
    { label: 'Total Cases',        value: stats.totalCases.toLocaleString(), icon: Database,   color: 'text-blue-600',   bg: 'bg-blue-50 border-blue-100' },
    { label: 'High Risk Zones',    value: String(stats.activeHighRisk),      icon: ShieldAlert, color: 'text-red-600',    bg: 'bg-red-50 border-red-100' },
    { label: 'Financial Loss',     value: formatLoss(stats.totalLoss),       icon: TrendingUp,  color: 'text-orange-600', bg: 'bg-orange-50 border-orange-100' },
    { label: 'Most Targeted',      value: stats.mostTargetedDistrict,        icon: MapPin,      color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100' },
    { label: 'Peak Risk Score',    value: `${stats.highestRiskScore}/100`,   icon: Activity,    color: 'text-red-600',    bg: 'bg-red-50 border-red-100' },
    { label: 'Top Scam Type',      value: stats.mostCommonScam,              icon: AlertTriangle,color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-100' },
  ];

  if (loading) return <PageLoader message="Loading police command data..." />;

  return (
    <div className="space-y-6 pb-24 lg:pb-8 print:space-y-4">

      {/* Back + Header */}
      <div className="print:hidden">
        <BackButton label="Dashboard" href="/dashboard" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:block">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0">
            <Shield size={20} className="text-red-600" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">Police Command Dashboard</h1>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Law enforcement cyber intelligence · MP State Police</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap print:hidden">
          <button onClick={handleIngest} disabled={ingesting}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-50 active:scale-95 disabled:opacity-50 transition-all shadow-sm">
            <RefreshCw size={12} className={ingesting ? 'animate-spin' : ''} />
            {ingesting ? 'Scanning...' : 'Trigger News Scan'}
          </button>
          <button onClick={exportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold active:scale-95 transition-all shadow-sm">
            <Download size={12} /> Export CSV
          </button>
          <button onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-50 active:scale-95 transition-all shadow-sm">
            <Printer size={12} /> Print Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {kpis.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-9 h-9 rounded-lg border ${bg} flex items-center justify-center mb-3`}>
              <Icon size={16} className={color} />
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none">{label}</p>
            <p className={`text-base font-black mt-1 truncate ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Main 3-column grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* ── District Rankings Table ── */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Threat Standings</h3>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">All 52 MP districts ranked by risk</p>
            </div>
            <span className="text-[10px] font-mono font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">{districts.length} zones</span>
          </div>

          <div className="px-4 py-3 border-b border-gray-100">
            <div className="relative">
              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search district..."
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full h-8 pl-8 pr-3 rounded-lg bg-gray-50 border border-gray-200 text-xs font-medium text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto" style={{ maxHeight: '480px' }}>
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-2.5 text-left font-bold text-gray-400 uppercase tracking-wider text-[9px]">#</th>
                  <th className="px-2 py-2.5 text-left font-bold text-gray-400 uppercase tracking-wider text-[9px]">District</th>
                  <th className="px-2 py-2.5 text-center font-bold text-gray-400 uppercase tracking-wider text-[9px]">Score</th>
                  <th className="px-2 py-2.5 text-right font-bold text-gray-400 uppercase tracking-wider text-[9px]">Cases</th>
                  <th className="px-4 py-2.5 text-right font-bold text-gray-400 uppercase tracking-wider text-[9px]">Loss</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredDistricts.map((d, idx) => {
                  const rc = riskConfig(d.riskScore);
                  const isSel = selectedDistrict === d.districtName;
                  return (
                    <tr key={d.districtId}
                      onClick={() => setSelectedDistrict(isSel ? null : d.districtName)}
                      className={`cursor-pointer transition-colors hover:bg-blue-50 ${isSel ? 'bg-blue-50' : ''}`}
                    >
                      <td className="px-4 py-3 text-gray-400 font-mono text-[10px]">{idx + 1}</td>
                      <td className="px-2 py-3">
                        <p className="font-bold text-gray-800 truncate max-w-[100px]">{d.districtName}</p>
                        <p className="text-[9px] text-gray-400">{d.commonScam}</p>
                      </td>
                      <td className="px-2 py-3 text-center">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${rc.badge}`}>
                          {d.riskScore}
                        </span>
                      </td>
                      <td className="px-2 py-3 text-right font-mono text-[10px] text-gray-600 font-bold">{d.totalCases}</td>
                      <td className="px-4 py-3 text-right font-mono text-[10px] text-orange-600 font-bold">{formatLoss(d.financialLoss)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Centre: Map + Priority Alerts ── */}
        <div className="flex flex-col gap-4">
          {/* Mini Map */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden" style={{ height: '280px' }}>
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <MapPin size={13} className="text-red-500" />
              <h3 className="text-sm font-bold text-gray-900">Live Threat Map</h3>
              <span className="ml-auto flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] text-green-600 font-bold">LIVE</span>
              </span>
            </div>
            <div style={{ height: 'calc(100% - 45px)' }}>
              <MpHeatmap
                districtsData={districts}
                onDistrictSelect={name => setSelectedDistrict(p => p === name ? null : name)}
                selectedDistrict={selectedDistrict}
              />
            </div>
          </div>

          {/* Priority Alerts */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex-1 flex flex-col">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <AlertTriangle size={13} className="text-red-500" />
              <h3 className="text-sm font-bold text-gray-900">Critical Alert Queue</h3>
              <span className="ml-auto text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                {criticalAlerts.length} active
              </span>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-gray-50" style={{ maxHeight: '220px' }}>
              {criticalAlerts.length === 0 ? (
                <div className="flex items-center justify-center py-10 text-xs text-gray-400 font-medium">
                  No critical alerts queued.
                </div>
              ) : criticalAlerts.map((alert, idx) => {
                const rc = RISK_CONFIG[alert.priority];
                return (
                  <div key={idx} className={`flex items-start gap-3 px-4 py-3 ${rc.bg}`}>
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${rc.dot}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-800 truncate">{alert.title}</p>
                      <p className="text-[10px] text-gray-500 font-medium mt-0.5 truncate">{alert.district} · {alert.scamType}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${rc.badge}`}>
                        {alert.priority}
                      </span>
                      <span className="text-[9px] text-orange-600 font-bold">{formatLoss(alert.financialLoss)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Right: Charts Column ── */}
        <div className="flex flex-col gap-4">

          {/* Line chart: Monthly Trend */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <Activity size={13} className="text-blue-600" />
              <h3 className="text-sm font-bold text-gray-800">Incident Timeline</h3>
            </div>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={charts.casesPerMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#9ca3af' }} />
                  <YAxis tick={{ fontSize: 9, fill: '#9ca3af' }} />
                  <ChartTooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '11px' }} />
                  <Line type="monotone" dataKey="cases" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie chart: Scam Distribution */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <Database size={13} className="text-purple-600" />
              <h3 className="text-sm font-bold text-gray-800">Scam Distribution</h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-32 flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={charts.scamDistribution} cx="50%" cy="50%" innerRadius={28} outerRadius={50} paddingAngle={3} dataKey="count">
                      {charts.scamDistribution.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <ChartTooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-1.5 text-[9px] font-semibold text-gray-500 max-w-[110px]">
                {charts.scamDistribution.slice(0, 5).map((e, i) => (
                  <div key={i} className="flex items-center gap-1.5 truncate">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="truncate">{e.category}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bar chart: Top 5 */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={13} className="text-red-600" />
              <h3 className="text-sm font-bold text-gray-800">Top 5 Risk Zones</h3>
            </div>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.topDistricts.slice(0, 5)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 8, fill: '#9ca3af' }} />
                  <YAxis tick={{ fontSize: 9, fill: '#9ca3af' }} />
                  <ChartTooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '11px' }} />
                  <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                    {charts.topDistricts.slice(0, 5).map((d, i) => (
                      <Cell key={i} fill={d.score >= 76 ? '#ef4444' : d.score >= 51 ? '#f97316' : '#eab308'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
