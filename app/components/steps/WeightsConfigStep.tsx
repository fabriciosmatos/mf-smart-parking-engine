import React, { useState } from 'react';
import { RaffleConfig } from '../../types';
import { Button } from '../ui/Button';
import { WeightSlider } from '../ui/WeightSlider';
import { WEIGHT_TRANSLATIONS, WEIGHT_ICONS, WEIGHT_INFO } from '../../constants/weights';

interface WeightsConfigStepProps {
  config: RaffleConfig;
  onUpdateWeight: (key: string, value: number) => void;
  onUpdateSeed: (seed: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export const WeightsConfigStep: React.FC<WeightsConfigStepProps> = ({
  config,
  onUpdateWeight,
  onUpdateSeed,
  onBack,
  onNext
}) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-white p-10 rounded-3xl shadow-2xl border border-slate-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight italic">
              Matriz de Pesos e Justiça
            </h2>
            <p className="text-slate-500 font-medium italic mt-1">
              Calibre o motor SPE para refletir as prioridades da sua assembleia.
            </p>
          </div>
          <div className="bg-[#0f172a] p-4 rounded-2xl text-white shadow-xl flex items-center gap-4 border border-slate-700">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center border border-indigo-500/30">
              <i className="fa-solid fa-fingerprint text-indigo-400"></i>
            </div>
            <div>
              <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-0.5">
                Seed de Auditoria
              </label>
              <input
                type="text"
                value={config.seed}
                onChange={(e) => onUpdateSeed(e.target.value)}
                className="bg-transparent font-mono text-sm outline-none w-32 focus:text-indigo-300 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(config.weights).map(([key, value]) => {
            const info = WEIGHT_INFO[key];
            const isPenalty = key.includes('Penalty');
            const icon = WEIGHT_ICONS[key];
            const label = WEIGHT_TRANSLATIONS[key];

            return (
              <WeightSlider
                key={key}
                weightKey={key}
                value={value}
                label={label}
                icon={icon}
                isPenalty={isPenalty}
                info={info}
                isTooltipActive={activeTooltip === key}
                onMouseEnter={() => setActiveTooltip(key)}
                onMouseLeave={() => setActiveTooltip(null)}
                onChange={(newValue) => onUpdateWeight(key, newValue)}
              />
            );
          })}
        </div>

        <div className="mt-12 flex justify-between items-center border-t border-slate-100 pt-10">
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-3">
            <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> Voltar
          </Button>
          <div className="flex items-center gap-4">
            <div className="hidden lg:block text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confirmação</p>
              <p className="text-xs font-bold text-slate-600 italic">Parâmetros prontos para simulação</p>
            </div>
            <Button variant="secondary" onClick={onNext}>
              Simular Alocação <i className="fa-solid fa-chevron-right ml-3"></i>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
