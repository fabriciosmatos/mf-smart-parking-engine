// Versão em português - Passos/Etapas do fluxo
export const PASSOS = [
  { id: 1, rotulo: 'Dados', icone: 'fa-database', descricao: 'Ingestão de CSV' },
  { id: 2, rotulo: 'Regras', icone: 'fa-sliders', descricao: 'Configurar Regras' },
  { id: 3, rotulo: 'Motor', icone: 'fa-microchip', descricao: 'Simulação' },
  { id: 4, rotulo: 'Entrega', icone: 'fa-box-open', descricao: 'Auditoria' }
] as const;

export const ETAPAS = PASSOS;

// Compatibilidade com código legado
export const STEPS = [
  { id: 1, label: 'Dados', icon: 'fa-database', desc: 'Ingestão de CSV' },
  { id: 2, label: 'Regras', icon: 'fa-sliders', desc: 'Configurar Regras' },
  { id: 3, label: 'Motor', icon: 'fa-microchip', desc: 'Simulação' },
  { id: 4, label: 'Entrega', icon: 'fa-box-open', desc: 'Auditoria' }
] as const;
