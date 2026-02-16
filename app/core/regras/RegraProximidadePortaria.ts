import { RegraNegocios } from './RegraNegocios';
import { ContextoAlocacao, ResultadoRegra } from '../dominio/ModelosSorteio';

/**
 * Proximidade à Portaria/Entrada
 * 
 * Beneficia vagas próximas à entrada/saída principal.
 */
export class RegraProximidadePortaria implements RegraNegocios {
  codigo = 'PROX_PORT';
  nome = 'Proximidade Portaria';

  ehAplicavel(contexto: ContextoAlocacao): boolean {
    return contexto.vaga.pertoPortaria === true;
  }

  aplicar(contexto: ContextoAlocacao): ResultadoRegra {
    if (!this.ehAplicavel(contexto)) {
      return { nome: this.nome, pontos: 0, satisfeita: false };
    }

    const pontos = contexto.pesos.proximidadePortaria;

    return {
      nome: this.nome,
      pontos,
      satisfeita: true,
      razao: 'Vaga próxima à portaria'
    };
  }
}
