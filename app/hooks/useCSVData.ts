import { useState } from 'react';
import { Unit, ParkingSpace } from '../types';
import { 
  parseUnitsCSV, 
  parseSpacesCSV, 
  parseCurrentAllocationsCSV,
  enrichUnitsWithPreviousAssignment,
  CurrentAllocation 
} from '../utils/analisadorCSV';

/**
 * Hook: Gerenciamento de Dados CSV
 * 
 * Responsável por fazer upload, parsear e gerenciar o estado
 * dos dados de unidades, vagas e alocações atuais vindos de CSV.
 */
export const useCSVData = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [spaces, setSpaces] = useState<ParkingSpace[]>([]);
  const [currentAllocations, setCurrentAllocations] = useState<CurrentAllocation[]>([]);
  const [rawUnitsCsv, setRawUnitsCsv] = useState<string>("");
  const [rawSpacesCsv, setRawSpacesCsv] = useState<string>("");
  const [rawAllocationsCSV, setRawAllocationsCSV] = useState<string>("");

  /**
   * Manipula o upload de arquivos CSV
   * 
   * Suporta três tipos: 'units' (unidades), 'spaces' (vagas),
   * e 'allocations' (alocações atuais para enriquecimento).
   */
  const handleFileUpload = (file: File | undefined, type: 'units' | 'spaces' | 'allocations') => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const csvText = event.target?.result as string;

      if (type === 'units') {
        setRawUnitsCsv(csvText);
        const parsedUnits = parseUnitsCSV(csvText);
        setUnits(parsedUnits);
        
        // Se já tem alocações e vagas, enriquece automaticamente
        if (currentAllocations.length > 0 && spaces.length > 0) {
          const enrichedUnits = enrichUnitsWithPreviousAssignment(parsedUnits, spaces, currentAllocations);
          setUnits(enrichedUnits);
        }
      } else if (type === 'spaces') {
        setRawSpacesCsv(csvText);
        const parsedSpaces = parseSpacesCSV(csvText);
        setSpaces(parsedSpaces);
        
        // Se já tem alocações e unidades, enriquece automaticamente
        if (currentAllocations.length > 0 && units.length > 0) {
          const enrichedUnits = enrichUnitsWithPreviousAssignment(units, parsedSpaces, currentAllocations);
          setUnits(enrichedUnits);
        }
      } else if (type === 'allocations') {
        setRawAllocationsCSV(csvText);
        const parsedAllocations = parseCurrentAllocationsCSV(csvText);
        setCurrentAllocations(parsedAllocations);
        
        // Se já tem unidades e vagas, enriquece automaticamente
        if (units.length > 0 && spaces.length > 0) {
          const enrichedUnits = enrichUnitsWithPreviousAssignment(units, spaces, parsedAllocations);
          setUnits(enrichedUnits);
        }
      }
    };
    reader.readAsText(file);
  };

  /**
   * Carrega dados mock gerados programaticamente
   * 
   * Usado para demonstrações e testes rápidos sem necessidade de CSV.
   */
  const loadMockData = (mockUnits: Unit[], mockSpaces: ParkingSpace[]) => {
    setUnits(mockUnits);
    setSpaces(mockSpaces);
    
    // Gera alocações atuais a partir das unidades que têm previousAssignment
    const allocations: CurrentAllocation[] = mockUnits
      .filter(u => u.previousAssignment)
      .map(u => ({
        idUnidade: u.id,
        idVaga: u.previousAssignment!.spaceId
      }));
    
    setCurrentAllocations(allocations);

    const uCsv = "id;apartamento;bloco;vagas_carro;vagas_moto;pcd;idoso;inadimplente;presente\n" +
      mockUnits.map(u => 
        `${u.id};${u.apartment};${u.block};${u.carSpaces};${u.motoSpaces};${u.isPCD};${u.isElderly};${u.isDefaulting};${u.isPresentInAssembly}`
      ).join('\n');

    const sCsv = "id;numero;tipo;cobertura;acesso;pcd;idoso;critica;perto_elevador;perto_entrada;bloco\n" +
      mockSpaces.map(s => 
        `${s.id};${s.number};${s.type};${s.coverage};${s.access};${s.isPCD};${s.isElderly};${s.isCritical};${s.isNearElevator};${s.isNearEntrance};${s.block}`
      ).join('\n');

    const aCsv = allocations.length > 0
      ? "id_unidade;id_vaga\n" + allocations.map(a => `${a.idUnidade};${a.idVaga}`).join('\n')
      : "";

    setRawUnitsCsv(uCsv);
    setRawSpacesCsv(sCsv);
    setRawAllocationsCSV(aCsv);
  };

  return {
    units,
    spaces,
    currentAllocations,
    allocationsCount: currentAllocations.length,
    rawUnitsCsv,
    rawSpacesCsv,
    rawAllocationsCSV,
    handleFileUpload,
    loadMockData
  };
};
