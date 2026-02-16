/**
 * Retorna o ícone FontAwesome apropriado baseado no nome da regra
 * 
 * @param nomeRegra - Nome da regra de negócio (ex: "RN03: Compensação de Cobertura")
 * @returns Classe do ícone FontAwesome (ex: "fa-umbrella")
 */
export const obterIconeRegra = (nomeRegra: string): string => {
  const nome = nomeRegra.toLowerCase();
  
  if (nome.includes('cobertura')) return 'fa-umbrella';
  if (nome.includes('mobilidade') || nome.includes('manobra')) return 'fa-arrows-left-right';
  if (nome.includes('bloco')) return 'fa-building';
  if (nome.includes('elevador')) return 'fa-elevator';
  if (nome.includes('crítico') || nome.includes('inconveniência') || nome.includes('rodízio')) return 'fa-arrows-rotate';
  if (nome.includes('portaria') || nome.includes('entrada')) return 'fa-door-open';
  if (nome.includes('inadimplência') || nome.includes('débito')) return 'fa-hand-holding-dollar';
  if (nome.includes('assembleia') || nome.includes('ausência') || nome.includes('presença')) return 'fa-calendar-xmark';
  if (nome.includes('legal') || nome.includes('pcd') || nome.includes('idoso')) return 'fa-gavel';
  
  return 'fa-circle-info';
};

/**
 * Formata o rótulo da regra removendo o prefixo "RN##: "
 * 
 * @param nome - Nome completo da regra (ex: "RN03: Compensação de Cobertura")
 * @returns Nome sem o prefixo (ex: "Compensação de Cobertura")
 */
export const formatarRotuloRegra = (nome: string): string => {
  return nome.replace(/^RN\d+:\s*/i, '');
};

// ============================================================
// EXPORTS DE COMPATIBILIDADE (Manter para código legado)
// ============================================================

/** @deprecated Use obterIconeRegra */
export const getRuleIconFromRuleName = obterIconeRegra;

/** @deprecated Use formatarRotuloRegra */
export const formatRuleLabel = formatarRotuloRegra;
