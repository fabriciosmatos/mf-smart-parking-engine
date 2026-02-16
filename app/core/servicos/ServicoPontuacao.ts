import { VagaEstacionamento, Unidade } from '../../tipos';
import { ContextoAlocacao, PontuacaoVaga } from '../dominio/ModelosSorteio';
import type { RegraNegocios } from '../regras/RegraNegocios';
import {
  RegraCompensacaoCobertura,
  RegraCompensacaoMobilidade,
  RegraRodizioVagasCriticas,
  RegraProximidadeBloco,
  RegraPenalidadeInadimplencia,
  RegraPenalidadeAusenciaAssembleia,
  RegraProximidadeElevador,
  RegraProximidadePortaria
} from '../regras';

/**
 * Serviço responsável por calcular pontuações (scores)
 * 
 * Responsabilidade Única: Aplicar regras e calcular pontuações
 */
export class ServicoPontuacao {
  private regras: RegraNegocios[];

  constructor() {
    // Registra todas as regras de negócio
    this.regras = [
      new RegraCompensacaoCobertura(),
      new RegraCompensacaoMobilidade(),
      new RegraRodizioVagasCriticas(),
      new RegraProximidadeBloco(),
      new RegraPenalidadeInadimplencia(),
      new RegraPenalidadeAusenciaAssembleia(),
      new RegraProximidadeElevador(),
      new RegraProximidadePortaria()
    ];
  }

  /**
   * Calcula a pontuação de uma vaga específica para uma unidade
   */
  calcularPontuacao(unidade: Unidade, vaga: VagaEstacionamento, pesos: Record<string, number>): PontuacaoVaga {
    const contexto: ContextoAlocacao = { unidade, vaga, pesos };
    
    let pontuacaoTotal = 0;
    const regrasAplicadas = this.regras
      .filter(regra => regra.ehAplicavel(contexto))
      .map(regra => {
        const resultado = regra.aplicar(contexto);
        pontuacaoTotal += resultado.pontos;
        return resultado;
      });

    return {
      vaga,
      pontuacao: pontuacaoTotal,
      regras: regrasAplicadas
    };
  }

  /**
   * Encontra a melhor vaga para uma unidade entre as disponíveis
   */
  encontrarMelhorVaga(
    unidade: Unidade,
    vagasDisponiveis: VagaEstacionamento[],
    tipoTarefa: 'CARRO' | 'MOTO',
    pesos: Record<string, number>
  ): PontuacaoVaga | null {
    // Filtra vagas compatíveis com o tipo de veículo
    const vagasCompativeis = vagasDisponiveis.filter(vaga => 
      tipoTarefa === 'MOTO' ? vaga.tipo === 'MOTO' : vaga.tipo !== 'MOTO'
    );

    if (vagasCompativeis.length === 0) {
      return null;
    }

    // Calcula pontuação para cada vaga
    const pontuacoes = vagasCompativeis.map(vaga => 
      this.calcularPontuacao(unidade, vaga, pesos)
    );

    // Retorna a vaga com maior pontuação
    return pontuacoes.reduce((melhor, atual) => 
      atual.pontuacao > melhor.pontuacao ? atual : melhor
    );
  }

  /**
   * Adiciona uma nova regra ao sistema (Princípio Aberto/Fechado)
   */
  registrarRegra(regra: RegraNegocios): void {
    this.regras.push(regra);
  }

  /**
   * Remove uma regra do sistema
   */
  desregistrarRegra(codigoRegra: string): void {
    this.regras = this.regras.filter(regra => regra.codigo !== codigoRegra);
  }

  /**
   * Lista todas as regras registradas
   */
  obterRegrasRegistradas(): RegraNegocios[] {
    return [...this.regras];
  }
}
