import React from 'react';
import { ScreenId } from '../types/notice';

interface TopNavigationProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onNewIntake: () => void;
  activeNoticeCount: number;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  currentScreen,
  onNavigate,
  onNewIntake,
  activeNoticeCount,
}) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-6 py-3.5 bg-white border-b border-slate-200">
      {/* Zone 1: Single text element wordmark */}
      <button
        onClick={() => onNavigate('intake')}
        className="flex items-center gap-2.5 text-left text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-slate-700 transition-colors cursor-pointer"
      >
        <span className="w-7 h-7 rounded-sm bg-slate-900 text-white flex items-center justify-center text-xs font-mono font-semibold tracking-wider">
          NV
        </span>
        <span>NoticeVault</span>
      </button>

      {/* Zone 2: 4–5 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
        <button
          onClick={() => onNavigate('intake')}
          className={`cursor-pointer whitespace-nowrap shrink-0 pb-1 border-b-2 transition-colors ${
            currentScreen === 'intake'
              ? 'text-slate-900 border-slate-900 font-semibold'
              : 'border-transparent hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          Notice Intake
        </button>

        <button
          onClick={() => onNavigate('docket')}
          className={`cursor-pointer whitespace-nowrap shrink-0 pb-1 border-b-2 transition-colors flex items-center gap-1.5 ${
            currentScreen === 'docket'
              ? 'text-slate-900 border-slate-900 font-semibold'
              : 'border-transparent hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <span>Active Docket</span>
          <span className="text-xs font-mono tabular-nums text-slate-500">
            ({activeNoticeCount})
          </span>
        </button>

        <button
          onClick={() => onNavigate('dossier')}
          className={`cursor-pointer whitespace-nowrap shrink-0 pb-1 border-b-2 transition-colors ${
            currentScreen === 'dossier'
              ? 'text-slate-900 border-slate-900 font-semibold'
              : 'border-transparent hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          Notice Dossier
        </button>

        <button
          onClick={() => onNavigate('response')}
          className={`cursor-pointer whitespace-nowrap shrink-0 pb-1 border-b-2 transition-colors ${
            currentScreen === 'response'
              ? 'text-slate-900 border-slate-900 font-semibold'
              : 'border-transparent hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          Response Filing
        </button>

        <button
          onClick={() => onNavigate('calendar')}
          className={`cursor-pointer whitespace-nowrap shrink-0 pb-1 border-b-2 transition-colors ${
            currentScreen === 'calendar'
              ? 'text-slate-900 border-slate-900 font-semibold'
              : 'border-transparent hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          Deadlines
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onNewIntake}
          className="cursor-pointer px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 shadow-sm"
        >
          + Ingest Notice
        </button>
      </div>
    </header>
  );
};
