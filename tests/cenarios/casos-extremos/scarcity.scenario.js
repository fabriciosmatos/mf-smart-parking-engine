/**
 * CENÁRIO DE TESTE: Caso Extremo - Escassez
 * 
 * Descrição:
 * - 60 unidades querendo vagas
 * - Apenas 40 vagas disponíveis
 * - Déficit de 33% (20 unidades ficarão sem)
 * 
 * O que está sendo testado:
 * ✓ Sistema lida com escassez
 * ✓ Priorização funciona sob pressão
 * ✓ PCDs e idosos não ficam sem vaga
 * ✓ Inadimplentes são os primeiros a ficar sem
 * ✓ Nenhum erro ou crash
 * 
 * Expectativas:
 * - Taxa de alocação: 66% (40/60)
 * - PCDs: 100% alocados
 * - Idosos: 100% alocados
 * - Inadimplentes: < 50% alocados
 * - Sistema não falha
 */

export const scenario = {
  name: 'Caso Extremo - Escassez Severa',
  description: '60 unidades, 40 vagas - teste de escassez',
  
  units: [
    // PCDs (4 unidades) - DEVEM ser alocados
    ...Array.from({ length: 4 }, (_, i) => ({
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
    
    // Idosos (6 unidades) - DEVEM ser alocados
    ...Array.from({ length: 6 }, (_, i) => ({
      id: `U_ELD_${i + 1}`,
      apartment: `ELD${i + 1}`,
      block: 'A',
      vehicles: [{ type: 'CAR', plate: `ELD${2000 + i}` }],
      carSpaces: 1,
      motoSpaces: 0,
      isPCD: false,
      isElderly: true,
      isDefaulting: false,
      isPresentInAssembly: true
    })),
    
    // Inadimplentes (20 unidades) - Maioria NÃO deve ser alocada
    ...Array.from({ length: 20 }, (_, i) => ({
      id: `U_DEF_${i + 1}`,
      apartment: `DEF${i + 1}`,
      block: 'B',
      vehicles: [{ type: 'CAR', plate: `DEF${3000 + i}` }],
      carSpaces: 1,
      motoSpaces: 0,
      isPCD: false,
      isElderly: false,
      isDefaulting: true,     // Penalizados
      isPresentInAssembly: false  // Duplamente penalizados
    })),
    
    // Regulares (30 unidades) - Cerca de 50% devem ser alocados
    ...Array.from({ length: 30 }, (_, i) => ({
      id: `U_REG_${i + 1}`,
      apartment: `REG${i + 1}`,
      block: i % 2 === 0 ? 'A' : 'B',
      vehicles: [{ type: 'CAR', plate: `REG${4000 + i}` }],
      carSpaces: 1,
      motoSpaces: 0,
      isPCD: false,
      isElderly: false,
      isDefaulting: false,
      isPresentInAssembly: i % 3 < 2 // 66% presentes
    }))
  ],
  
  spaces: [
    // Vagas PCD (4 vagas) - Suficientes
    ...Array.from({ length: 4 }, (_, i) => ({
      id: `S_PCD_${i + 1}`,
      number: `PCD-${i + 1}`,
      type: 'G',
      coverage: 'COVERED',
      access: 'FREE',
      isPCD: true,
      isElderly: false,
      isCritical: false,
      isNearElevator: true,
      isNearEntrance: true,
      block: 'A'
    })),
    
    // Vagas Idosos (6 vagas) - Suficientes
    ...Array.from({ length: 6 }, (_, i) => ({
      id: `S_ELD_${i + 1}`,
      number: `ELD-${i + 1}`,
      type: 'M',
      coverage: 'COVERED',
      access: 'FREE',
      isPCD: false,
      isElderly: true,
      isCritical: false,
      isNearElevator: true,
      isNearEntrance: false,
      block: 'A'
    })),
    
    // Vagas regulares (30 vagas) - INSUFICIENTES para 50 demandas
    ...Array.from({ length: 30 }, (_, i) => ({
      id: `S_REG_${String(i + 1).padStart(3, '0')}`,
      number: `${i + 1}`,
      type: i % 3 === 0 ? 'P' : i % 3 === 1 ? 'M' : 'G',
      coverage: i % 2 === 0 ? 'COVERED' : 'UNCOVERED',
      access: i % 4 < 3 ? 'FREE' : 'LOCKED',
      isPCD: false,
      isElderly: false,
      isCritical: i % 10 === 0,
      isNearElevator: i % 5 < 2,
      isNearEntrance: i % 8 < 1,
      block: i % 2 === 0 ? 'A' : 'B'
    }))
  ],
  
  config: {
    seed: 'TEST-SCARCITY-2026',
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
    allocationRate: 0.66, // 40/60 = 66%
    pcdAllocationRate: 1.0, // 100% - TODOS devem receber
    elderlyAllocationRate: 1.0, // 100% - TODOS devem receber
    defaultingAllocationRate: 0.50, // < 50% - maioria fica sem
    noErrors: true, // Sistema não deve falhar
    
    // Validações adicionais
    priorityAllocatedFirst: true, // PCDs/Idosos primeiro
    penaltyImpactVisible: true // Inadimplentes claramente penalizados
  }
};

export default scenario;
