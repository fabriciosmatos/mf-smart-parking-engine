import { RegraNegocios } from './RegraNegocios';
import { ContextoAlocacao, ResultadoRegra } from '../dominio/ModelosSorteio';

/**
 * RN04: Compensação de Mobilidade
 * 
 * Beneficia unidades que estavam em vagas com acesso bloqueado
 * no ciclo anterior, priorizando vagas com acesso livre.
 */
export class RegraCompensacaoMobilidade implements RegraNegocios {
  codigo = 'RN04';
  nome = 'Compensação Mobilidade';

  ehAplicavel(contexto: ContextoAlocacao): boolean {
    return contexto.unidade.alocacaoAnterior?.acesso === 'TRAVADA';
  }

  aplicar(contexto: ContextoAlocacao): ResultadoRegra {
    if (!this.ehAplicavel(contexto)) {
      return { nome: `${this.codigo}: ${this.nome}`, pontos: 0, satisfeita: false };
    }

    const satisfeita = contexto.vaga.acesso === 'LIVRE';
    const pontos = satisfeita ? contexto.pesos.compensacaoMobilidade : 0;

    return {
      nome: `${this.codigo}: ${this.nome}`,
      pontos,
      satisfeita,
      razao: satisfeita 
        ? 'Unidade compensada com vaga de acesso livre' 
        : 'Vaga não atende critério de mobilidade'
    };
  }
}
