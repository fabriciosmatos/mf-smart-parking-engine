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
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">\n        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight italic leading-none">
            Mapa de Ocupação Final
          </h2>
          <p className="text-slate-500 font-medium italic mt-2 text-sm">
            Passe o mouse sobre os ícones para ver detalhes de cada regra.
          </p>
        </div>
        <div className="flex gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-[9px] font-black text-slate-500 uppercase">Aplicada</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-200"></span>
            <span className="text-[9px] font-black text-slate-500 uppercase">Não Aplicável</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-slate-100 shadow-inner max-h-[700px] overflow-y-auto custom-scrollbar">\n        <table className="w-full text-left text-sm min-w-[1000px] border-separate border-spacing-0">
          <thead className="bg-slate-900 text-white sticky top-0 uppercase text-[10px] font-black z-20 tracking-widest">
            <tr>
              <th className="px-10 py-6">Unidade</th>
              <th className="px-10 py-6 text-center">Vaga / Atributos</th>
              <th className="px-10 py-6">Análise de Regras</th>
              <th className="px-10 py-6 text-right">Score</th>
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
