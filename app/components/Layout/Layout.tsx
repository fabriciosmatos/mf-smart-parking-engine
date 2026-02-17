import React, { useState } from 'react';
import { BarraLateral } from './BarraLateral';
import { Cabecalho } from './Cabecalho';
import { PASSOS } from '../../constants/passos';

interface PropsLayout {
  children: React.ReactNode;
  passoAtivo: number;
}

export const Layout: React.FC<PropsLayout> = ({ children, passoAtivo }) => {
  const passoAtual = PASSOS.find(p => p.id === passoAtivo);
  const [barraLateralAberta, setBarraLateralAberta] = useState(false);

  return (
    <div className="flex h-screen w-full bg-[#f1f5f9] overflow-x-hidden">
      {/* Overlay para mobile quando barra lateral está aberta */}
      {barraLateralAberta && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setBarraLateralAberta(false)}
        />
      )}

      <BarraLateral 
        passoAtivo={passoAtivo} 
        aberta={barraLateralAberta}
        aoFechar={() => setBarraLateralAberta(false)}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Cabecalho 
          descricaoPassoAtual={passoAtual?.descricao || 'Operação'}
          aoClicarMenu={() => setBarraLateralAberta(true)}
        />

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 md:p-8 lg:p-10 max-w-full">
          {children}
        </div>
      </main>
    </div>
  );
};
