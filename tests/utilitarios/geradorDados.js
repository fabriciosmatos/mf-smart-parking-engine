/**
 * Gerador de dados de teste para Smart Parking Engine
 */

/**
 * Gera unidade de teste
 */
export function generateUnit(overrides = {}) {
  const base = {
    id: `U${Math.random().toString(36).substr(2, 9)}`,
    apartment: `${Math.floor(Math.random() * 500) + 101}`,
    block: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
    vehicles: [{
      type: 'CAR',
      plate: `ABC${Math.floor(Math.random() * 9000) + 1000}`
    }],
    carSpaces: 1,
    motoSpaces: 0,
    isPCD: false,
    isElderly: false,
    isDefaulting: false,
    isPresentInAssembly: true
  };
  
  return { ...base, ...overrides };
}

/**
 * Gera vaga de teste
 */
export function generateSpace(overrides = {}) {
  const base = {
    id: `S${Math.random().toString(36).substr(2, 9)}`,
    number: `${Math.floor(Math.random() * 200) + 1}`,
    type: 'M',
    coverage: Math.random() > 0.5 ? 'COVERED' : 'UNCOVERED',
    access: Math.random() > 0.3 ? 'FREE' : 'LOCKED',
    isPCD: false,
    isElderly: false,
    isCritical: false,
    isNearElevator: Math.random() > 0.7,
    isNearEntrance: Math.random() > 0.8,
    block: ['A', 'B', 'C'][Math.floor(Math.random() * 3)]
  };
  
  return { ...base, ...overrides };
}

/**
 * Gera conjunto de unidades para teste
 */
export function generateUnits(count, options = {}) {
  const units = [];
  
  for (let i = 0; i < count; i++) {
    const unit = generateUnit({
      id: `UNIT_${String(i + 1).padStart(3, '0')}`,
      apartment: `${100 + i}`,
      ...options
    });
    units.push(unit);
  }
  
  return units;
}

/**
 * Gera conjunto de vagas para teste
 */
export function generateSpaces(count, options = {}) {
  const spaces = [];
  
  for (let i = 0; i < count; i++) {
    const space = generateSpace({
      id: `SPACE_${String(i + 1).padStart(3, '0')}`,
      number: `${i + 1}`,
      ...options
    });
    spaces.push(space);
  }
  
  return spaces;
}

/**
 * Cria cenário de teste realista
 */
export function createRealisticScenario(unitCount = 50) {
  // Gera unidades com distribuição realista
  const units = [];
  
  for (let i = 0; i < unitCount; i++) {
    const isPCD = Math.random() < 0.05; // 5% PCD
    const isElderly = Math.random() < 0.15; // 15% idosos
    const isDefaulting = Math.random() < 0.08; // 8% inadimplentes
    const isPresentInAssembly = Math.random() < 0.60; // 60% presentes
    const hasMoto = Math.random() < 0.20; // 20% têm moto
    
    units.push(generateUnit({
      id: `UNIT_${String(i + 1).padStart(3, '0')}`,
      apartment: `${100 + i}`,
      isPCD,
      isElderly,
      isDefaulting,
      isPresentInAssembly,
      motoSpaces: hasMoto ? 1 : 0,
      vehicles: hasMoto ? [
        { type: 'CAR', plate: `ABC${1000 + i}` },
        { type: 'MOTO', plate: `XYZ${1000 + i}` }
      ] : [
        { type: 'CAR', plate: `ABC${1000 + i}` }
      ]
    }));
  }
  
  // Gera vagas com distribuição realista
  const totalSpaces = Math.floor(unitCount * 1.2); // 20% a mais de vagas
  const spaces = [];
  
  for (let i = 0; i < totalSpaces; i++) {
    const isMoto = Math.random() < 0.15; // 15% vagas de moto
    const isPCD = Math.random() < 0.05; // 5% vagas PCD
    const isElderly = Math.random() < 0.05; // 5% vagas idosos
    const isCritical = Math.random() < 0.10; // 10% críticas
    const covered = Math.random() < 0.40; // 40% cobertas
    const locked = Math.random() < 0.20; // 20% bloqueadas
    const nearElevator = Math.random() < 0.25; // 25% perto elevador
    const nearEntrance = Math.random() < 0.15; // 15% perto entrada
    
    spaces.push(generateSpace({
      id: `SPACE_${String(i + 1).padStart(3, '0')}`,
      number: `${i + 1}`,
      type: isMoto ? 'MOTO' : ['P', 'M', 'G'][Math.floor(Math.random() * 3)],
      coverage: covered ? 'COVERED' : 'UNCOVERED',
      access: locked ? 'LOCKED' : 'FREE',
      isPCD,
      isElderly,
      isCritical,
      isNearElevator: nearElevator,
      isNearEntrance: nearEntrance
    }));
  }
  
  return { units, spaces };
}

/**
 * Cria cenário com histórico de alocação anterior
 * 
 * IMPORTANTE: Cria históricos INTENCIONALMENTE RUINS para testar compensação
 */
export function createScenarioWithHistory(unitCount = 30) {
  const { units, spaces } = createRealisticScenario(unitCount);
  
  // Adiciona histórico para 60% das unidades com distribuição de problemas
  const unitsWithHistory = units.map((unit, index) => {
    if (index < Math.floor(unitCount * 0.6)) {
      // Cria histórico RUIM de propósito para testar compensação
      const historyType = index % 5; // 5 tipos diferentes de histórico ruim
      
      let previousAssignment;
      
      switch(historyType) {
        case 0: // Vaga DESCOBERTA (30% dos casos) - testa RN03
          previousAssignment = {
            spaceId: `PREV_UNCOV_${index}`,
            coverage: 'UNCOVERED',
            access: 'FREE',
            wasCritical: false,
            isNearElevator: false
          };
          break;
          
        case 1: // Vaga BLOQUEADA (20% dos casos) - testa RN04
          previousAssignment = {
            spaceId: `PREV_LOCK_${index}`,
            coverage: 'COVERED',
            access: 'LOCKED',
            wasCritical: false,
            isNearElevator: false
          };
          break;
          
        case 2: // Vaga CRÍTICA (20% dos casos) - testa RN09
          previousAssignment = {
            spaceId: `PREV_CRIT_${index}`,
            coverage: 'COVERED',
            access: 'FREE',
            wasCritical: true,
            isNearElevator: false
          };
          break;
          
        case 3: // PIOR CASO: Descoberta + Bloqueada + Crítica (20% dos casos)
          previousAssignment = {
            spaceId: `PREV_WORST_${index}`,
            coverage: 'UNCOVERED',
            access: 'LOCKED',
            wasCritical: true,
            isNearElevator: false
          };
          break;
          
        case 4: // Vaga BOA (10% dos casos) - não deve ser compensado
          previousAssignment = {
            spaceId: `PREV_GOOD_${index}`,
            coverage: 'COVERED',
            access: 'FREE',
            wasCritical: false,
            isNearElevator: true
          };
          break;
      }
      
      return {
        ...unit,
        previousAssignment
      };
    }
    return unit;
  });
  
  return { units: unitsWithHistory, spaces };
}

/**
 * Cria cenário de edge case
 */
export function createEdgeCaseScenario(scenarioType) {
  switch (scenarioType) {
    case 'MORE_UNITS_THAN_SPACES':
      return {
        units: generateUnits(100),
        spaces: generateSpaces(50)
      };
      
    case 'ALL_CRITICAL':
      return {
        units: generateUnits(30),
        spaces: generateSpaces(30, { isCritical: true })
      };
      
    case 'ALL_DEFAULTING':
      return {
        units: generateUnits(30, { isDefaulting: true }),
        spaces: generateSpaces(30)
      };
      
    case 'ALL_PRIORITY':
      return {
        units: generateUnits(30, { isPCD: true }),
        spaces: generateSpaces(30, { isPCD: true })
      };
      
    case 'NO_COVERED':
      return {
        units: generateUnits(30),
        spaces: generateSpaces(30, { coverage: 'UNCOVERED' })
      };
      
    default:
      return createRealisticScenario(30);
  }
}

/**
 * Configuração padrão de pesos
 */
export function getDefaultWeights() {
  return {
    coverageCompensation: 30,
    mobilityCompensation: 25,
    blockProximity: 15,
    elevatorProximity: 10,
    criticalRotation: 30,
    entranceProximity: 8,
    defaultingPenalty: 20,
    absencePenalty: 10
  };
}

/**
 * Cria configuração de sorteio
 */
export function createRaffleConfig(seed = '2024-TEST', weights = null) {
  return {
    seed,
    weights: weights || getDefaultWeights()
  };
}
