import React from 'react';

interface SimulationStepProps {
  isRaffling: boolean;
  onStartRaffle: () => void;
}

export const SimulationStep: React.FC<SimulationStepProps> = ({
  isRaffling,
  onStartRaffle
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-fadeIn px-6">
      <div className={`w-32 h-32 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center mb-8 border border-slate-100 ${
        isRaffling ? 'animate-spin-slow' : 'animate-float'
      }`}>
        <i className="fa-solid fa-microchip text-5xl text-indigo-600"></i>
      </div>
      <h2 className="text-3xl font-black text-slate-900 mb-4 italic tracking-tight">
        Processamento Algorítmico
      </h2>
      <p className="text-slate-500 max-w-lg mb-12 font-medium leading-relaxed italic">
        Cruzando inventário físico com demandas prioritárias para garantir equidade.
      </p>
      <button
        onClick={onStartRaffle}
        disabled={isRaffling}
        className={`px-16 py-6 rounded-2xl text-xl font-black tracking-widest shadow-2xl transition-all ${
          isRaffling ? 'bg-slate-200 text-slate-400' : 'bg-indigo-600 text-white uppercase'
        }`}
      >
        {isRaffling ? 'Calculando Matriz...' : 'Iniciar Sorteio'}
      </button>
    </div>
  );
};
