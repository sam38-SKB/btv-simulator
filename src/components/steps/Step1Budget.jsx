import React, { useEffect } from 'react';

export default function Step1BudgetPeriod({ state, actions, onNext }) {
  const DEFAULT_TOTAL_BUDGET = 10000000; // 1,000만원 (표준권장)
  const MAX_TOTAL_BUDGET = 50000000;     // 5,000만원 (최대)
  const MIN_TOTAL_BUDGET = 10000000;     // 1,000만원 (최소)
  const DEFAULT_MONTHS = 1;              // 1개월 (표준권장)

  // 1. 현재 선택된 약정 기간(개월 수) 구하기
  const currentMonths = Number(
    state?.months ||
    state?.period ||
    state?.executionMonths ||
    state?.contractPeriod ||
    state?.duration ||
    DEFAULT_MONTHS
  );

  // 2. 현재 총 집행 예산 구하기 (월예산 × 개월 수 중복 계산 방지)
  const getDisplayTotalBudget = () => {
    const rawTotal = state?.totalBudget || state?.budget;
    const rawMonthly = state?.monthlyBudget;

    if (rawTotal && Number(rawTotal) > 0) {
      // 상위 상태에서 3배 곱해진 경우 1,000만원~5,000만원 범위로 보정
      if (rawMonthly && rawTotal === rawMonthly * currentMonths && currentMonths > 1) {
        return Math.min(MAX_TOTAL_BUDGET, Math.max(MIN_TOTAL_BUDGET, Number(rawMonthly)));
      }
      return Math.min(MAX_TOTAL_BUDGET, Math.max(MIN_TOTAL_BUDGET, Number(rawTotal)));
    }
    if (rawMonthly && Number(rawMonthly) > 0) {
      return Math.min(MAX_TOTAL_BUDGET, Math.max(MIN_TOTAL_BUDGET, Number(rawMonthly)));
    }
    return DEFAULT_TOTAL_BUDGET;
  };

  const displayTotalBudget = getDisplayTotalBudget();

  // 3. 예산 및 기간 통합 안전 업데이트 함수 (월 예산 = 총 예산 / 개월 수)
  const updateBudgetAndPeriod = (targetTotalBudget, targetMonths) => {
    const validTotal = Math.min(MAX_TOTAL_BUDGET, Math.max(MIN_TOTAL_BUDGET, Number(targetTotalBudget) || DEFAULT_TOTAL_BUDGET));
    const validMonths = Number(targetMonths) || 1;
    const computedMonthly = Math.round(validTotal / validMonths); // 월 예산 분할 계산

    // 개월 수 변경 액션 전파
    if (typeof actions?.setMonths === 'function') actions.setMonths(validMonths);
    if (typeof actions?.setPeriod === 'function') actions.setPeriod(validMonths);
    if (typeof actions?.setExecutionMonths === 'function') actions.setExecutionMonths(validMonths);
    if (typeof actions?.setContractPeriod === 'function') actions.setContractPeriod(validMonths);

    // 예산 변경 액션 전파 (월예산을 정확히 분할하여 전달)
    if (typeof actions?.setTotalBudget === 'function') actions.setTotalBudget(validTotal);
    if (typeof actions?.setMonthlyBudget === 'function') actions.setMonthlyBudget(computedMonthly);
    if (typeof actions?.setBudget === 'function') actions.setBudget(validTotal);
  };

  // 최초 진입 시 1,000만원 / 1개월 표준 권장값 세팅
  useEffect(() => {
    updateBudgetAndPeriod(DEFAULT_TOTAL_BUDGET, DEFAULT_MONTHS);
  }, []);

  // 버튼 및 입력 핸들러
  const handleBudgetSelect = (newTotalBudget) => {
    updateBudgetAndPeriod(newTotalBudget, currentMonths);
  };

  const handlePeriodSelect = (newMonths) => {
    updateBudgetAndPeriod(displayTotalBudget, newMonths);
  };

  // 예산 빠른 선택 프리셋 (1,000만원 ~ 5,000만원)
  const budgetPresets = [
    { label: '1,000만원 (표준권장)', value: 10000000 },
    { label: '2,000만원', value: 20000000 },
    { label: '3,000만원', value: 30000000 },
    { label: '5,000만원 (MAX)', value: 50000000 }
  ];

  // 기간 빠른 선택 프리셋 (1개월 ~ 6개월)
  const periodPresets = [
    { label: '1개월 (표준권장)', value: 1 },
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
              {(displayTotalBudget / 10000).toLocaleString()}
            </span>
            <span className="text-xs font-bold text-slate-400 ml-1">만원 ({displayTotalBudget.toLocaleString()}원)</span>
          </div>
        </div>

        {/* 슬라이더 컨트롤 (최소 1,000만원 ~ 최대 5,000만원) */}
        <div className="space-y-2">
          <input
            type="range"
            min={MIN_TOTAL_BUDGET}
            max={MAX_TOTAL_BUDGET}
            step={1000000}
            value={displayTotalBudget}
            onChange={(e) => handleBudgetSelect(e.target.value)}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
            <span className="text-amber-400 font-bold">1,000만원 (표준)</span>
            <span>3,000만원</span>
            <span>5,000만원 (MAX)</span>
          </div>
        </div>

        {/* 직접 입력 및 빠른 선택 프리셋 버튼 */}
        <div className="pt-2 space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-bold">직접 입력 (만원):</span>
            <input
              type="number"
              min={1000}
              max={5000}
              step={100}
              value={Math.round(displayTotalBudget / 10000)}
              onChange={(e) => handleBudgetSelect(Number(e.target.value) * 10000)}
              className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-3 py-1.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-amber-500"
              placeholder="예산 입력 (만원 단위)"
            />
            <span className="text-xs text-slate-400 font-bold">만원</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1">
            {budgetPresets.map((preset) => {
              const isActive = displayTotalBudget === preset.value;
              return (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => handleBudgetSelect(preset.value)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-lg ring-2 ring-amber-300'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
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
                onClick={() => handlePeriodSelect(preset.value)}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                  isActive
                    ? 'bg-sky-500 text-slate-950 border-sky-400 font-black shadow-lg ring-2 ring-sky-300'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
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