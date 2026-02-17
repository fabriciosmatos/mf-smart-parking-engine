import React, { useRef, useEffect, useState } from 'react';

interface PropsControleDeslizantePeso {
  chavePeso: string;
  valor: number;
  rotulo: string;
  icone: string;
  ehPenalidade: boolean;
  informacao: {
    descricao: string;
    aumentar: string;
    diminuir: string;
  };
  dicaAtivaTooltip: boolean;
  aoEntrarMouse: () => void;
  aoSairMouse: () => void;
  aoMudar: (valor: number) => void;
}

export const ControleDeslizantePeso: React.FC<PropsControleDeslizantePeso> = ({
  valor,
  rotulo,
  icone,
  ehPenalidade,
  informacao,
  dicaAtivaTooltip,
  aoEntrarMouse,
  aoSairMouse,
  aoMudar
}) => {
  const referenciaCartao = useRef<HTMLDivElement>(null);
  const [posicaoTooltip, setPosicaoTooltip] = useState<'topo' | 'direita' | 'baixo' | 'esquerda'>('topo');

  useEffect(() => {
    if (dicaAtivaTooltip && referenciaCartao.current) {
      const retangulo = referenciaCartao.current.getBoundingClientRect();
      const espacoDireita = window.innerWidth - retangulo.right;
      const espacoEsquerda = retangulo.left;
      const espacoTopo = retangulo.top;

      // Escolhe a posição com mais espaço
      if (espacoDireita > 350) {
        setPosicaoTooltip('direita');
      } else if (espacoEsquerda > 350) {
        setPosicaoTooltip('esquerda');
      } else if (espacoTopo > 300) {
        setPosicaoTooltip('topo');
      } else {
        setPosicaoTooltip('baixo');
      }
    }
  }, [dicaAtivaTooltip]);

  const obterClassesTooltip = () => {
    switch (posicaoTooltip) {
      case 'direita':
        return 'left-full top-0 ml-4';
      case 'esquerda':
        return 'right-full top-0 mr-4';
      case 'baixo':
        return 'top-full left-1/2 -translate-x-1/2 mt-4';
      default: // topo
        return 'bottom-full left-1/2 -translate-x-1/2 mb-4';
    }
  };

  const obterClassesSeta = () => {
    switch (posicaoTooltip) {
      case 'direita':
        return 'absolute right-full top-6 mr-[-1px]';
      case 'esquerda':
        return 'absolute left-full top-6 ml-[-1px]';
      case 'baixo':
        return 'absolute bottom-full left-1/2 -translate-x-1/2 mb-[-1px]';
      default: // topo
        return 'absolute top-full left-1/2 -translate-x-1/2 mt-[-1px]';
    }
  };

  const obterSeta = () => {
    switch (posicaoTooltip) {
      case 'direita':
        return <div className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[8px] border-r-slate-900"></div>;
      case 'esquerda':
        return <div className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[8px] border-l-slate-900"></div>;
      case 'baixo':
        return <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-slate-900"></div>;
      default: // topo
        return <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-slate-900"></div>;
    }
  };

  return (
    <div ref={referenciaCartao} className="group relative flex flex-col bg-slate-50 p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-[2rem] border border-slate-100 hover:border-indigo-400/50 hover:bg-white hover:shadow-2xl transition-all duration-300">
      <div className="flex justify-between items-start mb-4 sm:mb-6">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3 ${
          ehPenalidade ? 'bg-rose-500 text-white shadow-rose-200' : 'bg-indigo-600 text-white shadow-indigo-200'
        }`}>
          <i className={`fa-solid ${icone} text-base sm:text-lg`}></i>
        </div>
        <div className="flex flex-col items-end">
          <span className={`text-lg sm:text-xl font-black italic tracking-tighter ${
            ehPenalidade ? 'text-rose-600' : 'text-indigo-600'
          }`}>
            {ehPenalidade ? '-' : '+'}{valor}
          </span>
          <span className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest">Peso Atual</span>
        </div>
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h4 className="text-xs sm:text-sm font-black text-slate-800 leading-tight">{rotulo}</h4>
          <button
            onMouseEnter={aoEntrarMouse}
            onMouseLeave={aoSairMouse}
            onTouchStart={aoEntrarMouse}
            className="w-5 h-5 bg-white border border-slate-200 rounded-full flex items-center justify-center text-[10px] text-slate-400 hover:text-indigo-500 hover:border-indigo-300 transition-all flex-shrink-0"
          >
            <i className="fa-solid fa-info"></i>
          </button>
        </div>

        {dicaAtivaTooltip && (
          <>
            {/* Overlay para fechar tooltip em mobile */}
            <div 
              className="fixed inset-0 z-[9998] lg:hidden" 
              onClick={aoSairMouse}
              onTouchStart={aoSairMouse}
            />
            <div className={`absolute z-[9999] w-72 sm:w-80 bg-slate-900 text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl text-xs shadow-2xl border border-slate-700 animate-fadeIn ${obterClassesTooltip()}`}>
              {/* Seta dinâmica - apenas em desktop */}
              <div className={`hidden lg:block ${obterClassesSeta()}`}>
                {obterSeta()}
              </div>
              
              <p className="font-black mb-2 sm:mb-3 text-indigo-400 uppercase tracking-widest flex items-center gap-2 text-[10px]">
                <i className="fa-solid fa-circle-nodes"></i> Lógica de Decisão
              </p>
              <p className="mb-3 sm:mb-4 leading-relaxed text-slate-200 text-xs">{informacao.descricao}</p>
              <div className="space-y-2 sm:space-y-3 pt-2 sm:pt-3 border-t border-slate-700">
                <div className="bg-emerald-500/10 p-2 sm:p-3 rounded-lg sm:rounded-xl">
                  <p className="text-emerald-400 font-bold leading-snug flex items-start gap-2 text-xs">
                    <i className="fa-solid fa-arrow-up mt-0.5 flex-shrink-0"></i>
                    <span>{informacao.aumentar}</span>
                  </p>
                </div>
                <div className="bg-rose-500/10 p-2 sm:p-3 rounded-lg sm:rounded-xl">
                  <p className="text-rose-400 font-bold leading-snug flex items-start gap-2 text-xs">
                    <i className="fa-solid fa-arrow-down mt-0.5 flex-shrink-0"></i>
                    <span>{informacao.diminuir}</span>
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="mt-4 sm:mt-6">
        <input
          type="range"
          min="0"
          max="250"
          value={valor}
          onChange={(e) => aoMudar(parseInt(e.target.value))}
          className={`w-full h-1.5 rounded-full appearance-none cursor-pointer ${
            ehPenalidade ? 'accent-rose-500 bg-rose-100' : 'accent-indigo-600 bg-indigo-100'
          }`}
        />
        <div className="flex justify-between mt-2 text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-tighter">
          <span>Mín</span>
          <span>Média</span>
          <span>Máx</span>
        </div>
      </div>
    </div>
  );
};
