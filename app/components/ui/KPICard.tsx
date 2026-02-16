import React from 'react';

interface KPICardProps {
  label: string;
  value: number;
  color: string;
  desc: string;
}

export const KPICard: React.FC<KPICardProps> = ({ label, value, color, desc }) => {
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-slate-100 transition-all hover:scale-105">
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-4">
        {label}
      </span>
      <div className={`text-3xl font-black text-${color}-600 mb-2 italic tracking-tighter`}>
        {value.toFixed(0)}%
      </div>
      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-3">
        <div 
          className={`h-full bg-${color}-500 rounded-full`} 
          style={{ width: `${value}%` }}
        ></div>
      </div>
      <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter italic">
        {desc}
      </p>
    </div>
  );
};
