/**
 * CENÁRIO DE TESTE: Caso Extremo - Todos Inadimplentes
 * 
 * Descrição:
 * - 30 unidades
 * - TODAS as unidades são inadimplentes
 * - 35 vagas disponíveis
 * 
 * O que está sendo testado:
 * ✓ Penalidade é aplicada uniformemente
 * ✓ Sistema não discrimina quando todos são iguais
 * ✓ Distribuição continua justa
 * ✓ Scores negativos não causam problemas
 * ✓ Outras regras (proximidade) ainda funcionam
 * 
 * Expectativas:
 * - Taxa alocação: 85% (30/35)
 * - Fairness Index: > 0.85 (deve ser justo entre iguais)
 * - TODOS têm -20 pontos de penalidade
 * - Outros critérios desempatam (bloco, elevador)
 */

export const scenario = {
  name: 'Caso Extremo - Todos Inadimplentes',
  description: 'Todas unidades inadimplentes - teste de uniformidade',
  
  units: [
    // 30 unidades - TODAS inadimplentes
    ...Array.from({ length: 30 }, (_, i) => ({
      id: `U_DEF_${String(i + 1).padStart(3, '0')}`,
      apartment: `${Math.floor(i / 5) + 1}0${(i % 5) + 1}`,
      block: ['A', 'B', 'C'][i % 3],
      vehicles: [{ type: 'CAR', plate: `DEF${1000 + i}` }],
      carSpaces: 1,
      motoSpaces: 0,
      isPCD: false,
      isElderly: false,
      isDefaulting: true, // TODOS inadimplentes!
      isPresentInAssembly: i % 4 < 2 // 50% presentes (varia)
    }))
  ],
  
  spaces: [
    // 35 vagas variadas
    ...Array.from({ length: 35 }, (_, i) => ({
      id: `S${String(i + 1).padStart(3, '0')}`,
      number: `${i + 1}`,
      type: i % 3 === 0 ? 'P' : i % 3 === 1 ? 'M' : 'G',
      coverage: i % 3 < 2 ? 'COVERED' : 'UNCOVERED',
      access: i % 6 < 5 ? 'FREE' : 'LOCKED',
      isPCD: false,
      isElderly: false,
      isCritical: i % 8 === 0,
      isNearElevator: i % 5 < 2,
      isNearEntrance: i % 7 < 1,
      block: ['A', 'B', 'C'][i % 3]
    }))
  ],
  
  config: {
    seed: 'TEST-ALL-DEFAULTING-2026',
    weights: {
      coverageCompensation: 30,
      mobilityCompensation: 25,
      blockProximity: 15,        // Deve funcionar
      elevatorProximity: 10,      // Deve funcionar
      criticalRotation: 30,
      entranceProximity: 8,       // Deve funcionar
      defaultingPenalty: 20,      // Todos têm -20
      absencePenalty: 10          // Varia (50% têm -10 adicional)
    }
  },
  
  expectedResults: {
    allocationRate: 0.85, // 30/35
    minFairnessIndex: 0.85, // Deve ser justo pois todos iguais
    
    // Validações
    allHavePenalty: true,           // Todos -20 pontos
    scoresAreNegative: true,        // Scores devem ser baixos
    otherRulesStillWork: true,      // Bloco, elevador etc funcionam
    distributionIsFair: true        // Apesar de todos penalizados
  }
};

export default scenario;
