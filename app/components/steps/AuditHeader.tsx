import React from 'react';
import { RaffleResult } from '../../types';

interface AuditHeaderProps {
  result: RaffleResult;
  onDownload: () => void;
}

export const AuditHeader: React.FC<AuditHeaderProps> = ({ result, onDownload }) => {
  return (
    <div className="bg-[#0f172a] text-white px-6 py-3 rounded-2xl shadow-xl border border-slate-800">
      <div className="flex items-center gap-4 overflow-x-auto">
        <i className="fa-solid fa-shield-halved text-lg text-indigo-400"></i>
        <span className="font-bold text-sm whitespace-nowrap">Auditoria</span>
        <div className="w-px h-6 bg-slate-700"></div>
        <span className="text-xs text-slate-400 whitespace-nowrap">Média: <span className="text-indigo-400 font-bold">{result.stats.averageScore.toFixed(1)}</span></span>
        <div className="w-px h-6 bg-slate-700"></div>
        <span className="text-xs text-slate-400 whitespace-nowrap">Semente: <span className="text-indigo-400 font-bold font-mono">{result.seed}</span></span>
        <div className="w-px h-6 bg-slate-700"></div>
        <code className="text-xs bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-emerald-400 font-mono truncate max-w-xs">{result.hash}</code>
        <button onClick={onDownload} className="ml-auto px-4 py-2 bg-indigo-600 rounded-xl font-bold text-xs shadow-lg hover:bg-indigo-500 transition-all flex items-center gap-2 whitespace-nowrap">
          <i className="fa-solid fa-file-zipper"></i><span>Download</span>
        </button>
      </div>
    </div>
  );
};
