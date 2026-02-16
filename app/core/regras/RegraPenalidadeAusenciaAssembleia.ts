import { RegraNegocios } from './RegraNegocios';
import { ContextoAlocacao, ResultadoRegra } from '../dominio/ModelosSorteio';

/**
 * RN14: Penalidade por Ausência em Assembleia
 * 
 * Aplica penalidade a unidades cujos proprietários não
 * compareceram à assembleia de aprovação do sorteio.
 */
export class RegraPenalidadeAusenciaAssembleia implements RegraNegocios {
  codigo = 'RN14';
  nome = 'Ausência Assembleia';

  ehAplicavel(contexto: ContextoAlocacao): boolean {
    return !contexto.unidade.estevePresenteAssembleia;
  }

  aplicar(contexto: ContextoAlocacao): ResultadoRegra {
    if (!this.ehAplicavel(contexto)) {
      return { nome: `${this.codigo}: ${this.nome}`, pontos: 0, satisfeita: false };
    }

    const pontos = -contexto.pesos.penalidadeAusencia;

    return {
      nome: `${this.codigo}: ${this.nome}`,
      pontos,
      satisfeita: true,
      razao: 'Ausente na assembleia de aprovação'
    };
  }
}
