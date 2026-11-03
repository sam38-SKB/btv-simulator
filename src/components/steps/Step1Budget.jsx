import React from 'react';

export default function Step1BudgetPeriod({ state, actions, onNext }) {
  // 1. 요청하신 설정값만 정의 (최대 5,000만원 / 기본 1,000만원, 1개월)
  const MAX_BUDGET = 50000000;      // 최대 예산: 5,000만원
  const DEFAULT_BUDGET = 10000000;  // 기본 예산: 1,000만원
  const DEFAULT_MONTHS = 1;         // 기본 기간: 1개월

  // 2. 기존 state 값 참조 (없을 경우에만 기본 1,000만원 / 1개월 표출)
  const currentBudget = state.totalBudget || DEFAULT_BUDGET;
  const currentMonths = state.months || DEFAULT_MONTHS;

  // 3. 예산 버튼 프리셋 (1,000만원 ~ 5,000만원)
  const budgetPresets = [
    { label: '1,000만원 (표준)', value: 10000000 },
    { label: '2,000만원', value: 20000000 },
    { label: '3,000만원', value: 30000000 },
    { label: '5,000만원 (MAX)', value: 50000000 }
  ];

  // 4. 기간 버튼 프리셋 (1개월 ~ 6개월)
  const periodPresets = [
    { label: '1개월 (표준)', value: 1 },
    { label: '2개월', value: 2 },
    { label: '3개월', value: 3 },
    { label: '6개월', value: 6 }
  ];

  return (
    <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl space-y-6 text-slate-100">
      {/* 스텝 안내 헤더 */}
      <div className="flex justify-between items-center border-b border-slate-700 pb-3">
        <h3 className="text-base font-bold text-white flex items-center">
          <span className="text-red-500 font-extrabold mr-1.5">1.</span> 캠페인 집행 예산 및 기간 설정
        </h3>
        <span className="text-xs bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full font-bold">
          표준권장: 1,000만원 / 1개월
        </span>
      </div>

      {/* 예산 설정 섹션 */}
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

        {/* 슬라이더 컨트롤 (최대 5,000만원 제한) */}
        <div className="space-y-2">
          <input
            type="range"
            min={10000000}
            max={MAX_BUDGET}
            step={1000000}
            value={currentBudget > MAX_BUDGET ? MAX_BUDGET : currentBudget}
            onChange={(e) => actions.setTotalBudget(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
            <span className="text-amber-400 font-bold">1,000만원</span>
            <span>3,000만원</span>
            <span>최대 5,000만원</span>
          </div>
        </div>

        {/* 직접 입력 및 예산 선택 버튼 (기존 actions.setTotalBudget 직접 호출) */}
        <div className="pt-2 space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-bold">직접 입력 (만원):</span>
            <input
              type="number"
              min={1000}
              max={5000}
              step={100}
              value={Math.round(currentBudget / 10000)}
              onChange={(e) => actions.setTotalBudget(Number(e.target.value) * 10000)}
              className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-3 py-1.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-amber-500"
            />
            <span className="text-xs text-slate-400 font-bold">만원</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1">
            {budgetPresets.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => actions.setTotalBudget(preset.value)}
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
      </div>

      {/* 기간 설정 섹션 (기존 actions.setMonths 직접 호출) */}
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {periodPresets.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => actions.setMonths(preset.value)}
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