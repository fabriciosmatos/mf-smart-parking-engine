import seedrandom from 'seedrandom';

/**
 * Algoritmo Fisher-Yates Shuffle
 * 
 * Embaralha um array de forma determinística usando uma semente.
 * Útil para criar sorteios reprodutíveis e auditáveis.
 * 
 * @param array Array a ser embaralhado
 * @param semente Semente para geração determinística
 * @returns Array embaralhado (nova instância)
 * 
 * @example
 * const itens = [1, 2, 3, 4, 5];
 * const embaralhado = fisherYatesShuffle(itens, 'minha-semente-123');
 * // Sempre retorna a mesma ordem para a mesma semente
 */
export function fisherYatesShuffle<T>(array: T[], semente: string): T[] {
  const rng = seedrandom(semente);
  const embaralhado = [...array];
  
  for (let i = embaralhado.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [embaralhado[i], embaralhado[j]] = [embaralhado[j], embaralhado[i]];
  }
  
  return embaralhado;
}

/**
 * Embaralha um array de forma não-determinística
 * 
 * @param array Array a ser embaralhado
 * @returns Array embaralhado (nova instância)
 */
export function shuffle<T>(array: T[]): T[] {
  return fisherYatesShuffle(array, Math.random().toString());
}
