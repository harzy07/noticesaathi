import React, { useState } from 'react';
import { NoticeItem } from '../types/notice';
import { getRemainingDays, formatStatutoryCountdown } from '../utils/dateCalculations';
import {
  FileText,
  CheckCircle2,
  Send,
  PenTool,
  Printer,
  Scale,
  Clock,
  ArrowLeft,
  Building,
} from 'lucide-react';

interface ResponseFilingScreenProps {
  currentNotice: NoticeItem;
  allNotices: NoticeItem[];
  onSelectNoticeId: (id: string) => void;
  onUpdateNoticeResponse: (noticeId: string, updatedPackage: NoticeItem['responsePackage']) => void;
  onBackToDocket: () => void;
}

export const ResponseFilingScreen: React.FC<ResponseFilingScreenProps> = ({
  currentNotice,
  allNotices,
  onSelectNoticeId,
  onUpdateNoticeResponse,
  onBackToDocket,
}) => {
  const [responseType, setResponseType] = useState(
    currentNotice.responsePackage?.responseType || 'Formal Responsive Statement & Objection'
  );
  const [rebuttalBasis, setRebuttalBasis] = useState(
    currentNotice.responsePackage?.rebuttalBasis || ''
  );
  const [letterBody, setLetterBody] = useState(
    currentNotice.responsePackage?.formalLetterBody || ''
  );
  const [counselNotes, setCounselNotes] = useState(
    currentNotice.responsePackage?.counselNotes || ''
  );
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [filingReceipt, setFilingReceipt] = useState<string | null>(null);

  const daysLeft = getRemainingDays(currentNotice.statutoryDeadline);
  const countdown = formatStatutoryCountdown(daysLeft);

  const handleApproveSignoff = (approverRole: string) => {
    const updatedSignoffs = (currentNotice.responsePackage?.signoffs || []).map((s) => {
      if (s.role === approverRole) {
        return {
          ...s,
          approved: true,
          date: new Date().toISOString().split('T')[0],
        };
      }
      return s;
    });

    const updatedPackage = {
      ...currentNotice.responsePackage,
      responseType,
      rebuttalBasis,
      formalLetterBody: letterBody,
      counselNotes,
      signoffs: updatedSignoffs,
      status: updatedSignoffs.every((s) => s.approved) ? ('Approved' as const) : ('Pending Sign-Off' as const),
    };

    onUpdateNoticeResponse(currentNotice.id, updatedPackage);
  };

  const handleTransmitFiling = () => {
    setIsTransmitting(true);
    setTimeout(() => {
      const receiptId = `RCPT-${Math.floor(100000 + Math.random() * 900000)}`;
      setFilingReceipt(receiptId);
      setIsTransmitting(false);

      const updatedPackage = {
        ...currentNotice.responsePackage,
        responseType,
        rebuttalBasis,
        formalLetterBody: letterBody,
        counselNotes,
        status: 'Transmitted' as const,
      };

      onUpdateNoticeResponse(currentNotice.id, updatedPackage);
    }, 800);
  };

  const allApproved = (currentNotice.responsePackage?.signoffs || []).every((s) => s.approved);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDocket}
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors cursor-pointer"
            title="Back to Docket"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Notice Operations</span>
              <span aria-hidden="true">·</span>
              <span>Response Filing & Submissions</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">{currentNotice.id}</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-0.5">
              Statutory Response Drafter & Transmittal
            </h1>
          </div>
        </div>

        {/* Matter Quick Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Matter:</span>
          <select
            value={currentNotice.id}
            onChange={(e) => onSelectNoticeId(e.target.value)}
            className="text-xs py-1 px-2.5 border border-slate-300 rounded bg-white font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
          >
            {allNotices.map((n) => (
              <option key={n.id} value={n.id}>
                {n.id} - {n.referenceNumber}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filing Receipt Banner */}
      {filingReceipt && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-emerald-900">
                Official Response Transmitted to {currentNotice.issuingAuthority}
              </div>
              <div className="text-xs text-emerald-800 font-mono mt-0.5">
                Electronic Filing Confirmation Token: {filingReceipt} · Timestamp: {new Date().toISOString()}
              </div>
            </div>
          </div>
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 text-xs font-medium text-emerald-900 bg-white border border-emerald-300 rounded hover:bg-emerald-100 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Filing Receipt
          </button>
        </div>
      )}

      {/* Statutory Deadline Quick Banner */}
      <div className="p-4 bg-white border border-slate-200 rounded-lg mb-6 flex items-center justify-between text-xs">
        <div>
          <span className="text-slate-500">Target Agency / Court:</span>{' '}
          <span className="font-semibold text-slate-900">{currentNotice.issuingAuthority}</span>
        </div>
        <div>
          <span className="text-slate-500">Statutory Deadline:</span>{' '}
          <span className="font-mono font-semibold text-slate-900">{currentNotice.statutoryDeadline}</span>{' '}
          <span className={`font-mono ${countdown.isUrgent ? 'text-amber-700 font-semibold' : 'text-slate-500'}`}>
            ({countdown.text})
          </span>
        </div>
        <div>
          <span className="text-slate-500">Service Status:</span>{' '}
          <span className="font-semibold text-slate-900">{currentNotice.responsePackage?.status || 'Drafting'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Response Letterhead Editor */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-700" />
                <h2 className="text-sm font-semibold text-slate-900">
                  Formal Letterhead & Pleadings Draft
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {currentNotice.targetEntity}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Response Pleading Type
                </label>
                <input
                  type="text"
                  value={responseType}
                  onChange={(e) => setResponseType(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Legal Rebuttal & Jurisdictional Grounds
                </label>
                <input
                  type="text"
                  value={rebuttalBasis}
                  onChange={(e) => setRebuttalBasis(e.target.value)}
                  placeholder="e.g. Overbroad temporal scope; non-jurisdictional subsidiary operations..."
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Formal Transmittal Letter Body
                </label>
                <textarea
                  rows={14}
                  value={letterBody}
                  onChange={(e) => setLetterBody(e.target.value)}
                  className="w-full p-3 font-mono text-xs leading-relaxed border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-900 bg-slate-50/50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel: Multi-Party Sign-Off Chain */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                Executive Sign-Off Chain
              </h3>
              <span className="text-xs font-mono text-slate-500">
                {(currentNotice.responsePackage?.signoffs || []).filter((s) => s.approved).length}/
                {(currentNotice.responsePackage?.signoffs || []).length} Signed
              </span>
            </div>

            <div className="space-y-3">
              {(currentNotice.responsePackage?.signoffs || []).map((signoff) => (
                <div
                  key={signoff.role}
                  className="p-3 bg-slate-50 rounded border border-slate-200 text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-900">{signoff.role}</span>
                    {signoff.approved ? (
                      <span className="text-emerald-700 font-mono text-[11px] font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Signed {signoff.date}
                      </span>
                    ) : (
                      <span className="text-amber-700 font-mono text-[11px]">Pending</span>
                    )}
                  </div>
                  <div className="text-slate-600 text-[11px]">
                    {signoff.name} ({signoff.title})
                  </div>
                  {signoff.comments && (
                    <div className="text-slate-500 text-[11px] mt-1 italic">
                      Note: {signoff.comments}
                    </div>
                  )}
                  {!signoff.approved && (
                    <button
                      onClick={() => handleApproveSignoff(signoff.role)}
                      className="mt-2 w-full py-1 px-2 text-[11px] font-semibold text-slate-800 bg-white border border-slate-300 rounded hover:bg-slate-100 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <PenTool className="w-3 h-3" />
                      Approve & Execute Signature
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Internal Counsel Work Notes
              </label>
              <textarea
                rows={3}
                value={counselNotes}
                onChange={(e) => setCounselNotes(e.target.value)}
                placeholder="Private internal counsel commentary..."
                className="w-full p-2 text-xs border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={handleTransmitFiling}
                disabled={isTransmitting}
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isTransmitting ? 'Transmitting via Electronic Portal...' : 'Transmit & File Response'}</span>
              </button>
              {!allApproved && (
                <div className="text-[11px] text-amber-700 mt-1 text-center">
                  * Note: Transmittal can be executed under provisional authorization prior to final CFO review.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
