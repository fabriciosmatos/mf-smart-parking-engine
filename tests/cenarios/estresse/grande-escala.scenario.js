/**
 * CENÁRIO DE TESTE: Teste de Estresse - Volume Alto
 * 
 * Descrição:
 * - 200 unidades (condomínio grande)
 * - 220 vagas (10% margem)
 * - Mix realista de todos os tipos
 * - Teste de performance e escala
 * 
 * O que está sendo testado:
 * ✓ Sistema escala para condomínios grandes
 * ✓ Performance: execução < 2 segundos
 * ✓ Memória não explode
 * ✓ Distribuição justa mesmo em alta escala
 * ✓ Todas regras funcionam com muitos dados
 * ✓ Logs não ficam gigantes
 * ✓ Auditoria mantém qualidade
 * 
 * Expectativas:
 * - Taxa alocação: 90% (200/220)
 * - Tempo execução: < 2000ms
 * - Pico memória: < 500MB
 * - Fairness Index: > 0.85
 * - Taxa PCD: 100%
 * - Taxa Idoso: 100%
 * - Gini: < 0.30
 */

export const scenario = {
  name: 'Teste de Estresse - 200 Unidades',
  description: 'Testa performance e escala em condomínio grande',
  
  units: [
    // PCDs (10 unidades - 5%)
    ...Array.from({ length: 10 }, (_, i) => ({
      id: `U_PCD_${String(i + 1).padStart(3, '0')}`,
      apartment: `PCD${String(i + 1).padStart(3, '0')}`,
      block: ['A', 'B', 'C', 'D'][i % 4],
      vehicles: [{ type: 'CAR', plate: `PCD${1000 + i}` }],
      carSpaces: 1,
      motoSpaces: 0,
      isPCD: true,
      isElderly: false,
      isDefaulting: false,
      isPresentInAssembly: true
    })),
    
    // Idosos (30 unidades - 15%)
    ...Array.from({ length: 30 }, (_, i) => ({
      id: `U_ELD_${String(i + 1).padStart(3, '0')}`,
      apartment: `ELD${String(i + 1).padStart(3, '0')}`,
      block: ['A', 'B', 'C', 'D'][i % 4],
      vehicles: [{ type: 'CAR', plate: `ELD${2000 + i}` }],
      carSpaces: 1,
      motoSpaces: 0,
      isPCD: false,
      isElderly: true,
      isDefaulting: i % 10 === 0, // 10% inadimplentes
      isPresentInAssembly: i % 5 < 4 // 80% presentes
    })),
    
    // Motociclistas (20 unidades - 10%)
    ...Array.from({ length: 20 }, (_, i) => ({
      id: `U_MOTO_${String(i + 1).padStart(3, '0')}`,
      apartment: `MOTO${String(i + 1).padStart(3, '0')}`,
      block: ['A', 'B', 'C', 'D'][i % 4],
      vehicles: [{ type: 'MOTORCYCLE', plate: `MOTO${3000 + i}` }],
      carSpaces: 0,
      motoSpaces: 1,
      isPCD: false,
      isElderly: false,
      isDefaulting: i % 8 === 0, // 12.5% inadimplentes
      isPresentInAssembly: i % 3 < 2 // 66% presentes
    })),
    
    // Inadimplentes (40 unidades - 20%)
    ...Array.from({ length: 40 }, (_, i) => ({
      id: `U_DEF_${String(i + 1).padStart(3, '0')}`,
      apartment: `DEF${String(i + 1).padStart(3, '0')}`,
      block: ['A', 'B', 'C', 'D'][i % 4],
      vehicles: [{ type: 'CAR', plate: `DEF${4000 + i}` }],
      carSpaces: 1,
      motoSpaces: 0,
      isPCD: false,
      isElderly: false,
      isDefaulting: true, // Todos inadimplentes
      isPresentInAssembly: i % 4 < 1 // Apenas 25% presentes
    })),
    
    // Regulares (100 unidades - 50%)
    ...Array.from({ length: 100 }, (_, i) => ({
      id: `U_REG_${String(i + 1).padStart(3, '0')}`,
      apartment: `REG${String(i + 1).padStart(3, '0')}`,
      block: ['A', 'B', 'C', 'D'][i % 4],
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
    // Vagas PCD (10 vagas)
    ...Array.from({ length: 10 }, (_, i) => ({
      id: `S_PCD_${String(i + 1).padStart(3, '0')}`,
      number: `PCD-${i + 1}`,
      type: 'G',
      coverage: 'COVERED',
      access: 'FREE',
      isPCD: true,
      isElderly: false,
      isCritical: false,
      isNearElevator: true,
      isNearEntrance: i < 5,
      block: ['A', 'B', 'C', 'D'][i % 4]
    })),
    
    // Vagas Idosos (30 vagas)
    ...Array.from({ length: 30 }, (_, i) => ({
      id: `S_ELD_${String(i + 1).padStart(3, '0')}`,
      number: `ELD-${i + 1}`,
      type: 'M',
      coverage: 'COVERED',
      access: 'FREE',
      isPCD: false,
      isElderly: true,
      isCritical: false,
      isNearElevator: i % 2 === 0,
      isNearEntrance: i < 10,
      block: ['A', 'B', 'C', 'D'][i % 4]
    })),
    
    // Vagas Motos (25 vagas)
    ...Array.from({ length: 25 }, (_, i) => ({
      id: `S_MOTO_${String(i + 1).padStart(3, '0')}`,
      number: `MOTO-${i + 1}`,
      type: 'P',
      coverage: i % 3 < 2 ? 'COVERED' : 'UNCOVERED',
      access: 'FREE',
      isPCD: false,
      isElderly: false,
      isCritical: false,
      isNearElevator: false,
      isNearEntrance: false,
      block: ['A', 'B', 'C', 'D'][i % 4]
    })),
    
    // Vagas Gerais (155 vagas - mix variado)
    ...Array.from({ length: 155 }, (_, i) => ({
      id: `S_GEN_${String(i + 1).padStart(3, '0')}`,
      number: `${i + 1}`,
      type: i % 3 === 0 ? 'P' : i % 3 === 1 ? 'M' : 'G',
      coverage: i % 4 < 3 ? 'COVERED' : 'UNCOVERED', // 75% cobertas
      access: i % 10 < 9 ? 'FREE' : 'LOCKED', // 90% livres
      isPCD: false,
      isElderly: false,
      isCritical: i % 12 === 0, // ~8% críticas
      isNearElevator: i % 6 < 1, // ~16% perto elevador
      isNearEntrance: i % 15 < 1, // ~6% perto entrada
      block: ['A', 'B', 'C', 'D'][i % 4]
    }))
  ],
  
  config: {
    seed: 'TEST-STRESS-200-UNITS-2026',
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
    // Performance
    maxExecutionTime: 2000, // ms
    maxMemoryUsage: 500,    // MB
    
    // Qualidade
    allocationRate: 0.90,   // 200/220
    minFairnessIndex: 0.85,
    maxGini: 0.30,
    
    // Prioridades
    pcdAllocationRate: 1.0,
    elderlyAllocationRate: 1.0,
    
    // Distribuição
    blockDistribution: true, // Balanced entre blocos
    noErrors: true,
    auditLogComplete: true
  }
};

export default scenario;
