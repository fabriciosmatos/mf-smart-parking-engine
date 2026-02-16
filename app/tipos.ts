export type TipoVeiculo = 'CARRO' | 'SUV' | 'MOTO' | 'CAMINHONETE';
export type TipoVaga = 'P' | 'M' | 'G' | 'MOTO';
export type TipoCobertura = 'COBERTA' | 'DESCOBERTA';
export type TipoAcesso = 'LIVRE' | 'TRAVADA';

export interface VagaEstacionamento {
  id: string;
  numero: string;
  tipo: TipoVaga;
  cobertura: TipoCobertura;
  acesso: TipoAcesso;
  ehPCD: boolean;
  ehIdoso: boolean;
  ehCritica: boolean;
  pertoElevador: boolean;
  pertoPortaria: boolean;
  bloco?: string;
}

export interface Unidade {
  id: string;
  apartamento: string;
  bloco: string;
  veiculos: {
    tipo: TipoVeiculo;
    placa: string;
  }[];
  vagasCarro: number;
  vagasMoto: number;
  ehPCD: boolean;
  ehIdoso: boolean;
  estaInadimplente: boolean;
  alocacaoAnterior?: {
    idVaga: string;
    cobertura: TipoCobertura;
    acesso: TipoAcesso;
    eraCritica: boolean;
    pertoElevador: boolean;
  };
  estevePresenteAssembleia: boolean;
}

export interface ConfiguracaoSorteio {
  semente: string;
  pesos: {
    compensacaoCobertura: number;
    compensacaoMobilidade: number;
    proximidadeBloco: number;
    proximidadeElevador: number;
    rodizioVagasCriticas: number;
    proximidadePortaria: number;
    penalidadeInadimplencia: number;
    penalidadeAusencia: number;
  };
}

export interface DetalheRegra {
  nome: string;
  pontos: number;
  satisfeita: boolean;
}

export interface Alocacao {
  idUnidade: string;
  idVaga: string;
  tipoVagaSolicitada: 'CARRO' | 'MOTO';
  regrasAplicadas: DetalheRegra[];
  pontuacao: number;
}

export interface EstatisticasSorteio {
  taxaSucessoCobertura: number;
  taxaSucessoMobilidade: number;
  taxaCorrespondenciaBloco: number;
  taxaAuditoriaPrioridade: number;
  taxaRodizioVagasCriticas: number;
  pontuacaoMedia: number;
  totalAlocacoes: number;
}

export interface ResultadoSorteio {
  alocacoes: Alocacao[];
  estatisticas: EstatisticasSorteio;
  log: string[];
  semente: string;
  hash: string;
  timestamp: string;
}
