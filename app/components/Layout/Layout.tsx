import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { STEPS } from '../../constants/steps';

interface LayoutProps {
  children: React.ReactNode;
  activeStep: number;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeStep }) => {
  const currentStep = STEPS.find(s => s.id === activeStep);

  return (
    <div className="flex h-full w-full bg-[#f1f5f9] overflow-x-hidden">
      <Sidebar activeStep={activeStep} />

      <main className="flex-1 flex flex-col min-w-0">
        <Header currentStepDesc={currentStep?.desc || 'Operação'} />

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-10 max-w-full">
          {children}
        </div>
      </main>
    </div>
  );
};
