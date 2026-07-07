'use client';
import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

interface RiskGaugeChartProps {
  score: number;
  riskLevel: 'safe' | 'low' | 'medium' | 'high' | 'critical';
}

const colorMap = {
  safe: 'var(--success)',
  low: 'var(--success)',
  medium: 'var(--warning)',
  high: 'var(--danger)',
  critical: 'var(--danger)',
};

const labelMap = {
  safe: 'SAFE',
  low: 'LOW',
  medium: 'MEDIUM',
  high: 'HIGH',
  critical: 'CRITICAL',
};

export default function RiskGaugeChart({ score, riskLevel }: RiskGaugeChartProps) {
  const color = colorMap[riskLevel];
  const data = [{ name: 'Risk', value: score, fill: color }];

  return (
    <div className="flex flex-col items-center">
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Risk Score</p>
      <div className="relative w-36 h-36">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="65%"
            outerRadius="90%"
            barSize={10}
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <RadialBar
              background={{ fill: 'var(--muted)' }}
              dataKey="value"
              cornerRadius={5}
              max={100}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-3xl font-bold font-mono-data"
            style={{ color }}
          >
            {score}
          </span>
          <span className="text-[9px] font-bold tracking-widest" style={{ color }}>
            {labelMap[riskLevel]}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-[11px] text-muted-foreground">0</span>
        <div className="flex-1 h-1 rounded-full overflow-hidden bg-muted w-24">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${score}%`, background: color }}
          />
        </div>
        <span className="text-[11px] text-muted-foreground">100</span>
      </div>
    </div>
  );
}