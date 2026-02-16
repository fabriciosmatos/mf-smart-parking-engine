/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║  ÍNDICE DE CENÁRIOS DE TESTE                                  ║
 * ║  Smart Parking Engine v2.5                                    ║
 * ╚═══════════════════════════════════════════════════════════════╝
 * 
 * Este arquivo serve como índice central de todos os cenários.
 * Use-o para importar e executar cenários programaticamente.
 */

// ═══════════════════════════════════════════════════════════════
// BASELINE - Casos fundamentais
// ═══════════════════════════════════════════════════════════════

export { default as perfectEquality } from './baseline/perfect-equality.scenario.js';

// ═══════════════════════════════════════════════════════════════
// REALISTIC - Condomínios reais
// ═══════════════════════════════════════════════════════════════

export { default as smallCondo } from './realistic/small-condo.scenario.js';
export { default as largeCondo } from './realistic/large-condo.scenario.js';

// ═══════════════════════════════════════════════════════════════
// COMPENSATION - Mecânicas de compensação
// ═══════════════════════════════════════════════════════════════

export { default as secondRaffle } from './compensation/second-raffle.scenario.js';

// ═══════════════════════════════════════════════════════════════
// EDGE CASES - Casos extremos
// ═══════════════════════════════════════════════════════════════

export { default as scarcity } from './edge-cases/scarcity.scenario.js';
export { default as allCritical } from './edge-cases/all-critical.scenario.js';
export { default as allDefaulting } from './edge-cases/all-defaulting.scenario.js';
export { default as noPrioritySpaces } from './edge-cases/no-priority-spaces.scenario.js';

// ═══════════════════════════════════════════════════════════════
// SEQUENCE - Sorteios consecutivos
// ═══════════════════════════════════════════════════════════════

export { default as multiRaffle } from './sequence/multi-raffle.scenario.js';

// ═══════════════════════════════════════════════════════════════
// STRESS - Testes de carga
// ═══════════════════════════════════════════════════════════════

export { default as largeScale } from './stress/large-scale.scenario.js';

// ═══════════════════════════════════════════════════════════════
// CATÁLOGO COMPLETO
// ═══════════════════════════════════════════════════════════════

export const ALL_SCENARIOS = {
  baseline: {
    perfectEquality: './baseline/perfect-equality.scenario.js'
  },
  
  realistic: {
    smallCondo: './realistic/small-condo.scenario.js',
    largeCondo: './realistic/large-condo.scenario.js'
  },
  
  compensation: {
    secondRaffle: './compensation/second-raffle.scenario.js'
  },
  
  edgeCases: {
    scarcity: './edge-cases/scarcity.scenario.js',
    allCritical: './edge-cases/all-critical.scenario.js',
    allDefaulting: './edge-cases/all-defaulting.scenario.js',
    noPrioritySpaces: './edge-cases/no-priority-spaces.scenario.js'
  },
  
  sequence: {
    multiRaffle: './sequence/multi-raffle.scenario.js'
  },
  
  stress: {
    largeScale: './stress/large-scale.scenario.js'
  }
};

// ═══════════════════════════════════════════════════════════════
// METADATA DOS CENÁRIOS
// ═══════════════════════════════════════════════════════════════

export const SCENARIO_METADATA = {
  perfectEquality: {
    category: 'baseline',
    difficulty: 'easy',
    executionTime: 'fast',
    tags: ['baseline', 'equality', 'random'],
    description: 'Todas unidades e vagas idênticas - testa aleatoriedade pura'
  },
  
  smallCondo: {
    category: 'realistic',
    difficulty: 'easy',
    executionTime: 'fast',
    tags: ['realistic', 'basic', 'complete'],
    description: '30 unidades, condomínio pequeno típico'
  },
  
  largeCondo: {
    category: 'realistic',
    difficulty: 'medium',
    executionTime: 'medium',
    tags: ['realistic', 'scale', 'performance'],
    description: '100 unidades, condomínio grande'
  },
  
  secondRaffle: {
    category: 'compensation',
    difficulty: 'medium',
    executionTime: 'fast',
    tags: ['compensation', 'history', 'fairness'],
    description: 'Testa compensação em segundo sorteio'
  },
  
  scarcity: {
    category: 'edge-cases',
    difficulty: 'hard',
    executionTime: 'fast',
    tags: ['edge-case', 'scarcity', 'priority'],
    description: '60 unidades, 40 vagas - deficit severo'
  },
  
  allCritical: {
    category: 'edge-cases',
    difficulty: 'hard',
    executionTime: 'fast',
    tags: ['edge-case', 'critical', 'worst-case'],
    description: 'Todas vagas são críticas - pior caso'
  },
  
  allDefaulting: {
    category: 'edge-cases',
    difficulty: 'medium',
    executionTime: 'fast',
    tags: ['edge-case', 'penalty', 'equality'],
    description: 'Todos inadimplentes - penalidade uniforme'
  },
  
  noPrioritySpaces: {
    category: 'edge-cases',
    difficulty: 'hard',
    executionTime: 'fast',
    tags: ['edge-case', 'priority', 'fallback'],
    description: 'PCDs/idosos sem vagas reservadas'
  },
  
  multiRaffle: {
    category: 'sequence',
    difficulty: 'hard',
    executionTime: 'slow',
    tags: ['sequence', 'history', 'evolution'],
    description: '4 sorteios consecutivos com histórico'
  },
  
  largeScale: {
    category: 'stress',
    difficulty: 'hard',
    executionTime: 'slow',
    tags: ['stress', 'performance', 'scale'],
    description: '200 unidades - teste de performance'
  }
};

// ═══════════════════════════════════════════════════════════════
// SUITES DE TESTES RECOMENDADAS
// ═══════════════════════════════════════════════════════════════

export const TEST_SUITES = {
  // Suite básica - execução rápida
  quick: [
    'perfectEquality',
    'smallCondo',
    'secondRaffle'
  ],
  
  // Suite completa - todos cenários menos stress
  full: [
    'perfectEquality',
    'smallCondo',
    'largeCondo',
    'secondRaffle',
    'scarcity',
    'allCritical',
    'allDefaulting',
    'noPrioritySpaces'
  ],
  
  // Suite de edge cases
  edges: [
    'scarcity',
    'allCritical',
    'allDefaulting',
    'noPrioritySpaces'
  ],
  
  // Suite de performance
  performance: [
    'largeCondo',
    'largeScale',
    'multiRaffle'
  ],
  
  // Suite de certificação - tudo!
  certification: [
    'perfectEquality',
    'smallCondo',
    'largeCondo',
    'secondRaffle',
    'scarcity',
    'allCritical',
    'allDefaulting',
    'noPrioritySpaces',
    'multiRaffle',
    'largeScale'
  ]
};

// ═══════════════════════════════════════════════════════════════
// HELPER: Busca cenários por tag
// ═══════════════════════════════════════════════════════════════

export function findByTag(tag) {
  return Object.entries(SCENARIO_METADATA)
    .filter(([_, meta]) => meta.tags.includes(tag))
    .map(([name, _]) => name);
}

// ═══════════════════════════════════════════════════════════════
// HELPER: Busca cenários por categoria
// ═══════════════════════════════════════════════════════════════

export function findByCategory(category) {
  return Object.entries(SCENARIO_METADATA)
    .filter(([_, meta]) => meta.category === category)
    .map(([name, _]) => name);
}

// ═══════════════════════════════════════════════════════════════
// EXEMPLO DE USO
// ═══════════════════════════════════════════════════════════════

/*
// Importar cenário específico
import { smallCondo } from './scenarios/index.js';

// Importar suite
import { TEST_SUITES } from './scenarios/index.js';
const quickTests = TEST_SUITES.quick;

// Buscar por tag
import { findByTag } from './scenarios/index.js';
const edgeCases = findByTag('edge-case');

// Buscar por categoria
import { findByCategory } from './scenarios/index.js';
const realistic = findByCategory('realistic');
*/
