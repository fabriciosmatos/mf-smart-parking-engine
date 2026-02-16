import { RegraNegocios } from './RegraNegocios';
import { ContextoAlocacao, ResultadoRegra } from '../dominio/ModelosSorteio';

/**
 * RN10: Proximidade do Bloco
 * 
 * Prioriza vagas próximas ao bloco/torre da unidade.
 */
export class RegraProximidadeBloco implements RegraNegocios {
  codigo = 'RN10';
  nome = 'Proximidade Bloco';

  ehAplicavel(_contexto: ContextoAlocacao): boolean {
    return true; // Sempre aplicável
  }

  aplicar(contexto: ContextoAlocacao): ResultadoRegra {
    const satisfeita = contexto.unidade.bloco === contexto.vaga.bloco;
    const pontos = satisfeita ? contexto.pesos.proximidadeBloco : 0;

    return {
      nome: `${this.codigo}: ${this.nome}`,
      pontos,
      satisfeita,
      razao: satisfeita 
        ? `Vaga no mesmo bloco (${contexto.unidade.bloco})` 
        : 'Vaga em bloco diferente'
    };
  }
}
