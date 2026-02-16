// Versão em português
export const CONFIGS_KPI = [
  {
    rotulo: 'Compensação Cobertura',
    chave: 'taxaSucessoCobertura' as const,
    cor: 'emerald',
    descricao: 'Migrados para Coberta'
  },
  {
    rotulo: 'Mobilidade Técnica',
    chave: 'taxaSucessoMobilidade' as const,
    cor: 'blue',
    descricao: 'Migrados para Livre'
  },
  {
    rotulo: 'Proximidade Torre',
    chave: 'taxaCorrespondenciaBloco' as const,
    cor: 'indigo',
    descricao: 'Match de Bloco'
  },
  {
    rotulo: 'Rodízio Crítico',
    chave: 'taxaRodizioVagasCriticas' as const,
    cor: 'rose',
    descricao: 'Fim de Inconveniência'
  }
] as const;

// Versão legada em inglês (compatibilidade)
export const KPI_CONFIGS = [
  {
    label: 'Compensação Cobertura',
    key: 'coverageSuccessRate' as const,
    color: 'emerald',
    desc: 'Migrados para Coberta'
  },
  {
    label: 'Mobilidade Técnica',
    key: 'mobilitySuccessRate' as const,
    color: 'blue',
    desc: 'Migrados para Livre'
  },
  {
    label: 'Proximidade Torre',
    key: 'blockMatchRate' as const,
    color: 'indigo',
    desc: 'Match de Bloco'
  },
  {
    label: 'Rodízio Crítico',
    key: 'criticalRotationRate' as const,
    color: 'rose',
    desc: 'Fim de Inconveniência'
  }
] as const;
