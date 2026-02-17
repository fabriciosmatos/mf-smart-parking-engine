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
  // Calcula solicitações por tipo
  const { carRequests, motoRequests } = useMemo(() => {
    const carRequests = units.reduce((acc, u) => acc + u.carSpaces, 0);
    const motoRequests = units.reduce((acc, u) => acc + u.motoSpaces, 0);
    return { carRequests, motoRequests };
  }, [units]);

  // Conta vagas por tipo
  const { carSpaces, motoSpaces } = useMemo(() => {
    const carSpaces = spaces.filter(s => s.type !== 'MOTO').length;
    const motoSpaces = spaces.filter(s => s.type === 'MOTO').length;
    return { carSpaces, motoSpaces };
  }, [spaces]);

  const hasCarDeficit = carRequests > carSpaces;
  const hasMotoDeficit = motoRequests > motoSpaces;
  const hasInventoryDeficit = hasCarDeficit || hasMotoDeficit;
  const canStartRaffle = !hasInventoryDeficit && !isRaffling;

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] sm:h-[60vh] text-center animate-fadeIn px-4 sm:px-6 pt-8 sm:pt-16">
      <div className={`w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-white rounded-2xl sm:rounded-[2.5rem] shadow-2xl flex items-center justify-center mb-6 sm:mb-8 border border-slate-100 ${
        isRaffling ? 'animate-spin-slow' : 'animate-float'
      }`}>
        <i className="fa-solid fa-microchip text-4xl sm:text-5xl text-indigo-600"></i>
      </div>
      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3 sm:mb-4 italic tracking-tight px-4">
        Processamento Algorítmico
      </h2>
      
      {hasInventoryDeficit ? (
        <div className="max-w-2xl mb-6 sm:mb-8 w-full">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3">
              <i className="fa-solid fa-triangle-exclamation text-2xl sm:text-3xl text-red-600"></i>
              <h3 className="text-lg sm:text-xl font-black text-red-900">ERRO CRÍTICO RN01</h3>
            </div>
            <p className="text-sm sm:text-base text-red-800 font-bold mb-3 sm:mb-4">
              {hasCarDeficit && hasMotoDeficit 
                ? "Déficit em vagas de CARRO e MOTO"
                : hasCarDeficit 
                  ? "Déficit em vagas de CARRO"
                  : "Déficit em vagas de MOTO"}
            </p>
            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 font-mono text-xs sm:text-sm space-y-2 sm:space-y-3">
              {/* Vagas de Carro */}
              <div className={hasCarDeficit ? 'opacity-100' : 'opacity-60'}>
                <div className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <i className="fa-solid fa-car"></i> Vagas de CARRO (P, M, G)
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-600">Solicitações:</span>
                  <span className={`font-black text-base sm:text-lg ${hasCarDeficit ? 'text-red-600' : 'text-slate-900'}`}>{carRequests}</span>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-600">Vagas disponíveis:</span>
                  <span className="font-black text-base sm:text-lg text-slate-900">{carSpaces}</span>
                </div>
                {hasCarDeficit && (
                  <div className="border-t-2 border-slate-200 pt-2 mt-2 flex justify-between items-center">
                    <span className="text-slate-600">Faltam:</span>
                    <span className="font-black text-red-600 text-base sm:text-lg">-{carRequests - carSpaces}</span>
                  </div>
                )}
              </div>

              {/* Vagas de Moto */}
              <div className={hasMotoDeficit ? 'opacity-100' : 'opacity-60'}>
                <div className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <i className="fa-solid fa-motorcycle"></i> Vagas de MOTO
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-600">Solicitações:</span>
                  <span className={`font-black text-base sm:text-lg ${hasMotoDeficit ? 'text-red-600' : 'text-slate-900'}`}>{motoRequests}</span>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-600">Vagas disponíveis:</span>
                  <span className="font-black text-base sm:text-lg text-slate-900">{motoSpaces}</span>
                </div>
                {hasMotoDeficit && (
                  <div className="border-t-2 border-slate-200 pt-2 mt-2 flex justify-between items-center">
                    <span className="text-slate-600">Faltam:</span>
                    <span className="font-black text-red-600 text-base sm:text-lg">-{motoRequests - motoSpaces}</span>
                  </div>
                )}
              </div>
            </div>
            <p className="text-xs text-slate-600 mt-3 sm:mt-4 italic">
              ⚠️ Volte para o Passo 1 e ajuste os dados: reduza unidades ou aumente vagas.
            </p>
          </div>
        </div>
      ) : (
        <div className="mb-8 sm:mb-12 w-full">
          <p className="text-sm sm:text-base text-slate-500 max-w-lg mx-auto mb-3 sm:mb-4 font-medium leading-relaxed italic px-4">
            Cruzando inventário físico com demandas prioritárias para garantir equidade.
          </p>
          <div className="flex justify-center gap-3 sm:gap-6 text-xs sm:text-sm flex-wrap">
            {/* Carro */}
            <div className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl ${carRequests === carSpaces ? 'bg-emerald-50' : 'bg-slate-50'}`}>
              <div className="flex items-center gap-2 mb-1">
                <i className="fa-solid fa-car text-slate-500 text-xs sm:text-base"></i>
                <span className="text-slate-500 font-bold">Carro</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`font-black text-xl sm:text-2xl ${carRequests === carSpaces ? 'text-emerald-600' : 'text-slate-900'}`}>{carRequests}</span>
                <span className="text-slate-400">/</span>
                <span className="font-bold text-base sm:text-lg text-slate-600">{carSpaces}</span>
              </div>
            </div>
            
            {/* Moto */}
            <div className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl ${motoRequests === motoSpaces ? 'bg-emerald-50' : 'bg-slate-50'}`}>
              <div className="flex items-center gap-2 mb-1">
                <i className="fa-solid fa-motorcycle text-slate-500 text-xs sm:text-base"></i>
                <span className="text-slate-500 font-bold">Moto</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`font-black text-xl sm:text-2xl ${motoRequests === motoSpaces ? 'text-emerald-600' : 'text-slate-900'}`}>{motoRequests}</span>
                <span className="text-slate-400">/</span>
                <span className="font-bold text-base sm:text-lg text-slate-600">{motoSpaces}</span>
              </div>
            </div>
          </div>
          {carRequests === carSpaces && motoRequests === motoSpaces && (
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
        className={`px-8 sm:px-12 md:px-16 py-4 sm:py-5 md:py-6 rounded-xl sm:rounded-2xl text-base sm:text-lg md:text-xl font-black tracking-wide sm:tracking-widest shadow-2xl transition-all ${
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
