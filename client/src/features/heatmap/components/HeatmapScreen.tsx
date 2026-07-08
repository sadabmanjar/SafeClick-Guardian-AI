'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
  Search, MapPin, AlertTriangle, ShieldAlert, Plus, Layers,
  X, TrendingUp, Wifi, Filter, ChevronDown, Database
} from 'lucide-react';
import { api } from '@/lib/axios';
import { toast } from 'sonner';
import BackButton from '@/components/ui/BackButton';
import PageLoader from '@/components/ui/PageLoader';

const MpHeatmap = dynamic(() => import('./MpHeatmap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 rounded-xl border border-gray-200 min-h-[400px]">
      <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin mb-3" />
      <p className="text-xs text-gray-500 font-medium">Loading district boundaries...</p>
    </div>
  )
});

interface DistrictData {
  districtId: string; districtName: string; geoJsonId: string;
  totalCases: number; financialLoss: number; riskScore: number;
  commonScam: string; recentIncidents: number; nearbyStation: string;
  lastUpdated: string | Date;
}

interface StatsData {
  totalCases: number; activeHighRisk: number; totalLoss: number;
  mostTargetedDistrict: string; mostCommonScam: string; highestRiskScore: number;
}

const RISK_CFG = {
  critical: { bar: 'bg-red-500',    badge: 'bg-red-50 border-red-200 text-red-700',    label: 'Critical', dot: 'bg-red-500' },
  high:     { bar: 'bg-orange-500', badge: 'bg-orange-50 border-orange-200 text-orange-700', label: 'High',     dot: 'bg-orange-500' },
  medium:   { bar: 'bg-yellow-400', badge: 'bg-yellow-50 border-yellow-200 text-yellow-700', label: 'Medium',   dot: 'bg-yellow-400' },
  low:      { bar: 'bg-green-500',  badge: 'bg-green-50 border-green-200 text-green-700',    label: 'Low',      dot: 'bg-green-500' },
};

function getRiskCfg(score: number) {
  if (score >= 76) return RISK_CFG.critical;
  if (score >= 51) return RISK_CFG.high;
  if (score >= 31) return RISK_CFG.medium;
  return RISK_CFG.low;
}

function formatLoss(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000)     return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n}`;
}

export default function HeatmapScreen() {
  const [districts, setDistricts] = useState<DistrictData[]>([]);
  const [stats, setStats] = useState<StatsData>({ totalCases: 0, activeHighRisk: 0, totalLoss: 0, mostTargetedDistrict: '—', mostCommonScam: '—', highestRiskScore: 0 });
  const [selectedDistrictName, setSelectedDistrictName] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [scamFilter, setScamFilter] = useState('all');
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportForm, setReportForm] = useState({ title: '', district: '', scamType: 'UPI Fraud', financialLoss: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [dRes, sRes] = await Promise.all([api.get('/heatmap/districts'), api.get('/heatmap/stats')]);
      if (dRes.data?.status === 'success') setDistricts(dRes.data.data);
      if (sRes.data?.status === 'success') setStats(sRes.data.data);
    } catch { toast.error('Backend offline — showing cached data.'); }
    finally  { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const selected = useMemo(() =>
    selectedDistrictName ? districts.find(d => d.districtName.toLowerCase() === selectedDistrictName.toLowerCase()) ?? null : null,
    [selectedDistrictName, districts]
  );

  const filtered = useMemo(() =>
    districts
      .filter(d => {
        if (!d.districtName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        if (scamFilter !== 'all' && d.commonScam.toLowerCase() !== scamFilter.toLowerCase()) return false;
        if (riskFilter === 'critical' && d.riskScore < 76) return false;
        if (riskFilter === 'high'     && (d.riskScore < 51 || d.riskScore > 75)) return false;
        if (riskFilter === 'medium'   && (d.riskScore < 31 || d.riskScore > 50)) return false;
        if (riskFilter === 'low'      && d.riskScore > 30) return false;
        return true;
      })
      .sort((a, b) => b.riskScore - a.riskScore),
    [districts, searchQuery, riskFilter, scamFilter]
  );

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/heatmap/report', { ...reportForm, financialLoss: Number(reportForm.financialLoss) || 0 });
      if (res.data?.status === 'success') {
        toast.success('Incident filed. Threat index recalculated.');
        setIsReportOpen(false);
        setReportForm({ title: '', district: '', scamType: 'UPI Fraud', financialLoss: '', description: '' });
        fetchData();
      }
    } catch { toast.error('Failed to file report.'); }
    finally  { setSubmitting(false); }
  };

  const getSafetyTips = (scam: string) => {
    const s = scam.toLowerCase();
    if (s.includes('upi'))      return ['Never enter your UPI PIN to receive money.', 'Verify receiver handle before each transfer.', 'Report spoofed payment apps to NCRP immediately.'];
    if (s.includes('kyc'))      return ['Telecom providers never request SIM updates via link.', 'Never share your screen with unknown callers.', 'Contact your bank branch for any KYC updates.'];
    if (s.includes('telegram')) return ['Never invest money to unlock "task earnings".', 'Reject unsolicited WhatsApp/Telegram job offers.', 'Report such groups to cybercrime@gov.in.'];
    return ['Never share OTP or bank credentials over phone.', 'Use separate strong passwords for each financial app.', 'Report suspicious activity on cybercrime.gov.in.'];
  };

  if (loading) return <PageLoader message="Loading threat intelligence..." />;

  const kpis = [
    { label: 'Total Cases',     value: stats.totalCases.toLocaleString(), color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200',   icon: Database },
    { label: 'High Risk Zones', value: String(stats.activeHighRisk),      color: 'text-red-700',    bg: 'bg-red-50 border-red-200',     icon: ShieldAlert },
    { label: 'Financial Loss',  value: formatLoss(stats.totalLoss),       color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200', icon: TrendingUp },
    { label: 'Most Targeted',   value: stats.mostTargetedDistrict,        color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200', icon: MapPin },
    { label: 'Peak Score',      value: `${stats.highestRiskScore}/100`,   color: 'text-red-700',    bg: 'bg-red-50 border-red-200',     icon: AlertTriangle },
    { label: 'Top Scam',        value: stats.mostCommonScam,              color: 'text-gray-800',   bg: 'bg-gray-50 border-gray-200',   icon: Filter },
  ];

  return (
    <div className="space-y-5 pb-24 lg:pb-8">

      {/* Back + Title */}
      <BackButton label="Dashboard" href="/dashboard" />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center">
            <MapPin size={18} className="text-red-600" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">Cyber Crime Heatmap</h1>
            <p className="text-xs text-gray-500 font-medium mt-0.5">District-wise threat intelligence · Madhya Pradesh</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsReportOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all active:scale-95 shadow-sm">
            <Plus size={12} /> Report Scam
          </button>
          <div className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-lg">
            <Wifi size={11} className="text-green-500 animate-pulse" />
            <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Live</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        {kpis.map(({ label, value, color, bg, icon: Icon }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-8 h-8 rounded-lg border ${bg} flex items-center justify-center mb-2.5`}>
              <Icon size={14} className={color} />
            </div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
            <p className={`text-sm font-black truncate ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Main content: Sidebar + Map + Detail */}
      <div className="grid grid-cols-1 xl:grid-cols-[260px_1fr_280px] gap-4" style={{ height: '660px' }}>

        {/* ── Left: Filters + District List ── */}
        <div className="flex flex-col gap-3 overflow-hidden">

          {/* Filters */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Filter size={10} /> Filters
            </p>
            <div className="space-y-2.5">
              {[
                {
                  label: 'Risk Level', value: riskFilter, set: setRiskFilter,
                  opts: [['all', 'All Levels'], ['critical', '🔴 Critical (76+)'], ['high', '🟠 High (51–75)'], ['medium', '🟡 Medium (31–50)'], ['low', '🟢 Low (≤30)']]
                },
                {
                  label: 'Scam Type', value: scamFilter, set: setScamFilter,
                  opts: [['all', 'All Types'], ['UPI Fraud', 'UPI Fraud'], ['KYC Phishing', 'KYC Phishing'], ['Telegram Task Fraud', 'Telegram Task Fraud'], ['Loan App Blackmail', 'Loan App Blackmail'], ['Phishing', 'Phishing']]
                },
              ].map(({ label, value, set, opts }) => (
                <div key={label}>
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">{label}</label>
                  <div className="relative">
                    <select value={value} onChange={e => set(e.target.value)}
                      className="w-full h-8 px-2.5 pr-7 text-[11px] font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 appearance-none transition-colors">
                      {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                    <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* District list */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col flex-1 overflow-hidden">
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Districts</p>
              <span className="text-[9px] font-mono text-gray-400">{filtered.length}/52</span>
            </div>
            <div className="relative mb-2.5">
              <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search district..." value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full h-8 pl-7 pr-3 text-[11px] font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 placeholder:text-gray-400 transition-colors"
              />
            </div>
            <div className="overflow-y-auto flex-1 space-y-1">
              {filtered.map(d => {
                const rc = getRiskCfg(d.riskScore);
                const isSel = selectedDistrictName?.toLowerCase() === d.districtName.toLowerCase();
                return (
                  <button key={d.districtId}
                    onClick={() => setSelectedDistrictName(isSel ? null : d.districtName)}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all group ${
                      isSel ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-200' : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[11px] font-bold ${isSel ? 'text-blue-700' : 'text-gray-800'}`}>{d.districtName}</span>
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full border ${rc.badge}`}>{d.riskScore}</span>
                    </div>
                    <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${rc.bar} transition-all`} style={{ width: `${d.riskScore}%` }} />
                    </div>
                    <p className="text-[9px] text-gray-400 font-medium mt-1 truncate">{d.totalCases} cases · {d.commonScam}</p>
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <div className="flex items-center justify-center py-10 text-xs text-gray-400 font-medium">No districts found</div>
              )}
            </div>
          </div>
        </div>

        {/* ── Centre: Map ── */}
        <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white" style={{ height: '660px' }}>
          {/* Legend */}
          <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl p-3 shadow-md text-[10px]">
            <p className="font-bold text-gray-400 uppercase tracking-widest text-[9px] mb-2">Risk Level</p>
            {[
              { c: 'bg-red-500',    l: 'Critical · 76–100' },
              { c: 'bg-orange-500', l: 'High · 51–75' },
              { c: 'bg-yellow-400', l: 'Medium · 31–50' },
              { c: 'bg-green-500',  l: 'Low · 0–30' },
            ].map(({ c, l }) => (
              <div key={l} className="flex items-center gap-2 mb-1.5 last:mb-0">
                <div className={`w-3 h-3 rounded-sm ${c}`} />
                <span className="text-gray-600 font-semibold">{l}</span>
              </div>
            ))}
          </div>

          {/* Selected district chip */}
          {selectedDistrictName && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] bg-white border border-gray-200 rounded-full px-4 py-1.5 flex items-center gap-2 shadow-md">
              <MapPin size={11} className="text-red-500" />
              <span className="text-xs font-bold text-gray-800">{selectedDistrictName}</span>
              <button onClick={() => setSelectedDistrictName(null)} className="text-gray-400 hover:text-gray-700 ml-0.5">
                <X size={12} />
              </button>
            </div>
          )}

          <MpHeatmap
            districtsData={districts}
            onDistrictSelect={name => setSelectedDistrictName(p => p === name ? null : name)}
            selectedDistrict={selectedDistrictName}
          />
        </div>

        {/* ── Right: District Detail ── */}
        <div className="overflow-y-auto" style={{ height: '660px' }}>
          {selected ? (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
              {/* Header */}
              <div className={`p-4 border-b ${getRiskCfg(selected.riskScore).badge.replace('text-', 'border-').split(' ')[1]}`}
                style={{ background: selected.riskScore >= 76 ? '#fef2f2' : selected.riskScore >= 51 ? '#fff7ed' : selected.riskScore >= 31 ? '#fefce8' : '#f0fdf4' }}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0 mr-2">
                    <h3 className="text-base font-black text-gray-900 truncate">{selected.districtName}</h3>
                    <p className="text-[9px] text-gray-400 font-mono">ID: {selected.districtId}</p>
                  </div>
                  <button onClick={() => setSelectedDistrictName(null)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-gray-700 transition-colors flex-shrink-0">
                    <X size={12} />
                  </button>
                </div>
                <div className="flex items-end gap-3">
                  <div>
                    <p className="text-3xl font-black font-mono text-gray-900">{selected.riskScore}</p>
                    <p className="text-[9px] text-gray-500 font-medium">Risk Score / 100</p>
                  </div>
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border mb-1 ${getRiskCfg(selected.riskScore).badge}`}>
                    {getRiskCfg(selected.riskScore).label}
                  </span>
                </div>
                <div className="mt-2 h-1.5 bg-white/60 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${getRiskCfg(selected.riskScore).bar}`} style={{ width: `${selected.riskScore}%` }} />
                </div>
              </div>

              {/* Stats 2x2 */}
              <div className="p-3 grid grid-cols-2 gap-2 border-b border-gray-100">
                {[
                  { label: 'Total Cases',   value: selected.totalCases.toLocaleString(), color: 'text-blue-700' },
                  { label: 'Recent (24h)',  value: String(selected.recentIncidents),      color: 'text-red-600' },
                  { label: 'Financial Loss',value: formatLoss(selected.financialLoss),    color: 'text-orange-600' },
                  { label: 'Common Scam',   value: selected.commonScam,                   color: 'text-purple-700' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-gray-50 border border-gray-100 rounded-lg p-2.5">
                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
                    <p className={`text-xs font-black truncate ${color}`}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Safety Tips */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-1.5 mb-3">
                  <AlertTriangle size={11} className="text-orange-500" />
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Defense Advisory</p>
                </div>
                <ul className="space-y-2">
                  {getSafetyTips(selected.commonScam).map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-[11px] text-gray-600 leading-relaxed">
                      <span className="w-4 h-4 rounded-full bg-blue-50 border border-blue-200 text-blue-600 font-black text-[9px] flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Police Station */}
              <div className="p-4">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <MapPin size={11} className="text-red-500" />
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Nearest Cyber Police Cell</p>
                </div>
                <p className="text-sm font-bold text-gray-800">{selected.nearbyStation}</p>
                <p className="text-[9px] text-gray-400 font-mono mt-2">
                  Last sync: {new Date(selected.lastUpdated).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm h-full flex flex-col items-center justify-center text-center p-8 min-h-[400px]">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center mb-4">
                <Layers size={24} className="text-gray-400" />
              </div>
              <p className="text-sm font-bold text-gray-700 mb-1">Select a District</p>
              <p className="text-xs text-gray-400 leading-relaxed max-w-[200px]">
                Click any polygon on the map or a district in the list to view threat details.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-2 w-full">
                {[
                  { c: 'bg-red-500',    l: 'Critical' },
                  { c: 'bg-orange-500', l: 'High Risk' },
                  { c: 'bg-yellow-400', l: 'Medium' },
                  { c: 'bg-green-500',  l: 'Low Risk' },
                ].map(({ c, l }) => (
                  <div key={l} className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
                    <div className={`w-2.5 h-2.5 rounded-sm ${c}`} />
                    <span className="text-[10px] font-semibold text-gray-500">{l}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Report Modal ── */}
      {isReportOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-red-50">
              <div className="flex items-center gap-2">
                <ShieldAlert size={16} className="text-red-600" />
                <h3 className="text-sm font-bold text-gray-900">Report Cybercrime Incident</h3>
              </div>
              <button onClick={() => setIsReportOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-gray-700 transition-colors">
                <X size={13} />
              </button>
            </div>

            <form onSubmit={handleReport} className="p-5 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Incident Title *</label>
                <input required type="text" placeholder="e.g. UPI fraud targeting local merchant"
                  value={reportForm.title} onChange={e => setReportForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full h-9 px-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-400 focus:outline-none text-sm text-gray-800 placeholder:text-gray-400 font-medium transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    label: 'District *', field: 'district' as const,
                    isSelect: true,
                    options: ['', ...districts.map(d => d.districtName)],
                    placeholder: 'Select...',
                  },
                  {
                    label: 'Scam Type *', field: 'scamType' as const,
                    isSelect: true,
                    options: ['UPI Fraud', 'KYC Phishing', 'Telegram Task Fraud', 'Loan App Blackmail', 'Phishing'],
                  },
                ].map(({ label, field, isSelect, options, placeholder }) => (
                  <div key={field}>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">{label}</label>
                    <div className="relative">
                      <select required={label.includes('*')} value={reportForm[field]}
                        onChange={e => setReportForm(f => ({ ...f, [field]: e.target.value }))}
                        className="w-full h-9 px-2.5 pr-7 text-[11px] font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none appearance-none transition-colors">
                        {options?.map(o => <option key={o} value={o}>{o || placeholder}</option>)}
                      </select>
                      <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Financial Loss (₹)</label>
                <input type="number" placeholder="e.g. 75000"
                  value={reportForm.financialLoss} onChange={e => setReportForm(f => ({ ...f, financialLoss: e.target.value }))}
                  className="w-full h-9 px-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-400 focus:outline-none text-sm text-gray-800 placeholder:text-gray-400 font-mono font-bold transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Description *</label>
                <textarea required rows={3} placeholder="Describe the fraud in detail..."
                  value={reportForm.description} onChange={e => setReportForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-400 focus:outline-none text-sm text-gray-800 placeholder:text-gray-400 font-medium resize-none leading-relaxed transition-colors"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setIsReportOpen(false)}
                  className="flex-1 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-bold transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold disabled:opacity-50 transition-all shadow-sm">
                  {submitting ? 'Submitting...' : 'File Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
