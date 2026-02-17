import React from 'react';

interface PropsZonaUploadArquivo {
  aoSelecionarArquivo: (arquivo: File | undefined) => void;
  icone: string;
  titulo: string;
  quantidadeCarregada?: number;
  rotuloQuantidade?: string;
}

export const ZonaUploadArquivo: React.FC<PropsZonaUploadArquivo> = ({
  aoSelecionarArquivo,
  icone,
  titulo,
  quantidadeCarregada,
  rotuloQuantidade
}) => {
  const referenciaInput = React.useRef<HTMLInputElement>(null);

  const aoClicar = () => referenciaInput.current?.click();
  
  const aoMudar = (e: React.ChangeEvent<HTMLInputElement>) => {
    aoSelecionarArquivo(e.target.files?.[0]);
  };

  return (
    <div
      className="border-2 border-dashed border-slate-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 text-center hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer relative min-h-[160px] sm:min-h-[200px] flex flex-col items-center justify-center"
      onClick={aoClicar}
    >
      <input
        type="file"
        ref={referenciaInput}
        className="hidden"
        onChange={aoMudar}
        accept=".csv"
      />
      <i className={`fa-solid ${icone} text-3xl sm:text-4xl text-indigo-500 mb-3 sm:mb-4`}></i>
      <h3 className="font-bold text-base sm:text-lg">{titulo}</h3>
      {quantidadeCarregada !== undefined && quantidadeCarregada > 0 && (
        <p className="mt-3 sm:mt-4 text-emerald-600 font-black text-xs uppercase">
          {quantidadeCarregada} {rotuloQuantidade}
        </p>
      )}
    </div>
  );
};
