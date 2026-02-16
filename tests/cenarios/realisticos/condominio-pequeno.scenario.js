/**
 * CENÁRIO DE TESTE: Condomínio Pequeno (30 unidades)
 * 
 * Descrição:
 * - Condomínio típico de 30 apartamentos
 * - 35 vagas disponíveis (pouca sobra)
 * - Mix realista de PCDs, idosos e inadimplentes
 * - Primeiro sorteio (sem histórico)
 * 
 * O que está sendo testado:
 * ✓ Alocação básica funciona
 * ✓ Priorização de PCDs e idosos
 * ✓ Penalidades aplicadas corretamente
 * ✓ Distribuição inicial justa
 * 
 * Expectativas:
 * - Taxa de alocação: 100% (tem vagas para todos)
 * - PCDs devem receber vagas PCD
 * - Fairness Index > 0.85
 * - Inadimplentes com scores ~20 pontos menores
 */

export const scenario = {
  name: 'Condomínio Pequeno - Primeiro Sorteio',
  description: '30 unidades, 35 vagas, sem histórico',
  
  units: [
    // PCDs (2 unidades - 6.7%)
    {
      id: 'U001',
      apartment: '101',
      block: 'A',
      vehicles: [{ type: 'CAR', plate: 'ABC1234' }],
      carSpaces: 1,
      motoSpaces: 0,
      isPCD: true,
      isElderly: false,
      isDefaulting: false,
      isPresentInAssembly: true
    },
    {
      id: 'U002',
      apartment: '102',
      block: 'A',
      vehicles: [{ type: 'CAR', plate: 'ABC1235' }],
      carSpaces: 1,
      motoSpaces: 0,
      isPCD: true,
      isElderly: false,
      isDefaulting: false,
      isPresentInAssembly: true
    },
    
    // Idosos (4 unidades - 13.3%)
    {
      id: 'U003',
      apartment: '103',
      block: 'A',
      vehicles: [{ type: 'CAR', plate: 'ABC1236' }],
      carSpaces: 1,
      motoSpaces: 0,
      isPCD: false,
      isElderly: true,
      isDefaulting: false,
      isPresentInAssembly: true
    },
    {
      id: 'U004',
      apartment: '104',
      block: 'A',
      vehicles: [{ type: 'CAR', plate: 'ABC1237' }],
      carSpaces: 1,
      motoSpaces: 0,
      isPCD: false,
      isElderly: true,
      isDefaulting: false,
      isPresentInAssembly: false
    },
    {
      id: 'U005',
      apartment: '201',
      block: 'B',
      vehicles: [{ type: 'CAR', plate: 'ABC1238' }],
      carSpaces: 1,
      motoSpaces: 0,
      isPCD: false,
      isElderly: true,
      isDefaulting: false,
      isPresentInAssembly: true
    },
    {
      id: 'U006',
      apartment: '202',
      block: 'B',
      vehicles: [{ type: 'CAR', plate: 'ABC1239' }],
      carSpaces: 1,
      motoSpaces: 0,
      isPCD: false,
      isElderly: true,
      isDefaulting: false,
      isPresentInAssembly: true
    },
    
    // Inadimplentes (3 unidades - 10%)
    {
      id: 'U007',
      apartment: '203',
      block: 'B',
      vehicles: [{ type: 'CAR', plate: 'ABC1240' }],
      carSpaces: 1,
      motoSpaces: 0,
      isPCD: false,
      isElderly: false,
      isDefaulting: true,
      isPresentInAssembly: false
    },
    {
      id: 'U008',
      apartment: '204',
      block: 'B',
      vehicles: [{ type: 'CAR', plate: 'ABC1241' }],
      carSpaces: 1,
      motoSpaces: 0,
      isPCD: false,
      isElderly: false,
      isDefaulting: true,
      isPresentInAssembly: true
    },
    {
      id: 'U009',
      apartment: '301',
      block: 'C',
      vehicles: [{ type: 'CAR', plate: 'ABC1242' }],
      carSpaces: 1,
      motoSpaces: 0,
      isPCD: false,
      isElderly: false,
      isDefaulting: true,
      isPresentInAssembly: false
    },
    
    // Com moto (2 unidades)
    {
      id: 'U010',
      apartment: '302',
      block: 'C',
      vehicles: [
        { type: 'CAR', plate: 'ABC1243' },
        { type: 'MOTO', plate: 'XYZ1001' }
      ],
      carSpaces: 1,
      motoSpaces: 1,
      isPCD: false,
      isElderly: false,
      isDefaulting: false,
      isPresentInAssembly: true
    },
    {
      id: 'U011',
      apartment: '303',
      block: 'C',
      vehicles: [
        { type: 'CAR', plate: 'ABC1244' },
        { type: 'MOTO', plate: 'XYZ1002' }
      ],
      carSpaces: 1,
      motoSpaces: 1,
      isPCD: false,
      isElderly: false,
      isDefaulting: false,
      isPresentInAssembly: false
    },
    
    // Unidades regulares (restante - completando 30)
    ...Array.from({ length: 19 }, (_, i) => ({
      id: `U${String(i + 12).padStart(3, '0')}`,
      apartment: `${Math.floor((i + 11) / 4) + 1}0${(i % 4) + 1}`,
      block: ['A', 'B', 'C'][i % 3],
      vehicles: [{ type: 'CAR', plate: `ABC${1245 + i}` }],
      carSpaces: 1,
      motoSpaces: 0,
      isPCD: false,
      isElderly: false,
      isDefaulting: false,
      isPresentInAssembly: Math.random() > 0.4
    }))
  ],
  
  spaces: [
    // Vagas PCD (2 vagas)
    {
      id: 'S001',
      number: '1',
      type: 'G',
      coverage: 'COVERED',
      access: 'FREE',
      isPCD: true,
      isElderly: false,
      isCritical: false,
      isNearElevator: true,
      isNearEntrance: true,
      block: 'A'
    },
    {
      id: 'S002',
      number: '2',
      type: 'G',
      coverage: 'COVERED',
      access: 'FREE',
      isPCD: true,
      isElderly: false,
      isCritical: false,
      isNearElevator: true,
      isNearEntrance: true,
      block: 'B'
    },
    
    // Vagas para Idosos (4 vagas)
    {
      id: 'S003',
      number: '3',
      type: 'M',
      coverage: 'COVERED',
      access: 'FREE',
      isPCD: false,
      isElderly: true,
      isCritical: false,
      isNearElevator: true,
      isNearEntrance: false,
      block: 'A'
    },
    {
      id: 'S004',
      number: '4',
      type: 'M',
      coverage: 'COVERED',
      access: 'FREE',
      isPCD: false,
      isElderly: true,
      isCritical: false,
      isNearElevator: true,
      isNearEntrance: false,
      block: 'B'
    },
    {
      id: 'S005',
      number: '5',
      type: 'M',
      coverage: 'COVERED',
      access: 'FREE',
      isPCD: false,
      isElderly: true,
      isCritical: false,
      isNearElevator: false,
      isNearEntrance: true,
      block: 'B'
    },
    {
      id: 'S006',
      number: '6',
      type: 'M',
      coverage: 'COVERED',
      access: 'FREE',
      isPCD: false,
      isElderly: true,
      isCritical: false,
      isNearElevator: false,
      isNearEntrance: true,
      block: 'C'
    },
    
    // Vagas de moto (3 vagas)
    {
      id: 'S007',
      number: 'M1',
      type: 'MOTO',
      coverage: 'UNCOVERED',
      access: 'FREE',
      isPCD: false,
      isElderly: false,
      isCritical: false,
      isNearElevator: false,
      isNearEntrance: true,
      block: 'A'
    },
    {
      id: 'S008',
      number: 'M2',
      type: 'MOTO',
      coverage: 'UNCOVERED',
      access: 'FREE',
      isPCD: false,
      isElderly: false,
      isCritical: false,
      isNearElevator: false,
      isNearEntrance: true,
      block: 'B'
    },
    {
      id: 'S009',
      number: 'M3',
      type: 'MOTO',
      coverage: 'UNCOVERED',
      access: 'FREE',
      isPCD: false,
      isElderly: false,
      isCritical: false,
      isNearElevator: false,
      isNearEntrance: false,
      block: 'C'
    },
    
    // Vagas regulares de carro (26 vagas - completando 35 total)
    ...Array.from({ length: 26 }, (_, i) => ({
      id: `S${String(i + 10).padStart(3, '0')}`,
      number: `${i + 7}`,
      type: i % 3 === 0 ? 'P' : i % 3 === 1 ? 'M' : 'G',
      coverage: i % 5 < 2 ? 'COVERED' : 'UNCOVERED',
      access: i % 7 < 5 ? 'FREE' : 'LOCKED',
      isPCD: false,
      isElderly: false,
      isCritical: i % 10 === 0,
      isNearElevator: i % 8 < 2,
      isNearEntrance: i % 6 < 1,
      block: ['A', 'B', 'C'][i % 3]
    }))
  ],
  
  config: {
    seed: 'TEST-SMALL-CONDO-2026',
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
    minFairnessIndex: 0.85,
    maxGini: 0.35,
    allocationRate: 1.0, // 100%
    pcdAllocationRate: 1.0, // Todos PCDs devem receber vaga PCD
    elderlyAllocationRate: 1.0 // Todos idosos devem receber vaga adequada
  }
};

export default scenario;
