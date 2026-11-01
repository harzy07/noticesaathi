import React, { useState } from 'react';
import { NoticeItem } from '../types/notice';
import { getRemainingDays, formatStatutoryCountdown, formatCurrency } from '../utils/dateCalculations';
import {
  Calendar as CalendarIcon,
  Clock,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  CheckCircle,
} from 'lucide-react';

interface StatutoryCalendarScreenProps {
  notices: NoticeItem[];
  onSelectNotice: (noticeId: string) => void;
  onOpenResponse: (noticeId: string) => void;
}

export const StatutoryCalendarScreen: React.FC<StatutoryCalendarScreenProps> = ({
  notices,
  onSelectNotice,
  onOpenResponse,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'urgent' | 'regulatory' | 'tax'>('all');

  // Sort by statutory deadline ascending
  const sortedNotices = [...notices].sort(
    (a, b) => new Date(a.statutoryDeadline).getTime() - new Date(b.statutoryDeadline).getTime()
  );

  const filteredNotices = sortedNotices.filter((n) => {
    if (selectedFilter === 'urgent') {
      const days = getRemainingDays(n.statutoryDeadline);
      return days <= 14;
    }
    if (selectedFilter === 'regulatory') return n.category === 'Regulatory Enforcement';
    if (selectedFilter === 'tax') return n.category === 'Tax & Revenue';
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Notice Operations</span>
            <span aria-hidden="true">·</span>
            <span>Statutory Calendar & Tolling Ledger</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">{notices.length} Scheduled Filings</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Statutory Deadline Ledger
          </h1>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              selectedFilter === 'all'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Scheduled ({notices.length})
          </button>
          <button
            onClick={() => setSelectedFilter('urgent')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              selectedFilter === 'urgent'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Due in ≤14 Days
          </button>
          <button
            onClick={() => setSelectedFilter('regulatory')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              selectedFilter === 'regulatory'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Regulatory
          </button>
          <button
            onClick={() => setSelectedFilter('tax')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              selectedFilter === 'tax'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tax & Revenue
          </button>
        </div>
      </div>

      {/* Calendar Timeline List */}
      <div className="space-y-4">
        {filteredNotices.map((n) => {
          const daysLeft = getRemainingDays(n.statutoryDeadline);
          const countdown = formatStatutoryCountdown(daysLeft);

          return (
            <div
              key={n.id}
              className="p-5 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Date Block */}
              <div className="flex items-start gap-4">
                <div className="w-20 p-2.5 bg-slate-50 border border-slate-200 rounded text-center shrink-0">
                  <div className="text-[11px] font-mono text-slate-500 uppercase">
                    {new Date(n.statutoryDeadline).toLocaleString('en-US', { month: 'short' })}
                  </div>
                  <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                    {new Date(n.statutoryDeadline).getDate()}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {new Date(n.statutoryDeadline).getFullYear()}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                    <span className="font-mono">{n.id}</span>
                    <span aria-hidden="true">·</span>
                    <span>{n.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">Ref: {n.referenceNumber}</span>
                  </div>
                  <h3
                    onClick={() => onSelectNotice(n.id)}
                    className="text-base font-semibold text-slate-900 hover:text-blue-700 transition-colors cursor-pointer"
                  >
                    {n.title}
                  </h3>
                  <div className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-2">
                    <span>Authority: {n.issuingAuthority}</span>
                    <span aria-hidden="true">·</span>
                    <span>Target: {n.targetEntity}</span>
                    <span aria-hidden="true">·</span>
                    <span>Counsel: {n.leadCounsel.split(',')[0]}</span>
                  </div>
                </div>
              </div>

              {/* Status & Action */}
              <div className="flex items-center gap-6 shrink-0 md:border-l md:border-slate-100 md:pl-6">
                <div className="text-right">
                  <div className={`font-mono text-xs font-semibold tabular-nums ${countdown.isUrgent ? 'text-amber-700' : 'text-slate-800'}`}>
                    {countdown.text}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono tabular-nums mt-0.5">
                    Exposure: {formatCurrency(n.financialExposure)}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Status: {n.status}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectNotice(n.id)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                  >
                    Dossier
                  </button>
                  <button
                    onClick={() => onOpenResponse(n.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                  >
                    Response
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
