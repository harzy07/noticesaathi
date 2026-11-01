/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NoticeItem, NoticeStatus, ScreenId } from './types/notice';
import { INITIAL_NOTICES } from './data/mockNotices';
import { TopNavigation } from './components/TopNavigation';
import { NoticeIntakeScreen } from './components/NoticeIntakeScreen';
import { ActiveDocketScreen } from './components/ActiveDocketScreen';
import { NoticeDossierScreen } from './components/NoticeDossierScreen';
import { ResponseFilingScreen } from './components/ResponseFilingScreen';
import { StatutoryCalendarScreen } from './components/StatutoryCalendarScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('intake');
  const [notices, setNotices] = useState<NoticeItem[]>(INITIAL_NOTICES);
  const [selectedNoticeId, setSelectedNoticeId] = useState<string>(INITIAL_NOTICES[0].id);

  // Notice Ingestion Callback
  const handleNoticeCreated = (newNotice: NoticeItem) => {
    setNotices((prev) => [newNotice, ...prev]);
    setSelectedNoticeId(newNotice.id);
  };

  // Status Update Callback
  const handleUpdateStatus = (noticeId: string, newStatus: NoticeStatus) => {
    setNotices((prev) =>
      prev.map((n) => {
        if (n.id === noticeId) {
          const updatedAudit = [
            {
              id: `aud-${Date.now()}`,
              timestamp: '2026-10-31 14:20 EST',
              action: `Status Updated to ${newStatus}`,
              actor: 'Legal Operations / Eleanor Vance',
              details: `Matter status transition recorded from ${n.status} to ${newStatus}.`,
            },
            ...n.auditHistory,
          ];
          return {
            ...n,
            status: newStatus,
            auditHistory: updatedAudit,
          };
        }
        return n;
      })
    );
  };

  // Legal Hold Toggle
  const handleToggleLegalHold = (noticeId: string) => {
    setNotices((prev) =>
      prev.map((n) => {
        if (n.id === noticeId) {
          const nextHold = !n.legalHoldRequired;
          const updatedAudit = [
            {
              id: `aud-${Date.now()}`,
              timestamp: '2026-10-31 14:22 EST',
              action: nextHold ? 'Litigation Hold Activated' : 'Litigation Hold Released',
              actor: 'General Counsel Office',
              details: nextHold
                ? 'Mandatory ESI preservation notice issued to all potential custodians.'
                : 'Preservation hold revoked following resolution.',
            },
            ...n.auditHistory,
          ];
          return {
            ...n,
            legalHoldRequired: nextHold,
            status: nextHold ? 'Legal Hold Active' : n.status === 'Legal Hold Active' ? 'Under Review' : n.status,
            auditHistory: updatedAudit,
          };
        }
        return n;
      })
    );
  };

  // Deliverable Toggle
  const handleToggleDeliverable = (noticeId: string, deliverableId: string) => {
    setNotices((prev) =>
      prev.map((n) => {
        if (n.id === noticeId) {
          const updatedDeliverables = n.requiredDeliverables.map((d) =>
            d.id === deliverableId ? { ...d, completed: !d.completed } : d
          );
          return {
            ...n,
            requiredDeliverables: updatedDeliverables,
          };
        }
        return n;
      })
    );
  };

  // Response Update
  const handleUpdateNoticeResponse = (
    noticeId: string,
    updatedPackage: NoticeItem['responsePackage']
  ) => {
    setNotices((prev) =>
      prev.map((n) => {
        if (n.id === noticeId) {
          const updatedAudit = [
            {
              id: `aud-${Date.now()}`,
              timestamp: '2026-10-31 14:25 EST',
              action: `Response Updated: ${updatedPackage.status}`,
              actor: 'Regulatory Counsel / Eleanor Vance',
              details: `Response pleading updated for submission to ${n.issuingAuthority}.`,
            },
            ...n.auditHistory,
          ];
          return {
            ...n,
            responsePackage: updatedPackage,
            status: updatedPackage.status === 'Transmitted' ? 'Filed & Completed' : n.status,
            auditHistory: updatedAudit,
          };
        }
        return n;
      })
    );
  };

  const activeNotice = notices.find((n) => n.id === selectedNoticeId) || notices[0];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Bar Contract (§2) */}
      <TopNavigation
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
        onNewIntake={() => setCurrentScreen('intake')}
        activeNoticeCount={notices.filter((n) => n.status !== 'Filed & Completed' && n.status !== 'Dismissed').length}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {currentScreen === 'intake' && (
          <NoticeIntakeScreen
            onNoticeCreated={handleNoticeCreated}
            onNavigateToDocket={() => setCurrentScreen('docket')}
            onNavigateToDossier={(id) => {
              setSelectedNoticeId(id);
              setCurrentScreen('dossier');
            }}
          />
        )}

        {currentScreen === 'docket' && (
          <ActiveDocketScreen
            notices={notices}
            onSelectNotice={(id) => {
              setSelectedNoticeId(id);
              setCurrentScreen('dossier');
            }}
            onNewIntake={() => setCurrentScreen('intake')}
            onUpdateStatus={handleUpdateStatus}
            onToggleLegalHold={handleToggleLegalHold}
          />
        )}

        {currentScreen === 'dossier' && (
          <NoticeDossierScreen
            notice={activeNotice}
            allNotices={notices}
            onSelectNoticeId={(id) => setSelectedNoticeId(id)}
            onBackToDocket={() => setCurrentScreen('docket')}
            onOpenResponseFiling={(id) => {
              setSelectedNoticeId(id);
              setCurrentScreen('response');
            }}
            onUpdateStatus={handleUpdateStatus}
            onToggleLegalHold={handleToggleLegalHold}
            onToggleDeliverable={handleToggleDeliverable}
          />
        )}

        {currentScreen === 'response' && (
          <ResponseFilingScreen
            currentNotice={activeNotice}
            allNotices={notices}
            onSelectNoticeId={(id) => setSelectedNoticeId(id)}
            onUpdateNoticeResponse={handleUpdateNoticeResponse}
            onBackToDocket={() => setCurrentScreen('docket')}
          />
        )}

        {currentScreen === 'calendar' && (
          <StatutoryCalendarScreen
            notices={notices}
            onSelectNotice={(id) => {
              setSelectedNoticeId(id);
              setCurrentScreen('dossier');
            }}
            onOpenResponse={(id) => {
              setSelectedNoticeId(id);
              setCurrentScreen('response');
            }}
          />
        )}
      </main>

      {/* Subtle Archival Footer */}
      <footer className="border-t border-slate-200 py-6 px-6 bg-white text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">NoticeVault</span>
            <span aria-hidden="true">·</span>
            <span>Statutory Notice & Docket Operations Engine</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Jurisdiction: U.S. Federal & 50 States</span>
            <span aria-hidden="true">·</span>
            <span>Anchor Date: 2026-10-31</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">Audit Hash Verified</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
