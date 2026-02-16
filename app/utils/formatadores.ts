/**
 * Formata uma data para o padrão brasileiro
 * 
 * @param data - Data a ser formatada (padrão: data/hora atual)
 * @returns String no formato DD/MM/YYYY HH:MM:SS
 */
export function formatarDataHoraBR(data: Date = new Date()): string {
  return data.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

/**
 * Gera um timestamp no formato ISO 8601
 * 
 * @returns String ISO 8601 (ex: "2026-02-15T20:30:00.000Z")
 */
export function gerarTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Formata um número como porcentagem
 * 
 * @param valor - Valor numérico (0-100)
 * @param decimais - Número de casas decimais (padrão: 1)
 * @returns String formatada com símbolo %
 */
export function formatarPorcentagem(valor: number, decimais: number = 1): string {
  return `${valor.toFixed(decimais)}%`;
}

/**
 * Gera uma seed aleatória para sorteios
 * 
 * @param comprimento - Tamanho da string gerada (padrão: 16)
 * @returns String alfanumérica aleatória
 */
export function gerarSementeAleatoria(comprimento: number = 16): string {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let semente = '';
  for (let i = 0; i < comprimento; i++) {
    semente += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return semente;
}

// ============================================================
// EXPORTS DE COMPATIBILIDADE (Manter para código legado)
// ============================================================

/** @deprecated Use formatarDataHoraBR */
export const formatDateTimeBR = formatarDataHoraBR;

/** @deprecated Use gerarTimestamp */
export const generateTimestamp = gerarTimestamp;

/** @deprecated Use formatarPorcentagem */
export const formatPercentage = formatarPorcentagem;

/** @deprecated Use gerarSementeAleatoria */
export const generateRandomSeed = gerarSementeAleatoria;
