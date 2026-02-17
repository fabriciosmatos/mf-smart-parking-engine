import React from 'react';

interface PropsCartaoKPI {
  rotulo: string;
  valor: number;
  cor: string;
  descricao: string;
}

export const CartaoKPI: React.FC<PropsCartaoKPI> = ({ rotulo, valor, cor, descricao }) => {
  return (
    <div className="bg-white p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-[2rem] shadow-xl border border-slate-100 transition-all hover:scale-105">
      <span className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 sm:mb-4">
        {rotulo}
      </span>
      <div className={`text-2xl sm:text-3xl font-black text-${cor}-600 mb-2 italic tracking-tighter`}>
        {valor.toFixed(0)}%
      </div>
      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-2 sm:mb-3">
        <div 
          className={`h-full bg-${cor}-500 rounded-full`} 
          style={{ width: `${valor}%` }}
        ></div>
      </div>
      <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter italic">
        {descricao}
      </p>
    </div>
  );
};
