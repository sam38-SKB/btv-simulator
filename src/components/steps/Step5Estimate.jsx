import React, { useState } from 'react';

// 소재 길이별 VOD 단가 (15초: 10원, 30초: 20원, 60초: 40원)
const VOD_PRICE_MAP = {
  15: 10,
  30: 20,
  60: 40,
};

export default function Step5Estimate({ state = {}, actions = {}, volInfo = {}, onPrev, onNext }) {
  // 1. 소재 길이 상태 관리 (상위 state 연동 또는 로컬 state fallback)
  const [localVodLength, setLocalVodLength] = useState(15);
  const vodLength = state.vodLength || localVodLength;

  const handleVodLengthChange = (val) => {
    const numVal = Number(val);
    if (typeof actions.setVodLength === 'function') {
      actions.setVodLength(numVal);
    } else {
      setLocalVodLength(numVal);
    }
  };

  // 2. 기본 예산 및 기간 산출
  const monthlyBudget = Number(state.monthlyBudget || 10000000);
  const durationMonths = Number(state.durationMonths || 1);
  const totalBudget = Number(state.totalBudget || (monthlyBudget * durationMonths));

  // 3. 프로모션 선택 상태 확인 (VOD 플러스 포함 여부)
  const selectedPromos = state.selectedPromos || [];
  const isVodPlusSelected = selectedPromos.includes('vod_plus') || Boolean(state.isVodPlus);

  // 4. VOD 플러스 요율 및 연산
  const vodPlusRate = Number(volInfo.vodPlusRate || state.vodPlusRate || 0.1); // 기본 10%
  const vodPlusBonusBudget = isVodPlusSelected ? totalBudget * vodPlusRate : 0;
  const vodUnitPrice = VOD_PRICE_MAP[vodLength] || 10;
  const vodPlusImpressions = Math.floor(vodPlusBonusBudget / vodUnitPrice);

  // 5. 볼륨 보너스 연산 (기존 기본 보너스)
  const volumeBonusRate = Number(volInfo.rate || 0);
  const volumeBonusBudget = totalBudget * volumeBonusRate;

  return (
    <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl space-y-6 text-slate-100">
      {/* 1. 스텝 안내 헤더 */}
      <div className="flex justify-between items-center border-b border-slate-700 pb-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center">
            <span className="text-red-500 font-extrabold mr-1.5">5.</span> 최종 시뮬레이션 견적서
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">설정한 집행 예산 및 프로모션 혜택 산출 결과입니다.</p>
        </div>
        <div className="text-right font-mono">
          <span className="text-xs text-slate-400 block">월 {(monthlyBudget / 10000).toLocaleString()}만원 × {durationMonths}개월</span>
          <span className="text-lg text-amber-300 font-black">총 집행 예산: {(totalBudget / 10000).toLocaleString()}만원</span>
        </div>
      </div>

      {/* 2. 요약 하이라이트 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
          <span className="text-xs text-slate-400 block mb-1">총 약정 청약 예산</span>
          <span className="text-xl font-bold font-mono text-white">{(totalBudget / 10000).toLocaleString()} 만원</span>
        </div>
        <div className="bg-slate-900 p-4 rounded-xl border border-emerald-500/40">
          <span className="text-xs text-emerald-400 block mb-1">기본 볼륨 보너스 혜택</span>
          <span className="text-xl font-bold font-mono text-emerald-300">
            +{(volumeBonusRate * 100).toFixed(0)}% <span className="text-xs font-normal text-slate-400">({(volumeBonusBudget / 10000).toLocaleString()}만원 상당)</span>
          </span>
        </div>
        <div className="bg-slate-900 p-4 rounded-xl border border-amber-500/40">
          <span className="text-xs text-amber-400 block mb-1">VOD 플러스 프로모션</span>
          <span className="text-xl font-bold font-mono text-amber-300">
            {isVodPlusSelected ? `+${(vodPlusRate * 100).toFixed(0)}% 적용` : '미선택'}
          </span>
        </div>
      </div>

      {/* 3. VOD 플러스 선택 시 조건부 상세 옵션 박스 */}
      {isVodPlusSelected && (
        <div className="bg-slate-900/90 border border-amber-500/50 p-4 rounded-xl space-y-3 shadow-inner">
          <div className="flex items-center justify-between pb-2 border-b border-slate-700">
            <div className="flex items-center space-x-2">
              <span className="text-base">🎬</span>
              <span className="text-xs font-bold text-amber-300">VOD 플러스 프로모션 소재 길이 설정</span>
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="vod-length-select" className="text-xs text-slate-300 font-semibold">소재 길이 선택:</label>
              <select
                id="vod-length-select"
                value={vodLength}
                onChange={(e) => handleVodLengthChange(e.target.value)}
                className="bg-slate-800 border border-slate-600 text-white font-bold text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value={15}>15초 (단가 10원)</option>
                <option value={30}>30초 (단가 20원)</option>
                <option value={60}>60초 (단가 40원)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
            <div className="bg-slate-800/90 p-3 rounded-lg border border-slate-700/80">
              <span className="text-slate-400 block text-[11px]">프로모션 적용 비율</span>
              <span className="text-emerald-400 font-bold font-mono text-sm">
                총 청약 금액의 +{(vodPlusRate * 100).toFixed(0)}%
              </span>
            </div>
            <div className="bg-slate-800/90 p-3 rounded-lg border border-slate-700/80">
              <span className="text-slate-400 block text-[11px]">VOD 플러스 산출 예산</span>
              <span className="text-amber-300 font-bold font-mono text-sm">
                {(vodPlusBonusBudget / 10000).toLocaleString()} 만원
              </span>
            </div>
            <div className="bg-slate-800/90 p-3 rounded-lg border border-amber-500/40">
              <span className="text-amber-400 block text-[11px]">보장 노출수 ({vodLength}초 / 단가 {vodUnitPrice}원)</span>
              <span className="text-amber-300 font-black font-mono text-base">
                {vodPlusImpressions.toLocaleString()} 회
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. 최종 내역 명세표 */}
      <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-3.5 bg-slate-800/60 border-b border-slate-700 font-bold text-xs text-slate-200">
          📋 견적 상세 명세표
        </div>
        <div className="divide-y divide-slate-800 text-xs">
          <div className="p-3.5 flex justify-between items-center">
            <span className="text-slate-300 font-semibold">기본 집행 약정 예산</span>
            <span className="font-mono font-bold text-white">{(totalBudget / 10000).toLocaleString()} 만원</span>
          </div>
          <div className="p-3.5 flex justify-between items-center">
            <span className="text-slate-300 font-semibold">볼륨 보너스 혜택 (+{(volumeBonusRate * 100).toFixed(0)}%)</span>
            <span className="font-mono font-bold text-emerald-400">+{(volumeBonusBudget / 10000).toLocaleString()} 만원 상당</span>
          </div>
          {isVodPlusSelected && (
            <div className="p-3.5 flex justify-between items-center bg-amber-500/5">
              <span className="text-amber-300 font-semibold flex items-center gap-1.5">
                <span>🎬</span> VOD 플러스 보장 노출 ({vodLength}초 기준)
              </span>
              <span className="font-mono font-bold text-amber-300">
                {vodPlusImpressions.toLocaleString()} 회 (단가 {vodUnitPrice}원 / {(vodPlusBonusBudget / 10000).toLocaleString()}만원)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 5. 이전 / 다음 단계 이동 버튼 */}
      <div className="pt-2 flex justify-between items-center">
        {onPrev ? (
          <button
            type="button"
            onClick={onPrev}
            className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold rounded-xl py-3 px-6 text-sm transition-all"
          >
            ◀ 이전 단계
          </button>
        ) : <div />}

        <button
          type="button"
          onClick={onNext}
          className="bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold rounded-xl py-3 px-8 text-sm shadow-xl transition-all"
        >
          견적 시뮬레이션 완료 ▶
        </button>
      </div>
    </div>
  );
}