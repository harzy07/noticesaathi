import React, { useState } from 'react';
import { NoticeItem, NoticeStatus } from '../types/notice';
import { getRemainingDays, formatStatutoryCountdown, formatCurrency } from '../utils/dateCalculations';
import {
  ArrowLeft,
  Calendar,
  Building,
  Scale,
  ShieldAlert,
  FileText,
  Clock,
  CheckCircle,
  FileSpreadsheet,
  Send,
  UserCheck,
} from 'lucide-react';

interface NoticeDossierScreenProps {
  notice: NoticeItem;
  allNotices: NoticeItem[];
  onSelectNoticeId: (id: string) => void;
  onBackToDocket: () => void;
  onOpenResponseFiling: (noticeId: string) => void;
  onUpdateStatus: (noticeId: string, newStatus: NoticeStatus) => void;
  onToggleLegalHold: (noticeId: string) => void;
  onToggleDeliverable: (noticeId: string, deliverableId: string) => void;
}

export const NoticeDossierScreen: React.FC<NoticeDossierScreenProps> = ({
  notice,
  allNotices,
  onSelectNoticeId,
  onBackToDocket,
  onOpenResponseFiling,
  onUpdateStatus,
  onToggleLegalHold,
  onToggleDeliverable,
}) => {
  const [activeTab, setActiveTab] = useState<'document' | 'provenance' | 'deliverables' | 'audit'>('document');

  const daysLeft = getRemainingDays(notice.statutoryDeadline);
  const countdown = formatStatutoryCountdown(daysLeft);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Top Breadcrumb & Matter Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDocket}
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors cursor-pointer"
            title="Back to Active Docket"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Notice Dossier</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">{notice.id}</span>
              <span aria-hidden="true">·</span>
              <span>Ref: {notice.referenceNumber}</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-0.5">
              {notice.title}
            </h1>
          </div>
        </div>

        {/* Matter Quick Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Switch Notice:</span>
          <select
            value={notice.id}
            onChange={(e) => onSelectNoticeId(e.target.value)}
            className="text-xs py-1 px-2.5 border border-slate-300 rounded bg-white font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
          >
            {allNotices.map((n) => (
              <option key={n.id} value={n.id}>
                {n.id} - {n.title.slice(0, 32)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Statutory Tolling & Countdown Banner */}
      <div className="p-5 bg-white border border-slate-200 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <div>
          <div className="text-xs text-slate-500">Statutory Deadline</div>
          <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
            {notice.statutoryDeadline}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            {notice.statutoryDays} {notice.isBusinessDays ? 'business days' : 'calendar days'} tolling
          </div>
        </div>

        <div>
          <div className="text-xs text-slate-500">Response Countdown</div>
          <div className={`text-base font-bold font-mono ${countdown.isUrgent ? 'text-amber-700' : 'text-slate-900'}`}>
            {countdown.text}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            Served on {notice.dateReceived}
          </div>
        </div>

        <div>
          <div className="text-xs text-slate-500">Risk & Exposure</div>
          <div className="text-base font-semibold font-mono text-slate-900 tabular-nums">
            {formatCurrency(notice.financialExposure)}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            Classification: {notice.riskTier}
          </div>
        </div>

        <div className="flex md:justify-end gap-2">
          <button
            onClick={() => onOpenResponseFiling(notice.id)}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Draft Formal Response</span>
          </button>
        </div>
      </div>

      {/* Segmented Detail Tabs (functional buttons) */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg mb-6 w-fit">
        <button
          onClick={() => setActiveTab('document')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            activeTab === 'document' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Document & Optical OCR
        </button>
        <button
          onClick={() => setActiveTab('provenance')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            activeTab === 'provenance' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Service & Legal Routing
        </button>
        <button
          onClick={() => setActiveTab('deliverables')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            activeTab === 'deliverables' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Deliverables ({notice.requiredDeliverables.filter((d) => d.completed).length}/{notice.requiredDeliverables.length})
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            activeTab === 'audit' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Audit History ({notice.auditHistory.length})
        </button>
      </div>

      {/* Tab 1: Document & OCR */}
      {activeTab === 'document' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Simulated Authentic Document Scan Preview */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-6 font-mono text-xs leading-relaxed">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <img
                  src="/src/assets/images/doc_intake_seal_1793481139355.jpg"
                  alt="Official Legal Seal"
                  className="w-12 h-12 object-contain rounded-full border border-slate-200"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="font-bold text-slate-900 text-sm">
                    {notice.issuingAuthority.toUpperCase()}
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    {notice.issuingOfficeOrDivision}
                  </div>
                </div>
              </div>
              <div className="text-right text-[11px] text-slate-500">
                <div>FILE: {notice.documentFileName}</div>
                <div>SIZE: {notice.documentFileSize}</div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded border border-slate-200 text-slate-800 whitespace-pre-wrap font-mono text-xs">
              {notice.extractedOcrText}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Verified against court docket register</span>
              <span className="font-mono">SHA-256: 7f8a3b91c...verified</span>
            </div>
          </div>

          {/* Side Panel: Notice Summary & Hold Status */}
          <div className="space-y-6">
            <div className="p-5 bg-white border border-slate-200 rounded-lg">
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">
                Executive Allegation Summary
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                {notice.summary}
              </p>
            </div>

            <div className="p-5 bg-white border border-slate-200 rounded-lg space-y-3">
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                Preservation & Hold Controls
              </h3>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Litigation Hold:</span>
                <span className={`font-semibold ${notice.legalHoldRequired ? 'text-amber-800' : 'text-slate-600'}`}>
                  {notice.legalHoldRequired ? 'Active & Mandatory' : 'Not Triggered'}
                </span>
              </div>

              <button
                onClick={() => onToggleLegalHold(notice.id)}
                className="w-full py-2 px-3 text-xs font-semibold rounded border transition-colors cursor-pointer text-slate-800 bg-slate-50 hover:bg-slate-100 border-slate-200"
              >
                {notice.legalHoldRequired ? 'Deactivate Litigation Hold' : 'Trigger Immediate Litigation Hold'}
              </button>

              <div className="pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-600 block mb-1">Matter Status:</span>
                <select
                  value={notice.status}
                  onChange={(e) => onUpdateStatus(notice.id, e.target.value as NoticeStatus)}
                  className="w-full py-1.5 px-2 text-xs border border-slate-300 rounded bg-white text-slate-900 font-medium"
                >
                  <option value="New Intake">New Intake</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Legal Hold Active">Legal Hold Active</option>
                  <option value="Response Drafted">Response Drafted</option>
                  <option value="Filed & Completed">Filed & Completed</option>
                  <option value="Dismissed">Dismissed</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Provenance & Legal Routing */}
      {activeTab === 'provenance' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
            Chain of Service & Jurisdictional Provenance
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-3">
              <div>
                <span className="text-slate-500 block">Target Legal Entity:</span>
                <span className="font-semibold text-slate-900 text-sm">{notice.targetEntity}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Jurisdiction & Venue:</span>
                <span className="text-slate-800">{notice.jurisdiction}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Designated Registered Agent:</span>
                <span className="text-slate-800">{notice.registeredAgent}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Service Method:</span>
                <span className="text-slate-800">{notice.serviceMethod}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-slate-500 block">Lead In-House Counsel:</span>
                <span className="font-semibold text-slate-900 text-sm">{notice.leadCounsel}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Assigned Internal Department:</span>
                <span className="text-slate-800">{notice.assignedDepartment}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Retained Outside Defense Counsel:</span>
                <span className="text-slate-800">{notice.outsideCounselFirm}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Serving Party / Process Server:</span>
                <span className="text-slate-800">{notice.servingParty}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Deliverables Checklist */}
      {activeTab === 'deliverables' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">
              Required Statutory Deliverables & Evidence Production
            </h2>
            <span className="text-xs text-slate-500">
              {notice.requiredDeliverables.filter((d) => d.completed).length} of {notice.requiredDeliverables.length} items satisfied
            </span>
          </div>

          <div className="space-y-3">
            {notice.requiredDeliverables.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-200"
              >
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => onToggleDeliverable(notice.id, item.id)}
                    className="accent-slate-900"
                  />
                  <span className={`text-xs ${item.completed ? 'line-through text-slate-400 font-normal' : 'text-slate-800 font-medium'}`}>
                    {item.label}
                  </span>
                </label>
                <span className="text-xs text-slate-500 font-mono">
                  {item.completed ? 'COMPLETED' : 'PENDING'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Audit History */}
      {activeTab === 'audit' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
            Immutable Audit Log & Custody Events
          </h2>

          <div className="space-y-4">
            {notice.auditHistory.map((entry) => (
              <div key={entry.id} className="text-xs pb-3 border-b border-slate-100 last:border-0">
                <div className="flex items-center justify-between font-mono text-slate-500 mb-1">
                  <span>{entry.timestamp}</span>
                  <span>{entry.actor}</span>
                </div>
                <div className="font-semibold text-slate-900">{entry.action}</div>
                <div className="text-slate-600 mt-0.5">{entry.details}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
