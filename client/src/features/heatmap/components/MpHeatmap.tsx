'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export interface DistrictMetric {
  districtName: string;
  riskScore: number;
  totalCases: number;
  financialLoss: number;
  commonScam: string;
  recentIncidents: number;
  nearbyStation: string;
  lastUpdated: string | Date;
}

interface MpHeatmapProps {
  districtsData: DistrictMetric[];
  onDistrictSelect: (name: string) => void;
  selectedDistrict: string | null;
}

function getRiskColor(score: number): string {
  if (score >= 76) return '#ef4444'; // red-500
  if (score >= 51) return '#f97316'; // orange-500
  if (score >= 31) return '#eab308'; // yellow-500
  return '#22c55e';                  // green-500
}

export default function MpHeatmap({ districtsData, onDistrictSelect, selectedDistrict }: MpHeatmapProps) {
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/mp_districts.geojson')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        setGeoJsonData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('[MpHeatmap] Failed to load GeoJSON:', err);
        setError(true);
        setLoading(false);
      });
  }, []);

  const getStyle = (feature: any) => {
    const dtname: string = feature?.properties?.dtname ?? '';
    const match = districtsData.find(d =>
      d.districtName.toLowerCase() === dtname.toLowerCase()
    );
    const score = match?.riskScore ?? 0;
    const isSelected = selectedDistrict?.toLowerCase() === dtname.toLowerCase();

    return {
      fillColor: getRiskColor(score),
      fillOpacity: isSelected ? 0.85 : 0.5,
      weight: isSelected ? 3 : 1,
      color: isSelected ? '#ffffff' : '#374151',
      opacity: 1,
    };
  };

  const onEachFeature = (feature: any, layer: any) => {
    const dtname: string = feature?.properties?.dtname ?? 'Unknown';
    const match = districtsData.find(d =>
      d.districtName.toLowerCase() === dtname.toLowerCase()
    );
    const score = match?.riskScore ?? 0;
    const cases = match?.totalCases ?? 0;
    const scam = match?.commonScam ?? 'N/A';
    const loss = match?.financialLoss ?? 0;

    const formatLoss = (n: number) => {
      if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
      if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
      if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
      return `₹${n}`;
    };

    const riskLabel = score >= 76 ? 'CRITICAL' : score >= 51 ? 'HIGH' : score >= 31 ? 'MEDIUM' : 'LOW';
    const riskColor = score >= 76 ? '#ef4444' : score >= 51 ? '#f97316' : score >= 31 ? '#ca8a04' : '#16a34a';

    layer.bindTooltip(
      `<div style="font-family: ui-sans-serif, system-ui, sans-serif; min-width: 160px; padding: 2px;">
        <div style="font-size: 13px; font-weight: 800; color: #111827; margin-bottom: 6px; padding-bottom: 6px; border-bottom: 1px solid #e5e7eb;">${dtname}</div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <span style="font-size: 11px; color: #6b7280;">Risk Score</span>
          <span style="font-size: 12px; font-weight: 800; font-family: monospace; color: ${riskColor};">${score}/100 <span style="font-size:9px; background: ${riskColor}22; border: 1px solid ${riskColor}44; border-radius: 4px; padding: 1px 4px;">${riskLabel}</span></span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
          <span style="font-size: 11px; color: #6b7280;">Cases</span>
          <span style="font-size: 11px; font-weight: 700; color: #111827;">${cases}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
          <span style="font-size: 11px; color: #6b7280;">Loss</span>
          <span style="font-size: 11px; font-weight: 700; color: #ea580c;">${formatLoss(loss)}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="font-size: 11px; color: #6b7280;">Top Scam</span>
          <span style="font-size: 11px; font-weight: 700; color: #7c3aed; max-width: 90px; text-align: right;">${scam}</span>
        </div>
      </div>`,
      { sticky: true, offset: [10, 0] }
    );

    layer.on({
      mouseover: (e: any) => {
        e.target.setStyle({ fillOpacity: 0.85, weight: 2.5, color: '#3b82f6' });
        e.target.bringToFront();
      },
      mouseout: (e: any) => {
        e.target.setStyle(getStyle(feature));
      },
      click: () => {
        onDistrictSelect(dtname);
      },
    });
  };

  // MP centre
  const mpCenter: [number, number] = [23.4733, 77.9479];

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 min-h-[400px]">
        <div className="w-8 h-8 rounded-full border-4 border-zinc-800 border-t-blue-500 animate-spin" />
        <p className="text-xs text-zinc-600 mt-3 font-mono">Loading map boundaries...</p>
      </div>
    );
  }

  if (error || !geoJsonData) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 min-h-[400px] text-center p-6">
        <p className="text-sm font-bold text-zinc-500 mb-1">Map Unavailable</p>
        <p className="text-xs text-zinc-700">Could not load <code className="text-zinc-600">/mp_districts.geojson</code>. Place it in the <code className="text-zinc-600">/public</code> folder.</p>
      </div>
    );
  }

  const mapKey = `${selectedDistrict ?? 'none'}-${districtsData.length}`;

  return (
    <div className="relative w-full h-full">
      {/* Leaflet tooltip dark theme overrides */}
      <style>{`
        .leaflet-tooltip {
          background: #fff !important;
          color: #111827 !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 10px !important;
          padding: 10px 12px !important;
          box-shadow: 0 4px 16px rgba(0,0,0,0.12) !important;
          font-size: 11px;
        }
        .leaflet-tooltip::before { display: none !important; }
        .leaflet-control-zoom a {
          background: #fff !important;
          color: #374151 !important;
          border-color: #d1d5db !important;
        }
        .leaflet-control-zoom a:hover {
          background: #f3f4f6 !important;
          color: #111827 !important;
        }
        .leaflet-control-attribution {
          background: rgba(255,255,255,0.85) !important;
          color: #9ca3af !important;
          font-size: 9px !important;
        }
        .leaflet-control-attribution a { color: #6b7280 !important; }
      `}</style>

      <MapContainer
        key={mapKey}
        center={mpCenter}
        zoom={6}
        style={{ width: '100%', height: '100%', background: '#ffffff' }}
        zoomControl={true}
        scrollWheelZoom={true}
        className="rounded-xl"
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <GeoJSON
          key={`geo-${mapKey}`}
          data={geoJsonData}
          style={getStyle}
          onEachFeature={onEachFeature}
        />
      </MapContainer>
    </div>
  );
}
