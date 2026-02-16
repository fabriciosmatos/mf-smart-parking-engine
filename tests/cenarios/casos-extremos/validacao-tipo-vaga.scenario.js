/**
 * CENÁRIO DE TESTE: Validação de Tipo de Vaga (CARRO vs MOTO)
 * 
 * Descrição:
 * - Testa a regra RN01 estendida: incompatibilidade entre vagas de CARRO e MOTO
 * - Carros (tipos P/M/G) NÃO PODEM usar vagas MOTO
 * - Motos (tipo MOTO) NÃO PODEM usar vagas de carro
 * - Sistema deve validar inventário SEPARADAMENTE por tipo
 * 
 * O que está sendo testado:
 * ✓ Validação bloqueia sorteio quando há déficit de vagas de CARRO
 * ✓ Validação bloqueia sorteio quando há déficit de vagas de MOTO
 * ✓ Sistema diferencia corretamente P/M/G (carro) de MOTO
 * ✓ Mensagens de erro são específicas por tipo
 * ✓ Inventário perfeito = carRequests === carSpaces && motoRequests === motoSpaces
 * 
 * Sub-cenários:
 * 1. Déficit em vagas de CARRO (50 carros → 45 vagas carro)
 * 2. Déficit em vagas de MOTO (15 motos → 10 vagas moto)
 * 3. Déficit DUPLO (falta carro E moto)
 * 4. Inventário PERFEITO (match exato por tipo)
 * 5. Excesso de vagas (mais vagas que solicitações)
 */

// ========================================
// SUB-CENÁRIO 1: Déficit em Vagas de CARRO
// ========================================
export const deficitCarroScenario = {
  name: 'Déficit em Vagas de CARRO',
  description: '50 unidades solicitam vagas de carro, mas só há 45 vagas de carro disponíveis',
  
  units: [
    // 50 unidades com CARRO (1 vaga de carro cada)
    ...Array.from({ length: 50 }, (_, i) => ({
      id: `U${String(i + 1).padStart(3, '0')}`,
      apartment: `${String(i + 1).padStart(3, '0')}`,
      block: ['A', 'B', 'C'][i % 3],
      vehicles: [{ type: 'CAR', plate: `ABC${1000 + i}` }],
      carSpaces: 1, // Solicita 1 vaga de CARRO
      motoSpaces: 0,
      isPCD: false,
      isElderly: false,
      isDefaulting: false,
      isPresentInAssembly: true,
    })),
    // 10 unidades com MOTO (inventário perfeito para motos)
    ...Array.from({ length: 10 }, (_, i) => ({
      id: `M${String(i + 1).padStart(3, '0')}`,
      apartment: `M${String(i + 1).padStart(3, '0')}`,
      block: ['A', 'B', 'C'][i % 3],
      vehicles: [{ type: 'MOTO', plate: `MOT${100 + i}` }],
      carSpaces: 0,
      motoSpaces: 1, // Solicita 1 vaga de MOTO
      isPCD: false,
      isElderly: false,
      isDefaulting: false,
      isPresentInAssembly: true,
    }))
  ],
  
  spaces: [
    // 45 vagas de CARRO (DÉFICIT de 5)
    ...Array.from({ length: 45 }, (_, i) => ({
      id: `C${String(i + 1).padStart(3, '0')}`,
      number: `C${i + 1}`,
      type: ['P', 'M', 'G'][i % 3], // Mix de P/M/G (todas são CARRO)
      coverage: 'COVERED',
      access: 'FREE',
      isPCD: false,
      isElderly: false,
      isCritical: false,
      isNearElevator: false,
      isNearEntrance: false,
      block: ['A', 'B', 'C'][i % 3]
    })),
    // 10 vagas de MOTO (inventário perfeito)
    ...Array.from({ length: 10 }, (_, i) => ({
      id: `M${String(i + 1).padStart(3, '0')}`,
      number: `M${i + 1}`,
      type: 'MOTO', // Vaga específica para MOTO
      coverage: 'UNCOVERED',
      access: 'FREE',
      isPCD: false,
      isElderly: false,
      isCritical: false,
      isNearElevator: false,
      isNearEntrance: false,
      block: ['A', 'B', 'C'][i % 3]
    }))
  ],
  
  expectedResults: {
    shouldBlockRaffle: true, // DEVE BLOQUEAR sorteio
    errorType: 'CAR_DEFICIT',
    errorMessage: 'Déficit em vagas de CARRO',
    
    validation: {
      totalUnits: 60,
      totalSpaces: 55,
      carRequests: 50,
      carSpaces: 45,
      carDeficit: -5, // Faltam 5 vagas de CARRO
      motoRequests: 10,
      motoSpaces: 10,
      motoDeficit: 0, // Motos OK
      hasCarDeficit: true,
      hasMotoDeficit: false,
      hasInventoryIssue: true
    },
    
    uiExpected: {
      step1Alert: 'Alerta vermelho mostrando déficit de CARRO',
      step1Status: 'Válido - Carro: 50/45 | Moto: 10/10',
      step3ErrorTitle: 'ERRO CRÍTICO (RN01): Déficit em vagas de CARRO',
      step3ErrorDetail: 'Solicitações Carro: 50 | Vagas Carro: 45 | Faltam: -5',
      startButtonDisabled: true,
      startButtonText: 'Dados Inválidos'
    }
  }
};


// ========================================
// SUB-CENÁRIO 2: Déficit em Vagas de MOTO
// ========================================
export const deficitMotoScenario = {
  name: 'Déficit em Vagas de MOTO',
  description: '20 unidades solicitam vagas de moto, mas só há 15 vagas de moto disponíveis',
  
  units: [
    // 40 unidades com CARRO (inventário perfeito para carros)
    ...Array.from({ length: 40 }, (_, i) => ({
      id: `U${String(i + 1).padStart(3, '0')}`,
      apartment: `${String(i + 1).padStart(3, '0')}`,
      block: ['A', 'B'][i % 2],
      vehicles: [{ type: 'CAR', plate: `ABC${1000 + i}` }],
      carSpaces: 1,
      motoSpaces: 0,
      isPCD: false,
      isElderly: false,
      isDefaulting: false,
      isPresentInAssembly: true,
    })),
    // 20 unidades com MOTO (DÉFICIT)
    ...Array.from({ length: 20 }, (_, i) => ({
      id: `M${String(i + 1).padStart(3, '0')}`,
      apartment: `M${String(i + 1).padStart(3, '0')}`,
      block: ['A', 'B'][i % 2],
      vehicles: [{ type: 'MOTO', plate: `MOT${100 + i}` }],
      carSpaces: 0,
      motoSpaces: 1,
      isPCD: false,
      isElderly: false,
      isDefaulting: false,
      isPresentInAssembly: true,
    }))
  ],
  
  spaces: [
    // 40 vagas de CARRO (inventário perfeito)
    ...Array.from({ length: 40 }, (_, i) => ({
      id: `C${String(i + 1).padStart(3, '0')}`,
      number: `C${i + 1}`,
      type: ['P', 'M', 'G'][i % 3],
      coverage: 'COVERED',
      access: 'FREE',
      isPCD: false,
      isElderly: false,
      isCritical: false,
      isNearElevator: false,
      isNearEntrance: false,
      block: ['A', 'B'][i % 2]
    })),
    // 15 vagas de MOTO (DÉFICIT de 5)
    ...Array.from({ length: 15 }, (_, i) => ({
      id: `M${String(i + 1).padStart(3, '0')}`,
      number: `M${i + 1}`,
      type: 'MOTO',
      coverage: 'UNCOVERED',
      access: 'FREE',
      isPCD: false,
      isElderly: false,
      isCritical: false,
      isNearElevator: false,
      isNearEntrance: false,
      block: ['A', 'B'][i % 2]
    }))
  ],
  
  expectedResults: {
    shouldBlockRaffle: true,
    errorType: 'MOTO_DEFICIT',
    errorMessage: 'Déficit em vagas de MOTO',
    
    validation: {
      totalUnits: 60,
      totalSpaces: 55,
      carRequests: 40,
      carSpaces: 40,
      carDeficit: 0, // Carros OK
      motoRequests: 20,
      motoSpaces: 15,
      motoDeficit: -5, // Faltam 5 vagas de MOTO
      hasCarDeficit: false,
      hasMotoDeficit: true,
      hasInventoryIssue: true
    },
    
    uiExpected: {
      step1Alert: 'Alerta vermelho mostrando déficit de MOTO',
      step1Status: 'Válido - Carro: 40/40 | Moto: 20/15',
      step3ErrorTitle: 'ERRO CRÍTICO (RN01): Déficit em vagas de MOTO',
      step3ErrorDetail: 'Solicitações Moto: 20 | Vagas Moto: 15 | Faltam: -5',
      startButtonDisabled: true,
      startButtonText: 'Dados Inválidos'
    }
  }
};


// ========================================
// SUB-CENÁRIO 3: Déficit DUPLO (Carro E Moto)
// ========================================
export const deficitDuploScenario = {
  name: 'Déficit DUPLO - Carro E Moto',
  description: 'Déficit em AMBOS os tipos de vaga simultaneamente',
  
  units: [
    // 60 unidades com CARRO
    ...Array.from({ length: 60 }, (_, i) => ({
      id: `U${String(i + 1).padStart(3, '0')}`,
      apartment: `${String(i + 1).padStart(3, '0')}`,
      block: ['A', 'B', 'C'][i % 3],
      vehicles: [{ type: 'CAR', plate: `ABC${1000 + i}` }],
      carSpaces: 1,
      motoSpaces: 0,
      isPCD: false,
      isElderly: false,
      isDefaulting: false,
      isPresentInAssembly: true,
    })),
    // 25 unidades com MOTO
    ...Array.from({ length: 25 }, (_, i) => ({
      id: `M${String(i + 1).padStart(3, '0')}`,
      apartment: `M${String(i + 1).padStart(3, '0')}`,
      block: ['A', 'B', 'C'][i % 3],
      vehicles: [{ type: 'MOTO', plate: `MOT${100 + i}` }],
      carSpaces: 0,
      motoSpaces: 1,
      isPCD: false,
      isElderly: false,
      isDefaulting: false,
      isPresentInAssembly: true,
    }))
  ],
  
  spaces: [
    // 50 vagas de CARRO (déficit de 10)
    ...Array.from({ length: 50 }, (_, i) => ({
      id: `C${String(i + 1).padStart(3, '0')}`,
      number: `C${i + 1}`,
      type: ['P', 'M', 'G'][i % 3],
      coverage: 'COVERED',
      access: 'FREE',
      isPCD: false,
      isElderly: false,
      isCritical: false,
      isNearElevator: false,
      isNearEntrance: false,
      block: ['A', 'B', 'C'][i % 3]
    })),
    // 18 vagas de MOTO (déficit de 7)
    ...Array.from({ length: 18 }, (_, i) => ({
      id: `M${String(i + 1).padStart(3, '0')}`,
      number: `M${i + 1}`,
      type: 'MOTO',
      coverage: 'UNCOVERED',
      access: 'FREE',
      isPCD: false,
      isElderly: false,
      isCritical: false,
      isNearElevator: false,
      isNearEntrance: false,
      block: ['A', 'B', 'C'][i % 3]
    }))
  ],
  
  expectedResults: {
    shouldBlockRaffle: true,
    errorType: 'BOTH_DEFICIT',
    errorMessage: 'Déficit em vagas de CARRO e MOTO',
    
    validation: {
      totalUnits: 85,
      totalSpaces: 68,
      carRequests: 60,
      carSpaces: 50,
      carDeficit: -10,
      motoRequests: 25,
      motoSpaces: 18,
      motoDeficit: -7,
      hasCarDeficit: true,
      hasMotoDeficit: true,
      hasInventoryIssue: true
    },
    
    uiExpected: {
      step1Alert: 'Alerta vermelho mostrando déficit em AMBOS os tipos',
      step1Status: 'Válido - Carro: 60/50 | Moto: 25/18',
      step3ErrorTitle: 'ERRO CRÍTICO (RN01): Déficit em vagas de CARRO e MOTO',
      step3ErrorDetail: [
        'Carro - Solicitações: 60 | Vagas: 50 | Faltam: -10',
        'Moto - Solicitações: 25 | Vagas: 18 | Faltam: -7'
      ],
      startButtonDisabled: true,
      startButtonText: 'Dados Inválidos'
    }
  }
};


// ========================================
// SUB-CENÁRIO 4: Inventário PERFEITO
// ========================================
export const inventarioPerfeitoScenario = {
  name: 'Inventário PERFEITO - Match Exato por Tipo',
  description: 'carRequests === carSpaces && motoRequests === motoSpaces (100% perfeito)',
  
  units: [
    // 70 unidades com CARRO
    ...Array.from({ length: 70 }, (_, i) => ({
      id: `U${String(i + 1).padStart(3, '0')}`,
      apartment: `${String(i + 1).padStart(3, '0')}`,
      block: ['A', 'B', 'C'][i % 3],
      vehicles: [{ type: 'CAR', plate: `ABC${1000 + i}` }],
      carSpaces: 1,
      motoSpaces: 0,
      isPCD: i < 3, // 3 PCDs
      isElderly: i >= 3 && i < 10, // 7 idosos
      isDefaulting: false,
      isPresentInAssembly: true,
    })),
    // 10 unidades com MOTO
    ...Array.from({ length: 10 }, (_, i) => ({
      id: `M${String(i + 1).padStart(3, '0')}`,
      apartment: `M${String(i + 1).padStart(3, '0')}`,
      block: ['A', 'B', 'C'][i % 3],
      vehicles: [{ type: 'MOTO', plate: `MOT${100 + i}` }],
      carSpaces: 0,
      motoSpaces: 1,
      isPCD: false,
      isElderly: false,
      isDefaulting: false,
      isPresentInAssembly: true,
    }))
  ],
  
  spaces: [
    // 70 vagas de CARRO (match perfeito)
    ...Array.from({ length: 70 }, (_, i) => ({
      id: `C${String(i + 1).padStart(3, '0')}`,
      number: `C${i + 1}`,
      type: ['P', 'M', 'G'][i % 3],
      coverage: i < 50 ? 'COVERED' : 'UNCOVERED',
      access: i < 5 ? 'LOCKED' : 'FREE',
      isPCD: i < 3,
      isElderly: i >= 3 && i < 10,
      isCritical: i >= 60,
      isNearElevator: i < 15,
      isNearEntrance: i < 20,
      block: ['A', 'B', 'C'][i % 3]
    })),
    // 10 vagas de MOTO (match perfeito)
    ...Array.from({ length: 10 }, (_, i) => ({
      id: `M${String(i + 1).padStart(3, '0')}`,
      number: `M${i + 1}`,
      type: 'MOTO',
      coverage: 'UNCOVERED',
      access: 'FREE',
      isPCD: false,
      isElderly: false,
      isCritical: i > 7,
      isNearElevator: false,
      isNearEntrance: false,
      block: ['A', 'B', 'C'][i % 3]
    }))
  ],
  
  expectedResults: {
    shouldBlockRaffle: false, // NÃO deve bloquear
    errorType: null,
    errorMessage: null,
    
    validation: {
      totalUnits: 80,
      totalSpaces: 80,
      carRequests: 70,
      carSpaces: 70,
      carDeficit: 0, // PERFEITO
      motoRequests: 10,
      motoSpaces: 10,
      motoDeficit: 0, // PERFEITO
      hasCarDeficit: false,
      hasMotoDeficit: false,
      hasInventoryIssue: false
    },
    
    uiExpected: {
      step1Alert: null, // SEM alerta
      step1Status: 'Perfeito! Carro: 70=70 | Moto: 10=10',
      step3Display: [
        'Card Carro: 70 / 70 (fundo verde)',
        'Card Moto: 10 / 10 (fundo verde)',
        'Mensagem: "Inventário perfeito: 100%"'
      ],
      step3Error: null,
      startButtonDisabled: false,
      startButtonText: 'Iniciar Sorteio'
    },
    
    allocationExpected: {
      rate: 1.0, // 100% alocação
      carsToCarSpaces: 70, // Todos carros em vagas de carro
      motosToMotoSpaces: 10, // Todas motos em vagas de moto
      noMismatch: true // Zero carros em vagas moto, zero motos em vagas carro
    }
  }
};


// ========================================
// SUB-CENÁRIO 5: Excesso de Vagas
// ========================================
export const excessoVagasScenario = {
  name: 'Excesso de Vagas - Mais vagas que solicitações',
  description: 'Inventário válido mas não perfeito (sobram vagas)',
  
  units: [
    // 40 unidades com CARRO
    ...Array.from({ length: 40 }, (_, i) => ({
      id: `U${String(i + 1).padStart(3, '0')}`,
      apartment: `${String(i + 1).padStart(3, '0')}`,
      block: ['A', 'B'][i % 2],
      vehicles: [{ type: 'CAR', plate: `ABC${1000 + i}` }],
      carSpaces: 1,
      motoSpaces: 0,
      isPCD: false,
      isElderly: false,
      isDefaulting: false,
      isPresentInAssembly: true,
    })),
    // 8 unidades com MOTO
    ...Array.from({ length: 8 }, (_, i) => ({
      id: `M${String(i + 1).padStart(3, '0')}`,
      apartment: `M${String(i + 1).padStart(3, '0')}`,
      block: ['A', 'B'][i % 2],
      vehicles: [{ type: 'MOTO', plate: `MOT${100 + i}` }],
      carSpaces: 0,
      motoSpaces: 1,
      isPCD: false,
      isElderly: false,
      isDefaulting: false,
      isPresentInAssembly: true,
    }))
  ],
  
  spaces: [
    // 55 vagas de CARRO (excesso de 15)
    ...Array.from({ length: 55 }, (_, i) => ({
      id: `C${String(i + 1).padStart(3, '0')}`,
      number: `C${i + 1}`,
      type: ['P', 'M', 'G'][i % 3],
      coverage: 'COVERED',
      access: 'FREE',
      isPCD: false,
      isElderly: false,
      isCritical: false,
      isNearElevator: false,
      isNearEntrance: false,
      block: ['A', 'B'][i % 2]
    })),
    // 12 vagas de MOTO (excesso de 4)
    ...Array.from({ length: 12 }, (_, i) => ({
      id: `M${String(i + 1).padStart(3, '0')}`,
      number: `M${i + 1}`,
      type: 'MOTO',
      coverage: 'UNCOVERED',
      access: 'FREE',
      isPCD: false,
      isElderly: false,
      isCritical: false,
      isNearElevator: false,
      isNearEntrance: false,
      block: ['A', 'B'][i % 2]
    }))
  ],
  
  expectedResults: {
    shouldBlockRaffle: false, // NÃO deve bloquear (excesso é OK)
    errorType: null,
    errorMessage: null,
    
    validation: {
      totalUnits: 48,
      totalSpaces: 67,
      carRequests: 40,
      carSpaces: 55,
      carDeficit: 15, // EXCESSO (positivo)
      motoRequests: 8,
      motoSpaces: 12,
      motoDeficit: 4, // EXCESSO (positivo)
      hasCarDeficit: false,
      hasMotoDeficit: false,
      hasInventoryIssue: false
    },
    
    uiExpected: {
      step1Alert: null,
      step1Status: 'Válido - Carro: 40/55 | Moto: 8/12',
      step3Display: [
        'Card Carro: 40 / 55 (fundo cinza - não perfeito)',
        'Card Moto: 8 / 12 (fundo cinza - não perfeito)'
      ],
      step3Error: null,
      startButtonDisabled: false,
      startButtonText: 'Iniciar Sorteio'
    },
    
    allocationExpected: {
      rate: 1.0, // 100% alocação
      unusedCarSpaces: 15, // 15 vagas de carro sobram
      unusedMotoSpaces: 4 // 4 vagas de moto sobram
    }
  }
};


// ========================================
// EXPORTAÇÃO DE TODOS OS SUB-CENÁRIOS
// ========================================
export default {
  name: 'Validação de Tipo de Vaga (CARRO vs MOTO)',
  description: 'Suite completa de testes para separação de tipos de vaga',
  category: 'edge-cases',
  
  scenarios: [
    deficitCarroScenario,
    deficitMotoScenario,
    deficitDuploScenario,
    inventarioPerfeitoScenario,
    excessoVagasScenario
  ],
  
  // Regras de negócio validadas
  businessRules: [
    'RN01-EXTENDED: Inventário deve ser validado SEPARADAMENTE por tipo',
    'Carros (P/M/G) não podem usar vagas MOTO',
    'Motos (MOTO) não podem usar vagas de carro',
    'Validação em 2 estágios: DataIngestionStep + SimulationStep',
    'UI deve mostrar métricas separadas com ícones (🚗/🏍️)',
    'Mock generator deve criar match perfeito por tipo'
  ],
  
  // Implementação relacionada
  implementedIn: [
    'app/components/steps/DataIngestionStep.tsx - Validação Step 1',
    'app/components/steps/SimulationStep.tsx - Validação Step 3',
    'app/App.tsx - Mock generator com type distribution',
    'app/core/modelos/Vaga.ts - type: P|M|G|MOTO',
    'app/core/modelos/Unidade.ts - carSpaces + motoSpaces'
  ],
  
  // Commit relacionado
  commitHash: 'e862c51',
  commitMessage: 'feat: Valida separadamente vagas de CARRO vs MOTO (incompatibilidade corrigida)',
  
  // Data de criação
  createdAt: '2026-02-15',
  version: 'v2.5.1'
};
