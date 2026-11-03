import React, { useState } from 'react';

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
  
  // 현재 플랫폼(BTV / ADDR3)에 맞는 활성화된 프로모션 목록 추출
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

  return (
    <div className="space-y-6 text-slate-100">
      {/* 상단 스텝 안내 헤더 */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${isBtv ? 'text-amber-300 border-amber-500/40 bg-amber-500/10' : 'text-sky-300 border-sky-500/40 bg-sky-500/10'}`}>
            {isBtv ? '📺 B tv 단독 시뮬레이션' : '🌐 IPTV 3사 PRIME 통합 시뮬레이션'}
          </span>
          <h2 className="text-xl font-black text-white mt-2">STEP 4. 최종 견적 산출 및 청약 신청</h2>
          <p className="text-xs text-slate-400 mt-1">
            설정하신 조건에 따른 보너스, 타겟팅 할증, 프로모션 혜택이 적용된 최종 노출량 및 집행 가치를 확인하세요.
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

      {/* 🎁 프로모션 혜택 및 우대 조건 선택 섹션 */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
        <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              🎁 특별 프로모션 혜택 및 우대 조건 선택
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              적용 가능한 프로모션을 선택하시면 보너스 노출량이 자동으로 계산서에 추가 반영됩니다.
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
                    onChange={() => {}} // parent onClick 처리
                    className="accent-amber-500 w-4 h-4 rounded mt-0.5 cursor-pointer"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-white">{promo.name}</span>
                      <span className="font-mono text-xs font-black text-amber-400">
                        +{promo.rate}%
                      </span>
                    </div>

                    {/* 🌟 관리자 모드에서 입력한 상세 설명(description) 바인딩 */}
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

      {/* 최종 견적 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
          <span className="text-xs text-slate-400 font-semibold">총 집행 예산 (VAT 별도)</span>
          <div className="text-2xl font-black text-white font-mono">
            {calculation?.totalBudget?.toLocaleString() || 0} <span className="text-sm font-bold text-slate-400">원</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-amber-500/30 p-5 rounded-2xl space-y-1">
          <span className="text-xs text-amber-400 font-semibold">기본 + 보너스 예상 노출수</span>
          <div className="text-2xl font-black text-amber-300 font-mono">
            {calculation?.totalImpressions?.toLocaleString() || 0} <span className="text-sm font-bold text-amber-400/80">회</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-emerald-500/30 p-5 rounded-2xl space-y-1">
          <span className="text-xs text-emerald-400 font-semibold">총 제공 서비스 가치</span>
          <div className="text-2xl font-black text-emerald-300 font-mono">
            {((calculation?.totalValue || 0) / 10000).toLocaleString()} <span className="text-sm font-bold text-emerald-400/80">만원</span>
          </div>
        </div>
      </div>
    </div>
  );
}