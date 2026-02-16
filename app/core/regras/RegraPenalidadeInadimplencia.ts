import { RegraNegocios } from './RegraNegocios';
import { ContextoAlocacao, ResultadoRegra } from '../dominio/ModelosSorteio';

/**
 * RN08: Penalidade por Inadimplência
 * 
 * Aplica penalidade a unidades inadimplentes,
 * reduzindo sua pontuação no sorteio.
 */
export class RegraPenalidadeInadimplencia implements RegraNegocios {
  codigo = 'RN08';
  nome = 'Inadimplência';

  ehAplicavel(contexto: ContextoAlocacao): boolean {
    return contexto.unidade.estaInadimplente === true;
  }

  aplicar(contexto: ContextoAlocacao): ResultadoRegra {
    if (!this.ehAplicavel(contexto)) {
      return { nome: `${this.codigo}: ${this.nome}`, pontos: 0, satisfeita: false };
    }

    const pontos = -contexto.pesos.penalidadeInadimplencia;

    return {
      nome: `${this.codigo}: ${this.nome}`,
      pontos,
      satisfeita: true,
      razao: 'Unidade com débitos em aberto'
    };
  }
}
