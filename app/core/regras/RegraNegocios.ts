import { ContextoAlocacao, ResultadoRegra } from '../dominio/ModelosSorteio';

/**
 * Interface base para todas as regras de negócio
 * Cada regra deve implementar esta interface
 */
export interface RegraNegocios {
  /**
   * Código único da regra (ex: RN01, RN02)
   */
  codigo: string;

  /**
   * Nome descritivo da regra
   */
  nome: string;

  /**
   * Aplica a regra e retorna o resultado
   */
  aplicar(contexto: ContextoAlocacao): ResultadoRegra;

  /**
   * Verifica se a regra é aplicável neste contexto
   */
  ehAplicavel(contexto: ContextoAlocacao): boolean;
}
