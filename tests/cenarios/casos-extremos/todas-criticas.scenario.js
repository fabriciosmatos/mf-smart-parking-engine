/**
 * CENÁRIO DE TESTE: Caso Extremo - Todas Vagas Críticas
 * 
 * Descrição:
 * - 25 unidades
 * - 30 vagas, mas TODAS são críticas (difícil manobra)
 * - Teste do "pior cenário possível"
 * 
 * O que está sendo testado:
 * ✓ Sistema funciona mesmo sem vagas ideais
 * ✓ Distribuição justa mesmo em situação ruim
 * ✓ Compensação será aplicada no PRÓXIMO sorteio
 * ✓ Nenhum erro ou exceção
 * ✓ Log de auditoria registra a situação
 * 
 * Expectativas:
 * - Taxa alocação: 83% (25/30)
 * - Fairness Index: > 0.75 (mais baixo é OK)
 * - Nenhuma vaga crítica deve ter bônus (todas iguais)
 * - Sistema marca todas como wasCritical para próximo sorteio
 */

export const scenario = {
  name: 'Caso Extremo - Só Vagas Ruins (Críticas)',
  description: 'Todas vagas são críticas - pior caso',
  
  units: [
    // 25 unidades normais
    ...Array.from({ length: 25 }, (_, i) => ({
      id: `U${String(i + 1).padStart(3, '0')}`,
      apartment: `${Math.floor(i / 5) + 1}0${(i % 5) + 1}`,
      block: ['A', 'B', 'C'][i % 3],
      vehicles: [{ type: 'CAR', plate: `ABC${1000 + i}` }],
      carSpaces: 1,
      motoSpaces: 0,
      isPCD: i < 2,          // 2 PCDs
      isElderly: i >= 2 && i < 5, // 3 idosos
      isDefaulting: i >= 20,  // 5 inadimplentes
      isPresentInAssembly: i % 3 < 2
    }))
  ],
  
  spaces: [
    // Vagas PCD (2 vagas) - mas CRÍTICAS
    {
      id: 'S_PCD_1',
      number: 'PCD-1',
      type: 'G',
      coverage: 'COVERED',
      access: 'FREE',
      isPCD: true,
      isElderly: false,
      isCritical: true, // CRÍTICA!
      isNearElevator: true,
      isNearEntrance: true,
      block: 'A'
    },
    {
      id: 'S_PCD_2',
      number: 'PCD-2',
      type: 'G',
      coverage: 'COVERED',
      access: 'FREE',
      isPCD: true,
      isElderly: false,
      isCritical: true, // CRÍTICA!
      isNearElevator: true,
      isNearEntrance: true,
      block: 'B'
    },
    
    // Vagas Idosos (3 vagas) - mas CRÍTICAS
    ...Array.from({ length: 3 }, (_, i) => ({
      id: `S_ELD_${i + 1}`,
      number: `ELD-${i + 1}`,
      type: 'M',
      coverage: 'COVERED',
      access: 'FREE',
      isPCD: false,
      isElderly: true,
      isCritical: true, // CRÍTICA!
      isNearElevator: true,
      isNearEntrance: false,
      block: ['A', 'B', 'C'][i % 3]
    })),
    
    // Todas as outras (25 vagas) - TODAS CRÍTICAS
    ...Array.from({ length: 25 }, (_, i) => ({
      id: `S_CRIT_${String(i + 1).padStart(3, '0')}`,
      number: `CRIT-${i + 1}`,
      type: i % 3 === 0 ? 'P' : i % 3 === 1 ? 'M' : 'G',
      coverage: i % 4 < 2 ? 'COVERED' : 'UNCOVERED',
      access: i % 5 < 4 ? 'FREE' : 'LOCKED',
      isPCD: false,
      isElderly: false,
      isCritical: true, // TODAS CRÍTICAS!
      isNearElevator: i % 6 < 2,
      isNearEntrance: i % 8 < 1,
      block: ['A', 'B', 'C'][i % 3]
    }))
  ],
  
  config: {
    seed: 'TEST-ALL-CRITICAL-2026',
    weights: {
      coverageCompensation: 30,
      mobilityCompensation: 25,
      blockProximity: 15,
      elevatorProximity: 10,
      criticalRotation: 30, // Não terá efeito neste sorteio
      entranceProximity: 8,
      defaultingPenalty: 20,
      absencePenalty: 10
    }
  },
  
  expectedResults: {
    allocationRate: 0.83, // 25/30
    minFairnessIndex: 0.75, // Mais baixo é aceitável
    noErrors: true,
    
    // Validação especial
    allAllocatedHaveCritical: true, // Todas marcadas como críticas
    nextRaffleWillCompensate: true  // Próximo sorteio compensa
  }
};

export default scenario;
