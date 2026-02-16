import React from 'react';
import { RaffleResult, Unit, ParkingSpace } from '../../types';
import { KPICard } from '../ui/KPICard';
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
    <div className="space-y-8 animate-fadeIn pb-20">
      <AuditHeader result={result} onDownload={onDownloadAudit} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {KPI_CONFIGS.map((kpi, i) => (
          <KPICard
            key={i}
            label={kpi.label}
            value={result.stats[kpi.key]}
            color={kpi.color}
            desc={kpi.desc}
          />
        ))}
      </div>

      <ResultsTable
        assignments={result.assignments}
        units={units}
        spaces={spaces}
      />
    </div>
  );
};
