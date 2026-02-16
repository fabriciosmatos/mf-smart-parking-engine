import { RegraNegocios } from './RegraNegocios';
import { ContextoAlocacao, ResultadoRegra } from '../dominio/ModelosSorteio';

/**
 * Proximidade ao Elevador
 * 
 * Beneficia vagas próximas aos elevadores do prédio.
 */
export class RegraProximidadeElevador implements RegraNegocios {
  codigo = 'PROX_ELEV';
  nome = 'Proximidade Elevador';

  ehAplicavel(contexto: ContextoAlocacao): boolean {
    return contexto.vaga.pertoElevador === true;
  }

  aplicar(contexto: ContextoAlocacao): ResultadoRegra {
    if (!this.ehAplicavel(contexto)) {
      return { nome: this.nome, pontos: 0, satisfeita: false };
    }

    const pontos = contexto.pesos.proximidadeElevador;

    return {
      nome: this.nome,
      pontos,
      satisfeita: true,
      razao: 'Vaga próxima ao elevador'
    };
  }
}
