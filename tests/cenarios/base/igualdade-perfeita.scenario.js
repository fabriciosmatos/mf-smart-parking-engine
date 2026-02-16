/**
 * CENÁRIO DE TESTE: Equilíbrio Perfeito
 * 
 * Descrição:
 * - 30 unidades IDÊNTICAS (sem prioridades, sem inadimplentes)
 * - 30 vagas IDÊNTICAS (todas iguais)
 * - Teste de justiça pura - sorteio totalmente aleatório
 * 
 * O que está sendo testado:
 * ✓ Sistema funciona sem diferenciação
 * ✓ Aleatoriedade é verdadeira (não viciada)
 * ✓ Distribuição uniforme (chi-quadrado)
 * ✓ Fairness Index: próximo de 1.0 (perfeito)
 * ✓ Gini: próximo de 0.0 (igualdade total)
 * ✓ Seed gera resultados reproduzíveis
 * 
 * Expectativas:
 * - Taxa alocação: 100% (30/30)
 * - Fairness Index: > 0.95 (quase perfeito)
 * - Gini: < 0.10 (quase zero desigualdade)
 * - Distribuição uniforme entre blocos
 * - Chi-quadrado p-value > 0.05
 */

export const scenario = {
  name: 'Equilíbrio Perfeito - Tudo Igual',
  description: 'Todas unidades e vagas idênticas - teste de aleatoriedade pura',
  
  units: [
    // 30 unidades PERFEITAMENTE IDÊNTICAS
    ...Array.from({ length: 30 }, (_, i) => ({
      id: `U${String(i + 1).padStart(3, '0')}`,
      apartment: `${String(i + 1).padStart(3, '0')}`,
      block: ['A', 'B', 'C'][i % 3], // Distribuição uniforme
      vehicles: [{ type: 'CAR', plate: `ABC${1000 + i}` }],
      carSpaces: 1,
      motoSpaces: 0,
      isPCD: false,
      isElderly: false,
      isDefaulting: false,
      isPresentInAssembly: true, // Todos presentes
      // SEM histórico, SEM diferenciação
    }))
  ],
  
  spaces: [
    // 30 vagas PERFEITAMENTE IDÊNTICAS
    ...Array.from({ length: 30 }, (_, i) => ({
      id: `S${String(i + 1).padStart(3, '0')}`,
      number: `${i + 1}`,
      type: 'M', // Todas médias
      coverage: 'COVERED', // Todas cobertas
      access: 'FREE', // Todas livres
      isPCD: false,
      isElderly: false,
      isCritical: false,
      isNearElevator: false,
      isNearEntrance: false,
      block: ['A', 'B', 'C'][i % 3] // Distribuição uniforme
    }))
  ],
  
  config: {
    seed: 'TEST-PERFECT-BALANCE-2026',
    weights: {
      // Pesos não devem importar (tudo igual)
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
    allocationRate: 1.0, // 30/30 - perfeito
    minFairnessIndex: 0.95, // Quase perfeito
    maxGini: 0.10, // Quase zero desigualdade
    
    // Testes estatísticos
    uniformDistribution: true, // Chi-quadrado
    reproducible: true, // Seed funciona
    
    // Validações
    allScoresEqual: true, // Todos têm mesmo score
    blockBalanced: true, // 10-10-10 entre A-B-C
    noErrors: true
  }
};

export default scenario;
