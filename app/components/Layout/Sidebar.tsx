import React from 'react';

interface SidebarProps {
  activeStep: number;
}

const STEPS = [
  { id: 1, label: 'Dados', icon: 'fa-database', desc: 'Ingestão de CSV' },
  { id: 2, label: 'Regras', icon: 'fa-sliders', desc: 'Configurar Regras' },
  { id: 3, label: 'Motor', icon: 'fa-microchip', desc: 'Simulação' },
  { id: 4, label: 'Entrega', icon: 'fa-box-open', desc: 'Auditoria' }
];

export const Sidebar: React.FC<SidebarProps> = ({ activeStep }) => {
  return (
    <aside className="w-72 h-full bg-[#0f172a] text-white flex flex-col shadow-2xl relative z-20">
      <div className="p-8 border-b border-slate-800/50 flex items-center gap-4">
        <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 rotate-3">
          <i className="fa-solid fa-parking text-2xl text-white"></i>
        </div>
        <div>
          <h1 className="font-extrabold text-2xl tracking-tight leading-none">SPE</h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 font-semibold">
            Smart Parking Engine
          </p>
        </div>
      </div>

      <nav className="flex-1 p-6 pb-8 mt-4 relative flex flex-col">
        <div className="space-y-2 pb-6">
          {STEPS.map((step, index) => (
            <React.Fragment key={step.id}>
              <div
                className={`flex items-start gap-4 p-4 rounded-2xl transition-all duration-500 relative z-10 ${
                  activeStep === step.id
                    ? 'bg-indigo-600 shadow-xl shadow-indigo-500/20 scale-105 border border-indigo-400/30'
                    : activeStep > step.id
                      ? 'text-emerald-400 bg-slate-800/30 opacity-80'
                      : 'text-slate-500 opacity-40 grayscale pointer-events-none'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                  activeStep === step.id ? 'bg-white text-indigo-600 shadow-inner' : 'bg-slate-800'
                }`}>
                  <i className={`fa-solid ${activeStep > step.id ? 'fa-check' : step.icon} text-lg`}></i>
                </div>
                <div className="flex-1">
                  <span className={`block font-bold text-sm ${
                    activeStep === step.id ? 'text-white' : 'text-slate-300'
                  }`}>
                    {step.label}
                  </span>
                  <span className={`text-[11px] block mt-0.5 ${
                    activeStep === step.id ? 'text-indigo-100' : 'text-slate-500'
                  }`}>
                    {step.desc}
                  </span>
                </div>
                {activeStep === step.id && (
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-indigo-600 rotate-45 border-r border-t border-indigo-400/30 hidden lg:block"></div>
                )}
              </div>

              {index < STEPS.length - 1 && (
                <div className="flex justify-center my-[-8px] relative z-0">
                  <div className={`w-0.5 h-8 transition-colors duration-500 ${
                    activeStep > step.id ? 'bg-emerald-500/50' : 'bg-slate-800'
                  }`}></div>
                  <i className={`fa-solid fa-chevron-down text-[8px] absolute bottom-0 translate-y-1/2 transition-colors duration-500 ${
                    activeStep > step.id ? 'text-emerald-500' : 'text-slate-800'
                  }`}></i>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </nav>
    </aside>
  );
};
