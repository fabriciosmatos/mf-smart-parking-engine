import React from 'react';
import { Assignment, Unit, ParkingSpace } from '../../types';
import { getRuleIconFromRuleName, formatRuleLabel } from '../../utils/iconesRegras';

interface ResultTableRowProps {
  unit: Unit;
  space: ParkingSpace;
  assignment: Assignment;
}

export const ResultTableRow: React.FC<ResultTableRowProps> = ({
  unit,
  space,
  assignment
}) => {
  return (
    <tr className="hover:bg-slate-50 transition-all group">
      <td className="px-4 md:px-6 lg:px-10 py-6">
        <div className="font-black text-slate-800 text-2xl leading-none italic">
          {unit.apartment}
        </div>
        <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2">
          Bloco {unit.block}
        </div>
      </td>
      <td className="px-4 md:px-6 lg:px-10 py-6 text-center">
        <div className="inline-flex flex-col items-center">
          <span className="px-6 py-2 bg-white text-indigo-700 rounded-xl font-mono font-black border border-indigo-100 shadow-sm text-lg">
            #{space.number}
          </span>
          <div className="flex gap-1.5 mt-2">
            <span
              title={space.coverage === 'COVERED' ? 'Vaga Coberta' : 'Vaga Descoberta'}
              className={`px-2 py-0.5 rounded-md text-[8px] font-black cursor-help uppercase shadow-sm ${
                space.coverage === 'COVERED' ? 'bg-indigo-100 text-indigo-700' : 'bg-orange-100 text-orange-700'
              }`}
            >
              {space.coverage === 'COVERED' ? 'COB' : 'DES'}
            </span>
            <span
              title={space.access === 'FREE' ? 'Acesso Livre (sem manobra)' : 'Vaga Presa (necessita manobra)'}
              className={`px-2 py-0.5 rounded-md text-[8px] font-black cursor-help uppercase shadow-sm ${
                space.access === 'FREE' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
              }`}
            >
              {space.access === 'FREE' ? 'LIV' : 'PRE'}
            </span>
          </div>
        </div>
      </td>
      <td className="px-4 md:px-6 lg:px-10 py-6">
        <div className="flex flex-wrap gap-2 max-w-md">
          {assignment.rulesApplied.map((rule, idx) => {
            const icon = getRuleIconFromRuleName(rule.name);
            const isPenalty = rule.points < 0;
            const isLegal = rule.name.toLowerCase().includes('legal') || rule.name.toLowerCase().includes('reserva');

            return (
              <div
                key={idx}
                title={`${formatRuleLabel(rule.name)} (${rule.satisfied ? 'Critério Satisfeito' : 'Não Aplicável para esta vaga'})`}
                className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all cursor-help ${
                  rule.satisfied
                    ? isLegal
                      ? 'bg-indigo-600 text-white border-indigo-700'
                      : isPenalty
                        ? 'bg-rose-500 text-white border-rose-600'
                        : 'bg-emerald-500 text-white border-emerald-600'
                    : 'bg-slate-50 text-slate-300 border-slate-100 opacity-40 grayscale'
                }`}
              >
                <i className={`fa-solid ${icon} text-[10px]`}></i>
              </div>
            );
          })}
        </div>
      </td>
      <td className="px-4 md:px-6 lg:px-10 py-6 text-right">
        <div className={`font-mono font-black text-xl italic leading-none ${
          assignment.score >= 5000 ? 'text-indigo-600' : 'text-slate-900'
        }`}>
          {assignment.score.toFixed(1)}
        </div>
      </td>
    </tr>
  );
};
