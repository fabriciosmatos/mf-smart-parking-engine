import React from 'react';
import { RaffleResult } from '../../types';

interface AuditHeaderProps {
  result: RaffleResult;
  onDownload: () => void;
}

export const AuditHeader: React.FC<AuditHeaderProps> = ({ result, onDownload }) => {
  return (
    <div className="bg-[#0f172a] text-white px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-xl border border-slate-800">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 md:gap-4">
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 overflow-x-auto w-full sm:w-auto">
          <i className="fa-solid fa-shield-halved text-base sm:text-lg text-indigo-400 flex-shrink-0"></i>
          <span className="font-bold text-xs sm:text-sm whitespace-nowrap">Auditoria</span>
          <div className="w-px h-4 sm:h-6 bg-slate-700 flex-shrink-0"></div>
          <span className="text-[10px] sm:text-xs text-slate-400 whitespace-nowrap">Média: <span className="text-indigo-400 font-bold">{result.stats.averageScore.toFixed(1)}</span></span>
          <div className="w-px h-4 sm:h-6 bg-slate-700 hidden sm:block flex-shrink-0"></div>
          <span className="text-[10px] sm:text-xs text-slate-400 whitespace-nowrap hidden md:inline">Semente: <span className="text-indigo-400 font-bold font-mono text-[9px] sm:text-xs">{result.seed}</span></span>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-auto">
          <code className="text-[9px] sm:text-xs bg-slate-800/80 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-slate-700 text-emerald-400 font-mono truncate flex-1 sm:flex-none sm:max-w-[200px] md:max-w-xs">{result.hash}</code>
          <button onClick={onDownload} className="px-3 sm:px-4 py-1.5 sm:py-2 bg-indigo-600 rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-xs shadow-lg hover:bg-indigo-500 transition-all flex items-center gap-1 sm:gap-2 whitespace-nowrap flex-shrink-0">
            <i className="fa-solid fa-file-zipper"></i><span className="hidden sm:inline">Download</span><span className="sm:hidden">ZIP</span>
          </button>
        </div>
      </div>
    </div>
  );
};
