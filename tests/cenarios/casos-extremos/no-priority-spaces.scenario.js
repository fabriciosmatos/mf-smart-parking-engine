/**
 * CENÁRIO DE TESTE: Caso Extremo - Sem Vagas Prioritárias
 * 
 * Descrição:
 * - 30 unidades (5 PCDs, 8 idosos)
 * - 35 vagas mas NENHUMA vaga PCD ou idoso
 * - Prioritários devem entrar no sorteio geral
 * 
 * O que está sendo testado:
 * ✓ Sistema não falha quando faltam vagas prioritárias
 * ✓ PCDs e idosos entram no sorteio geral
 * ✓ Ainda recebem preferência por outros critérios
 * ✓ Log registra a situação anormal
 * ✓ Sistema não quebra a lógica
 * 
 * Expectativas:
 * - Taxa alocação: 85% (30/35)
 * - PCDs conseguem vaga (mesmo sem PCD): 100%
 * - Idosos conseguem vaga: 100%
 * - Fairness Index: > 0.80
 * - Sem erros ou exceções
 */

export const scenario = {
  name: 'Caso Extremo - Sem Vagas Prioritárias',
  description: 'PCDs/idosos sem vagas reservadas - fallback para geral',
  
  units: [
    // PCDs (5 unidades) - SEM vagas PCD disponíveis!
    ...Array.from({ length: 5 }, (_, i) => ({
      id: `U_PCD_${i + 1}`,
      apartment: `PCD${i + 1}`,
      block: 'A',
      vehicles: [{ type: 'CAR', plate: `PCD${1000 + i}` }],
      carSpaces: 1,
      motoSpaces: 0,
      isPCD: true,
      isElderly: false,
      isDefaulting: false,
      isPresentInAssembly: true
    })),
    
    // Idosos (8 unidades) - SEM vagas idoso disponíveis!
    ...Array.from({ length: 8 }, (_, i) => ({
      id: `U_ELD_${i + 1}`,
      apartment: `ELD${i + 1}`,
      block: 'B',
      vehicles: [{ type: 'CAR', plate: `ELD${2000 + i}` }],
      carSpaces: 1,
      motoSpaces: 0,
      isPCD: false,
      isElderly: true,
      isDefaulting: false,
      isPresentInAssembly: true
    })),
    
    // Regulares (17 unidades)
    ...Array.from({ length: 17 }, (_, i) => ({
      id: `U_REG_${i + 1}`,
      apartment: `REG${i + 1}`,
      block: ['A', 'B', 'C'][i % 3],
      vehicles: [{ type: 'CAR', plate: `REG${3000 + i}` }],
      carSpaces: 1,
      motoSpaces: 0,
      isPCD: false,
      isElderly: false,
      isDefaulting: i % 5 === 0,
      isPresentInAssembly: i % 2 === 0
    }))
  ],
  
  spaces: [
    // 35 vagas - NENHUMA é PCD ou Idoso!
    ...Array.from({ length: 35 }, (_, i) => ({
      id: `S${String(i + 1).padStart(3, '0')}`,
      number: `${i + 1}`,
      type: i % 3 === 0 ? 'P' : i % 3 === 1 ? 'M' : 'G',
      coverage: i % 2 === 0 ? 'COVERED' : 'UNCOVERED',
      access: i % 5 < 4 ? 'FREE' : 'LOCKED',
      isPCD: false,        // NENHUMA vaga PCD!
      isElderly: false,    // NENHUMA vaga idoso!
      isCritical: i % 10 === 0,
      isNearElevator: i % 4 < 1, // Poucos elevadores
      isNearEntrance: i % 6 < 1,
      block: ['A', 'B', 'C'][i % 3]
    }))
  ],
  
  config: {
    seed: 'TEST-NO-PRIORITY-SPACES-2026',
    weights: {
      coverageCompensation: 30,
      mobilityCompensation: 25,
      blockProximity: 15,
      elevatorProximity: 10, // Idosos ainda preferem elevador
      criticalRotation: 30,
      entranceProximity: 8,
      defaultingPenalty: 20,
      absencePenalty: 10
    }
  },
  
  expectedResults: {
    allocationRate: 0.85, // 30/35
    pcdAllocationRate: 1.0, // TODOS devem conseguir (no geral)
    elderlyAllocationRate: 1.0, // TODOS devem conseguir (no geral)
    
    // Validações especiais
    noErrors: true,
    priorityFallbackWorks: true, // Entram no sorteio geral
    logWarning: true // Sistema avisa que faltam vagas prioritárias
  }
};

export default scenario;
