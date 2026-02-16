import React, { useState } from 'react';
import { Layout } from './components/Layout/Layout';
import { DataIngestionStep } from './components/steps/DataIngestionStep';
import { WeightsConfigStep } from './components/steps/WeightsConfigStep';
import { SimulationStep } from './components/steps/SimulationStep';
import { AuditStep } from './components/steps/AuditStep';
import { useCSVData } from './hooks/useCSVData';
import { useRaffleConfig } from './hooks/useRaffleConfig';
import { useRaffleExecution } from './hooks/useRaffleExecution';
import { useAuditPackage } from './hooks/useAuditPackage';
import { generateMockUnits, generateMockSpaces } from './utils/dadosSimulados';

const App: React.FC = () => {
  const [step, setStep] = useState(1);
  
  const { 
    units, 
    spaces,
    allocationsCount,
    rawUnitsCsv, 
    rawSpacesCsv, 
    handleFileUpload, 
    loadMockData 
  } = useCSVData();
  
  const { config, updateWeight, updateSeed } = useRaffleConfig();
  const { result, isRaffling, executeRaffle } = useRaffleExecution();
  const { generateAuditPackage } = useAuditPackage();

  const handleGenerateMock = () => {
    const unitCount = Math.floor(Math.random() * (70 - 50 + 1)) + 50;
    
    // Gera unidades primeiro para calcular solicitações reais
    const mockUnits = generateMockUnits(unitCount, undefined);
    
    // Calcula total de solicitações baseado nas unidades criadas
    const totalRequests = mockUnits.reduce((acc, u) => acc + u.carSpaces + u.motoSpaces, 0);
    
    // Gera EXATAMENTE o mesmo número de vagas que solicitações
    const mockSpaces = generateMockSpaces(totalRequests);
    
    // Agora sim, enriquece as unidades com histórico baseado nas vagas reais
    const enrichedUnits = generateMockUnits(unitCount, mockSpaces);
    
    loadMockData(enrichedUnits, mockSpaces);
  };

  const handleStartRaffle = async () => {
    const raffleResult = await executeRaffle(units, spaces, config);
    
    if (raffleResult) {
      setStep(4);
      setTimeout(() => {
        generateAuditPackage(raffleResult, units, spaces, rawUnitsCsv, rawSpacesCsv);
      }, 800);
    }
  };

  const handleDownloadAudit = () => {
    if (result) {
      generateAuditPackage(result, units, spaces, rawUnitsCsv, rawSpacesCsv);
    }
  };

  return (
    <Layout activeStep={step}>
      {step === 1 && (
        <DataIngestionStep
          unitsCount={units.length}
          spacesCount={spaces.length}
          allocationsCount={allocationsCount}
          units={units}
          onFileUpload={handleFileUpload}
          onGenerateMock={handleGenerateMock}
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <WeightsConfigStep
          config={config}
          onUpdateWeight={updateWeight}
          onUpdateSeed={updateSeed}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <SimulationStep
          isRaffling={isRaffling}
          onStartRaffle={handleStartRaffle}
          units={units}
          spaces={spaces}
        />
      )}

      {step === 4 && result && (
        <AuditStep
          result={result}
          units={units}
          spaces={spaces}
          onDownloadAudit={handleDownloadAudit}
        />
      )}
    </Layout>
  );
};

export default App;
