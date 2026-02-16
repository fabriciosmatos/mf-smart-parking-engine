// ===== TRADUÇÕES PARA PORTUGUÊS =====
export const TRADUCOES_PESOS: Record<string, string> = {
  compensacaoCobertura: 'Compensação de Cobertura',
  compensacaoMobilidade: 'Facilidade de Manobra',
  proximidadeBloco: 'Proximidade do Bloco',
  proximidadeElevador: 'Acesso ao Elevador',
  rodizioVagasCriticas: 'Rodízio de Inconveniência',
  proximidadePortaria: 'Acesso à Portaria',
  penalidadeInadimplencia: 'Situação Financeira',
  penalidadeAusenciaAssembleia: 'Presença em Assembleia'
};

export const ICONES_PESOS: Record<string, string> = {
  compensacaoCobertura: 'fa-umbrella',
  compensacaoMobilidade: 'fa-arrows-left-right',
  proximidadeBloco: 'fa-building',
  proximidadeElevador: 'fa-elevator',
  rodizioVagasCriticas: 'fa-arrows-rotate',
  proximidadePortaria: 'fa-door-open',
  penalidadeInadimplencia: 'fa-hand-holding-dollar',
  penalidadeAusenciaAssembleia: 'fa-calendar-xmark'
};

export interface InfoPeso {
  descricao: string;
  aumentar: string;
  diminuir: string;
}

export const INFO_PESOS: Record<string, InfoPeso> = {
  compensacaoCobertura: {
    descricao: "Compensa moradores que ficaram em vagas descobertas no ciclo passado.",
    aumentar: "Se AUMENTAR: Garante que quem estava no tempo agora tenha vaga coberta prioritariamente.",
    diminuir: "Se DIMINUIR: O sistema tratará a cobertura como secundária."
  },
  compensacaoMobilidade: {
    descricao: "Prioriza vaga 'Livre' para quem estava em vaga 'Presa' (manobra).",
    aumentar: "Se AUMENTAR: Garante que ninguém fique com vaga 'Presa' por dois ciclos seguidos.",
    diminuir: "Se DIMINUIR: A facilidade de manobra terá menos peso."
  },
  proximidadeBloco: {
    descricao: "Busca manter a vaga o mais próximo possível da torre/bloco do morador.",
    aumentar: "Se AUMENTAR: O morador terá que caminhar o mínimo possível.",
    diminuir: "Se DIMINUIR: O sistema priorizará a qualidade da vaga sobre a distância."
  },
  proximidadeElevador: {
    descricao: "Valoriza vagas localizadas próximas aos núcleos de elevadores.",
    aumentar: "Se AUMENTAR: Vagas próximas aos elevadores serão as primeiras a serem preenchidas por bons scores.",
    diminuir: "Se DIMINUIR: A distância horizontal até o elevador será ignorada."
  },
  rodizioVagasCriticas: {
    descricao: "Evita que o mesmo morador fique em vagas 'ruins' recorrentemente.",
    aumentar: "Se AUMENTAR: Impede matematicamente a reincidência em vagas consideradas críticas.",
    diminuir: "Se DIMINUIR: O acaso pode manter o morador em vaga crítica."
  },
  proximidadePortaria: {
    descricao: "Busca vagas próximas à entrada/saída principal.",
    aumentar: "Se AUMENTAR: Favorece moradores que buscam agilidade na saída diária.",
    diminuir: "Se DIMINUIR: O tempo de saída não afetará o score."
  },
  penalidadeInadimplencia: {
    descricao: "Aplica restrição para unidades com débitos condominiais.",
    aumentar: "Se AUMENTAR: Inadimplentes serão movidos para as vagas remanescentes.",
    diminuir: "Se DIMINUIR: A situação financeira terá pouco impacto."
  },
  penalidadeAusenciaAssembleia: {
    descricao: "Privilegia moradores que participam da assembleia.",
    aumentar: "Se AUMENTAR: Quem está presente escolhe as melhores vagas primeiro.",
    diminuir: "Se DIMINUIR: A presença física não influenciará o resultado."
  }
};

export const PESOS_PADRAO = {
  compensacaoCobertura: 80,
  compensacaoMobilidade: 60,
  proximidadeBloco: 40,
  proximidadeElevador: 50,
  rodizioVagasCriticas: 100,
  proximidadePortaria: 30,
  penalidadeInadimplencia: 150,
  penalidadeAusenciaAssembleia: 100
};

// ===== MANTÉM COMPATIBILIDADE COM CÓDIGO LEGADO (INGLÊS) =====
export const WEIGHT_TRANSLATIONS: Record<string, string> = {
  coverageCompensation: 'Compensação de Cobertura',
  mobilityCompensation: 'Facilidade de Manobra',
  blockProximity: 'Proximidade do Bloco',
  elevatorProximity: 'Acesso ao Elevador',
  criticalRotation: 'Rodízio de Inconveniência',
  entranceProximity: 'Acesso à Portaria',
  defaultingPenalty: 'Situação Financeira',
  absencePenalty: 'Presença em Assembleia'
};

export const WEIGHT_ICONS: Record<string, string> = {
  coverageCompensation: 'fa-umbrella',
  mobilityCompensation: 'fa-arrows-left-right',
  blockProximity: 'fa-building',
  elevatorProximity: 'fa-elevator',
  criticalRotation: 'fa-arrows-rotate',
  entranceProximity: 'fa-door-open',
  defaultingPenalty: 'fa-hand-holding-dollar',
  absencePenalty: 'fa-calendar-xmark'
};

export interface WeightInfo {
  desc: string;
  up: string;
  down: string;
}

export const WEIGHT_INFO: Record<string, WeightInfo> = {
  coverageCompensation: {
    desc: "Compensa moradores que ficaram em vagas descobertas no ciclo passado.",
    up: "Se AUMENTAR: Garante que quem estava no tempo agora tenha vaga coberta prioritariamente.",
    down: "Se DIMINUIR: O sistema tratará a cobertura como secundária."
  },
  mobilityCompensation: {
    desc: "Prioriza vaga 'Livre' para quem estava em vaga 'Presa' (manobra).",
    up: "Se AUMENTAR: Garante que ninguém fique com vaga 'Presa' por dois ciclos seguidos.",
    down: "Se DIMINUIR: A facilidade de manobra terá menos peso."
  },
  blockProximity: {
    desc: "Busca manter a vaga o mais próximo possível da torre/bloco do morador.",
    up: "Se AUMENTAR: O morador terá que caminhar o mínimo possível.",
    down: "Se DIMINUIR: O sistema priorizará a qualidade da vaga sobre a distância."
  },
  elevatorProximity: {
    desc: "Valoriza vagas localizadas próximas aos núcleos de elevadores.",
    up: "Se AUMENTAR: Vagas próximas aos elevadores serão as primeiras a serem preenchidas por bons scores.",
    down: "Se DIMINUIR: A distância horizontal até o elevador será ignorada."
  },
  criticalRotation: {
    desc: "Evita que o mesmo morador fique em vagas 'ruins' recorrentemente.",
    up: "Se AUMENTAR: Impede matematicamente a reincidência em vagas consideradas críticas.",
    down: "Se DIMINUIR: O acaso pode manter o morador em vaga crítica."
  },
  entranceProximity: {
    desc: "Busca vagas próximas à entrada/saída principal.",
    up: "Se AUMENTAR: Favorece moradores que buscam agilidade na saída diária.",
    down: "Se DIMINUIR: O tempo de saída não afetará o score."
  },
  defaultingPenalty: {
    desc: "Aplica restrição para unidades com débitos condominiais.",
    up: "Se AUMENTAR: Inadimplentes serão movidos para as vagas remanescentes.",
    down: "Se DIMINUIR: A situação financeira terá pouco impacto."
  },
  absencePenalty: {
    desc: "Privilegia moradores que participam da assembleia.",
    up: "Se AUMENTAR: Quem está presente escolhe as melhores vagas primeiro.",
    down: "Se DIMINUIR: A presença física não influenciará o resultado."
  }
};

export const DEFAULT_WEIGHTS = {
  coverageCompensation: 80,
  mobilityCompensation: 60,
  blockProximity: 40,
  elevatorProximity: 50,
  criticalRotation: 100,
  entranceProximity: 30,
  defaultingPenalty: 150,
  absencePenalty: 100
};
