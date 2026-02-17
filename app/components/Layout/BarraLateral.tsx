import React from 'react';

interface PropsBarraLateral {
  passoAtivo: number;
  aberta: boolean;
  aoFechar: () => void;
}

const PASSOS = [
  { id: 1, rotulo: 'Dados', icone: 'fa-database', descricao: 'Ingestão de CSV' },
  { id: 2, rotulo: 'Regras', icone: 'fa-sliders', descricao: 'Configurar Regras' },
  { id: 3, rotulo: 'Motor', icone: 'fa-microchip', descricao: 'Simulação' },
  { id: 4, rotulo: 'Entrega', icone: 'fa-box-open', descricao: 'Auditoria' }
];

export const BarraLateral: React.FC<PropsBarraLateral> = ({ passoAtivo, aberta, aoFechar }) => {
  return (
    <aside className={`
      fixed lg:relative
      w-72 h-full 
      bg-[#0f172a] text-white 
      flex flex-col 
      shadow-2xl 
      z-40
      transition-transform duration-300 ease-in-out
      ${aberta ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      {/* Header da BarraLateral */}
      <div className="p-6 sm:p-8 border-b border-slate-800/50 flex items-center gap-4">
        <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 rotate-3">
          <i className="fa-solid fa-parking text-2xl text-white"></i>
        </div>
        <div className="flex-1">
          <h1 className="font-extrabold text-2xl tracking-tight leading-none">SPE</h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 font-semibold">
            Smart Parking Engine
          </p>
        </div>
        {/* Botão de fechar para mobile */}
        <button
          onClick={aoFechar}
          className="lg:hidden w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Fechar menu"
        >
          <i className="fa-solid fa-times text-lg"></i>
        </button>
      </div>

      <nav className="flex-1 p-4 sm:p-6 mt-4 relative flex flex-col overflow-y-auto overflow-x-hidden">
        <div className="space-y-2">
          {PASSOS.map((passo, indice) => (
            <React.Fragment key={passo.id}>
              <div
                className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl transition-all duration-500 relative z-10 ${
                  passoAtivo === passo.id
                    ? 'bg-indigo-600 shadow-xl shadow-indigo-500/20 scale-105 border border-indigo-400/30'
                    : passoAtivo > passo.id
                      ? 'bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/15'
                      : 'text-slate-500 opacity-40 grayscale pointer-events-none'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                  passoAtivo === passo.id 
                    ? 'bg-white text-indigo-600 shadow-inner' 
                    : passoAtivo > passo.id
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800'
                }`}>
                  <i className={`fa-solid ${passoAtivo > passo.id ? 'fa-check' : passo.icone} text-lg`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`block font-bold text-sm ${
                    passoAtivo === passo.id 
                      ? 'text-white' 
                      : passoAtivo > passo.id
                        ? 'text-emerald-400'
                        : 'text-slate-300'
                  }`}>
                    {passo.rotulo}
                  </span>
                  <span className={`text-[11px] block mt-0.5 truncate ${
                    passoAtivo === passo.id 
                      ? 'text-indigo-100' 
                      : passoAtivo > passo.id
                        ? 'text-emerald-300/70'
                        : 'text-slate-500'
                  }`}>
                    {passo.descricao}
                  </span>
                </div>
                {passoAtivo === passo.id && (
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-indigo-600 rotate-45 border-r border-t border-indigo-400/30 hidden lg:block"></div>
                )}
              </div>

              {indice < PASSOS.length - 1 && (
                <div className="flex justify-center my-[-8px] relative z-0">
                  <div className={`w-0.5 h-8 transition-colors duration-500 ${
                    passoAtivo > passo.id ? 'bg-emerald-500/50' : 'bg-slate-800'
                  }`}></div>
                  <i className={`fa-solid fa-chevron-down text-[8px] absolute bottom-0 translate-y-1/2 transition-colors duration-500 ${
                    passoAtivo > passo.id ? 'text-emerald-500' : 'text-slate-800'
                  }`}></i>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </nav>
    </aside>
  );
};
