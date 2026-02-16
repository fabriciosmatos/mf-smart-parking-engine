import { Unidade, VagaEstacionamento } from '../../tipos';
import { TarefaAlocacao } from '../dominio/ModelosSorteio';

/**
 * Serviço responsável por validações de regras de negócio
 * 
 * Responsabilidade Única: Validar dados de entrada e regras críticas
 */
export class ServicoValidacao {
  /**
   * RN01: Validação de Consistência de Inventário
   * 
   * Verifica se há vagas suficientes para todas as solicitações.
   * 
   * @throws Error se houver déficit de inventário
   */
  validarConsistenciaInventario(tarefas: TarefaAlocacao[], vagas: VagaEstacionamento[]): void {
    if (tarefas.length > vagas.length) {
      throw new Error(
        `ERRO CRÍTICO RN01: Déficit de inventário. ` +
        `${tarefas.length} solicitações > ${vagas.length} vagas disponíveis.`
      );
    }
  }

  /**
   * Valida se os dados de entrada são válidos
   */
  validarDadosEntrada(unidades: Unidade[], vagas: VagaEstacionamento[]): void {
    if (!unidades || unidades.length === 0) {
      throw new Error('Nenhuma unidade fornecida para sorteio');
    }

    if (!vagas || vagas.length === 0) {
      throw new Error('Nenhuma vaga disponível para sorteio');
    }

    // Valida integridade dos dados
    unidades.forEach((unidade, indice) => {
      if (!unidade.id || !unidade.apartamento) {
        throw new Error(`Unidade ${indice + 1} possui dados incompletos (id ou apartamento ausente)`);
      }
    });

    vagas.forEach((vaga, indice) => {
      if (!vaga.id || !vaga.numero) {
        throw new Error(`Vaga ${indice + 1} possui dados incompletos (id ou numero ausente)`);
      }
    });
  }

  /**
   * Cria lista de tarefas de alocação a partir das unidades
   */
  criarTarefasAlocacao(unidades: Unidade[]): TarefaAlocacao[] {
    const tarefas: TarefaAlocacao[] = [];

    unidades.forEach(unidade => {
      // Adiciona tarefas para carros
      for (let i = 0; i < unidade.vagasCarro; i++) {
        tarefas.push({ 
          unidade, 
          tipo: 'CARRO', 
          ehPrioridade: unidade.ehPCD || unidade.ehIdoso 
        });
      }

      // Adiciona tarefas para motos
      for (let i = 0; i < unidade.vagasMoto; i++) {
        tarefas.push({ 
          unidade, 
          tipo: 'MOTO', 
          ehPrioridade: false 
        });
      }
    });

    return tarefas;
  }

  /**
   * Separa tarefas prioritárias (RN02) das tarefas comuns
   */
  separarTarefasPrioritarias(tarefas: TarefaAlocacao[]): {
    tarefasPrioritarias: TarefaAlocacao[];
    tarefasRegulares: TarefaAlocacao[];
  } {
    const tarefasPrioritarias = tarefas.filter(t => t.ehPrioridade && t.tipo === 'CARRO');
    const tarefasRegulares = tarefas.filter(t => !tarefasPrioritarias.includes(t));

    return { tarefasPrioritarias, tarefasRegulares };
  }
}
