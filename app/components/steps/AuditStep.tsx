import React from 'react';
import { RaffleResult, Unit, ParkingSpace } from '../../types';
import { CartaoKPI } from '../ui/CartaoKPI';
import { ResultsTable } from './ResultsTable';
import { AuditHeader } from './AuditHeader';
import { KPI_CONFIGS } from '../../constants/kpis';

interface AuditStepProps {
  result: RaffleResult;
  units: Unit[];
  spaces: ParkingSpace[];
  onDownloadAudit: () => void;
}

export const AuditStep: React.FC<AuditStepProps> = ({
  result,
  units,
  spaces,
  onDownloadAudit
}) => {
  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-full">
      <div className="bg-white p-4 sm:p-6 md:p-8 lg:p-10 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-x-hidden max-w-full">
        <AuditHeader result={result} onDownload={onDownloadAudit} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-6 sm:mt-8">
          {KPI_CONFIGS.map((kpi, i) => (
            <CartaoKPI
              key={i}
              rotulo={kpi.label}
              valor={result.stats[kpi.key]}
              cor={kpi.color}
              descricao={kpi.desc}
            />
          ))}
        </div>

        <div className="mt-6 sm:mt-8 max-w-full overflow-x-auto">
          <ResultsTable
            assignments={result.assignments}
            units={units}
            spaces={spaces}
          />
        </div>
      </div>
    </div>
  );
};
