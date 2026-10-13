import React from 'react';

export default function StepIndicator({ currentStep, goToStep, setCurrentStep }) {
  const steps = [
    { num: 1, label: '1. 예산/기간' },
    { num: 2, label: '2. 매체 선택' },
    { num: 3, label: '3. 패키지/소재' },
    { num: 4, label: '4. 오디언스' },
    { num: 5, label: '5. 최종견적' }
  ];

  return (
    <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
      <button onClick={() => setCurrentStep(Math.max(1, currentStep - 1))} disabled={currentStep === 1} className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 ${currentStep === 1 ? 'bg-slate-900 text-slate-600 cursor-not-allowed' : 'bg-slate-700 hover:bg-slate-600 text-white shadow'}`}>
        <span>◀ 이전 단계</span>
      </button>
      <div className="flex items-center space-x-2 md:space-x-3 overflow-x-auto w-full md:w-auto justify-center">
        {steps.map((st) => (
          <button key={st.num} onClick={() => goToStep(st.num)} className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition flex items-center space-x-1.5 whitespace-nowrap ${currentStep === st.num ? 'bg-red-600 text-white shadow-lg ring-2 ring-red-400 scale-105' : st.num < currentStep ? 'bg-emerald-950 text-emerald-400 border border-emerald-700' : 'bg-slate-900 text-slate-400 hover:bg-slate-750 border border-slate-700'}`}>
            <span className="w-5 h-5 rounded-full bg-black/30 flex items-center justify-center text-[10px]">{st.num}</span>
            <span>{st.label}</span>
          </button>
        ))}
      </div>
      <div className="text-xs font-mono text-slate-400 hidden md:block">진행 상태: <strong className="text-amber-300 font-bold">{currentStep}</strong> / 5 Step</div>
    </div>
  );
}