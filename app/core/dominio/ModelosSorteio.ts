import { Unidade, VagaEstacionamento } from '../../tipos';

/**
 * Tarefa de alocação no domínio de sorteio
 */
export interface TarefaAlocacao {
  unidade: Unidade;
  tipo: 'CARRO' | 'MOTO';
  ehPrioridade: boolean;
}

/**
 * Contexto de alocação para cálculo de pontuação
 */
export interface ContextoAlocacao {
  unidade: Unidade;
  vaga: VagaEstacionamento;
  pesos: Record<string, number>;
}

/**
 * Resultado de aplicação de uma regra
 */
export interface ResultadoRegra {
  nome: string;
  pontos: number;
  satisfeita: boolean;
  razao?: string;
}

/**
 * Pontuação calculada para uma combinação unidade-vaga
 */
export interface PontuacaoVaga {
  vaga: VagaEstacionamento;
  pontuacao: number;
  regras: ResultadoRegra[];
}
