import React from 'react';
import { RaffleResult } from '../../types';

interface AuditHeaderProps {
  result: RaffleResult;
  onDownload: () => void;
}

export const AuditHeader: React.FC<AuditHeaderProps> = ({ result, onDownload }) => {
  return (
    <div className="bg-[#0f172a] text-white p-4 md:p-6 rounded-[2rem] shadow-2xl border border-slate-800">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 lg:gap-6">
        {/* Cabeçalho + Métricas */}
        <div className="flex items-center gap-4 flex-wrap lg:flex-1">
          <div className="w-12 h-12 bg-indigo-600/20 rounded-2xl flex items-center justify-center border border-indigo-500/30">
            <i className="fa-solid fa-shield-halved text-xl text-indigo-400"></i>
          </div>
          <div className="flex-1 min-w-[140px]">
            <h3 className="font-black text-lg tracking-tight italic">Relatório de Auditoria</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">
                Certificado Imutável Gerado
              </p>
            </div>
          </div>
          
          {/* Métricas */}
          <div className="flex items-center gap-4">
            <div className="text-center">
              <span className="text-[9px] text-slate-500 block uppercase font-black mb-1">Média</span>
              <span className="text-xl font-black text-indigo-400">{result.stats.averageScore.toFixed(1)}</span>
            </div>
            <div className="text-center">
              <span className="text-[9px] text-slate-500 block uppercase font-black mb-1">Semente</span>
              <span className="text-xl font-black text-indigo-400 font-mono">{result.seed}</span>
            </div>
          </div>
        </div>

        {/* Hash */}
        <div className="flex-1 lg:max-w-md min-w-0">
          <span className="text-[9px] text-slate-500 block uppercase font-black mb-1.5 tracking-widest">
            SHA-16
          </span>
          <code className="text-xs bg-slate-800/80 px-3 py-2 block rounded-xl border border-slate-700 text-emerald-400 font-mono truncate">
            {result.hash}
          </code>
        </div>
        
        {/* Botão */}
        <button
          onClick={onDownload}
          className="lg:w-auto px-6 py-3 bg-indigo-600 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <i className="fa-solid fa-file-zipper"></i> 
          <span className="hidden lg:inline">Pacote (.zip)</span>
          <span className="lg:hidden">Download</span>
        </button>
      </div>
    </div>
  );
};
