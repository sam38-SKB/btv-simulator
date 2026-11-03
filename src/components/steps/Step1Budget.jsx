import React from 'react';

export default function Step1BudgetPeriod({ state = {}, actions = {}, onNext }) {
  // 예산 및 기간 상태 변경 안전 핸들러
  const handleBudgetChange = (val) => {
    if (typeof actions.setTotalBudget === 'function') actions.setTotalBudget(val);
    else if (typeof actions.setBudget === 'function') actions.setBudget(val);
    else if (typeof actions.setMonthlyBudget === 'function') actions.setMonthlyBudget(val);
  };

  const handleMonthsChange = (val) => {
    if (typeof actions.setMonths === 'function') actions.setMonths(val);
    else if (typeof actions.setPeriod === 'function') actions.setPeriod(val);
    else if (typeof actions.setExecutionMonths === 'function') actions.setExecutionMonths(val);
  };

  // 현재 입력/선택된 예산 및 기간 값
  const currentBudget = Number(state.totalBudget || state.budget || state.monthlyBudget || 10000000);
  const currentMonths = Number(state.months || state.period || state.executionMonths || 1);

  // 원본 기본 예산 프리셋 (1,000만원 ~ 1억원)
  const budgetPresets = [
    { label: '1,000만원', value: 10000000 },
    { label: '3,000만원', value: 30000000 },
    { label: '5,000만원', value: 50000000 },
    { label: '1억원', value: 100000000 }
  ];

  // 원본 기간 프리셋 (1개월 ~ 6개월)
  const periodPresets = [
    { label: '1개월', value: 1 },
    { label: '2개월', value: 2 },
    { label: '3개월', value: 3 },
    { label: '6개월', value: 6 }
  ];

  return (
    <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl space-y-6 text-slate-100">
      {/* 스텝 헤더 */}
      <div className="flex justify-between items-center border-b border-slate-700 pb-3">
        <h3 className="text-base font-bold text-white flex items-center">
          <span className="text-red-500 font-extrabold mr-1.5">1.</span> 캠페인 집행 예산 및 기간 설정
        </h3>
      </div>

      {/* 예산 설정 영역 */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-700 space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-bold text-slate-200 block">
            💳 총 집행 예산 (VAT 별도)
          </label>
          <div className="text-right">
            <span className="text-2xl font-black text-amber-300 font-mono">
              {(currentBudget / 10000).toLocaleString()}
            </span>
            <span className="text-xs font-bold text-slate-400 ml-1">만원</span>
          </div>
        </div>

        {/* 원본 슬라이더 (1,000만원 ~ 1억원) */}
        <div className="space-y-2">
          <input
            type="range"
            min={10000000}
            max={100000000}
            step={5000000}
            value={currentBudget}
            onChange={(e) => handleBudgetChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
            <span>1,000만원</span>
            <span>5,000만원</span>
            <span>1억원</span>
          </div>
        </div>

        {/* 예산 프리셋 버튼 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2">
          {budgetPresets.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => handleBudgetChange(preset.value)}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                currentBudget === preset.value
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-lg ring-2 ring-amber-300'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* 기간 설정 영역 */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-700 space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-bold text-slate-200 block">
            📅 약정 집행 기간
          </label>
          <div className="text-right">
            <span className="text-2xl font-black text-sky-300 font-mono">
              {currentMonths}
            </span>
            <span className="text-xs font-bold text-slate-400 ml-1">개월</span>
          </div>
        </div>

        {/* 기간 프리셋 버튼 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {periodPresets.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => handleMonthsChange(preset.value)}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                currentMonths === preset.value
                  ? 'bg-sky-500 text-slate-950 border-sky-400 font-black shadow-lg ring-2 ring-sky-300'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750 hover:text-white'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* 다음 단계 버튼 */}
      <div className="pt-2 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          className="bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold rounded-xl py-3 px-8 text-sm shadow-xl transition-all"
        >
          다음 단계 (상품 및 채널 선택) ▶
        </button>
      </div>
    </div>
  );
}