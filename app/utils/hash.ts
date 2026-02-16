/**
 * Gera um hash simples para auditoria
 * 
 * Nota: Esta é uma implementação básica usando Base64.
 * Para ambientes de produção, considere usar uma biblioteca
 * de hash criptográfico real (SHA-256, SHA-512, etc).
 * 
 * @param dados Dados a serem "hasheados"
 * @param comprimento Comprimento do hash resultante
 * @returns Hash em maiúsculas
 * 
 * @example
 * const hash = generateAuditHash('unidade123:vaga456', 16);
 * // Retorna algo como: "ABC123DEF4567890"
 */
export function generateAuditHash(dados: string, comprimento: number = 16): string {
  // Usa btoa (Base64) como hash básico
  // Para produção, substituir por crypto.subtle.digest('SHA-256', ...)
  const base64 = btoa(dados);
  return base64.substring(0, comprimento).toUpperCase();
}

/**
 * Gera um hash SHA-256 real (assíncrono, requer Web Crypto API)
 * 
 * @param dados Dados a serem hasheados
 * @returns Promise com hash hexadecimal
 */
export async function generateSHA256Hash(dados: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const codificador = new TextEncoder();
    const bufferDados = codificador.encode(dados);
    const bufferHash = await window.crypto.subtle.digest('SHA-256', bufferDados);
    const arrayHash = Array.from(new Uint8Array(bufferHash));
    return arrayHash.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  // Fallback para Base64 se Web Crypto API não estiver disponível
  return generateAuditHash(dados, 64);
}
