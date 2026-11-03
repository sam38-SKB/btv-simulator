import React from 'react';

export default function Step1Budget({ state, actions, volInfo, onNext }) {
  const budgetOptions = Array.from({ length: 20 }, (_, i) => (i + 1) * 5000000);

  const handleDirectInput = (val) => {
    const num = Number(val);
    if (isNaN(num)) return;
    if (num > 10000) actions.setMonthlyBudget(100000000);
    else if (num < 0) actions.setMonthlyBudget(0);
    else actions.setMonthlyBudget(num * 10000);
  };

  return (
    <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl space-y-6">
      <div className="flex justify-between items-center border-b border-slate-700 pb-3">
        <h3 className="text-base font-bold text-white flex items-center">
          <span className="text-red-500 font-extrabold mr-1.5">1.</span> 집행 예산 및 기간 설정 <span className="text-red-400 text-xs ml-3 font-normal">* 필수 선택</span>
        </h3>
        <div className="text-right font-mono">
          <span className="text-xs text-slate-400 block">월 {(Number(state.monthlyBudget) / 10000 || 0).toLocaleString()}만원 × {state.durationMonths || 0}개월</span>
          <span className="text-base text-amber-300 font-bold">총 집행 금액: {(state.totalBudget / 10000).toLocaleString()}만원</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 space-y-3">
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="text-slate-300">월 집행 금액 선택 (슬라이더 / 드롭다운 / 직접 입력)</span>
            <div className="flex items-center space-x-1.5">
              <input type="number" min={0} max={10000} step={100} value={state.monthlyBudget ? state.monthlyBudget / 10000 : ''} onChange={(e) => handleDirectInput(e.target.value)} className="w-28 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1 text-right font-bold text-red-400 focus:outline-none focus:border-red-500 text-sm font-mono" placeholder="선택하세요" />
              <span className="text-red-400 font-bold text-sm">만원 / 월</span>
            </div>
          </div>
          <select value={state.monthlyBudget} onChange={(e) => actions.setMonthlyBudget(e.target.value ? Number(e.target.value) : '')} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white font-bold">
            <option value="">-- 예산을 선택하세요 --</option>
            {budgetOptions.map(val => (
              <option key={val} value={val}>월 {(val / 10000).toLocaleString()} 만원 {val === 30000000 ? '(표준 권장)' : val === 5000000 ? '(최소)' : val === 100000000 ? '(최대)' : ''}</option>
            ))}
          </select>
          <input type="range" min={5000000} max={100000000} step={5000000} value={state.monthlyBudget || 5000000} onChange={(e) => actions.setMonthlyBudget(Number(e.target.value))} className="w-full accent-red-500 h-2 bg-slate-900 rounded-lg cursor-pointer mt-2" />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-slate-400 font-bold block mb-1">📅 집행 희망 기간</label>
          <select value={state.durationMonths} onChange={(e) => actions.setDurationMonths(e.target.value ? Number(e.target.value) : '')} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white font-bold">
            <option value="">-- 집행 기간을 선택하세요 --</option>
            <option value={1}>1개월 (기본)</option>
            <option value={2}>2개월</option>
            <option value={3}>3개월 (분기 청약 - 우대)</option>
            <option value={6}>6개월 (상/하반기 연속)</option>
          </select>
        </div>
      </div>
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border border-emerald-500/50 p-4 rounded-xl flex items-center justify-between text-xs mt-2">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">🎁</span>
          <div>
            <div className="font-bold text-emerald-400 text-sm flex items-center">
              <span>조건: 월 {(Number(state.monthlyBudget) / 10000 || 0).toLocaleString()}만원 & {state.durationMonths || 0}개월</span>
              <span className="ml-2 bg-emerald-900 text-emerald-200 px-2 py-0.5 rounded text-[11px] font-extrabold">볼륨 보너스 +{(volInfo.rate * 100).toFixed(0)}%</span>
            </div>
            <div className="text-slate-300 text-xs mt-0.5">달성 상태: <strong className="text-amber-300 font-semibold">{volInfo.label}</strong></div>
          </div>
        </div>
        {volInfo.nextTier && (
          <div className="text-right bg-slate-900/90 border border-slate-700 px-3 py-1.5 rounded-lg">
            <span className="text-slate-400 block text-[11px]">다음 보너스 승급 조건</span>
            <span className="text-amber-400 font-bold">{volInfo.nextTier}</span>
          </div>
        )}
      </div>
      <div className="pt-4 flex justify-end">
        <button onClick={onNext} className="bg-red-600 hover:bg-red-500 text-white font-bold px-7 py-3 rounded-xl transition shadow-lg text-sm">다음 단계 (매체 선택) ▶</button>
      </div>
    </div>
  );
}