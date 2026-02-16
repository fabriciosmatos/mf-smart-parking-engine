import { RegraNegocios } from './RegraNegocios';
import { ContextoAlocacao, ResultadoRegra } from '../dominio/ModelosSorteio';

/**
 * RN09: Rodízio de Vagas Críticas
 * 
 * Evita que a mesma unidade fique em vaga crítica
 * por dois ciclos consecutivos.
 */
export class RegraRodizioVagasCriticas implements RegraNegocios {
  codigo = 'RN09';
  nome = 'Rodízio Crítico';

  ehAplicavel(contexto: ContextoAlocacao): boolean {
    return contexto.unidade.alocacaoAnterior?.eraCritica === true;
  }

  aplicar(contexto: ContextoAlocacao): ResultadoRegra {
    if (!this.ehAplicavel(contexto)) {
      return { nome: `${this.codigo}: ${this.nome}`, pontos: 0, satisfeita: false };
    }

    const satisfeita = !contexto.vaga.ehCritica;
    const pontos = satisfeita ? contexto.pesos.rodizioVagasCriticas : 0;

    return {
      nome: `${this.codigo}: ${this.nome}`,
      pontos,
      satisfeita,
      razao: satisfeita 
        ? 'Unidade saiu de vaga crítica' 
        : 'Vaga ainda é crítica'
    };
  }
}
