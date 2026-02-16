/**
 * @deprecated Este arquivo foi mantido apenas por compatibilidade.
 * Use `CasoDeUsoExecutarSorteio` diretamente de `core/casosDeUso/CasoDeUsoExecutarSorteio.ts`
 * 
 * A lógica foi refatorada seguindo o princípio da Responsabilidade Única (SRP):
 * - Regras de negócio: `core/regras/`
 * - Serviços: `core/servicos/`
 * - Casos de uso: `core/casosDeUso/`
 * - Utilitários genéricos: `utils/shuffle.ts`, `utils/hash.ts`
 */

import { Unidade, VagaEstacionamento, ConfiguracaoSorteio, ResultadoSorteio } from '../tipos';
import { CasoDeUsoExecutarSorteio } from '../core/casosDeUso/CasoDeUsoExecutarSorteio';

// Mantém compatibilidade com código legado em inglês
import type { Unit, ParkingSpace, RaffleConfig, RaffleResult } from '../types';

/**
 * Converte Unit (EN) para Unidade (PT)
 */
function converterUnit(unit: Unit): Unidade {
  return {
    id: unit.id,
    apartamento: unit.apartment,
    bloco: unit.block,
    veiculos: unit.vehicles.map(v => ({
      tipo: v.type as any,
      placa: v.plate
    })),
    vagasCarro: unit.carSpaces,
    vagasMoto: unit.motoSpaces,
    ehPCD: unit.isPCD,
    ehIdoso: unit.isElderly,
    estaInadimplente: unit.isDefaulting,
    alocacaoAnterior: unit.previousAssignment ? {
      idVaga: unit.previousAssignment.spaceId,
      cobertura: unit.previousAssignment.coverage === 'COVERED' ? 'COBERTA' : 'DESCOBERTA',
      acesso: unit.previousAssignment.access === 'FREE' ? 'LIVRE' : 'TRAVADA',
      eraCritica: unit.previousAssignment.wasCritical,
      pertoElevador: unit.previousAssignment.isNearElevator
    } : undefined,
    estevePresenteAssembleia: unit.isPresentInAssembly
  };
}

/**
 * Converte ParkingSpace (EN) para VagaEstacionamento (PT)
 */
function converterSpace(space: ParkingSpace): VagaEstacionamento {
  return {
    id: space.id,
    numero: space.number,
    tipo: space.type,
    cobertura: space.coverage === 'COVERED' ? 'COBERTA' : 'DESCOBERTA',
    acesso: space.access === 'FREE' ? 'LIVRE' : 'TRAVADA',
    ehPCD: space.isPCD,
    ehIdoso: space.isElderly,
    ehCritica: space.isCritical,
    pertoElevador: space.isNearElevator,
    pertoPortaria: space.isNearEntrance,
    bloco: space.block
  };
}

/**
 * Converte RaffleConfig (EN) para ConfiguracaoSorteio (PT)
 */
function converterConfig(config: RaffleConfig): ConfiguracaoSorteio {
  return {
    semente: config.seed,
    pesos: {
      compensacaoCobertura: config.weights.coverageCompensation,
      compensacaoMobilidade: config.weights.mobilityCompensation,
      proximidadeBloco: config.weights.blockProximity,
      proximidadeElevador: config.weights.elevatorProximity,
      rodizioVagasCriticas: config.weights.criticalRotation,
      proximidadePortaria: config.weights.entranceProximity,
      penalidadeInadimplencia: config.weights.defaultingPenalty,
      penalidadeAusencia: config.weights.absencePenalty
    }
  };
}

/**
 * Converte ResultadoSorteio (PT) para RaffleResult (EN)
 */
function converterResultado(resultado: ResultadoSorteio): RaffleResult {
  return {
    assignments: resultado.alocacoes.map(a => ({
      unitId: a.idUnidade,
      spaceId: a.idVaga,
      spaceTypeRequested: a.tipoVagaSolicitada === 'CARRO' ? 'CAR' : 'MOTO',
      rulesApplied: a.regrasAplicadas.map(r => ({
        name: r.nome,
        points: r.pontos,
        satisfied: r.satisfeita
      })),
      score: a.pontuacao
    })),
    stats: {
      coverageSuccessRate: resultado.estatisticas.taxaSucessoCobertura,
      mobilitySuccessRate: resultado.estatisticas.taxaSucessoMobilidade,
      blockMatchRate: resultado.estatisticas.taxaCorrespondenciaBloco,
      priorityAuditRate: resultado.estatisticas.taxaAuditoriaPrioridade,
      criticalRotationRate: resultado.estatisticas.taxaRodizioVagasCriticas,
      averageScore: resultado.estatisticas.pontuacaoMedia,
      totalAssignments: resultado.estatisticas.totalAlocacoes
    },
    log: resultado.log,
    seed: resultado.semente,
    hash: resultado.hash,
    timestamp: resultado.timestamp
  };
}

/**
 * Executa o sorteio de vagas
 * 
 * Este é um wrapper para manter compatibilidade com código existente.
 * Internamente, delega para o Caso de Uso que coordena todos os serviços.
 * 
 * @param units Array de unidades/moradores (inglês - compatibilidade)
 * @param spaces Array de vagas disponíveis (inglês - compatibilidade)
 * @param config Configuração do sorteio (seed + pesos) (inglês - compatibilidade)
 * @returns Resultado completo do sorteio
 */
export const runRaffle = async (
  units: Unit[],
  spaces: ParkingSpace[],
  config: RaffleConfig
): Promise<RaffleResult> => {
  const casoDeUso = new CasoDeUsoExecutarSorteio();
  
  // Converte tipos EN → PT
  const unidades = units.map(converterUnit);
  const vagas = spaces.map(converterSpace);
  const configuracao = converterConfig(config);
  
  // Executa o sorteio
  const resultado = await casoDeUso.executar(unidades, vagas, configuracao);
  
  // Converte resultado PT → EN
  return converterResultado(resultado);
};

/**
 * Executa o sorteio de vagas (versão em português)
 * 
 * @param unidades Array de unidades/moradores
 * @param vagas Array de vagas disponíveis
 * @param configuracao Configuração do sorteio (semente + pesos)
 * @returns Resultado completo do sorteio
 */
export const executarSorteio = async (
  unidades: Unidade[],
  vagas: VagaEstacionamento[],
  configuracao: ConfiguracaoSorteio
): Promise<ResultadoSorteio> => {
  const casoDeUso = new CasoDeUsoExecutarSorteio();
  return casoDeUso.executar(unidades, vagas, configuracao);
};
