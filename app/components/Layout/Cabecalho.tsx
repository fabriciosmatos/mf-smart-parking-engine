import React from 'react';

interface PropsCabecalho {
  descricaoPassoAtual: string;
  aoClicarMenu: () => void;
}

export const Cabecalho: React.FC<PropsCabecalho> = ({ descricaoPassoAtual, aoClicarMenu }) => {
  return (
    <header className="h-16 sm:h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 md:px-10 z-10">
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Botão de menu para mobile */}
        <button
          onClick={aoClicarMenu}
          className="lg:hidden w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Abrir menu"
        >
          <i className="fa-solid fa-bars text-xl"></i>
        </button>

        <div className="h-6 sm:h-8 w-1 bg-indigo-500 rounded-full"></div>
        <h2 className="text-sm sm:text-lg md:text-xl font-bold text-slate-800 uppercase tracking-tight">
          {descricaoPassoAtual}
        </h2>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        <div className="text-right">
          <span className="text-[8px] sm:text-[9px] text-slate-400 uppercase tracking-widest block font-black">
            Versão
          </span>
          <span className="text-xs text-slate-600 font-bold">SPE v3.0</span>
        </div>
      </div>
    </header>
  );
};
