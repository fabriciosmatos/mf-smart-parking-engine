import React, { useState } from 'react';
import { Layout } from './components/Layout/Layout';
import { PassoIngestao } from './components/steps/PassoIngestao';
import { PassoConfiguracaoPesos } from './components/steps/PassoConfiguracaoPesos';
import { PassoSimulacao } from './components/steps/PassoSimulacao';
import { PassoAuditoria } from './components/steps/PassoAuditoria';
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
    rawAllocationsCSV,
    handleFileUpload, 
    loadMockData 
  } = useCSVData();
  
  const { config, updateWeight, updateSeed } = useRaffleConfig();
  const { result, isRaffling, executeRaffle } = useRaffleExecution();
  const { generateAuditPackage } = useAuditPackage();

  const handleGenerateMock = () => {
    const unitCount = Math.floor(Math.random() * (70 - 50 + 1)) + 50;
    
    // Gera unidades UMA VEZ (sem histórico ainda)
    const mockUnits = generateMockUnits(unitCount, undefined);
    
    // Calcula solicitações por tipo
    const carRequests = mockUnits.reduce((acc, u) => acc + u.carSpaces, 0);
    const motoRequests = mockUnits.reduce((acc, u) => acc + u.motoSpaces, 0);
    const totalRequests = carRequests + motoRequests;
    
    // Gera vagas: EXATAMENTE carRequests vagas de carro + motoRequests vagas de moto
    const mockSpaces = generateMockSpaces(totalRequests);
    
    // Ajusta tipos de vaga para garantir quantidade exata
    let carCount = 0;
    let motoCount = 0;
    mockSpaces.forEach((space) => {
      if (motoCount < motoRequests) {
        space.type = 'MOTO';
        motoCount++;
      } else if (carCount < carRequests) {
        // Distribui entre P, M, G
        const carTypes: ('P' | 'M' | 'G')[] = ['P', 'M', 'G'];
        space.type = carTypes[Math.floor(Math.random() * 3)];
        carCount++;
      }
    });
    
    // Enriquece as MESMAS unidades com histórico baseado nas vagas reais
    const enrichedUnits = mockUnits.map(unit => {
      const randomSpace = mockSpaces[Math.floor(Math.random() * mockSpaces.length)];
      return {
        ...unit,
        previousAssignment: {
          spaceId: randomSpace.id,
          coverage: randomSpace.coverage,
          access: randomSpace.access,
          wasCritical: randomSpace.isCritical,
          isNearElevator: randomSpace.isNearElevator
        }
      };
    });
    
    loadMockData(enrichedUnits, mockSpaces);
  };

  const handleStartRaffle = async () => {
    const raffleResult = await executeRaffle(units, spaces, config);
    
    if (raffleResult) {
      setStep(4);
      setTimeout(() => {
        generateAuditPackage(raffleResult, units, spaces, rawUnitsCsv, rawSpacesCsv, rawAllocationsCSV);
      }, 800);
    }
  };

  const handleDownloadAudit = () => {
    if (result) {
      generateAuditPackage(result, units, spaces, rawUnitsCsv, rawSpacesCsv, rawAllocationsCSV);
    }
  };

  return (
    <Layout passoAtivo={step}>
      {step === 1 && (
        <PassoIngestao
          quantidadeUnidades={units.length}
          quantidadeVagas={spaces.length}
          quantidadeAlocacoes={allocationsCount}
          unidades={units}
          vagas={spaces}
          aoUploadArquivo={handleFileUpload}
          aoGerarDadosSimulados={handleGenerateMock}
          aoProximo={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <PassoConfiguracaoPesos
          configuracao={config}
          aoAtualizarPeso={updateWeight}
          aoAtualizarSemente={updateSeed}
          aoVoltar={() => setStep(1)}
          aoProximo={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <PassoSimulacao
          estaRodando={isRaffling}
          aoIniciarSorteio={handleStartRaffle}
          unidades={units}
          vagas={spaces}
        />
      )}

      {step === 4 && result && (
        <PassoAuditoria
          resultado={result}
          unidades={units}
          vagas={spaces}
          aoDownloadAuditoria={handleDownloadAudit}
        />
      )}
    </Layout>
  );
};

export default App;
