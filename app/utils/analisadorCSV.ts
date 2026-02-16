import { Unit, ParkingSpace, SpaceType, CoverageType, AccessType } from '../types';

/**
 * Interface para alocação atual (CSV de entrada)
 */
export interface AlocacaoAtual {
  idUnidade: string;
  idVaga: string;
}

/**
 * Converte texto CSV de unidades para array de objetos Unit
 * 
 * @param textoCSV - Texto do arquivo CSV
 * @returns Array de unidades
 * 
 * Formato: id;apartamento;bloco;vagas_carro;vagas_moto;pcd;idoso;inadimplente;presente
 */
export const converterCSVUnidades = (textoCSV: string): Unit[] => {
  const linhas = textoCSV.split('\n').filter(l => l.trim() !== '');
  
  return linhas.slice(1).map((linha) => {
    const valores = linha.split(';');
    return {
      id: valores[0],
      apartment: valores[1],
      block: valores[2],
      carSpaces: parseInt(valores[3]) || 1,
      motoSpaces: parseInt(valores[4]) || 0,
      isPCD: valores[5] === 'true',
      isElderly: valores[6] === 'true',
      isDefaulting: valores[7] === 'true',
      isPresentInAssembly: valores[8] === 'true',
      vehicles: [],
      // previousAssignment será preenchido via enriquecerUnidadesComAlocacaoAnterior
    };
  });
};

/**
 * Converte texto CSV de vagas para array de objetos ParkingSpace
 * 
 * @param textoCSV - Texto do arquivo CSV
 * @returns Array de vagas de estacionamento
 * 
 * Formato: id;numero;tipo;cobertura;acesso;pcd;idoso;critica;perto_elevador;perto_entrada;bloco
 */
export const converterCSVVagas = (textoCSV: string): ParkingSpace[] => {
  const linhas = textoCSV.split('\n').filter(l => l.trim() !== '');
  
  return linhas.slice(1).map((linha) => {
    const valores = linha.split(';');
    return {
      id: valores[0],
      number: valores[1],
      type: valores[2] as SpaceType,
      coverage: valores[3] as CoverageType,
      access: valores[4] as AccessType,
      isPCD: valores[5] === 'true',
      isElderly: valores[6] === 'true',
      isCritical: valores[7] === 'true',
      isNearElevator: valores[8] === 'true',
      isNearEntrance: valores[9] === 'true',
      block: valores[10]
    };
  });
};

/**
 * Converte texto CSV de alocações atuais para array de objetos
 * 
 * @param textoCSV - Texto do arquivo CSV
 * @returns Array de alocações atuais
 * 
 * Formato: unidade_id;vaga_id
 * 
 * Exemplo:
 * unidade_id;vaga_id
 * u-1;s-25
 * u-2;s-103
 */
export const converterCSVAlocacoesAtuais = (textoCSV: string): AlocacaoAtual[] => {
  const linhas = textoCSV.split('\n').filter(l => l.trim() !== '');
  
  return linhas.slice(1).map((linha) => {
    const valores = linha.split(';');
    return {
      idUnidade: valores[0].trim(),
      idVaga: valores[1].trim()
    };
  });
};

/**
 * Enriquece unidades com informações das vagas anteriores
 * 
 * @param unidades - Lista de unidades
 * @param vagas - Lista de vagas
 * @param alocacoesAtuais - Alocações atuais (qual unidade está em qual vaga)
 * @returns Unidades com previousAssignment preenchido
 */
export const enriquecerUnidadesComAlocacaoAnterior = (
  unidades: Unit[],
  vagas: ParkingSpace[],
  alocacoesAtuais: AlocacaoAtual[]
): Unit[] => {
  return unidades.map(unidade => {
    // Busca a alocação atual desta unidade
    const alocacao = alocacoesAtuais.find(a => a.idUnidade === unidade.id);
    
    if (!alocacao) {
      // Unidade sem alocação prévia (primeiro sorteio ou não tinha vaga)
      return unidade;
    }
    
    // Busca os dados da vaga atual
    const vagaAtual = vagas.find(v => v.id === alocacao.idVaga);
    
    if (!vagaAtual) {
      console.warn(`Vaga ${alocacao.idVaga} não encontrada para unidade ${unidade.id}`);
      return unidade;
    }
    
    // Preenche previousAssignment com dados da vaga atual
    return {
      ...unidade,
      previousAssignment: {
        spaceId: vagaAtual.id,
        coverage: vagaAtual.coverage,
        access: vagaAtual.access,
        wasCritical: vagaAtual.isCritical,
        isNearElevator: vagaAtual.isNearElevator
      }
    };
  });
};

// ============================================================
// EXPORTS DE COMPATIBILIDADE (Manter para código legado)
// ============================================================

/** @deprecated Use AlocacaoAtual */
export type CurrentAllocation = AlocacaoAtual;

/** @deprecated Use converterCSVUnidades */
export const parseUnitsCSV = converterCSVUnidades;

/** @deprecated Use converterCSVVagas */
export const parseSpacesCSV = converterCSVVagas;

/** @deprecated Use converterCSVAlocacoesAtuais */
export const parseCurrentAllocationsCSV = converterCSVAlocacoesAtuais;

/** @deprecated Use enriquecerUnidadesComAlocacaoAnterior */
export const enrichUnitsWithPreviousAssignment = enriquecerUnidadesComAlocacaoAnterior;
