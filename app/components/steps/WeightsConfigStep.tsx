import React, { useState } from 'react';
import { RaffleConfig } from '../../types';
import { Botao } from '../ui/Botao';
import { ControleDeslizantePeso } from '../ui/ControleDeslizantePeso';
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
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-full">
      <div className="bg-white p-4 sm:p-6 md:p-8 lg:p-10 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-x-hidden max-w-full">
        <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center mb-8 sm:mb-10 gap-4 sm:gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight italic">
              Matriz de Pesos e Justiça
            </h2>
            <p className="text-sm sm:text-base text-slate-500 font-medium italic mt-1">
              Calibre o motor SPE para refletir as prioridades da sua assembleia.
            </p>
          </div>
          <div className="bg-[#0f172a] p-3 sm:p-4 rounded-xl sm:rounded-2xl text-white shadow-xl flex items-center gap-3 sm:gap-4 border border-slate-700">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center border border-indigo-500/30 flex-shrink-0">
              <i className="fa-solid fa-fingerprint text-indigo-400 text-sm sm:text-base"></i>
            </div>
            <div className="min-w-0">
              <label className="text-[9px] sm:text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-0.5">
                Seed de Auditoria
              </label>
              <input
                type="text"
                value={config.seed}
                onChange={(e) => onUpdateSeed(e.target.value)}
                className="bg-transparent font-mono text-xs sm:text-sm outline-none w-24 sm:w-32 focus:text-indigo-300 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {Object.entries(config.weights).map(([key, value]) => {
            const info = WEIGHT_INFO[key];
            const isPenalty = key.includes('Penalty');
            const icon = WEIGHT_ICONS[key];
            const label = WEIGHT_TRANSLATIONS[key];

            return (
              <ControleDeslizantePeso
                key={key}
                chavePeso={key}
                valor={value}
                rotulo={label}
                icone={icon}
                ehPenalidade={isPenalty}
                informacao={{
                  descricao: info.desc,
                  aumentar: info.up,
                  diminuir: info.down
                }}
                dicaAtivaTooltip={activeTooltip === key}
                aoEntrarMouse={() => setActiveTooltip(key)}
                aoSairMouse={() => setActiveTooltip(null)}
                aoMudar={(newValue) => onUpdateWeight(key, newValue)}
              />
            );
          })}
        </div>

        <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row justify-between items-start sm:items-center border-t border-slate-100 pt-6 sm:pt-10 gap-4">
          <Botao variante="fantasma" aoClicar={onBack} className="flex items-center gap-3">
            <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> Voltar
          </Botao>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <div className="hidden xl:block text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confirmação</p>
              <p className="text-xs font-bold text-slate-600 italic">Parâmetros prontos para simulação</p>
            </div>
            <Botao variante="secundario" aoClicar={onNext}>
              Simular Alocação <i className="fa-solid fa-chevron-right ml-3"></i>
            </Botao>
          </div>
        </div>
      </div>
    </div>
  );
};
