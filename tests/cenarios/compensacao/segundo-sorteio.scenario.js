/**
 * CENÁRIO DE TESTE: Segundo Sorteio com Compensação
 * 
 * Descrição:
 * - Sorteio subsequente com histórico completo
 * - 40% das unidades tiveram vagas ruins no sorteio anterior
 * - Sistema deve compensar: vagas descobertas, bloqueadas e críticas
 * 
 * O que está sendo testado:
 * ✓ RN03: Compensação de cobertura funciona
 * ✓ RN04: Compensação de mobilidade funciona
 * ✓ RN09: Rotação de vagas críticas funciona
 * ✓ Sistema "lembra" e corrige injustiças
 * ✓ Fairness melhora ao longo do tempo
 * 
 * Expectativas:
 * - Taxa compensação cobertura: > 70%
 * - Taxa compensação mobilidade: > 70%
 * - Taxa rotação crítica: > 75%
 * - Fairness Index > 0.85
 */

export const scenario = {
  name: 'Segundo Sorteio - Compensação Ativa',
  description: 'Teste de compensação após primeiro sorteio ruim',
  
  units: [
    // Casos de compensação de COBERTURA (10 unidades)
    ...Array.from({ length: 10 }, (_, i) => ({
      id: `U_UNCOV_${i + 1}`,
      apartment: `${i + 1}01`,
      block: ['A', 'B'][i % 2],
      vehicles: [{ type: 'CAR', plate: `UNC${1000 + i}` }],
      carSpaces: 1,
      motoSpaces: 0,
      isPCD: false,
      isElderly: i < 2, // 2 são idosos
      isDefaulting: false,
      isPresentInAssembly: true,
      // HISTÓRICO: Tinha vaga DESCOBERTA
      previousAssignment: {
        spaceId: `S_OLD_UNCOV_${i}`,
        coverage: 'UNCOVERED', // <-- Deve ganhar bônus em COVERED
        access: 'FREE',
        wasCritical: false,
        isNearElevator: false
      }
    })),
    
    // Casos de compensação de MOBILIDADE (8 unidades)
    ...Array.from({ length: 8 }, (_, i) => ({
      id: `U_LOCKED_${i + 1}`,
      apartment: `${i + 2}01`,
      block: ['A', 'B'][i % 2],
      vehicles: [{ type: 'CAR', plate: `LOC${2000 + i}` }],
      carSpaces: 1,
      motoSpaces: 0,
      isPCD: false,
      isElderly: false,
      isDefaulting: false,
      isPresentInAssembly: true,
      // HISTÓRICO: Tinha vaga BLOQUEADA
      previousAssignment: {
        spaceId: `S_OLD_LOCKED_${i}`,
        coverage: 'COVERED',
        access: 'LOCKED', // <-- Deve ganhar bônus em FREE
        wasCritical: false,
        isNearElevator: false
      }
    })),
    
    // Casos de ROTAÇÃO de vagas CRÍTICAS (6 unidades)
    ...Array.from({ length: 6 }, (_, i) => ({
      id: `U_CRITICAL_${i + 1}`,
      apartment: `${i + 3}01`,
      block: ['A', 'B'][i % 2],
      vehicles: [{ type: 'CAR', plate: `CRT${3000 + i}` }],
      carSpaces: 1,
      motoSpaces: 0,
      isPCD: false,
      isElderly: false,
      isDefaulting: false,
      isPresentInAssembly: true,
      // HISTÓRICO: Tinha vaga CRÍTICA
      previousAssignment: {
        spaceId: `S_OLD_CRIT_${i}`,
        coverage: 'UNCOVERED',
        access: 'FREE',
        wasCritical: true, // <-- Deve ganhar bônus em NÃO-CRÍTICA
        isNearElevator: false
      }
    })),
    
    // Casos COMBINADOS (pior caso - tudo ruim) (4 unidades)
    ...Array.from({ length: 4 }, (_, i) => ({
      id: `U_WORST_${i + 1}`,
      apartment: `${i + 4}01`,
      block: ['A', 'B'][i % 2],
      vehicles: [{ type: 'CAR', plate: `WRT${4000 + i}` }],
      carSpaces: 1,
      motoSpaces: 0,
      isPCD: false,
      isElderly: false,
      isDefaulting: false,
      isPresentInAssembly: true,
      // HISTÓRICO: TUDO RUIM (descoberta + bloqueada + crítica)
      previousAssignment: {
        spaceId: `S_OLD_WORST_${i}`,
        coverage: 'UNCOVERED', // Ruim
        access: 'LOCKED',      // Ruim
        wasCritical: true,     // Ruim
        isNearElevator: false
      }
    })),
    
    // Unidades que tiveram vagas BOAS (não precisam compensação) (12 unidades)
    ...Array.from({ length: 12 }, (_, i) => ({
      id: `U_GOOD_${i + 1}`,
      apartment: `${i + 5}01`,
      block: ['A', 'B'][i % 2],
      vehicles: [{ type: 'CAR', plate: `GOD${5000 + i}` }],
      carSpaces: 1,
      motoSpaces: 0,
      isPCD: false,
      isElderly: false,
      isDefaulting: i < 2, // 2 inadimplentes
      isPresentInAssembly: i % 2 === 0,
      // HISTÓRICO: Tudo BOM
      previousAssignment: {
        spaceId: `S_OLD_GOOD_${i}`,
        coverage: 'COVERED',   // Bom
        access: 'FREE',        // Bom
        wasCritical: false,    // Bom
        isNearElevator: i < 4
      }
    }))
  ],
  
  spaces: [
    // Vagas COBERTAS e LIVRES (20 vagas - para compensação)
    ...Array.from({ length: 20 }, (_, i) => ({
      id: `S_GOOD_${String(i + 1).padStart(3, '0')}`,
      number: `GOOD-${i + 1}`,
      type: i % 3 === 0 ? 'G' : 'M',
      coverage: 'COVERED',  // Boas para compensar descobertas
      access: 'FREE',       // Boas para compensar bloqueadas
      isPCD: false,
      isElderly: false,
      isCritical: false,    // Boas para compensar críticas
      isNearElevator: i < 8,
      isNearEntrance: i < 4,
      block: ['A', 'B'][i % 2]
    })),
    
    // Vagas DESCOBERTAS mas LIVRES (10 vagas)
    ...Array.from({ length: 10 }, (_, i) => ({
      id: `S_UNCOV_${i + 1}`,
      number: `UNCOV-${i + 1}`,
      type: 'M',
      coverage: 'UNCOVERED', // Ruim
      access: 'FREE',        // Bom
      isPCD: false,
      isElderly: false,
      isCritical: false,
      isNearElevator: false,
      isNearEntrance: false,
      block: ['A', 'B'][i % 2]
    })),
    
    // Vagas COBERTAS mas BLOQUEADAS (8 vagas)
    ...Array.from({ length: 8 }, (_, i) => ({
      id: `S_LOCKED_${i + 1}`,
      number: `LOCK-${i + 1}`,
      type: 'M',
      coverage: 'COVERED',   // Bom
      access: 'LOCKED',      // Ruim
      isPCD: false,
      isElderly: false,
      isCritical: false,
      isNearElevator: false,
      isNearEntrance: false,
      block: ['A', 'B'][i % 2]
    })),
    
    // Vagas CRÍTICAS (6 vagas)
    ...Array.from({ length: 6 }, (_, i) => ({
      id: `S_CRIT_${i + 1}`,
      number: `CRIT-${i + 1}`,
      type: 'P',
      coverage: 'UNCOVERED',
      access: 'FREE',
      isPCD: false,
      isElderly: false,
      isCritical: true,      // Ruim - difícil manobrar
      isNearElevator: false,
      isNearEntrance: false,
      block: ['A', 'B'][i % 2]
    }))
  ],
  
  config: {
    seed: 'TEST-COMPENSATION-2026',
    weights: {
      coverageCompensation: 30,  // Alto para testar
      mobilityCompensation: 25,   // Alto para testar
      blockProximity: 15,
      elevatorProximity: 10,
      criticalRotation: 30,       // Alto para testar
      entranceProximity: 8,
      defaultingPenalty: 20,
      absencePenalty: 10
    }
  },
  
  expectedResults: {
    // Compensação deve funcionar bem
    coverageCompensationRate: 0.70,  // > 70%
    mobilityCompensationRate: 0.70,   // > 70%
    criticalRotationRate: 0.75,       // > 75%
    
    // Fairness deve melhorar
    minFairnessIndex: 0.85,
    maxGini: 0.30,
    
    // Casos piores devem receber melhores vagas
    worstCasesImprovement: 0.80 // 80%+ dos piores casos melhoram
  }
};

export default scenario;
