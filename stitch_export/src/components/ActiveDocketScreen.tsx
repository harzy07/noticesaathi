import React, { useState } from 'react';
import { NoticeItem, RiskTier, NoticeStatus } from '../types/notice';
import { getRemainingDays, formatStatutoryCountdown, formatCurrency } from '../utils/dateCalculations';
import {
  Search,
  Filter,
  Download,
  ExternalLink,
  ShieldAlert,
  ArrowUpDown,
  Plus,
} from 'lucide-react';

interface ActiveDocketScreenProps {
  notices: NoticeItem[];
  onSelectNotice: (noticeId: string) => void;
  onNewIntake: () => void;
  onUpdateStatus: (noticeId: string, newStatus: NoticeStatus) => void;
  onToggleLegalHold: (noticeId: string) => void;
}

export const ActiveDocketScreen: React.FC<ActiveDocketScreenProps> = ({
  notices,
  onSelectNotice,
  onNewIntake,
  onUpdateStatus,
  onToggleLegalHold,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'deadline' | 'exposure' | 'received'>('deadline');
  const [sortAsc, setSortAsc] = useState(true);

  // Filter & Search Logic
  const filteredNotices = notices
    .filter((n) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        n.title.toLowerCase().includes(q) ||
        n.referenceNumber.toLowerCase().includes(q) ||
        n.issuingAuthority.toLowerCase().includes(q) ||
        n.targetEntity.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (filterCategory === 'critical') return n.riskTier === 'P1 - Critical';
      if (filterCategory === 'legal_hold') return n.legalHoldRequired;
      if (filterCategory === 'regulatory') return n.category === 'Regulatory Enforcement';
      if (filterCategory === 'tax') return n.category === 'Tax & Revenue';
      if (filterCategory === 'active') return n.status !== 'Filed & Completed' && n.status !== 'Dismissed';

      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'deadline') {
        comparison = new Date(a.statutoryDeadline).getTime() - new Date(b.statutoryDeadline).getTime();
      } else if (sortBy === 'exposure') {
        comparison = a.financialExposure - b.financialExposure;
      } else if (sortBy === 'received') {
        comparison = new Date(a.dateReceived).getTime() - new Date(b.dateReceived).getTime();
      }
      return sortAsc ? comparison : -comparison;
    });

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Reference #', 'Title', 'Issuing Authority', 'Target Entity', 'Category', 'Deadline', 'Risk Tier', 'Exposure ($)', 'Status'];
    const rows = filteredNotices.map((n) => [
      n.id,
      `"${n.referenceNumber}"`,
      `"${n.title.replace(/"/g, '""')}"`,
      `"${n.issuingAuthority}"`,
      `"${n.targetEntity}"`,
      n.category,
      n.statutoryDeadline,
      n.riskTier,
      n.financialExposure,
      n.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `notice_docket_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Header & Metrics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Notice Operations</span>
            <span aria-hidden="true">·</span>
            <span>Active Docket</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{notices.length} Total Matters</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Active Notice Docket
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Docket CSV</span>
          </button>
          <button
            onClick={onNewIntake}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Notice Intake</span>
          </button>
        </div>
      </div>

      {/* Control Strip: Search & Filter Tabs */}
      <div className="p-4 bg-white border border-slate-200 rounded-lg mb-6 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, docket #, agency, or target entity..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
            />
          </div>

          {/* Interactive filter tabs (functional buttons) */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                filterCategory === 'all'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Notices ({notices.length})
            </button>
            <button
              onClick={() => setFilterCategory('critical')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                filterCategory === 'critical'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              P1 Critical ({notices.filter((n) => n.riskTier === 'P1 - Critical').length})
            </button>
            <button
              onClick={() => setFilterCategory('legal_hold')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                filterCategory === 'legal_hold'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Legal Hold ({notices.filter((n) => n.legalHoldRequired).length})
            </button>
            <button
              onClick={() => setFilterCategory('regulatory')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                filterCategory === 'regulatory'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Regulatory
            </button>
            <button
              onClick={() => setFilterCategory('tax')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                filterCategory === 'tax'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tax & Revenue
            </button>
          </div>
        </div>
      </div>

      {/* High Density Notice Grid */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-3 px-4">Docket ID / Title</th>
                <th className="py-3 px-4">Issuing Authority & Target</th>
                <th className="py-3 px-4">
                  <button
                    onClick={() => {
                      if (sortBy === 'deadline') setSortAsc(!sortAsc);
                      else {
                        setSortBy('deadline');
                        setSortAsc(true);
                      }
                    }}
                    className="flex items-center gap-1 hover:text-slate-900 cursor-pointer"
                  >
                    <span>Statutory Deadline</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-4">
                  <button
                    onClick={() => {
                      if (sortBy === 'exposure') setSortAsc(!sortAsc);
                      else {
                        setSortBy('exposure');
                        setSortAsc(false);
                      }
                    }}
                    className="flex items-center gap-1 hover:text-slate-900 cursor-pointer"
                  >
                    <span>Risk & Exposure</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-4">Status & Legal Hold</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredNotices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <p className="text-sm">No notices match your current filter criteria.</p>
                    <button
                      onClick={onNewIntake}
                      className="mt-3 px-3 py-1.5 text-xs font-semibold text-slate-900 bg-slate-100 rounded hover:bg-slate-200 transition-colors"
                    >
                      Log New Notice Intake
                    </button>
                  </td>
                </tr>
              ) : (
                filteredNotices.map((n) => {
                  const daysLeft = getRemainingDays(n.statutoryDeadline);
                  const countdown = formatStatutoryCountdown(daysLeft);

                  return (
                    <tr
                      key={n.id}
                      className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                      onClick={() => onSelectNotice(n.id)}
                    >
                      {/* Column 1: Docket ID / Title */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-mono text-slate-500 text-[11px] mb-0.5">
                          {n.id} · Ref: {n.referenceNumber}
                        </div>
                        <div className="font-semibold text-slate-900 line-clamp-1 group-hover:text-blue-700 transition-colors">
                          {n.title}
                        </div>
                        <div className="text-slate-500 text-[11px] mt-0.5 line-clamp-1">
                          {n.category} · Recv {n.dateReceived}
                        </div>
                      </td>

                      {/* Column 2: Issuing Authority & Target */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-medium text-slate-900 line-clamp-1">
                          {n.issuingAuthority}
                        </div>
                        <div className="text-slate-500 text-[11px] line-clamp-1">
                          Target: {n.targetEntity}
                        </div>
                        <div className="text-slate-400 text-[11px]">
                          Lead: {n.leadCounsel.split(',')[0]}
                        </div>
                      </td>

                      {/* Column 3: Statutory Deadline */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-mono font-medium text-slate-900 tabular-nums">
                          {n.statutoryDeadline}
                        </div>
                        <div className={`font-mono text-[11px] tabular-nums mt-0.5 ${countdown.isUrgent ? 'text-amber-700 font-semibold' : 'text-slate-500'}`}>
                          {countdown.text}
                        </div>
                        <div className="text-slate-400 text-[11px]">
                          {n.statutoryDays} {n.isBusinessDays ? 'biz days' : 'cal days'}
                        </div>
                      </td>

                      {/* Column 4: Risk & Exposure */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-900 font-mono tabular-nums">
                          {formatCurrency(n.financialExposure)}
                        </div>
                        <div className="text-[11px] mt-0.5">
                          <span
                            className={
                              n.riskTier.includes('P1')
                                ? 'text-rose-700 font-semibold'
                                : n.riskTier.includes('P2')
                                ? 'text-amber-700 font-semibold'
                                : 'text-slate-600'
                            }
                          >
                            {n.riskTier}
                          </span>
                        </div>
                      </td>

                      {/* Column 5: Status & Legal Hold */}
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <div className="space-y-1">
                          <select
                            value={n.status}
                            onChange={(e) => onUpdateStatus(n.id, e.target.value as NoticeStatus)}
                            className="text-xs py-1 px-2 border border-slate-200 rounded bg-white text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-slate-900"
                          >
                            <option value="New Intake">New Intake</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Legal Hold Active">Legal Hold Active</option>
                            <option value="Response Drafted">Response Drafted</option>
                            <option value="Filed & Completed">Filed & Completed</option>
                            <option value="Dismissed">Dismissed</option>
                          </select>

                          {n.legalHoldRequired && (
                            <div className="flex items-center gap-1 text-[11px] text-amber-800 font-medium">
                              <ShieldAlert className="w-3 h-3 text-amber-700" />
                              <span>Hold Active</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Column 6: Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => onSelectNotice(n.id)}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>Inspect</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Summary Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>Showing {filteredNotices.length} of {notices.length} notice matters</span>
          <span>Aggregate Exposure: {formatCurrency(filteredNotices.reduce((acc, curr) => acc + curr.financialExposure, 0))}</span>
        </div>
      </div>
    </div>
  );
};
