import React from 'react';

interface HeaderProps {
  currentStepDesc: string;
}

export const Header: React.FC<HeaderProps> = ({ currentStepDesc }) => {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-10 z-10">
      <div className="flex items-center gap-4">
        <div className="h-8 w-1 bg-indigo-500 rounded-full"></div>
        <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">
          {currentStepDesc}
        </h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-black">
            Versão
          </span>
          <span className="text-xs text-slate-600 font-bold">SPE v2.5</span>
        </div>
      </div>
    </header>
  );
};
