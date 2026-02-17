import React from 'react';
import { Assignment, Unit, ParkingSpace } from '../../types';
import { ResultTableRow } from './ResultTableRow';

interface ResultsTableProps {
  assignments: Assignment[];
  units: Unit[];
  spaces: ParkingSpace[];
}

export const ResultsTable: React.FC<ResultsTableProps> = ({
  assignments,
  units,
  spaces
}) => {
  return (
    <div className="max-w-full">
      <div className="mb-6 sm:mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight italic leading-none">
            Mapa de Ocupação Final
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium italic mt-1 sm:mt-2">
            <span className="hidden sm:inline">Passe o mouse sobre os ícones para ver detalhes de cada regra.</span>
            <span className="sm:hidden">Toque nos ícones para ver detalhes.</span>
          </p>
        </div>
        <div className="flex gap-3 sm:gap-4 bg-slate-50 p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-slate-100">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></span>
            <span className="text-[8px] sm:text-[9px] font-black text-slate-500 uppercase">Aplicada</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-200 flex-shrink-0"></span>
            <span className="text-[8px] sm:text-[9px] font-black text-slate-500 uppercase">Não Aplicável</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl sm:rounded-3xl border border-slate-100 shadow-inner max-h-[500px] sm:max-h-[700px] overflow-y-auto custom-scrollbar">
        <table className="w-full text-left text-xs sm:text-sm min-w-[800px] border-separate border-spacing-0">
          <thead className="bg-slate-900 text-white sticky top-0 uppercase text-[9px] sm:text-[10px] font-black z-20 tracking-widest">
            <tr>
              <th className="px-3 sm:px-4 md:px-6 lg:px-10 py-4 sm:py-6">Unidade</th>
              <th className="px-3 sm:px-4 md:px-6 lg:px-10 py-4 sm:py-6 text-center">Vaga / Atributos</th>
              <th className="px-3 sm:px-4 md:px-6 lg:px-10 py-4 sm:py-6">Análise de Regras</th>
              <th className="px-3 sm:px-4 md:px-6 lg:px-10 py-4 sm:py-6 text-right">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {assignments.map((assignment, index) => {
              const unit = units.find(u => u.id === assignment.unitId)!;
              const space = spaces.find(s => s.id === assignment.spaceId)!;

              return (
                <ResultTableRow
                  key={index}
                  unit={unit}
                  space={space}
                  assignment={assignment}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
