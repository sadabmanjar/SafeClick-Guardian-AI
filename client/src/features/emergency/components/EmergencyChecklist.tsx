'use client';
import React, { useState } from 'react';
import { CheckCircle, Circle, AlertTriangle, Clock } from 'lucide-react';

const checklistItems = [
  {
    id: 'chk-stop',
    step: 1,
    priority: 'critical' as const,
    title: 'STOP all transactions immediately',
    description: 'Do not transfer any more money. Do not share OTP, password, or CVV with anyone — even if they claim to be bank officials or police.',
    actionLabel: 'Done — no more transactions',
    timeEstimate: '30 sec',
  },
  {
    id: 'chk-freeze',
    step: 2,
    priority: 'critical' as const,
    title: 'Block your bank account / UPI',
    description: 'Call your bank helpline immediately to freeze your account. HDFC: 1800-202-6161 | SBI: 1800-11-2211 | ICICI: 1800-102-4242 | Paytm: 0120-4456-456',
    actionLabel: 'Account blocked',
    timeEstimate: '2 min',
  },
  {
    id: 'chk-screenshot',
    step: 3,
    priority: 'high' as const,
    title: 'Preserve all evidence',
    description: 'Take screenshots of all messages, transaction IDs, payment receipts, and fraudulent links. Do NOT delete any messages or call logs.',
    actionLabel: 'Evidence saved',
    timeEstimate: '3 min',
  },
  {
    id: 'chk-report',
    step: 4,
    priority: 'high' as const,
    title: 'Report on NCRP portal',
    description: 'Go to cybercrime.gov.in and file a complaint. Note down the complaint number — you will need it for bank chargeback and police FIR.',
    actionLabel: 'Complaint filed',
    timeEstimate: '10 min',
  },
  {
    id: 'chk-bank-complaint',
    step: 5,
    priority: 'medium' as const,
    title: 'File complaint with your bank',
    description: 'Submit a written fraud complaint to your bank branch. Request chargeback/reversal for unauthorized transactions made within the last 72 hours.',
    actionLabel: 'Bank notified',
    timeEstimate: '15 min',
  },
  {
    id: 'chk-fir',
    step: 6,
    priority: 'medium' as const,
    title: 'File FIR at nearest Cyber Police Station',
    description: 'Visit the nearest cyber police station with your evidence package and NCRP complaint number. You can also use the Complaint Generator below.',
    actionLabel: 'FIR filed',
    timeEstimate: '1-2 hrs',
  },
];

const priorityConfig = {
  critical: { color: 'text-danger', bg: 'bg-danger/10 border-danger/20', label: 'CRITICAL', dotColor: 'bg-danger' },
  high: { color: 'text-warning', bg: 'bg-warning/10 border-warning/20', label: 'HIGH', dotColor: 'bg-warning' },
  medium: { color: 'text-primary', bg: 'bg-primary/10 border-primary/20', label: 'MEDIUM', dotColor: 'bg-primary' },
};

export default function EmergencyChecklist() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const completedCount = completed.size;
  const totalCount = checklistItems.length;
  const progressPct = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="glass-card rounded-2xl border border-border h-full flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-warning" />
            <h3 className="text-sm font-bold text-foreground">Emergency Response Checklist</h3>
          </div>
          <span className="text-xs font-mono-data text-muted-foreground">
            {completedCount}/{totalCount} done
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              progressPct === 100 ? 'bg-success' : progressPct > 50 ? 'bg-warning' : 'bg-danger'
            }`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
        {completedCount === totalCount && (
          <p className="text-xs text-success font-medium mt-2 flex items-center gap-1.5">
            <CheckCircle size={12} />
            All steps completed — you are well protected
          </p>
        )}
      </div>

      {/* Checklist items */}
      <div className="flex-1 overflow-y-auto scrollbar-cyber divide-y divide-border">
        {checklistItems.map((item) => {
          const isDone = completed.has(item.id);
          const pConfig = priorityConfig[item.priority];
          return (
            <div
              key={item.id}
              className={`px-5 py-4 transition-all duration-200 cursor-pointer group ${
                isDone ? 'opacity-60' : 'hover:bg-muted/30'
              }`}
              onClick={() => toggleItem(item.id)}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <button
                  className="flex-shrink-0 mt-0.5 transition-all duration-150 active:scale-90"
                  aria-label={isDone ? `Unmark step ${item.step}` : `Mark step ${item.step} as done`}
                  onClick={(e) => { e.stopPropagation(); toggleItem(item.id); }}
                >
                  {isDone ? (
                    <CheckCircle size={20} className="text-success" />
                  ) : (
                    <Circle size={20} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${pConfig.bg} ${pConfig.color}`}>
                      {pConfig.label}
                    </span>
                    <span className="text-xs font-semibold text-foreground">{item.title}</span>
                    <div className="flex items-center gap-1 ml-auto text-[10px] text-muted-foreground">
                      <Clock size={10} />
                      {item.timeEstimate}
                    </div>
                  </div>
                  <p className={`text-xs leading-relaxed transition-colors ${isDone ? 'text-muted-foreground line-through' : 'text-muted-foreground'}`}>
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}