import React, { useMemo } from 'react';
import { Botao } from '../ui/Botao';
import { ZonaUploadArquivo } from '../ui/ZonaUploadArquivo';
import { Unit, ParkingSpace } from '../../types';

interface PropriedadesPassoIngestao {
  quantidadeUnidades: number;
  quantidadeVagas: number;
  quantidadeAlocacoes: number;
  unidades: Unit[];
  vagas: ParkingSpace[];
  aoUploadArquivo: (file: File | undefined, type: 'units' | 'spaces' | 'allocations') => void;
  aoGerarDadosSimulados: () => void;
  aoProximo: () => void;
}

export const PassoIngestao: React.FC<PropriedadesPassoIngestao> = ({
  quantidadeUnidades,
  quantidadeVagas,
  quantidadeAlocacoes,
  unidades,
  vagas,
  aoUploadArquivo,
  aoGerarDadosSimulados,
  aoProximo
}) => {
  // Calcula solicitações por tipo
  const { carRequests, motoRequests } = useMemo(() => {
    const carRequests = unidades.reduce((acc, u) => acc + u.carSpaces, 0);
    const motoRequests = unidades.reduce((acc, u) => acc + u.motoSpaces, 0);
    return { carRequests, motoRequests };
  }, [unidades]);

  // Conta vagas por tipo
  const { carSpaces, motoSpaces } = useMemo(() => {
    const carSpaces = vagas.filter(s => s.type !== 'MOTO').length;
    const motoSpaces = vagas.filter(s => s.type === 'MOTO').length;
    return { carSpaces, motoSpaces };
  }, [vagas]);

  const hasCarDeficit = carRequests > carSpaces;
  const hasMotoDeficit = motoRequests > motoSpaces;
  const hasInventoryIssue = hasCarDeficit || hasMotoDeficit;
  const canProceed = quantidadeUnidades > 0 && quantidadeVagas > 0 && !hasInventoryIssue;

  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 lg:p-10 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200 animate-fadeIn overflow-x-hidden max-w-full">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 sm:mb-8 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 italic tracking-tight">
            Carregar Dados
          </h2>
          <p className="text-sm sm:text-base text-slate-500 font-medium italic">
            Carregue os arquivos CSV com as informações do condomínio
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <a
            href="/examples/unidades_exemplo.csv"
            download
            className="px-4 sm:px-6 py-2 sm:py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all font-bold text-xs sm:text-sm flex items-center justify-center"
          >
            <i className="fa-solid fa-download mr-2"></i>Baixar Exemplos
          </a>
          <button
            onClick={aoGerarDadosSimulados}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all font-bold text-xs sm:text-sm flex items-center justify-center"
          >
            <i className="fa-solid fa-wand-magic-sparkles mr-2"></i>Gerar Dados Aleatórios
          </button>
        </div>
      </div>

      {hasInventoryIssue && (
        <div className="mb-4 sm:mb-6 bg-red-50 border-2 border-red-200 rounded-xl sm:rounded-2xl p-3 sm:p-5">
          <div className="flex items-start gap-2 sm:gap-3">
            <i className="fa-solid fa-triangle-exclamation text-lg sm:text-2xl text-red-600 mt-1"></i>
            <div className="flex-1">
              <h3 className="font-black text-sm sm:text-base text-red-900 mb-2">⚠️ Déficit de Inventário Detectado</h3>
              <p className="text-xs sm:text-sm text-red-800 mb-3">
                {hasCarDeficit && hasMotoDeficit 
                  ? "Déficit em vagas de CARRO e MOTO detectado."
                  : hasCarDeficit 
                    ? "Déficit em vagas de CARRO detectado."
                    : "Déficit em vagas de MOTO detectado."}
              </p>
              <div className="bg-white rounded-lg p-2 sm:p-3 text-xs font-mono space-y-2 sm:space-y-3">
                {/* Vagas de Carro */}
                <div className={hasCarDeficit ? 'opacity-100' : 'opacity-60'}>
                  <div className="font-bold text-slate-700 mb-1 flex items-center gap-2">
                    <i className="fa-solid fa-car"></i> Vagas de CARRO (P, M, G)
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-600">Solicitações:</span>
                    <span className={`font-black ${hasCarDeficit ? 'text-red-600' : 'text-slate-900'}`}>{carRequests}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-600">Vagas disponíveis:</span>
                    <span className="font-black text-slate-900">{carSpaces}</span>
                  </div>
                  {hasCarDeficit && (
                    <div className="border-t pt-1 mt-1 flex justify-between">
                      <span className="text-slate-600">Faltam:</span>
                      <span className="font-black text-red-600">{carRequests - carSpaces} vagas</span>
                    </div>
                  )}
                </div>

                {/* Vagas de Moto */}
                <div className={hasMotoDeficit ? 'opacity-100' : 'opacity-60'}>
                  <div className="font-bold text-slate-700 mb-1 flex items-center gap-2">
                    <i className="fa-solid fa-motorcycle"></i> Vagas de MOTO
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-600">Solicitações:</span>
                    <span className={`font-black ${hasMotoDeficit ? 'text-red-600' : 'text-slate-900'}`}>{motoRequests}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-600">Vagas disponíveis:</span>
                    <span className="font-black text-slate-900">{motoSpaces}</span>
                  </div>
                  {hasMotoDeficit && (
                    <div className="border-t pt-1 mt-1 flex justify-between">
                      <span className="text-slate-600">Faltam:</span>
                      <span className="font-black text-red-600">{motoRequests - motoSpaces} vagas</span>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-xs text-slate-600 mt-2 sm:mt-3 italic">
                💡 Solução: Adicione mais vagas do tipo correto no arquivo de vagas ou reduza as solicitações.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Upload 1 - Obrigatório */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-3 h-7">
            <span className="w-6 h-6 sm:w-7 sm:h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">1</span>
            <span className="text-xs sm:text-sm font-bold text-slate-700">OBRIGATÓRIO</span>
          </div>
          <ZonaUploadArquivo
            aoSelecionarArquivo={(file) => aoUploadArquivo(file, 'units')}
            icone="fa-people-group"
            titulo="Unidades"
            quantidadeCarregada={quantidadeUnidades}
            rotuloQuantidade="UNIDADES"
          />
          <div className="text-xs text-slate-500 mt-2 italic min-h-[40px]">
            Lista de apartamentos do condomínio<br/>
            📄 <a href="/examples/unidades_exemplo.csv" download className="text-blue-600 hover:underline">Baixar exemplo</a>
          </div>
        </div>

        {/* Upload 2 - Obrigatório */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-3 h-7">
            <span className="w-6 h-6 sm:w-7 sm:h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">2</span>
            <span className="text-xs sm:text-sm font-bold text-slate-700">OBRIGATÓRIO</span>
          </div>
          <ZonaUploadArquivo
            aoSelecionarArquivo={(file) => aoUploadArquivo(file, 'spaces')}
            icone="fa-car-rear"
            titulo="Vagas"
            quantidadeCarregada={quantidadeVagas}
            rotuloQuantidade="VAGAS"
          />
          <div className="text-xs text-slate-500 mt-2 italic min-h-[40px]">
            Lista de vagas disponíveis<br/>
            📄 <a href="/examples/vagas_exemplo.csv" download className="text-blue-600 hover:underline">Baixar exemplo</a>
          </div>
        </div>

        {/* Upload 3 - Opcional */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-3 h-7">
            <span className="w-6 h-6 sm:w-7 sm:h-7 bg-slate-300 text-slate-600 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">3</span>
            <span className="text-xs sm:text-sm font-bold text-slate-500">OPCIONAL</span>
          </div>
          <ZonaUploadArquivo
            aoSelecionarArquivo={(file) => aoUploadArquivo(file, 'allocations')}
            icone="fa-link"
            titulo="Vagas Atuais"
            quantidadeCarregada={quantidadeAlocacoes}
            rotuloQuantidade="ALOCAÇÕES"
          />
          <div className="mt-2 min-h-[40px]">
            <details>
              <summary className="text-xs text-blue-600 cursor-pointer hover:text-blue-700 font-medium list-none flex items-center gap-1">
                <i className="fa-solid fa-circle-info"></i> Quando usar este arquivo?
              </summary>
              <div className="text-xs text-slate-700 mt-2 bg-blue-50 p-3 rounded border border-blue-200">
                <p className="mb-2"><strong>Use APENAS se já houve sorteio antes</strong></p>
                <p className="text-slate-600">
                  ✅ Segundo sorteio do ano<br/>
                  ✅ Quer compensar vagas ruins<br/>
                  ❌ Primeiro sorteio (deixe em branco)
                </p>
                <p className="mt-2 text-xs">
                  📄 <a href="/examples/alocacao_atual_exemplo.csv" download className="text-blue-600 hover:underline">
                    Baixar exemplo
                  </a>
                </p>
              </div>
            </details>
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <a 
          href="/COMO_USAR.md" 
          target="_blank"
          className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
        >
          <i className="fa-solid fa-circle-question"></i>
          Como preencher os arquivos CSV?
        </a>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
          {quantidadeUnidades === 0 || quantidadeVagas === 0 ? (
            <p className="text-xs sm:text-sm text-amber-600 font-medium">
              <i className="fa-solid fa-exclamation-triangle mr-1"></i>
              Carregue pelo menos Unidades e Vagas
            </p>
          ) : hasInventoryIssue ? (
            <p className="text-xs sm:text-sm text-red-600 font-bold">
              <i className="fa-solid fa-xmark-circle mr-1"></i>
              Corrija o déficit de vagas antes de prosseguir
            </p>
          ) : carRequests === carSpaces && motoRequests === motoSpaces ? (
            <p className="text-xs sm:text-sm text-emerald-600 font-medium">
              <i className="fa-solid fa-circle-check mr-1"></i>
              <span className="hidden sm:inline">Perfeito! Carro: {carRequests}={carSpaces} | Moto: {motoRequests}={motoSpaces}</span>
              <span className="sm:hidden">Perfeito! Tudo certo ✓</span>
            </p>
          ) : (
            <p className="text-xs sm:text-sm text-blue-600 font-medium">
              <i className="fa-solid fa-circle-check mr-1"></i>
              <span className="hidden sm:inline">Válido - Carro: {carRequests}/{carSpaces} | Moto: {motoRequests}/{motoSpaces}</span>
              <span className="sm:hidden">Válido ✓</span>
            </p>
          )}
          <Botao disabled={!canProceed} aoClicar={aoProximo}>
            Configurar Regras <i className="fa-solid fa-arrow-right ml-2"></i>
          </Botao>
        </div>
      </div>
    </div>
  );
};
