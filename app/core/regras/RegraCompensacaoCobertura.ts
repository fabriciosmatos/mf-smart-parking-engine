import { RegraNegocios } from './RegraNegocios';
import { ContextoAlocacao, ResultadoRegra } from '../dominio/ModelosSorteio';

/**
 * RN03: Compensação de Cobertura
 * 
 * Beneficia unidades que estavam em vagas descobertas
 * no ciclo anterior, priorizando vagas cobertas.
 */
export class RegraCompensacaoCobertura implements RegraNegocios {
  codigo = 'RN03';
  nome = 'Compensação Cobertura';

  ehAplicavel(contexto: ContextoAlocacao): boolean {
    return contexto.unidade.alocacaoAnterior?.cobertura === 'DESCOBERTA';
  }

  aplicar(contexto: ContextoAlocacao): ResultadoRegra {
    if (!this.ehAplicavel(contexto)) {
      return { nome: `${this.codigo}: ${this.nome}`, pontos: 0, satisfeita: false };
    }

    const satisfeita = contexto.vaga.cobertura === 'COBERTA';
    const pontos = satisfeita ? contexto.pesos.compensacaoCobertura : 0;

    return {
      nome: `${this.codigo}: ${this.nome}`,
      pontos,
      satisfeita,
      razao: satisfeita 
        ? 'Unidade compensada com vaga coberta' 
        : 'Vaga não atende critério de cobertura'
    };
  }
}
