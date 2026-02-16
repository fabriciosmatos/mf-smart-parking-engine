import React, { useRef, useEffect, useState } from 'react';

interface WeightSliderProps {
  weightKey: string;
  value: number;
  label: string;
  icon: string;
  isPenalty: boolean;
  info: {
    desc: string;
    up: string;
    down: string;
  };
  isTooltipActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onChange: (value: number) => void;
}

export const WeightSlider: React.FC<WeightSliderProps> = ({
  value,
  label,
  icon,
  isPenalty,
  info,
  isTooltipActive,
  onMouseEnter,
  onMouseLeave,
  onChange
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tooltipPosition, setTooltipPosition] = useState<'top' | 'right' | 'bottom' | 'left'>('top');

  useEffect(() => {
    if (isTooltipActive && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const spaceRight = window.innerWidth - rect.right;
      const spaceLeft = rect.left;
      const spaceTop = rect.top;

      // Escolhe a posição com mais espaço
      if (spaceRight > 350) {
        setTooltipPosition('right');
      } else if (spaceLeft > 350) {
        setTooltipPosition('left');
      } else if (spaceTop > 300) {
        setTooltipPosition('top');
      } else {
        setTooltipPosition('bottom');
      }
    }
  }, [isTooltipActive]);

  const getTooltipClasses = () => {
    switch (tooltipPosition) {
      case 'right':
        return 'left-full top-0 ml-4';
      case 'left':
        return 'right-full top-0 mr-4';
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-4';
      default: // top
        return 'bottom-full left-1/2 -translate-x-1/2 mb-4';
    }
  };

  const getArrowClasses = () => {
    switch (tooltipPosition) {
      case 'right':
        return 'absolute right-full top-6 mr-[-1px]';
      case 'left':
        return 'absolute left-full top-6 ml-[-1px]';
      case 'bottom':
        return 'absolute bottom-full left-1/2 -translate-x-1/2 mb-[-1px]';
      default: // top
        return 'absolute top-full left-1/2 -translate-x-1/2 mt-[-1px]';
    }
  };

  const getArrow = () => {
    switch (tooltipPosition) {
      case 'right':
        return <div className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[8px] border-r-slate-900"></div>;
      case 'left':
        return <div className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[8px] border-l-slate-900"></div>;
      case 'bottom':
        return <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-slate-900"></div>;
      default: // top
        return <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-slate-900"></div>;
    }
  };

  return (
    <div ref={cardRef} className="group relative flex flex-col bg-slate-50 p-6 rounded-[2rem] border border-slate-100 hover:border-indigo-400/50 hover:bg-white hover:shadow-2xl transition-all duration-300">
      <div className="flex justify-between items-start mb-6">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3 ${
          isPenalty ? 'bg-rose-500 text-white shadow-rose-200' : 'bg-indigo-600 text-white shadow-indigo-200'
        }`}>
          <i className={`fa-solid ${icon} text-lg`}></i>
        </div>
        <div className="flex flex-col items-end">
          <span className={`text-xl font-black italic tracking-tighter ${
            isPenalty ? 'text-rose-600' : 'text-indigo-600'
          }`}>
            {isPenalty ? '-' : '+'}{value}
          </span>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Peso Atual</span>
        </div>
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h4 className="text-sm font-black text-slate-800 leading-tight">{label}</h4>
          <button
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className="w-5 h-5 bg-white border border-slate-200 rounded-full flex items-center justify-center text-[10px] text-slate-400 hover:text-indigo-500 hover:border-indigo-300 transition-all"
          >
            <i className="fa-solid fa-info"></i>
          </button>
        </div>

        {isTooltipActive && (
          <div className={`absolute z-[9999] w-80 bg-slate-900 text-white p-6 rounded-2xl text-xs shadow-2xl border border-slate-700 animate-fadeIn ${getTooltipClasses()}`}>
            {/* Seta dinâmica */}
            <div className={getArrowClasses()}>
              {getArrow()}
            </div>
            
            <p className="font-black mb-3 text-indigo-400 uppercase tracking-widest flex items-center gap-2 text-[10px]">
              <i className="fa-solid fa-circle-nodes"></i> Lógica de Decisão
            </p>
            <p className="mb-4 leading-relaxed text-slate-200">{info.desc}</p>
            <div className="space-y-3 pt-3 border-t border-slate-700">
              <div className="bg-emerald-500/10 p-3 rounded-xl">
                <p className="text-emerald-400 font-bold leading-snug flex items-start gap-2">
                  <i className="fa-solid fa-arrow-up mt-0.5"></i>
                  <span>{info.up}</span>
                </p>
              </div>
              <div className="bg-rose-500/10 p-3 rounded-xl">
                <p className="text-rose-400 font-bold leading-snug flex items-start gap-2">
                  <i className="fa-solid fa-arrow-down mt-0.5"></i>
                  <span>{info.down}</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6">
        <input
          type="range"
          min="0"
          max="250"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className={`w-full h-1.5 rounded-full appearance-none cursor-pointer ${
            isPenalty ? 'accent-rose-500 bg-rose-100' : 'accent-indigo-600 bg-indigo-100'
          }`}
        />
        <div className="flex justify-between mt-2 text-[9px] font-black text-slate-400 uppercase tracking-tighter">
          <span>Min</span>
          <span>Média</span>
          <span>Máx</span>
        </div>
      </div>
    </div>
  );
};
