'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Search, MapPin, AlertCircle, ShieldAlert, Layers } from 'lucide-react';
import { ScamLocation } from './ScamMap';

// Dynamically import map component with no SSR to bypass browser window variable checks
const ScamMap = dynamic(() => import('./ScamMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full border border-border/80 rounded-2xl bg-zinc-950/60 flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
      <p className="text-xs text-muted-foreground mt-4 font-mono">Initializing GPS Layer...</p>
    </div>
  )
});

// Mock scam locations across major Indian tech hubs/cities
const mockLocations: ScamLocation[] = [
  {
    id: 'sc-001',
    lat: 28.6139,
    lng: 77.2090,
    city: 'New Delhi',
    category: 'UPI Spoofing',
    details: 'Victim targeted with unsolicited bank KYC cut-off threats via SMS spoofing.',
    severity: 'high',
    loss: '₹45,000',
    date: 'Today',
  },
  {
    id: 'sc-002',
    lat: 28.6250,
    lng: 77.2150,
    city: 'New Delhi',
    category: 'Fake Job Offer',
    details: 'Victim charged security fees for a fraudulent customer care executive role.',
    severity: 'medium',
    loss: '₹12,000',
    date: 'Yesterday',
  },
  {
    id: 'sc-003',
    lat: 19.0760,
    lng: 72.8777,
    city: 'Mumbai',
    category: 'NetBanking Phishing',
    details: 'Fake HDFC portal redirected credentials. Fraudulent debit detected within 10 min.',
    severity: 'high',
    loss: '₹1,20,000',
    date: 'Today',
  },
  {
    id: 'sc-004',
    lat: 19.0820,
    lng: 72.8900,
    city: 'Mumbai',
    category: 'Lottery Prize Scam',
    details: 'Unsolicited WhatsApp message promising KBC prizes. Processing fees requested.',
    severity: 'low',
    loss: '₹5,000',
    date: '3 days ago',
  },
  {
    id: 'sc-005',
    lat: 12.9716,
    lng: 77.5946,
    city: 'Bengaluru',
    category: 'Telegram Tasks Fraud',
    details: 'Exploitative cryptocurrency rating task scam on Telegram channels.',
    severity: 'high',
    loss: '₹2,50,000',
    date: 'Yesterday',
  },
  {
    id: 'sc-006',
    lat: 12.9850,
    lng: 77.6050,
    city: 'Bengaluru',
    category: 'Fake Loan App',
    details: 'Predatory loan app requesting device permissions and blackmailing contacts.',
    severity: 'high',
    loss: '₹80,000',
    date: '2 days ago',
  },
  {
    id: 'sc-007',
    lat: 22.5726,
    lng: 88.3639,
    city: 'Kolkata',
    category: 'Electricity Bill Cut-off',
    details: 'Unsolicited warning stating electricity cuts unless immediate payment made to UPI ID.',
    severity: 'medium',
    loss: '₹8,500',
    date: 'Today',
  },
];

const cities = [
  { name: 'New Delhi', coords: [28.6139, 77.2090] as [number, number], zoom: 12 },
  { name: 'Mumbai', coords: [19.0760, 72.8777] as [number, number], zoom: 12 },
  { name: 'Bengaluru', coords: [12.9716, 77.5946] as [number, number], zoom: 12 },
  { name: 'Kolkata', coords: [22.5726, 88.3639] as [number, number], zoom: 12 },
];

export default function HeatmapScreen() {
  const [mapCenter, setMapCenter] = useState<[number, number]>([28.6139, 77.2090]); // Default New Delhi
  const [mapZoom, setMapZoom] = useState(12);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = useMemo(() => {
    const list = new Set(mockLocations.map((l) => l.category));
    return ['all', ...Array.from(list)];
  }, []);

  const filteredLocations = useMemo(() => {
    return mockLocations.filter((loc) => {
      const matchesSearch = loc.city.toLowerCase().includes(searchQuery.toLowerCase()) || 
        loc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.details.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSeverity = severityFilter === 'all' || loc.severity === severityFilter;
      const matchesCategory = categoryFilter === 'all' || loc.category === categoryFilter;

      return matchesSearch && matchesSeverity && matchesCategory;
    });
  }, [searchQuery, severityFilter, categoryFilter]);

  const handleCitySelect = (coords: [number, number], zoom: number) => {
    setMapCenter(coords);
    setMapZoom(zoom);
  };

  return (
    <div className="space-y-6 pb-24 lg:pb-8 flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Scam Threat Heatmap</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track active geographical scam nodes and warning areas reported by citizens
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 glass-card rounded-lg border border-danger/20">
          <span className="w-2 h-2 rounded-full bg-danger animate-ping" />
          <span className="text-xs font-semibold text-danger">Threat Index: Critical</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-4 gap-6 min-h-0">
        {/* Left Control Panel / Side list */}
        <div className="xl:col-span-1 flex flex-col gap-4 overflow-y-auto scrollbar-cyber pr-1">
          {/* City Selector */}
          <div className="glass-card border border-border p-4 rounded-xl space-y-3">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Sector Coordinates</h3>
            <div className="grid grid-cols-2 gap-2">
              {cities.map((city) => (
                <button
                  key={city.name}
                  onClick={() => handleCitySelect(city.coords, city.zoom)}
                  className={`px-3 py-2 rounded-lg text-[10px] font-bold text-left border flex items-center gap-1.5 transition-all ${
                    mapCenter[0] === city.coords[0] && mapCenter[1] === city.coords[1]
                      ? 'bg-primary/10 border-primary/20 text-primary neon-glow-primary'
                      : 'bg-zinc-900 border-border/50 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <MapPin size={11} /> {city.name}
                </button>
              ))}
            </div>
          </div>

          {/* Search + Heuristics Filters */}
          <div className="glass-card border border-border p-4 rounded-xl space-y-4">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Filter Settings</h3>
            
            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search location/threat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-lg bg-black border border-border/80 text-[11px] focus:outline-none focus:border-primary/50 transition-all placeholder:text-zinc-600"
              />
            </div>

            {/* Severity Filter */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Threat Severity</label>
              <div className="flex flex-wrap gap-1">
                {(['all', 'high', 'medium', 'low'] as const).map((filter) => (
                  <button
                    key={`severity-${filter}`}
                    onClick={() => setSeverityFilter(filter)}
                    className={`px-2 py-1 rounded text-[9px] font-bold uppercase transition-all border ${
                      severityFilter === filter
                        ? 'bg-primary/10 text-primary border-primary/20'
                        : 'bg-zinc-900 border-border/50 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full h-9 px-2 rounded-lg bg-black border border-border/80 text-[11px] focus:outline-none focus:border-primary/50 text-muted-foreground"
              >
                {categories.map((cat) => (
                  <option key={`cat-select-${cat}`} value={cat}>
                    {cat.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Map Legend */}
          <div className="glass-card border border-border p-4 rounded-xl space-y-2.5">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Map Legend</h3>
            <div className="space-y-2 text-[10px] font-mono">
              <div className="flex items-center gap-2 text-danger">
                <span className="w-2.5 h-2.5 rounded-full bg-danger animate-pulse" />
                <span>High Threat Zone (Radius 800m)</span>
              </div>
              <div className="flex items-center gap-2 text-warning">
                <span className="w-2.5 h-2.5 rounded-full bg-warning animate-pulse" />
                <span>Medium Threat Zone (Radius 800m)</span>
              </div>
              <div className="flex items-center gap-2 text-success">
                <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse" />
                <span>Safe Verified Node (Radius 800m)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Map Canvas Panel */}
        <div className="xl:col-span-3 h-full min-h-[400px] xl:min-h-0 relative">
          <ScamMap
            locations={filteredLocations}
            center={mapCenter}
            zoom={mapZoom}
          />
        </div>
      </div>
    </div>
  );
}
