/**
 * CENÁRIO DE TESTE: Condomínio Grande (100 unidades)
 * 
 * Descrição:
 * - Condomínio grande com 100 apartamentos
 * - 110 vagas disponíveis (10% de sobra)
 * - 3 blocos (A, B, C)
 * - Mix realista e diversificado
 * 
 * O que está sendo testado:
 * ✓ Escalabilidade do sistema
 * ✓ Distribuição em múltiplos blocos
 * ✓ Performance com mais unidades
 * ✓ Proximidade de bloco influenciando
 * 
 * Expectativas:
 * - Tempo execução < 1 segundo
 * - Taxa alocação: 90%+ (algumas ficam sem)
 * - Fairness Index > 0.80
 * - Taxa de match bloco > 40%
 */

export const scenario = {
  name: 'Condomínio Grande - Alto Volume',
  description: '100 unidades, 110 vagas, teste de escalabilidade',
  
  // Gerador de unidades
  units: [
    // PCDs (5 unidades - 5%)
    ...Array.from({ length: 5 }, (_, i) => ({
      id: `U_PCD_${i + 1}`,
      apartment: `${i + 1}01`,
      block: ['A', 'B', 'C'][i % 3],
      vehicles: [{ type: 'CAR', plate: `PCD${1000 + i}` }],
      carSpaces: 1,
      motoSpaces: 0,
      isPCD: true,
      isElderly: false,
      isDefaulting: false,
      isPresentInAssembly: true
    })),
    
    // Idosos (15 unidades - 15%)
    ...Array.from({ length: 15 }, (_, i) => ({
      id: `U_ELD_${i + 1}`,
      apartment: `${i + 1}02`,
      block: ['A', 'B', 'C'][i % 3],
      vehicles: [{ type: 'CAR', plate: `ELD${1000 + i}` }],
      carSpaces: 1,
      motoSpaces: 0,
      isPCD: false,
      isElderly: true,
      isDefaulting: i % 10 < 1, // 10% inadimplentes
      isPresentInAssembly: i % 5 < 3 // 60% presentes
    })),
    
    // Com moto (15 unidades - 15%)
    ...Array.from({ length: 15 }, (_, i) => ({
      id: `U_MOTO_${i + 1}`,
      apartment: `${i + 2}01`,
      block: ['A', 'B', 'C'][i % 3],
      vehicles: [
        { type: 'CAR', plate: `CAR${2000 + i}` },
        { type: 'MOTO', plate: `MOT${3000 + i}` }
      ],
      carSpaces: 1,
      motoSpaces: 1,
      isPCD: false,
      isElderly: false,
      isDefaulting: i % 12 < 1, // ~8% inadimplentes
      isPresentInAssembly: i % 3 < 2 // ~66% presentes
    })),
    
    // Inadimplentes (10 unidades puras - 10%)
    ...Array.from({ length: 10 }, (_, i) => ({
      id: `U_DEF_${i + 1}`,
      apartment: `${i + 3}01`,
      block: ['A', 'B', 'C'][i % 3],
      vehicles: [{ type: 'CAR', plate: `DEF${4000 + i}` }],
      carSpaces: 1,
      motoSpaces: 0,
      isPCD: false,
      isElderly: false,
      isDefaulting: true,
      isPresentInAssembly: i % 4 < 1 // 25% presentes (baixo)
    })),
    
    // Unidades regulares (55 unidades - completando 100)
    ...Array.from({ length: 55 }, (_, i) => ({
      id: `U_REG_${i + 1}`,
      apartment: `${Math.floor(i / 3) + 10}${(i % 3) + 1}`,
      block: ['A', 'B', 'C'][i % 3],
      vehicles: [{ type: 'CAR', plate: `REG${5000 + i}` }],
      carSpaces: 1,
      motoSpaces: 0,
      isPCD: false,
      isElderly: false,
      isDefaulting: false,
      isPresentInAssembly: i % 2 === 0 // 50% presentes
    }))
  ],
  
  spaces: [
    // Vagas PCD (6 vagas)
    ...Array.from({ length: 6 }, (_, i) => ({
      id: `S_PCD_${i + 1}`,
      number: `PCD-${i + 1}`,
      type: 'G',
      coverage: 'COVERED',
      access: 'FREE',
      isPCD: true,
      isElderly: false,
      isCritical: false,
      isNearElevator: true,
      isNearEntrance: i < 3,
      block: ['A', 'B', 'C'][i % 3]
    })),
    
    // Vagas Idosos (16 vagas)
    ...Array.from({ length: 16 }, (_, i) => ({
      id: `S_ELD_${i + 1}`,
      number: `ELD-${i + 1}`,
      type: 'M',
      coverage: i < 12 ? 'COVERED' : 'UNCOVERED',
      access: 'FREE',
      isPCD: false,
      isElderly: true,
      isCritical: false,
      isNearElevator: i < 8,
      isNearEntrance: i < 4,
      block: ['A', 'B', 'C'][i % 3]
    })),
    
    // Vagas Moto (18 vagas)
    ...Array.from({ length: 18 }, (_, i) => ({
      id: `S_MOTO_${i + 1}`,
      number: `M-${i + 1}`,
      type: 'MOTO',
      coverage: i % 4 === 0 ? 'COVERED' : 'UNCOVERED',
      access: 'FREE',
      isPCD: false,
      isElderly: false,
      isCritical: false,
      isNearElevator: false,
      isNearEntrance: i < 6,
      block: ['A', 'B', 'C'][i % 3]
    })),
    
    // Vagas regulares (70 vagas - completando 110)
    ...Array.from({ length: 70 }, (_, i) => ({
      id: `S_REG_${String(i + 1).padStart(3, '0')}`,
      number: `${i + 1}`,
      type: i % 4 === 0 ? 'P' : i % 4 === 1 ? 'M' : i % 4 === 2 ? 'G' : 'M',
      coverage: i % 3 === 0 ? 'COVERED' : 'UNCOVERED',
      access: i % 5 < 4 ? 'FREE' : 'LOCKED',
      isPCD: false,
      isElderly: false,
      isCritical: i % 12 === 0,
      isNearElevator: i % 10 < 3,
      isNearEntrance: i % 15 < 2,
      block: ['A', 'B', 'C'][i % 3]
    }))
  ],
  
  config: {
    seed: 'TEST-LARGE-CONDO-2026',
    weights: {
      coverageCompensation: 30,
      mobilityCompensation: 25,
      blockProximity: 15,
      elevatorProximity: 10,
      criticalRotation: 30,
      entranceProximity: 8,
      defaultingPenalty: 20,
      absencePenalty: 10
    }
  },
  
  expectedResults: {
    minFairnessIndex: 0.80,
    maxGini: 0.40,
    allocationRate: 0.90, // 90%+
    blockMatchRate: 0.40, // 40%+ match de blocos
    executionTimeMs: 1000 // < 1 segundo
  }
};

export default scenario;
