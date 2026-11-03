import React from 'react';

export default function Step5Estimate({
  state,
  actions,
  calculation,
  surchargeRules,
  promoRules,
  onPrev,
  onOpenProposal
}) {
  const isBtv = state.platformMode === 'BTV';

  // 프로모션 규칙 안전 추출
  const rawPromos = promoRules?.[state.platformMode] || (Array.isArray(promoRules) ? promoRules : []);
  const activePromos = rawPromos.filter(p => p.isActive !== false);
  const selectedPromoIds = state.selectedPromos || [];

  const handleTogglePromo = (promoId) => {
    if (selectedPromoIds.includes(promoId)) {
      actions.setSelectedPromos(selectedPromoIds.filter(id => id !== promoId));
    } else {
      actions.setSelectedPromos([...selectedPromoIds, promoId]);
    }
  };

  // 기존 calculation 객체의 모든 핵심 계산 지표 분리
  const {
    totalBudget = 0,
    monthlyBudget = 0,
    months = 1,
    basePrice = 0,
    baseImpressions = 0,
    volumeBonusRate = 0,
    volumeBonusImpressions = 0,
    totalSurchargeRate = 0,
    surchargeAmount = 0,
    promoBonusRate = 0,
    promoBonusImpressions = 0,
    totalImpressions = 0,
    totalValue = 0,
    surchargesBreakdown = []
  } = calculation || {};

  return (
    <div className="space-y-6 text-slate-100 pb-12">
      {/* 1. 상단 안내 헤더 및 버튼 */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${isBtv ? 'text-amber-300 border-amber-500/40 bg-amber-500/10' : 'text-sky-300 border-sky-500/40 bg-sky-500/10'}`}>
            {isBtv ? '📺 B tv 단독 시뮬레이션' : '🌐 IPTV 3사 PRIME 통합 시뮬레이션'}
          </span>
          <h2 className="text-xl font-black text-white mt-2">STEP 4. 최종 견적 산출 및 청약 신청</h2>
          <p className="text-xs text-slate-400 mt-1">
            설정하신 기간, 예산, 타겟팅 할증 및 특별 프로모션이 일체 반영된 최종 시뮬레이션 결과입니다.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onPrev}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 transition-all"
          >
            ← 이전 단계 (타겟팅)
          </button>
          <button
            onClick={onOpenProposal}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl shadow-xl transition-all flex items-center space-x-1.5 ring-2 ring-emerald-300"
          >
            <span>📝</span>
            <span>청약 신청서 작성하기</span>
          </button>
        </div>
      </div>

      {/* 2. 핵심 요약 지표 카드 4종 (기간, 예산, 노출수, 보너스, 서비스 가치) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
          <span className="text-xs text-slate-400 font-semibold">집행 기간 & 총 예산</span>
          <div className="text-xl font-black text-white font-mono">
            {months}개월 <span className="text-xs font-normal text-slate-400">({(monthlyBudget / 10000).toLocaleString()}만원/월)</span>
          </div>
          <div className="text-xs font-bold text-amber-300 font-mono mt-1">
            총 {(totalBudget / 10000).toLocaleString()} 만원
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
          <span className="text-xs text-slate-400 font-semibold">기본 계약 노출수</span>
          <div className="text-xl font-black text-slate-200 font-mono">
            {baseImpressions.toLocaleString()} <span className="text-xs font-normal text-slate-400">회</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            기본 단가: {basePrice}원 / 회
          </div>
        </div>

        <div className="bg-slate-900 border border-amber-500/30 p-5 rounded-2xl space-y-1">
          <span className="text-xs text-amber-400 font-semibold">보너스 노출합계 (볼륨+프로모션)</span>
          <div className="text-xl font-black text-amber-300 font-mono">
            +{(volumeBonusImpressions + promoBonusImpressions).toLocaleString()} <span className="text-xs font-normal text-amber-400/80">회</span>
          </div>
          <div className="text-[11px] text-amber-400/70 font-semibold mt-1">
            볼륨 +{volumeBonusRate}% | 프로모션 +{promoBonusRate}%
          </div>
        </div>

        <div className="bg-slate-900 border border-emerald-500/30 p-5 rounded-2xl space-y-1">
          <span className="text-xs text-emerald-400 font-semibold">최종 제공 가치 (보너스 포함)</span>
          <div className="text-xl font-black text-emerald-300 font-mono">
            {(totalValue / 10000).toLocaleString()} <span className="text-xs font-normal text-emerald-400/80">만원</span>
          </div>
          <div className="text-[11px] text-emerald-400/70 font-semibold mt-1">
            총 예상 노출: {totalImpressions.toLocaleString()} 회
          </div>
        </div>
      </div>

      {/* 3. 🎁 특별 프로모션 혜택 및 우대 조건 선택 (관리자 상세 설명 표시 연동) */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
        <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              🎁 특별 프로모션 혜택 및 우대 조건 선택
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              적용 가능한 프로모션을 선택하시면 보너스 노출량이 최종 산출 내역에 즉시 추가 반영됩니다.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-lg">
            선택됨: {selectedPromoIds.length}개
          </span>
        </div>

        {activePromos.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800">
            현재 활성화된 특별 프로모션 혜택이 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activePromos.map((promo) => {
              const isSelected = selectedPromoIds.includes(promo.id);
              return (
                <div
                  key={promo.id}
                  onClick={() => handleTogglePromo(promo.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 ${
                    isSelected
                      ? 'bg-slate-950 border-amber-500/60 ring-1 ring-amber-500/40 shadow-lg'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-950/80'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="accent-amber-500 w-4 h-4 rounded mt-0.5 cursor-pointer"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-white">{promo.name}</span>
                      <span className="font-mono text-xs font-black text-amber-400">
                        +{promo.rate}%
                      </span>
                    </div>
                    {/* 관리자 모드에서 입력한 promo.description 바인딩 */}
                    <p className="text-xs text-slate-300 font-medium leading-relaxed">
                      {promo.description || '특별 프로모션 우대 조건 혜택이 적용됩니다.'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. 세부 정산 & 할증/보너스 내역 산출 명세표 */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-3 flex items-center justify-between">
          <span>📊 상세 견적 및 서비스 가치 산출 명세</span>
          <span className="text-xs text-slate-400 font-normal">VAT 별도 기준</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase border-b border-slate-800">
              <tr>
                <th className="p-3">항목</th>
                <th className="p-3">조건 및 산출 기준</th>
                <th className="p-3 text-right">요율 / 금액</th>
                <th className="p-3 text-right">반영 노출수 / 가치</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200 font-medium">
              <tr>
                <td className="p-3 font-bold text-white">기본 집행 예산</td>
                <td className="p-3 text-slate-300">월 {(monthlyBudget / 10000).toLocaleString()}만원 × {months}개월</td>
                <td className="p-3 text-right font-mono text-white">{(totalBudget).toLocaleString()} 원</td>
                <td className="p-3 text-right font-mono text-slate-300">{baseImpressions.toLocaleString()} 회</td>
              </tr>

              <tr>
                <td className="p-3 font-bold text-amber-400">볼륨 보너스</td>
                <td className="p-3 text-slate-300">집행 예산 및 기간 구간별 우대 보너스</td>
                <td className="p-3 text-right font-mono text-amber-400 font-bold">+{volumeBonusRate}%</td>
                <td className="p-3 text-right font-mono text-amber-300 font-bold">+{volumeBonusImpressions.toLocaleString()} 회</td>
              </tr>

              <tr>
                <td className="p-3 font-bold text-purple-400">타겟팅 할증 요율</td>
                <td className="p-3 text-slate-300">
                  {surchargesBreakdown && surchargesBreakdown.length > 0 
                    ? surchargesBreakdown.map(s => `${s.name}(+${s.rate}%)`).join(', ')
                    : '기본 타겟팅 적용'}
                </td>
                <td className="p-3 text-right font-mono text-purple-400 font-bold">+{totalSurchargeRate}%</td>
                <td className="p-3 text-right font-mono text-purple-300 font-bold">
                  {surchargeAmount > 0 ? `+${surchargeAmount.toLocaleString()} 원` : '0 원'}
                </td>
              </tr>

              <tr>
                <td className="p-3 font-bold text-sky-400">선택 프로모션 혜택</td>
                <td className="p-3 text-slate-300">선택한 {selectedPromoIds.length}개 특별 프로모션 합산</td>
                <td className="p-3 text-right font-mono text-sky-400 font-bold">+{promoBonusRate}%</td>
                <td className="p-3 text-right font-mono text-sky-300 font-bold">+{promoBonusImpressions.toLocaleString()} 회</td>
              </tr>

              <tr className="bg-slate-950/80 font-black text-sm">
                <td className="p-4 text-emerald-400">최종합계 (제공 가치)</td>
                <td className="p-4 text-slate-300 text-xs font-normal">순 집행예산 대비 보너스 노출 포함 총 가치</td>
                <td className="p-4 text-right font-mono text-emerald-400 font-bold">{(totalValue).toLocaleString()} 원</td>
                <td className="p-4 text-right font-mono text-emerald-300 font-bold">{totalImpressions.toLocaleString()} 회</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}