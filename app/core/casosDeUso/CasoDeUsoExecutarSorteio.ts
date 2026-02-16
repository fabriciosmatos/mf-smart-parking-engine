import { Unidade, VagaEstacionamento, ConfiguracaoSorteio, ResultadoSorteio, Alocacao } from '../../tipos';
import { ServicoValidacao } from '../servicos/ServicoValidacao';
import { ServicoAlocacaoPrioridade } from '../servicos/ServicoAlocacaoPrioridade';
import { ServicoPontuacao } from '../servicos/ServicoPontuacao';
import { ServicoAuditoria } from '../servicos/ServicoAuditoria';
import { fisherYatesShuffle } from '../../utils/embaralhar';
import { generateAuditHash } from '../../utils/hash';

/**
 * Caso de Uso: Executar Sorteio de Vagas
 * 
 * Orquestra todo o processo de sorteio seguindo as regras de negócio.
 * Este é o ponto de entrada principal do sistema de sorteio.
 * 
 * Single Responsibility: Orquestrar o fluxo de sorteio
 * 
 * @example
 * const casoDeUso = new CasoDeUsoExecutarSorteio();
 * const resultado = await casoDeUso.executar(unidades, vagas, config);
 */
export class CasoDeUsoExecutarSorteio {
  private servicoValidacao: ServicoValidacao;
  private servicoPrioridade: ServicoAlocacaoPrioridade;
  private servicoPontuacao: ServicoPontuacao;
  private servicoAuditoria: ServicoAuditoria;

  constructor() {
    this.servicoValidacao = new ServicoValidacao();
    this.servicoPrioridade = new ServicoAlocacaoPrioridade();
    this.servicoPontuacao = new ServicoPontuacao();
    this.servicoAuditoria = new ServicoAuditoria();
  }

  /**
   * Executa o sorteio completo
   */
  async executar(
    unidades: Unidade[],
    vagas: VagaEstacionamento[],
    config: ConfiguracaoSorteio
  ): Promise<ResultadoSorteio> {
    // ============================================
    // FASE 1: VALIDAÇÃO E PREPARAÇÃO
    // ============================================
    
    // Valida dados de entrada
    this.servicoValidacao.validarDadosEntrada(unidades, vagas);
    
    // Cria tarefas de alocação
    const todasTarefas = this.servicoValidacao.criarTarefasAlocacao(unidades);
    
    // Valida inventário (RN01)
    this.servicoValidacao.validarConsistenciaInventario(todasTarefas, vagas);
    
    // Inicializa log de auditoria
    this.servicoAuditoria.inicializarLog(config.semente);
    this.servicoAuditoria.registrarIngestao(unidades.length, vagas.length, todasTarefas);
    this.servicoAuditoria.registrarValidacaoInventario();

    // ============================================
    // FASE 2: ALOCAÇÃO PRIORITÁRIA (RN02)
    // ============================================
    
    const { tarefasPrioritarias, tarefasRegulares } = this.servicoValidacao.separarTarefasPrioritarias(todasTarefas);
    
    this.servicoAuditoria.registrarInicioPrioridadeAlocacao(tarefasPrioritarias.length);
    
    const resultadoPrioridade = this.servicoPrioridade.alocarVagasPrioritarias(
      tarefasPrioritarias,
      vagas
    );
    
    // Registra alocações prioritárias no log
    resultadoPrioridade.registros.forEach(({ unidade, vaga, justificativa }) => {
      this.servicoAuditoria.registrarAlocacaoPrioritaria(unidade, vaga, justificativa);
    });
    
    this.servicoAuditoria.registrarFimAlocacaoPrioridade();
    
    // Inicializa arrays de resultado
    const alocacoes: Alocacao[] = [...resultadoPrioridade.alocacoes];
    let vagasDisponiveis = resultadoPrioridade.vagasRestantes;

    // ============================================
    // FASE 3: SORTEIO GERAL (Embaralhamento + Score)
    // ============================================
    
    // Embaralha tarefas restantes (Fisher-Yates)
    const tarefasEmbaralhadas = fisherYatesShuffle(tarefasRegulares, config.semente);
    
    const primeirosTres = tarefasEmbaralhadas
      .slice(0, 3)
      .map(t => t.unidade.apartamento);
    
    this.servicoAuditoria.registrarInicioSorteioGeral(config.semente, primeirosTres);
    
    // Processa cada tarefa em ordem embaralhada
    for (const tarefa of tarefasEmbaralhadas) {
      const unidade = tarefa.unidade;
      
      // Filtra vagas compatíveis com o tipo de veículo
      const vagasCompativeis = vagasDisponiveis.filter(vaga => 
        tarefa.tipo === 'MOTO' ? vaga.tipo === 'MOTO' : vaga.tipo !== 'MOTO'
      );
      
      this.servicoAuditoria.registrarAnaliseUnidade(unidade, tarefa.tipo, vagasCompativeis.length);
      
      if (vagasCompativeis.length === 0) {
        continue; // Pula se não há vagas compatíveis
      }
      
      // Encontra a melhor vaga usando o sistema de pontuação
      const melhorPontuacaoVaga = this.servicoPontuacao.encontrarMelhorVaga(
        unidade,
        vagasCompativeis,
        tarefa.tipo,
        config.pesos
      );
      
      if (melhorPontuacaoVaga) {
        // Cria alocação
        alocacoes.push({
          idUnidade: unidade.id,
          idVaga: melhorPontuacaoVaga.vaga.id,
          tipoVagaSolicitada: tarefa.tipo,
          regrasAplicadas: melhorPontuacaoVaga.regras.map(r => ({
            nome: r.nome,
            pontos: r.pontos,
            satisfeita: r.satisfeita
          })),
          pontuacao: melhorPontuacaoVaga.pontuacao
        });
        
        // Registra decisão no log
        this.servicoAuditoria.registrarDecisaoAlocacao(melhorPontuacaoVaga, unidade);
        
        // Remove vaga das disponíveis
        vagasDisponiveis = vagasDisponiveis.filter(
          v => v.id !== melhorPontuacaoVaga.vaga.id
        );
      }
    }

    // ============================================
    // FASE 4: CONSOLIDAÇÃO E AUDITORIA
    // ============================================
    
    // Calcula estatísticas
    const estatisticas = this.servicoAuditoria.calcularEstatisticas(alocacoes, unidades, vagas);
    
    // Gera hash de auditoria
    const dadosHash = JSON.stringify(
      alocacoes.map(a => `${a.idUnidade}:${a.idVaga}`)
    );
    const hash = generateAuditHash(dadosHash, 16);
    
    // Registra consolidação final
    this.servicoAuditoria.registrarConsolidacao(estatisticas, hash);
    
    // Retorna resultado completo
    return {
      alocacoes,
      estatisticas,
      log: this.servicoAuditoria.obterLog(),
      semente: config.semente,
      hash,
      timestamp: new Date().toISOString()
    };
  }
}
