import React, { useMemo } from 'react';
import { Unit, ParkingSpace } from '../../types';

interface SimulationStepProps {
  isRaffling: boolean;
  onStartRaffle: () => void;
  units: Unit[];
  spaces: ParkingSpace[];
}

export const SimulationStep: React.FC<SimulationStepProps> = ({
  isRaffling,
  onStartRaffle,
  units,
  spaces
}) => {
  // Calcula total de solicitações (cada unidade pode ter múltiplas vagas)
  const totalRequests = useMemo(() => {
    return units.reduce((acc, unit) => acc + unit.carSpaces + unit.motoSpaces, 0);
  }, [units]);

  const totalSpaces = spaces.length;
  const hasInventoryDeficit = totalRequests > totalSpaces;
  const canStartRaffle = !hasInventoryDeficit && !isRaffling;

  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-fadeIn px-6 pt-16">
      <div className={`w-32 h-32 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center mb-8 border border-slate-100 ${
        isRaffling ? 'animate-spin-slow' : 'animate-float'
      }`}>
        <i className="fa-solid fa-microchip text-5xl text-indigo-600"></i>
      </div>
      <h2 className="text-3xl font-black text-slate-900 mb-4 italic tracking-tight">
        Processamento Algorítmico
      </h2>
      
      {hasInventoryDeficit ? (
        <div className="max-w-lg mb-8">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-4">
            <div className="flex items-center justify-center gap-3 mb-3">
              <i className="fa-solid fa-triangle-exclamation text-3xl text-red-600"></i>
              <h3 className="text-xl font-black text-red-900">ERRO CRÍTICO RN01</h3>
            </div>
            <p className="text-red-800 font-bold mb-4">
              Déficit de inventário detectado
            </p>
            <div className="bg-white rounded-xl p-4 font-mono text-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-600">Solicitações:</span>
                <span className="font-black text-red-600 text-xl">{totalRequests}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-600">Vagas disponíveis:</span>
                <span className="font-black text-slate-900 text-xl">{totalSpaces}</span>
              </div>
              <div className="border-t-2 border-slate-200 pt-2 mt-2 flex justify-between items-center">
                <span className="text-slate-600">Déficit:</span>
                <span className="font-black text-red-600 text-xl">-{totalRequests - totalSpaces}</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 mt-4 italic">
              ⚠️ Volte para o Passo 1 e ajuste os dados: reduza unidades ou aumente vagas.
            </p>
          </div>
        </div>
      ) : (
        <div className="mb-12">
          <p className="text-slate-500 max-w-lg mb-4 font-medium leading-relaxed italic">
            Cruzando inventário físico com demandas prioritárias para garantir equidade.
          </p>
          <div className="flex justify-center gap-8 text-sm">
            <div className={`px-6 py-3 rounded-xl ${totalRequests === totalSpaces ? 'bg-emerald-50' : 'bg-slate-50'}`}>
              <span className="text-slate-500 block mb-1">Solicitações</span>
              <span className={`font-black text-2xl ${totalRequests === totalSpaces ? 'text-emerald-600' : 'text-slate-900'}`}>{totalRequests}</span>
            </div>
            <div className={`px-6 py-3 rounded-xl ${totalRequests === totalSpaces ? 'bg-emerald-50' : 'bg-emerald-50'}`}>
              <span className="text-slate-500 block mb-1">Vagas Disponíveis</span>
              <span className="font-black text-2xl text-emerald-600">{totalSpaces}</span>
            </div>
          </div>
          {totalRequests === totalSpaces && (
            <p className="text-xs text-emerald-600 font-bold mt-3 flex items-center justify-center gap-2">
              <i className="fa-solid fa-check-double"></i>
              Inventário perfeito: 100% de aproveitamento
            </p>
          )}
        </div>
      )}
      
      <button
        onClick={onStartRaffle}
        disabled={!canStartRaffle}
        className={`px-16 py-6 rounded-2xl text-xl font-black tracking-widest shadow-2xl transition-all ${
          !canStartRaffle 
            ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
            : 'bg-indigo-600 text-white uppercase hover:bg-indigo-500'
        }`}
      >
        {isRaffling ? 'Calculando Matriz...' : hasInventoryDeficit ? 'Dados Inválidos' : 'Iniciar Sorteio'}
      </button>
    </div>
  );
};
