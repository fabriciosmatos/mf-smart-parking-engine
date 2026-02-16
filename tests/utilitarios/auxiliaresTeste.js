/**
 * Utilitários de análise e validação para testes
 */

/**
 * Calcula média de um array
 */
export function mean(values) {
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

/**
 * Calcula mediana de um array
 */
export function median(values) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

/**
 * Calcula desvio padrão
 */
export function standardDeviation(values) {
  if (values.length === 0) return 0;
  const avg = mean(values);
  const squareDiffs = values.map(value => Math.pow(value - avg, 2));
  return Math.sqrt(mean(squareDiffs));
}

/**
 * Calcula índice de Gini (desigualdade na distribuição)
 * Retorna valor entre 0 (perfeita igualdade) e 1 (perfeita desigualdade)
 */
export function giniCoefficient(values) {
  if (values.length === 0) return 0;
  
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  const sum = sorted.reduce((a, b) => a + b, 0);
  
  if (sum === 0) return 0;
  
  let cumSum = 0;
  let gini = 0;
  
  for (let i = 0; i < n; i++) {
    cumSum += sorted[i];
    gini += (2 * (i + 1) - n - 1) * sorted[i];
  }
  
  return gini / (n * sum);
}

/**
 * Calcula Fairness Index (baseado em Jain's Fairness Index)
 * Retorna valor entre 0 (injusto) e 1 (perfeitamente justo)
 */
export function fairnessIndex(values) {
  if (values.length === 0) return 0;
  
  const sumSquared = Math.pow(values.reduce((a, b) => a + b, 0), 2);
  const squareSum = values.reduce((a, b) => a + Math.pow(b, 2), 0);
  
  if (squareSum === 0) return 1;
  
  return sumSquared / (values.length * squareSum);
}

/**
 * Analisa distribuição de scores
 */
export function analyzeScoreDistribution(assignments) {
  const scores = assignments.map(a => a.score);
  
  return {
    count: scores.length,
    mean: mean(scores),
    median: median(scores),
    stdDev: standardDeviation(scores),
    min: Math.min(...scores),
    max: Math.max(...scores),
    gini: giniCoefficient(scores),
    fairness: fairnessIndex(scores)
  };
}

/**
 * Valida taxa de compensação
 */
export function validateCompensationRate(assignments, units, spaces) {
  // Unidades que tinham vaga descoberta
  const unitsWithUncovered = units.filter(u => 
    u.previousAssignment?.coverage === 'UNCOVERED'
  );
  
  if (unitsWithUncovered.length === 0) {
    return { rate: null, satisfied: 0, total: 0 };
  }
  
  // Verifica quantas foram compensadas com vaga coberta
  let compensated = 0;
  
  for (const unit of unitsWithUncovered) {
    const assignment = assignments.find(a => a.unitId === unit.id);
    if (!assignment) continue;
    
    const space = spaces.find(s => s.id === assignment.spaceId);
    if (space && space.coverage === 'COVERED') {
      compensated++;
    }
  }
  
  return {
    rate: compensated / unitsWithUncovered.length,
    satisfied: compensated,
    total: unitsWithUncovered.length
  };
}

/**
 * Valida taxa de mobilidade
 */
export function validateMobilityRate(assignments, units, spaces) {
  // Unidades que tinham acesso bloqueado
  const unitsWithLocked = units.filter(u => 
    u.previousAssignment?.access === 'LOCKED'
  );
  
  if (unitsWithLocked.length === 0) {
    return { rate: null, satisfied: 0, total: 0 };
  }
  
  let compensated = 0;
  
  for (const unit of unitsWithLocked) {
    const assignment = assignments.find(a => a.unitId === unit.id);
    if (!assignment) continue;
    
    const space = spaces.find(s => s.id === assignment.spaceId);
    if (space && space.access === 'FREE') {
      compensated++;
    }
  }
  
  return {
    rate: compensated / unitsWithLocked.length,
    satisfied: compensated,
    total: unitsWithLocked.length
  };
}

/**
 * Valida rotação de vagas críticas
 */
export function validateCriticalRotation(assignments, units, spaces) {
  // Unidades que tinham vaga crítica
  const unitsWithCritical = units.filter(u => 
    u.previousAssignment?.wasCritical === true
  );
  
  if (unitsWithCritical.length === 0) {
    return { rate: null, rotated: 0, total: 0 };
  }
  
  let rotated = 0;
  
  for (const unit of unitsWithCritical) {
    const assignment = assignments.find(a => a.unitId === unit.id);
    if (!assignment) continue;
    
    const space = spaces.find(s => s.id === assignment.spaceId);
    if (space && !space.isCritical) {
      rotated++;
    }
  }
  
  return {
    rate: rotated / unitsWithCritical.length,
    rotated,
    total: unitsWithCritical.length
  };
}

/**
 * Valida alocação prioritária
 */
export function validatePriorityAllocation(assignments, units, spaces) {
  const priorityUnits = units.filter(u => u.isPCD || u.isElderly);
  
  if (priorityUnits.length === 0) {
    return { rate: 1, satisfied: 0, total: 0 };
  }
  
  let satisfied = 0;
  
  for (const unit of priorityUnits) {
    const assignment = assignments.find(a => a.unitId === unit.id);
    if (!assignment) continue;
    
    const space = spaces.find(s => s.id === assignment.spaceId);
    if (!space) continue;
    
    // Valida se unidade prioritária recebeu vaga adequada
    if (unit.isPCD && space.isPCD) satisfied++;
    else if (unit.isElderly && space.isElderly) satisfied++;
  }
  
  return {
    rate: satisfied / priorityUnits.length,
    satisfied,
    total: priorityUnits.length
  };
}

/**
 * Valida penalidade por inadimplência
 */
export function validateDefaultingPenalty(assignments, units) {
  const defaultingUnits = units.filter(u => u.isDefaulting);
  const regularUnits = units.filter(u => !u.isDefaulting);
  
  if (defaultingUnits.length === 0 || regularUnits.length === 0) {
    return { impactDetected: null, avgDefaulting: 0, avgRegular: 0 };
  }
  
  const defaultingScores = defaultingUnits
    .map(u => assignments.find(a => a.unitId === u.id))
    .filter(a => a !== undefined)
    .map(a => a.score);
  
  const regularScores = regularUnits
    .map(u => assignments.find(a => a.unitId === u.id))
    .filter(a => a !== undefined)
    .map(a => a.score);
  
  const avgDefaulting = mean(defaultingScores);
  const avgRegular = mean(regularScores);
  
  return {
    impactDetected: avgDefaulting < avgRegular,
    avgDefaulting,
    avgRegular,
    difference: avgRegular - avgDefaulting
  };
}

/**
 * Valida proximidade de bloco
 */
export function validateBlockProximity(assignments, units, spaces) {
  let sameBlockCount = 0;
  let totalAssignments = 0;
  
  for (const assignment of assignments) {
    const unit = units.find(u => u.id === assignment.unitId);
    const space = spaces.find(s => s.id === assignment.spaceId);
    
    if (unit && space && unit.block && space.block) {
      totalAssignments++;
      if (unit.block === space.block) {
        sameBlockCount++;
      }
    }
  }
  
  return {
    rate: totalAssignments > 0 ? sameBlockCount / totalAssignments : 0,
    sameBlock: sameBlockCount,
    total: totalAssignments
  };
}

/**
 * Testa determinismo (mesma seed = mesmo resultado)
 */
export function testDeterminism(executeRaffle, units, spaces, config) {
  const result1 = executeRaffle(units, spaces, config);
  const result2 = executeRaffle(units, spaces, config);
  
  // Compara assignments
  if (result1.assignments.length !== result2.assignments.length) {
    return false;
  }
  
  for (let i = 0; i < result1.assignments.length; i++) {
    const a1 = result1.assignments[i];
    const a2 = result2.assignments[i];
    
    if (a1.unitId !== a2.unitId || a1.spaceId !== a2.spaceId) {
      return false;
    }
  }
  
  return true;
}

/**
 * Gera relatório completo de análise
 */
export function generateAnalysisReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    totalSimulations: results.length,
    scoreDistribution: {},
    fairnessMetrics: {},
    ruleCompliance: {},
    edgeCases: {},
    determinism: true
  };
  
  // Agrega métricas de todas as simulações
  const allScores = results.flatMap(r => r.assignments.map(a => a.score));
  
  report.scoreDistribution = {
    mean: mean(allScores),
    median: median(allScores),
    stdDev: standardDeviation(allScores),
    min: Math.min(...allScores),
    max: Math.max(...allScores)
  };
  
  // Calcula fairness geral
  const fairnessValues = results.map(r => 
    fairnessIndex(r.assignments.map(a => a.score))
  );
  
  report.fairnessMetrics = {
    avgFairnessIndex: mean(fairnessValues),
    minFairness: Math.min(...fairnessValues),
    maxFairness: Math.max(...fairnessValues)
  };
  
  return report;
}

/**
 * Assertions customizadas
 */
export class TestAssertions {
  static assertTrue(condition, message) {
    if (!condition) {
      throw new Error(`❌ Assertion failed: ${message}`);
    }
  }
  
  static assertFalse(condition, message) {
    if (condition) {
      throw new Error(`❌ Assertion failed: ${message}`);
    }
  }
  
  static assertEqual(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(`❌ Assertion failed: ${message}\n  Expected: ${expected}\n  Actual: ${actual}`);
    }
  }
  
  static assertGreaterThan(actual, threshold, message) {
    if (actual <= threshold) {
      throw new Error(`❌ Assertion failed: ${message}\n  Expected > ${threshold}\n  Actual: ${actual}`);
    }
  }
  
  static assertLessThan(actual, threshold, message) {
    if (actual >= threshold) {
      throw new Error(`❌ Assertion failed: ${message}\n  Expected < ${threshold}\n  Actual: ${actual}`);
    }
  }
  
  static assertBetween(actual, min, max, message) {
    if (actual < min || actual > max) {
      throw new Error(`❌ Assertion failed: ${message}\n  Expected between ${min} and ${max}\n  Actual: ${actual}`);
    }
  }
}
