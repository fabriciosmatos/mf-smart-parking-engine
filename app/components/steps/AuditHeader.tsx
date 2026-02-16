import React from 'react';
import { RaffleResult } from '../../types';

interface AuditHeaderProps {
  result: RaffleResult;
  onDownload: () => void;
}

export const AuditHeader: React.FC<AuditHeaderProps> = ({ result, onDownload }) => {
  return (
    <div className="bg-[#0f172a] text-white p-6 rounded-[2rem] shadow-2xl border border-slate-800 space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-600/20 rounded-2xl flex items-center justify-center border border-indigo-500/30">
            <i className="fa-solid fa-shield-halved text-2xl text-indigo-400"></i>
          </div>
          <div>
            <h3 className="font-black text-xl tracking-tight italic">Relatório de Auditoria</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">
                Certificado Imutável Gerado
              </p>
            </div>
          </div>
        </div>
        
        {/* Métricas principais */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <span className="text-[9px] text-slate-500 block uppercase font-black mb-1">Média Justiça</span>
            <span className="text-2xl font-black text-indigo-400">{result.stats.averageScore.toFixed(1)}</span>
          </div>
          <div className="text-center">
            <span className="text-[9px] text-slate-500 block uppercase font-black mb-1">Semente</span>
            <span className="text-2xl font-black text-indigo-400 font-mono">{result.seed}</span>
          </div>
        </div>
      </div>

      {/* Hash e Botão */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
        <div className="flex-1 min-w-0">
          <span className="text-[9px] text-slate-500 block uppercase font-black mb-2 tracking-widest">
            Integridade SHA-16
          </span>
          <code className="text-xs bg-slate-800/80 px-4 py-3 block rounded-xl border border-slate-700 text-emerald-400 font-mono truncate">
            {result.hash}
          </code>
        </div>
        
        <button
          onClick={onDownload}
          className="lg:w-auto px-8 py-4 bg-indigo-600 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl hover:bg-indigo-500 transition-all flex items-center justify-center gap-3 whitespace-nowrap"
        >
          <i className="fa-solid fa-file-zipper text-lg"></i> 
          <span className="hidden md:inline">Pacote de Auditoria (.zip)</span>
          <span className="md:hidden">Download</span>
        </button>
      </div>
    </div>
  );
};
