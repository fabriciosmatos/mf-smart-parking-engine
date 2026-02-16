export type VehicleType = 'CAR' | 'SUV' | 'MOTO' | 'TRUCK';
export type SpaceType = 'P' | 'M' | 'G' | 'MOTO';
export type CoverageType = 'COVERED' | 'UNCOVERED';
export type AccessType = 'FREE' | 'LOCKED';

export interface ParkingSpace {
  id: string;
  number: string;
  type: SpaceType;
  coverage: CoverageType;
  access: AccessType;
  isPCD: boolean;
  isElderly: boolean;
  isCritical: boolean;
  isNearElevator: boolean;
  isNearEntrance: boolean;
  block?: string;
}

export interface Unit {
  id: string;
  apartment: string;
  block: string;
  vehicles: {
    type: VehicleType;
    plate: string;
  }[];
  carSpaces: number;
  motoSpaces: number;
  isPCD: boolean;
  isElderly: boolean;
  isDefaulting: boolean;
  previousAssignment?: {
    spaceId: string;
    coverage: CoverageType;
    access: AccessType;
    wasCritical: boolean;
    isNearElevator: boolean;
  };
  isPresentInAssembly: boolean;
}

export interface RaffleConfig {
  seed: string;
  weights: {
    coverageCompensation: number;
    mobilityCompensation: number;
    blockProximity: number;
    elevatorProximity: number;
    criticalRotation: number;
    entranceProximity: number;
    defaultingPenalty: number;
    absencePenalty: number;
  };
}

export interface RuleDetail {
  name: string;
  points: number;
  satisfied: boolean;
}

export interface Assignment {
  unitId: string;
  spaceId: string;
  spaceTypeRequested: 'CAR' | 'MOTO';
  rulesApplied: RuleDetail[];
  score: number;
}

export interface RaffleStats {
  coverageSuccessRate: number;
  mobilitySuccessRate: number;
  blockMatchRate: number;
  priorityAuditRate: number;
  criticalRotationRate: number;
  averageScore: number;
  totalAssignments: number;
}

export interface RaffleResult {
  assignments: Assignment[];
  stats: RaffleStats;
  log: string[];
  seed: string;
  hash: string;
  timestamp: string;
}
