import React, { useEffect } from 'react';

export default function Step1BudgetPeriod({ state, actions, onNext }) {
  // 예산 표준권장 기본값: 10,000,000원 (1천만원)
  const DEFAULT_BUDGET = 10000000;
  // 최대 예산 제한: 50,000,000원 (5천만원)
  const MAX_BUDGET = 50000000;
  // 기본 집행 기간: 1개월
  const DEFAULT_MONTHS = 1;

  // 초기 진입 시 예산이 없거나 최대 예산 초과 시 표준권장 값(1,000만원 / 1개월)으로 안전 초기화
  useEffect(() => {
    if (!state.totalBudget) {
      if (actions.setTotalBudget) actions.setTotalBudget(DEFAULT_BUDGET);
      if (actions.setMonthlyBudget) actions.setMonthlyBudget(DEFAULT_BUDGET);
    } else if (state.totalBudget > MAX_BUDGET) {
      if (actions.setTotalBudget) actions.setTotalBudget(MAX_BUDGET);
    }

    if (!state.months && !state.period) {
      if (actions.setMonths) actions.setMonths(DEFAULT_MONTHS);
      if (actions.setPeriod) actions.setPeriod(DEFAULT_MONTHS);
    }
  }, []);

  const currentBudget = state.totalBudget || state.monthlyBudget || DEFAULT_BUDGET;
  const currentMonths = state.months || state.period || DEFAULT_MONTHS;

  const handleBudgetChange = (value) => {
    const numericValue = Math.min(MAX_BUDGET, Math.max(0, Number(value) || 0));
    if (actions.setTotalBudget) actions.setTotalBudget(numericValue);
    if (actions.setMonthlyBudget) actions.setMonthlyBudget(numericValue);
  };

  const handleMonthsChange = (value) => {
    const monthsValue = Number(value) || 1;
    if (actions.setMonths) actions.setMonths(monthsValue);
    if (actions.setPeriod) actions.setPeriod(monthsValue);
  };

  // 빠른 선택 예산 버튼 프리셋 (1,000만원 표준권장 ~ 5,000만원 MAX)
  const budgetPresets = [
    { label: '1,000만원 (표준권장)', value: 10000000, isRecommended: true },
    { label: '2,000만원', value: 20000000 },
    { label: '3,000만원', value: 30000000 },
    { label: '5,000만원 (MAX)', value: 50000000 }
  ];

  // 기간 프리셋 (1개월 표준권장 ~ 6개월)
  const periodPresets = [
    { label: '1개월 (표준권장)', value: 1, isRecommended: true },
    { label: '2개월', value: 2 },
    { label: '3개월', value: 3 },
    { label: '6개월', value: 6 }
  ];

  return (
    <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl space-y-6 text-slate-100">
      {/* 1. 스텝 안내 헤더 */}
      <div className="flex justify-between items-center border-b border-slate-700 pb-3">
        <h3 className="text-base font-bold text-white flex items-center">
          <span className="text-red-500 font-extrabold mr-1.5">1.</span> 캠페인 집행 예산 및 기간 설정
        </h3>
        <span className="text-xs bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full font-bold">
          표준권장: 1,000만원 / 1개월
        </span>
      </div>

      {/* 2. 예산 설정 섹션 */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-700 space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
            💳 총 집행 예산 (VAT 별도)
          </label>
          <div className="text-right">
            <span className="text-2xl font-black text-amber-300 font-mono">
              {(currentBudget / 10000).toLocaleString()}
            </span>
            <span className="text-xs font-bold text-slate-400 ml-1">만원 ({currentBudget.toLocaleString()}원)</span>
          </div>
        </div>

        {/* 슬라이더 컨트롤 (최대 5,000만원 제한) */}
        <div className="space-y-2">
          <input
            type="range"
            min={1000000}
            max={MAX_BUDGET}
            step={1000000}
            value={currentBudget}
            onChange={(e) => handleBudgetChange(e.target.value)}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
            <span>최소: 100만원</span>
            <span className="text-amber-400 font-bold">표준권장: 1,000만원</span>
            <span>최대: 5,000만원 (MAX)</span>
          </div>
        </div>

        {/* 직접 입력 및 빠른 선택 프리셋 버튼 */}
        <div className="pt-2 space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-bold">직접 입력 (만원):</span>
            <input
              type="number"
              min={100}
              max={5000}
              value={Math.round(currentBudget / 10000)}
              onChange={(e) => handleBudgetChange(Number(e.target.value) * 10000)}
              className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-3 py-1.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-amber-500"
              placeholder="예산 입력 (만원 단위)"
            />
            <span className="text-xs text-slate-400 font-bold">만원</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1">
            {budgetPresets.map((preset) => {
              const isActive = currentBudget === preset.value;
              return (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => handleBudgetChange(preset.value)}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-md'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. 기간 설정 섹션 */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-700 space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
            📅 약정 집행 기간
          </label>
          <div className="text-right">
            <span className="text-2xl font-black text-sky-300 font-mono">
              {currentMonths}
            </span>
            <span className="text-xs font-bold text-slate-400 ml-1">개월</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {periodPresets.map((preset) => {
            const isActive = currentMonths === preset.value;
            return (
              <button
                key={preset.value}
                type="button"
                onClick={() => handleMonthsChange(preset.value)}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                  isActive
                    ? 'bg-sky-500/20 text-sky-300 border-sky-500 shadow-md ring-1 ring-sky-500/40'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. 다음 단계 이동 버튼 */}
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