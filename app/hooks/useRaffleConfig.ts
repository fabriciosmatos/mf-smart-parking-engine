import { useState } from 'react';
import { RaffleConfig } from '../types';
import { DEFAULT_WEIGHTS } from '../constants/weights';

/**
 * Gera uma semente aleatória para o sorteio
 */
const generateSeed = () => Math.random().toString(36).substring(7).toUpperCase();

/**
 * Hook: Gerenciamento de Configuração do Sorteio
 * 
 * Responsável por manter o estado da configuração do sorteio,
 * incluindo a semente (seed) e os pesos das regras.
 */
export const useRaffleConfig = () => {
  const [config, setConfig] = useState<RaffleConfig>({
    seed: generateSeed(),
    weights: DEFAULT_WEIGHTS
  });

  /**
   * Atualiza o peso de uma regra específica
   */
  const updateWeight = (key: string, value: number) => {
    setConfig(prev => ({
      ...prev,
      weights: { ...prev.weights, [key]: value }
    }));
  };

  /**
   * Atualiza a semente do sorteio (para reprodutibilidade)
   */
  const updateSeed = (seed: string) => {
    setConfig(prev => ({ ...prev, seed: seed.toUpperCase() }));
  };

  return {
    config,
    updateWeight,
    updateSeed
  };
};
