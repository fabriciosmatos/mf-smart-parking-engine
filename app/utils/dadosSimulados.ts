import { Unit, ParkingSpace, VehicleType } from '../types';

/**
 * Gera unidades fictícias para testes e demonstrações
 */
export function generateMockUnits(count: number, availableSpaces?: ParkingSpace[]): Unit[] {
  const blocks = ['A', 'B', 'C', 'D'];
  const vehicleTypes: VehicleType[] = ['CAR', 'SUV', 'MOTO'];
  const units: Unit[] = [];

  for (let i = 1; i <= count; i++) {
    const block = blocks[i % blocks.length];
    const apartment = `${Math.floor(i / blocks.length) + 1}0${(i % 4) + 1}`;
    
    const carSpaces = Math.random() < 0.7 ? 1 : 2; // 70% tem 1 vaga, 30% tem 2
    const motoSpaces = Math.random() < 0.2 ? 1 : 0; // 20% tem vaga de moto
    
    const vehicles = [];
    for (let v = 0; v < carSpaces; v++) {
      vehicles.push({
        type: vehicleTypes[Math.floor(Math.random() * 2)] as VehicleType, // CAR ou SUV
        plate: `ABC${Math.floor(1000 + Math.random() * 9000)}`
      });
    }
    for (let m = 0; m < motoSpaces; m++) {
      vehicles.push({
        type: 'MOTO' as VehicleType,
        plate: `MOT${Math.floor(100 + Math.random() * 900)}`
      });
    }

    const isPCD = Math.random() < 0.05; // 5% PCD
    const isElderly = Math.random() < 0.15; // 15% idosos
    const isDefaulting = Math.random() < 0.08; // 8% inadimplentes
    const isPresentInAssembly = Math.random() < 0.70; // 70% presentes

    // Se temos vagas disponíveis, TODAS as unidades têm histórico (Vagas Atuais = 100%)
    let previousAssignment = undefined;
    if (availableSpaces && availableSpaces.length > 0) {
      const hasBadHistory = Math.random() < 0.6; // 60% têm histórico ruim para testar compensação
      
      const randomSpace = availableSpaces[Math.floor(Math.random() * availableSpaces.length)];
      
      previousAssignment = {
        spaceId: randomSpace.id,
        coverage: randomSpace.coverage,
        access: randomSpace.access,
        wasCritical: randomSpace.isCritical,
        isNearElevator: randomSpace.isNearElevator
      } as const;
    }

    units.push({
      id: `U${String(i).padStart(3, '0')}`,
      apartment,
      block,
      vehicles,
      carSpaces,
      motoSpaces,
      isPCD,
      isElderly,
      isDefaulting,
      previousAssignment,
      isPresentInAssembly
    });
  }

  return units;
}

/**
 * Gera vagas fictícias para testes e demonstrações
 */
export function generateMockSpaces(count: number): ParkingSpace[] {
  const blocks = ['A', 'B', 'C', 'D'];
  const spaces: ParkingSpace[] = [];

  for (let i = 1; i <= count; i++) {
    const block = blocks[i % blocks.length];
    const number = String(i).padStart(3, '0');
    
    // 80% vagas P (normal), 15% G (grande), 5% MOTO
    let type: 'P' | 'M' | 'G' | 'MOTO';
    const typeRand = Math.random();
    if (typeRand < 0.80) type = 'P';
    else if (typeRand < 0.95) type = 'G';
    else type = 'MOTO';

    // 60% cobertas, 40% descobertas
    const coverage = Math.random() < 0.6 ? 'COVERED' : 'UNCOVERED';
    
    // 75% livres, 25% presas (precisa manobrar)
    const access = Math.random() < 0.75 ? 'FREE' : 'LOCKED';
    
    // 5% vagas PCD
    const isPCD = Math.random() < 0.05;
    
    // 10% vagas idoso
    const isElderly = Math.random() < 0.10 && !isPCD;
    
    // 15% vagas críticas (ruins)
    const isCritical = Math.random() < 0.15;
    
    // 30% próximas ao elevador
    const isNearElevator = Math.random() < 0.30;
    
    // 20% próximas à entrada
    const isNearEntrance = Math.random() < 0.20;

    spaces.push({
      id: `S${String(i).padStart(3, '0')}`,
      number,
      type,
      coverage,
      access,
      isPCD,
      isElderly,
      isCritical,
      isNearElevator,
      isNearEntrance,
      block
    });
  }

  return spaces;
}
