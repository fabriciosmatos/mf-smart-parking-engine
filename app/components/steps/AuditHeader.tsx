import React from 'react';
import { RaffleResult } from '../../types';

interface AuditHeaderProps {
  result: RaffleResult;
  onDownload: () => void;
}

export const AuditHeader: React.FC<AuditHeaderProps> = ({ result, onDownload }) => {
  return (
    <div className="bg-[#0f172a] text-white p-6 md:p-8 rounded-[2rem] shadow-2xl border border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-6 overflow-hidden">
      <div className="flex items-center gap-6 shrink-0">
        <div className="w-14 h-14 bg-indigo-600/20 rounded-2xl flex items-center justify-center border border-indigo-500/30">
          <i className="fa-solid fa-shield-halved text-2xl text-indigo-400"></i>
        </div>
        <div>
          <h3 className="font-black text-xl tracking-tight italic">Relatório de Auditoria</h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest italic tracking-tighter">
              Certificado Imutável Gerado
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col md:flex-row items-center gap-6 md:gap-8 w-full max-w-full min-w-0">
        <div className="w-full md:flex-1 min-w-0">
          <span className="text-[8px] text-slate-500 block uppercase font-black mb-1 tracking-widest">
            Integridade SHA-16
          </span>
          <code className="text-[10px] bg-slate-800/80 px-4 py-2 block rounded-xl border border-slate-700 text-emerald-400 font-mono italic truncate">
            {result.hash}
          </code>
        </div>
        <div className="flex items-center gap-8 shrink-0">
          <div className="text-center">
            <span className="text-[8px] text-slate-500 block uppercase font-black mb-1">Média Justiça</span>
            <span className="text-lg font-black text-indigo-400">{result.stats.averageScore.toFixed(1)}</span>
          </div>
          <div className="text-center">
            <span className="text-[8px] text-slate-500 block uppercase font-black mb-1">Semente</span>
            <span className="text-lg font-black text-indigo-400 font-mono">{result.seed}</span>
          </div>
        </div>
      </div>
      <button
        onClick={onDownload}
        className="w-full lg:w-auto px-10 py-5 bg-indigo-600 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl hover:bg-indigo-500 transition-all flex items-center justify-center gap-3"
      >
        <i className="fa-solid fa-file-zipper text-lg"></i> Pacote de Auditoria (.zip)
      </button>
    </div>
  );
};
