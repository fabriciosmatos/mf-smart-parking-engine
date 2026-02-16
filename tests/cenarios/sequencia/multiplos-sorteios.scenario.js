/**
 * CENÁRIO DE TESTE: Sequência - Múltiplos Sorteios
 * 
 * Descrição:
 * - 20 unidades
 * - 25 vagas
 * - Executa 4 sorteios consecutivos
 * - Testa evolução da compensação ao longo do tempo
 * 
 * O que está sendo testado:
 * ✓ Histórico é preservado entre sorteios
 * ✓ Compensação aumenta a cada sorteio ruim
 * ✓ Quem perdeu no sorteio 1 ganha vantagem no sorteio 2
 * ✓ Sistema equilibra desigualdades ao longo do tempo
 * ✓ Fairness Index melhora a cada iteração
 * ✓ Mobilidade e cobertura alternam corretamente
 * 
 * Expectativas:
 * - Fairness Index melhora: 0.80 → 0.85 → 0.90 → 0.95
 * - Taxa compensação: 70% → 80% → 90% → 95%
 * - Todas unidades ganham pelo menos 1x em 4 sorteios
 * - Gini coefficient diminui ao longo do tempo
 */

export const scenario = {
  name: 'Sequência - 4 Sorteios Consecutivos',
  description: 'Testa evolução da compensação ao longo do tempo',
  
  units: [
    // 20 unidades variadas
    { id: 'U001', apartment: '101', block: 'A', vehicles: [{ type: 'CAR', plate: 'AAA1001' }], carSpaces: 1, motoSpaces: 0, isPCD: true, isElderly: false, isDefaulting: false, isPresentInAssembly: true },
    { id: 'U002', apartment: '102', block: 'A', vehicles: [{ type: 'CAR', plate: 'AAA1002' }], carSpaces: 1, motoSpaces: 0, isPCD: false, isElderly: true, isDefaulting: false, isPresentInAssembly: true },
    { id: 'U003', apartment: '103', block: 'A', vehicles: [{ type: 'CAR', plate: 'AAA1003' }], carSpaces: 1, motoSpaces: 0, isPCD: false, isElderly: false, isDefaulting: false, isPresentInAssembly: true },
    { id: 'U004', apartment: '104', block: 'A', vehicles: [{ type: 'CAR', plate: 'AAA1004' }], carSpaces: 1, motoSpaces: 0, isPCD: false, isElderly: false, isDefaulting: false, isPresentInAssembly: false },
    { id: 'U005', apartment: '105', block: 'A', vehicles: [{ type: 'CAR', plate: 'AAA1005' }], carSpaces: 1, motoSpaces: 0, isPCD: false, isElderly: false, isDefaulting: true, isPresentInAssembly: true },
    
    { id: 'U006', apartment: '201', block: 'B', vehicles: [{ type: 'CAR', plate: 'BBB2001' }], carSpaces: 1, motoSpaces: 0, isPCD: false, isElderly: true, isDefaulting: false, isPresentInAssembly: true },
    { id: 'U007', apartment: '202', block: 'B', vehicles: [{ type: 'CAR', plate: 'BBB2002' }], carSpaces: 1, motoSpaces: 0, isPCD: false, isElderly: false, isDefaulting: false, isPresentInAssembly: true },
    { id: 'U008', apartment: '203', block: 'B', vehicles: [{ type: 'CAR', plate: 'BBB2003' }], carSpaces: 1, motoSpaces: 0, isPCD: false, isElderly: false, isDefaulting: false, isPresentInAssembly: true },
    { id: 'U009', apartment: '204', block: 'B', vehicles: [{ type: 'CAR', plate: 'BBB2004' }], carSpaces: 1, motoSpaces: 0, isPCD: false, isElderly: false, isDefaulting: false, isPresentInAssembly: false },
    { id: 'U010', apartment: '205', block: 'B', vehicles: [{ type: 'CAR', plate: 'BBB2005' }], carSpaces: 1, motoSpaces: 0, isPCD: false, isElderly: false, isDefaulting: true, isPresentInAssembly: true },
    
    { id: 'U011', apartment: '301', block: 'C', vehicles: [{ type: 'CAR', plate: 'CCC3001' }], carSpaces: 1, motoSpaces: 0, isPCD: false, isElderly: true, isDefaulting: false, isPresentInAssembly: true },
    { id: 'U012', apartment: '302', block: 'C', vehicles: [{ type: 'CAR', plate: 'CCC3002' }], carSpaces: 1, motoSpaces: 0, isPCD: false, isElderly: false, isDefaulting: false, isPresentInAssembly: true },
    { id: 'U013', apartment: '303', block: 'C', vehicles: [{ type: 'CAR', plate: 'CCC3003' }], carSpaces: 1, motoSpaces: 0, isPCD: false, isElderly: false, isDefaulting: false, isPresentInAssembly: true },
    { id: 'U014', apartment: '304', block: 'C', vehicles: [{ type: 'CAR', plate: 'CCC3004' }], carSpaces: 1, motoSpaces: 0, isPCD: false, isElderly: false, isDefaulting: false, isPresentInAssembly: false },
    { id: 'U015', apartment: '305', block: 'C', vehicles: [{ type: 'CAR', plate: 'CCC3005' }], carSpaces: 1, motoSpaces: 0, isPCD: false, isElderly: false, isDefaulting: true, isPresentInAssembly: true },
    
    { id: 'U016', apartment: '401', block: 'A', vehicles: [{ type: 'CAR', plate: 'AAA4001' }], carSpaces: 1, motoSpaces: 0, isPCD: false, isElderly: false, isDefaulting: false, isPresentInAssembly: true },
    { id: 'U017', apartment: '402', block: 'B', vehicles: [{ type: 'CAR', plate: 'BBB4002' }], carSpaces: 1, motoSpaces: 0, isPCD: false, isElderly: false, isDefaulting: false, isPresentInAssembly: true },
    { id: 'U018', apartment: '403', block: 'C', vehicles: [{ type: 'CAR', plate: 'CCC4003' }], carSpaces: 1, motoSpaces: 0, isPCD: false, isElderly: false, isDefaulting: false, isPresentInAssembly: true },
    { id: 'U019', apartment: '404', block: 'A', vehicles: [{ type: 'CAR', plate: 'AAA4004' }], carSpaces: 1, motoSpaces: 0, isPCD: false, isElderly: false, isDefaulting: false, isPresentInAssembly: false },
    { id: 'U020', apartment: '405', block: 'B', vehicles: [{ type: 'CAR', plate: 'BBB4005' }], carSpaces: 1, motoSpaces: 0, isPCD: false, isElderly: false, isDefaulting: true, isPresentInAssembly: true }
  ],
  
  spaces: [
    // Vaga PCD
    { id: 'S_PCD_1', number: 'PCD-1', type: 'G', coverage: 'COVERED', access: 'FREE', isPCD: true, isElderly: false, isCritical: false, isNearElevator: true, isNearEntrance: true, block: 'A' },
    
    // Vagas Idosos (3)
    { id: 'S_ELD_1', number: 'ELD-1', type: 'M', coverage: 'COVERED', access: 'FREE', isPCD: false, isElderly: true, isCritical: false, isNearElevator: true, isNearEntrance: true, block: 'A' },
    { id: 'S_ELD_2', number: 'ELD-2', type: 'M', coverage: 'COVERED', access: 'FREE', isPCD: false, isElderly: true, isCritical: false, isNearElevator: true, isNearEntrance: false, block: 'B' },
    { id: 'S_ELD_3', number: 'ELD-3', type: 'M', coverage: 'COVERED', access: 'FREE', isPCD: false, isElderly: true, isCritical: false, isNearElevator: true, isNearEntrance: false, block: 'C' },
    
    // Mix de vagas - algumas descobertas, trancadas, críticas
    { id: 'S01', number: '1', type: 'G', coverage: 'COVERED', access: 'FREE', isPCD: false, isElderly: false, isCritical: false, isNearElevator: true, isNearEntrance: true, block: 'A' },
    { id: 'S02', number: '2', type: 'M', coverage: 'COVERED', access: 'FREE', isPCD: false, isElderly: false, isCritical: false, isNearElevator: false, isNearEntrance: false, block: 'A' },
    { id: 'S03', number: '3', type: 'P', coverage: 'UNCOVERED', access: 'FREE', isPCD: false, isElderly: false, isCritical: false, isNearElevator: false, isNearEntrance: false, block: 'A' },
    { id: 'S04', number: '4', type: 'G', coverage: 'COVERED', access: 'LOCKED', isPCD: false, isElderly: false, isCritical: false, isNearElevator: false, isNearEntrance: false, block: 'A' },
    { id: 'S05', number: '5', type: 'M', coverage: 'COVERED', access: 'FREE', isPCD: false, isElderly: false, isCritical: true, isNearElevator: false, isNearEntrance: false, block: 'A' },
    
    { id: 'S06', number: '6', type: 'G', coverage: 'COVERED', access: 'FREE', isPCD: false, isElderly: false, isCritical: false, isNearElevator: true, isNearEntrance: false, block: 'B' },
    { id: 'S07', number: '7', type: 'M', coverage: 'COVERED', access: 'FREE', isPCD: false, isElderly: false, isCritical: false, isNearElevator: false, isNearEntrance: false, block: 'B' },
    { id: 'S08', number: '8', type: 'P', coverage: 'UNCOVERED', access: 'FREE', isPCD: false, isElderly: false, isCritical: false, isNearElevator: false, isNearEntrance: false, block: 'B' },
    { id: 'S09', number: '9', type: 'G', coverage: 'COVERED', access: 'LOCKED', isPCD: false, isElderly: false, isCritical: false, isNearElevator: false, isNearEntrance: false, block: 'B' },
    { id: 'S10', number: '10', type: 'M', coverage: 'COVERED', access: 'FREE', isPCD: false, isElderly: false, isCritical: true, isNearElevator: false, isNearEntrance: false, block: 'B' },
    
    { id: 'S11', number: '11', type: 'G', coverage: 'COVERED', access: 'FREE', isPCD: false, isElderly: false, isCritical: false, isNearElevator: true, isNearEntrance: false, block: 'C' },
    { id: 'S12', number: '12', type: 'M', coverage: 'COVERED', access: 'FREE', isPCD: false, isElderly: false, isCritical: false, isNearElevator: false, isNearEntrance: false, block: 'C' },
    { id: 'S13', number: '13', type: 'P', coverage: 'UNCOVERED', access: 'FREE', isPCD: false, isElderly: false, isCritical: false, isNearElevator: false, isNearEntrance: false, block: 'C' },
    { id: 'S14', number: '14', type: 'G', coverage: 'COVERED', access: 'LOCKED', isPCD: false, isElderly: false, isCritical: false, isNearElevator: false, isNearEntrance: false, block: 'C' },
    { id: 'S15', number: '15', type: 'M', coverage: 'COVERED', access: 'FREE', isPCD: false, isElderly: false, isCritical: true, isNearElevator: false, isNearEntrance: false, block: 'C' },
    
    { id: 'S16', number: '16', type: 'G', coverage: 'COVERED', access: 'FREE', isPCD: false, isElderly: false, isCritical: false, isNearElevator: false, isNearEntrance: false, block: 'A' },
    { id: 'S17', number: '17', type: 'M', coverage: 'COVERED', access: 'FREE', isPCD: false, isElderly: false, isCritical: false, isNearElevator: false, isNearEntrance: false, block: 'B' },
    { id: 'S18', number: '18', type: 'P', coverage: 'UNCOVERED', access: 'FREE', isPCD: false, isElderly: false, isCritical: false, isNearElevator: false, isNearEntrance: false, block: 'C' },
    { id: 'S19', number: '19', type: 'G', coverage: 'COVERED', access: 'FREE', isPCD: false, isElderly: false, isCritical: false, isNearElevator: false, isNearEntrance: false, block: 'A' },
    { id: 'S20', number: '20', type: 'M', coverage: 'COVERED', access: 'FREE', isPCD: false, isElderly: false, isCritical: false, isNearElevator: false, isNearEntrance: false, block: 'B' },
    { id: 'S21', number: '21', type: 'P', coverage: 'COVERED', access: 'FREE', isPCD: false, isElderly: false, isCritical: false, isNearElevator: false, isNearEntrance: false, block: 'C' }
  ],
  
  config: {
    seed: 'TEST-MULTI-RAFFLE-2026',
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
  
  // Este cenário requer 4 execuções sequenciais
  raffles: 4,
  
  expectedResults: {
    // Evolução ao longo dos 4 sorteios
    fairnessProgression: [0.80, 0.85, 0.90, 0.95],
    compensationProgression: [0.70, 0.80, 0.90, 0.95],
    
    // Análise final (após 4 sorteios)
    allUnitsWonAtLeastOnce: true, // Todas ganham pelo menos 1x
    giniDecreases: true,           // Desigualdade diminui
    compensationWorks: true        // Sistema compensa injustiças
  }
};

export default scenario;
