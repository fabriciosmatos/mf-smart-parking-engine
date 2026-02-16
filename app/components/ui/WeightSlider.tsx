import React from 'react';

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
  return (
    <div className="group relative flex flex-col bg-slate-50 p-6 rounded-[2rem] border border-slate-100 hover:border-indigo-400/50 hover:bg-white hover:shadow-2xl transition-all duration-300 overflow-visible">
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
          <div className="absolute z-[9999] bottom-full left-1/2 -translate-x-1/2 mb-4 w-72 bg-slate-900 text-white p-6 rounded-3xl text-[11px] shadow-2xl border border-slate-800 animate-fadeIn pointer-events-none">
            <p className="font-black mb-3 text-indigo-400 uppercase tracking-widest flex items-center gap-2">
              <i className="fa-solid fa-circle-nodes"></i> Lógica de Decisão
            </p>
            <p className="mb-4 leading-relaxed text-slate-300 italic">"{info.desc}"</p>
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <p className="text-emerald-400 font-bold leading-snug">
                <i className="fa-solid fa-caret-up mr-2"></i>{info.up}
              </p>
              <p className="text-slate-400 font-medium leading-snug">
                <i className="fa-solid fa-caret-down mr-2"></i>{info.down}
              </p>
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-4 h-4 bg-slate-900 rotate-45 -mt-2"></div>
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
