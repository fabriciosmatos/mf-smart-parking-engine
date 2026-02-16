import { Unidade, VagaEstacionamento, Alocacao } from '../../tipos';
import { TarefaAlocacao } from '../dominio/ModelosSorteio';

/**
 * Serviço responsável pela alocação prioritária (RN02)
 * 
 * Responsabilidade Única: Alocação de vagas para beneficiários legais (PCD/Idoso)
 */
export class ServicoAlocacaoPrioridade {
  private readonly PONTUACAO_PRIORITARIA = 5000;

  /**
   * RN02: Aloca vagas para beneficiários prioritários (PCD/Idoso)
   * 
   * Prioriza vagas específicas (marcadas como PCD/Idoso) ou vagas
   * de melhor qualidade (não-críticas, acesso livre).
   */
  alocarVagasPrioritarias(
    tarefasPrioritarias: TarefaAlocacao[],
    vagasDisponiveis: VagaEstacionamento[]
  ): {
    alocacoes: Alocacao[];
    vagasRestantes: VagaEstacionamento[];
    registros: Array<{ unidade: Unidade; vaga: VagaEstacionamento; justificativa: string }>;
  } {
    const alocacoes: Alocacao[] = [];
    const registros: Array<{ unidade: Unidade; vaga: VagaEstacionamento; justificativa: string }> = [];
    let vagasRestantes = [...vagasDisponiveis];

    for (const tarefa of tarefasPrioritarias) {
      const unidade = tarefa.unidade;
      
      // Busca vaga específica (marcada como PCD ou Idoso)
      let vagaIdeal = vagasRestantes.find(v => 
        v.tipo !== 'MOTO' && ((unidade.ehPCD && v.ehPCD) || (unidade.ehIdoso && v.ehIdoso))
      );

      let justificativa = '';

      if (vagaIdeal) {
        justificativa = 'Vaga reservada específica encontrada.';
      } else {
        // Se não há vaga específica, busca a melhor vaga disponível
        vagaIdeal = vagasRestantes.find(v => 
          v.tipo !== 'MOTO' && !v.ehCritica && v.acesso === 'LIVRE'
        );
        justificativa = 'Sem vaga reservada disponível; alocado em vaga livre/não-crítica como garantia de acessibilidade.';
      }

      if (vagaIdeal) {
        alocacoes.push({
          idUnidade: unidade.id,
          idVaga: vagaIdeal.id,
          tipoVagaSolicitada: 'CARRO',
          regrasAplicadas: [{ 
            nome: 'RN02: Reserva Legal Garantida', 
            pontos: this.PONTUACAO_PRIORITARIA, 
            satisfeita: true 
          }],
          pontuacao: this.PONTUACAO_PRIORITARIA
        });

        registros.push({ unidade, vaga: vagaIdeal, justificativa });

        // Remove a vaga das disponíveis
        vagasRestantes = vagasRestantes.filter(v => v.id !== vagaIdeal!.id);
      }
    }

    return { alocacoes, vagasRestantes, registros };
  }
}
