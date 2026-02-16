import { useState } from 'react';
import { Unit, ParkingSpace, RaffleConfig, RaffleResult } from '../types';
import { runRaffle } from '../utils/motorSorteio';

/**
 * Hook: Execução do Sorteio
 * 
 * Responsável por executar o motor de sorteio e gerenciar
 * o estado do resultado e do processo de execução.
 */
export const useRaffleExecution = () => {
  const [result, setResult] = useState<RaffleResult | null>(null);
  const [isRaffling, setIsRaffling] = useState(false);

  /**
   * Executa o sorteio completo
   * 
   * Simula delay de 2s para melhor UX e então executa
   * o motor de sorteio com as configurações fornecidas.
   */
  const executeRaffle = async (
    units: Unit[],
    spaces: ParkingSpace[],
    config: RaffleConfig
  ): Promise<RaffleResult | null> => {
    setIsRaffling(true);
    
    try {
      // Delay para melhor experiência do usuário
      await new Promise(resolve => setTimeout(resolve, 2000));
      const raffleResult = await runRaffle(units, spaces, config);
      setResult(raffleResult);
      return raffleResult;
    } catch (error: any) {
      alert(error.message);
      return null;
    } finally {
      setIsRaffling(false);
    }
  };

  return {
    result,
    isRaffling,
    executeRaffle
  };
};
