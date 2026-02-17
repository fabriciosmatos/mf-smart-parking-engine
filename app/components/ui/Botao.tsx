import React from 'react';

interface PropsBotao extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  variante?: 'primario' | 'secundario' | 'fantasma';
  children: React.ReactNode;
  aoClicar?: () => void;
}

export const Botao: React.FC<PropsBotao> = ({ 
  variante = 'primario', 
  children, 
  className = '',
  aoClicar,
  ...props 
}) => {
  const estilosBase = "px-6 sm:px-8 md:px-10 lg:px-12 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold sm:font-black uppercase tracking-wide sm:tracking-widest transition-all text-xs sm:text-sm";
  
  const estilosVariante = {
    primario: "bg-slate-900 text-white disabled:opacity-30",
    secundario: "bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 hover:scale-105",
    fantasma: "text-slate-400 hover:text-slate-900"
  };

  return (
    <button 
      className={`${estilosBase} ${estilosVariante[variante]} ${className}`}
      onClick={aoClicar}
      {...props}
    >
      {children}
    </button>
  );
};
