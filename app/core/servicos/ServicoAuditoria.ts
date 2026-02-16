import { Unidade, VagaEstacionamento, Alocacao, EstatisticasSorteio } from '../../tipos';
import { TarefaAlocacao, PontuacaoVaga } from '../dominio/ModelosSorteio';

/**
 * Serviço responsável por geração de logs e relatórios de auditoria
 * 
 * Single Responsibility: Logging e geração de estatísticas
 */
export class ServicoAuditoria {
  private log: string[] = [];
  private readonly separador = '='.repeat(80);
  private readonly subSeparador = '-'.repeat(40);

  /**
   * Inicializa o log de auditoria
   */
  inicializarLog(semente: string): void {
    this.log = [];
    this.log.push(this.separador);
    this.log.push(`[SISTEMA] MOTOR DE GOVERNANÇA SPE v2.5 - RELATÓRIO DE AUDITORIA`);
    this.log.push(`[DATA/HORA] ${new Date().toLocaleString('pt-BR')}`);
    this.log.push(`[SEED PÚBLICA] ${semente}`);
    this.log.push(`[INFO] A semente garante que este sorteio seja 100% reproduzível para fins de fiscalização.`);
    this.log.push(this.separador);
  }

  /**
   * Registra estatísticas de ingestão
   */
  registrarIngestao(quantidadeUnidades: number, quantidadeVagas: number, tarefas: TarefaAlocacao[]): void {
    this.log.push(`[ETAPA 1] INGESTÃO E MAPEAMENTO`);
    this.log.push(`- Unidades Cadastradas: ${quantidadeUnidades}`);
    this.log.push(`- Vagas Disponíveis: ${quantidadeVagas}`);
    this.log.push(`- Solicitações Identificadas: ${tarefas.length} (Carro: ${tarefas.filter(t => t.tipo === 'CARRO').length}, Moto: ${tarefas.filter(t => t.tipo === 'MOTO').length})`);
  }

  /**
   * Registra aprovação da validação de inventário
   */
  registrarValidacaoInventario(): void {
    this.log.push(`[CHECK] RN01 (Consistência de Inventário): APROVADO`);
    this.log.push(this.subSeparador);
  }

  /**
   * Registra início da alocação prioritária
   */
  registrarInicioPrioridadeAlocacao(quantidadePrioritaria: number): void {
    this.log.push(`[ETAPA 2] ALOCAÇÃO DE RESERVA LEGAL (RN02)`);
    this.log.push(`- Total de beneficiários prioritários (PCD/Idoso): ${quantidadePrioritaria}`);
  }

  /**
   * Registra alocação de vaga prioritária
   */
  registrarAlocacaoPrioritaria(unidade: Unidade, vaga: VagaEstacionamento, justificativa: string): void {
    this.log.push(`> Processando Unidade ${unidade.apartamento} (Bloco ${unidade.bloco}): Beneficiário de Prioridade Legal.`);
    this.log.push(`  [SUCESSO] Alocado na Vaga #${vaga.numero} (${vaga.cobertura}/${vaga.acesso}).`);
    this.log.push(`  [MOTIVO] ${justificativa}`);
  }

  /**
   * Registra final da etapa prioritária
   */
  registrarFimAlocacaoPrioridade(): void {
    this.log.push(this.subSeparador);
  }

  /**
   * Registra início do sorteio geral
   */
  registrarInicioSorteioGeral(semente: string, primeirosTres: string[]): void {
    this.log.push(`[ETAPA 3] SORTEIO GERAL E COMPENSAÇÃO`);
    this.log.push(`- Embaralhando fila de espera utilizando algoritmo Fisher-Yates com semente: ${semente}`);
    this.log.push(`- Ordem de sorteio definida para as primeiras 3 unidades: ${primeirosTres.join(', ')}...`);
    this.log.push(this.subSeparador);
  }

  /**
   * Registra análise de uma unidade
   */
  registrarAnaliseUnidade(unidade: Unidade, tipoTarefa: 'CARRO' | 'MOTO', quantidadeCompativeis: number): void {
    this.log.push(`> Analisando Unidade ${unidade.apartamento} (Bloco ${unidade.bloco}) para tipo [${tipoTarefa}]:`);
    this.log.push(`  Candidatos compatíveis: ${quantidadeCompativeis} vagas.`);
  }

  /**
   * Registra decisão de alocação
   */
  registrarDecisaoAlocacao(pontuacaoVaga: PontuacaoVaga, unidade: Unidade): void {
    const { vaga, pontuacao, regras } = pontuacaoVaga;
    const regrasSatisfeitas = regras.filter(r => r.satisfeita && r.pontos > 0).map(r => r.nome.split(':')[0]);
    
    this.log.push(`  [DECISÃO] Vaga #${vaga.numero} selecionada com Score Final: ${pontuacao}`);
    if (regrasSatisfeitas.length > 0) {
      this.log.push(`  [REGRAS ATENDIDAS] ${regrasSatisfeitas.join(', ')}`);
    }
    if (unidade.estaInadimplente) {
      this.log.push(`  [PENALIDADE] Unidade penalizada por inadimplência (RN08).`);
    }
    this.log.push('');
  }

  /**
   * Registra consolidação final
   */
  registrarConsolidacao(estatisticas: EstatisticasSorteio, hash: string): void {
    this.log.push(this.separador);
    this.log.push(`[ETAPA 4] CONSOLIDAÇÃO DE DADOS`);
    this.log.push(`- Eficiência da Compensação de Cobertura: ${estatisticas.taxaSucessoCobertura.toFixed(1)}%`);
    this.log.push(`- Eficiência da Mobilidade: ${estatisticas.taxaSucessoMobilidade.toFixed(1)}%`);
    this.log.push(`- Integridade do Bloco: ${estatisticas.taxaCorrespondenciaBloco.toFixed(1)}%`);
    this.log.push(`- Hash de Segurança SHA-256 Equivalente: ${hash}`);
    this.log.push(this.separador);
    this.log.push(`[FIM DO LOG DE AUDITORIA]`);
  }

  /**
   * Calcula estatísticas finais
   */
  calcularEstatisticas(
    alocacoes: Alocacao[],
    unidades: Unidade[],
    vagas: VagaEstacionamento[]
  ): EstatisticasSorteio {
    const calcularTaxa = (
      filtrarUnidade: (u: Unidade) => boolean,
      verificarSucesso: (u: Unidade, v: VagaEstacionamento) => boolean
    ): number => {
      const elegiveis = unidades.filter(filtrarUnidade);
      if (elegiveis.length === 0) return 100;
      
      const sucesso = alocacoes.filter(a => {
        const u = unidades.find(unidade => unidade.id === a.idUnidade)!;
        const v = vagas.find(vaga => vaga.id === a.idVaga)!;
        return filtrarUnidade(u) && verificarSucesso(u, v);
      }).length;
      
      return (sucesso / elegiveis.length) * 100;
    };

    const estatisticas: EstatisticasSorteio = {
      taxaSucessoCobertura: calcularTaxa(
        u => u.alocacaoAnterior?.cobertura === 'DESCOBERTA',
        (_, v) => v.cobertura === 'COBERTA'
      ),
      taxaSucessoMobilidade: calcularTaxa(
        u => u.alocacaoAnterior?.acesso === 'TRAVADA',
        (_, v) => v.acesso === 'LIVRE'
      ),
      taxaCorrespondenciaBloco: calcularTaxa(
        _ => true,
        (u, v) => u.bloco === v.bloco
      ),
      taxaRodizioVagasCriticas: calcularTaxa(
        u => u.alocacaoAnterior?.eraCritica || false,
        (_, v) => !v.ehCritica
      ),
      taxaAuditoriaPrioridade: 100,
      pontuacaoMedia: alocacoes.reduce((acc, a) => 
        acc + (a.pontuacao === 5000 ? 0 : a.pontuacao), 0
      ) / (alocacoes.length || 1),
      totalAlocacoes: alocacoes.length
    };

    return estatisticas;
  }

  /**
   * Retorna o log completo
   */
  obterLog(): string[] {
    return [...this.log];
  }
}
