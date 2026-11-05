import React from 'react';

// VOD 3가지 상품 규격 및 단가 정의
const VOD_PRODUCTS = {
  PRE_ROLL: {
    id: 'PRE_ROLL',
    name: 'VOD Pre-roll',
    badge: 'Pre-roll',
    billing: 'CPV',
    desc: 'VOD 콘텐츠 재생 직전 스킵 없는 몰입형 동영상 광고',
    lengths: [
      { sec: 7, label: '7초 이하', price: 10, unitStr: '10원 / 회' },
      { sec: 15, label: '15초 이하', price: 20, unitStr: '20원 / 회' },
      { sec: 30, label: '30초 이하', price: 40, unitStr: '40원 / 회' }
    ]
  },
  POST_ROLL: {
    id: 'POST_ROLL',
    name: 'VOD Post-roll',
    badge: 'Post-roll',
    billing: 'CPM',
    desc: 'VOD 콘텐츠 시청 완료 직후 송출되는 엔딩 광고',
    lengths: [
      { sec: 15, label: '15초 이하', price: 15000, unitStr: '15,000원 / CPM' },
      { sec: 30, label: '15초 초과', price: 20000, unitStr: '20,000원 / CPM' }
    ]
  },
  MOBILE_BTV: {
    id: 'MOBILE_BTV',
    name: '모바일 B tv',
    badge: 'Mobile Btv',
    billing: 'CPM',
    desc: '모바일 B tv 앱 내 콘텐츠 시청 전/후 동영상 광고',
    lengths: [
      { sec: 60, label: '60초 이하', price: 10000, unitStr: '10,000원 / CPM' }
    ]
  }
};

// 실시간 광고(AD+) 상품 패키지 정의
const BTV_PACKAGES = [
  {
    id: 'STANDARD',
    name: 'AD+ 정밀 오디언스 패키지',
    desc: '100여 개 실시간 제휴 채널 대상 맞춤형 타겟팅 송출 (기본 패키지)',
    cpmStr: '5,000원 / CPM',
    tag: '추천'
  },
  {
    id: 'PREMIUM',
    name: 'AD+ 프라임 채널 집중 패키지',
    desc: '주요 보도/종편/인기 예능 채널 집중 편성 타겟팅',
    cpmStr: '7,000원 / CPM',
    tag: '프리미엄'
  }
];

export default function Step3Package({ state, actions, calculation, onPrev, onNext }) {
  const isVOD = state.platformMode === 'ADDR3';

  // VOD 전용 상태
  const currentVodType = state.vodType || 'PRE_ROLL';
  const selectedVodProduct = VOD_PRODUCTS[currentVodType] || VOD_PRODUCTS.PRE_ROLL;
  const currentVodLengthInfo = selectedVodProduct.lengths.find(l => l.sec === state.videoLength) || selectedVodProduct.lengths[0];

  // VOD 유형 변경 핸들러
  const handleVodTypeChange = (typeKey) => {
    const targetProd = VOD_PRODUCTS[typeKey];
    if (actions.setVodType) actions.setVodType(typeKey);
    if (actions.setProductMode) actions.setProductMode(typeKey);
    if (actions.setVideoLength && targetProd.lengths.length > 0) {
      actions.setVideoLength(targetProd.lengths[0].sec);
    }
  };

  return (
    <div className="space-y-6">
      {/* 스텝 상단 타이틀 */}
      <div className="border-b border-slate-800 pb-3">
        <h3 className="text-lg font-extrabold text-white flex items-center space-x-2">
          <span className={isVOD ? 'text-sky-400' : 'text-amber-400'}>Step 2.</span>
          <span>{isVOD ? '🎬 VOD 상품 선택 및 과금 방식 설정' : '📺 실시간 광고(AD+) 상품 및 보너스 선택'}</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          {isVOD 
            ? '광고 노출 목적에 맞는 VOD 유형(Pre-roll / Post-roll / 모바일 B tv) 및 소재 길이를 선택하세요.'
            : '실시간 방송 채널 타겟팅 패키지 및 집행 조건별 보너스 요율을 확인하세요.'}
        </p>
      </div>

      {isVOD ? (
        /* ================= 1. 로딩광고 VOD (ADDR3) 모드 ================= */
        <div className="space-y-6">
          {/* VOD 3가지 상품 유형 선택 */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-3">
              1. VOD 광고 유형 선택 (3가지)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.values(VOD_PRODUCTS).map((prod) => {
                const isSelected = currentVodType === prod.id;
                return (
                  <div
                    key={prod.id}
                    onClick={() => handleVodTypeChange(prod.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-sky-950/60 border-sky-400 ring-2 ring-sky-400/30 shadow-lg shadow-sky-500/10'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-black text-sm text-white">{prod.name}</span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        prod.billing === 'CPV' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      }`}>
                        {prod.billing} 방식
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                      {prod.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 소재 길이 및 단가 선택 */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center space-x-2">
                <span>2. 소재 길이 및 적용 단가</span>
                <span className="text-[11px] text-sky-400 font-normal">
                  ({selectedVodProduct.name} - 과금: <strong className="font-black">{selectedVodProduct.billing}</strong>)
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {selectedVodProduct.lengths.map((len) => {
                const isLenSelected = state.videoLength === len.sec;
                return (
                  <button
                    key={len.sec}
                    type="button"
                    onClick={() => actions.setVideoLength && actions.setVideoLength(len.sec)}
                    className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between space-y-1 ${
                      isLenSelected
                        ? 'bg-sky-500/20 border-sky-400 text-white shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-extrabold text-xs">{len.label}</span>
                      {isLenSelected && <span className="text-sky-400 text-xs">✓ 선택됨</span>}
                    </div>
                    <div className="font-mono text-sm font-black text-amber-300">
                      {len.unitStr}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* VOD 노출 요약 카드 */}
          <div className="bg-gradient-to-r from-sky-950/40 via-slate-900 to-slate-900 border border-sky-500/30 rounded-2xl p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-300">💡 예상 기본 노출 산출 요약</span>
              <span className="text-xs font-mono font-bold text-sky-400">
                집행예산: {(state.monthlyBudget / 10000).toLocaleString()}만원
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
              <div>
                <span className="block text-[11px] text-slate-400">선택 상품/길이</span>
                <span className="text-xs font-bold text-white mt-0.5 block">
                  {selectedVodProduct.badge} ({currentVodLengthInfo.label})
                </span>
              </div>
              <div>
                <span className="block text-[11px] text-slate-400">과금 방식 / 기준단가</span>
                <span className="text-xs font-bold text-amber-300 mt-0.5 block font-mono">
                  {selectedVodProduct.billing} ({currentVodLengthInfo.unitStr})
                </span>
              </div>
              <div>
                <span className="block text-[11px] text-slate-400">기본 제공 노출수</span>
                <span className="text-xs font-bold text-sky-300 mt-0.5 block font-mono">
                  {calculation?.baseImpressions ? calculation.baseImpressions.toLocaleString() : 0} 회
                </span>
              </div>
              <div>
                <span className="block text-[11px] text-slate-400">볼륨 보너스 요율</span>
                <span className="text-xs font-bold text-emerald-400 mt-0.5 block font-mono">
                  +{calculation?.bonusRate || 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ================= 2. 실시간 광고 AD+ (BTV) 모드 ================= */
        <div className="space-y-6">
          {/* 1. AD+ 패키지 라인업 선택 */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-3">
              1. 실시간 광고(AD+) 패키지 선택
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {BTV_PACKAGES.map((pkg) => {
                const isSelected = (state.productMode || 'STANDARD') === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => actions.setProductMode && actions.setProductMode(pkg.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/30 shadow-lg shadow-amber-500/10'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-black text-sm text-white">{pkg.name}</span>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        {pkg.tag}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed mb-3">
                      {pkg.desc}
                    </p>
                    <div className="text-xs font-mono font-bold text-amber-300 pt-2 border-t border-slate-800 flex justify-between">
                      <span>기준 단가:</span>
                      <span>{pkg.cpmStr}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. 볼륨 보너스 요율 산출 카드 */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="text-sm font-bold text-amber-400 flex items-center space-x-1.5">
                <span>📊</span>
                <span>실시간 방송 타깃 광고 (AD+) 볼륨 보너스 적용 현황</span>
              </h4>
              <span className="text-xs font-mono font-bold text-emerald-400">
                적용 보너스: +{calculation?.bonusRate || 0}%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850">
                <span className="block text-[11px] text-slate-400">월 집행 예산</span>
                <span className="text-sm font-black text-amber-300 mt-1 block font-mono">
                  {(state.monthlyBudget / 10000).toLocaleString()} 만원
                </span>
              </div>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850">
                <span className="block text-[11px] text-slate-400">약정 집행 기간</span>
                <span className="text-sm font-black text-white mt-1 block font-mono">
                  {state.months} 개월
                </span>
              </div>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850">
                <span className="block text-[11px] text-slate-400">총 보너스 노출 제공량</span>
                <span className="text-sm font-black text-emerald-400 mt-1 block font-mono">
                  {calculation?.bonusImpressions ? calculation.bonusImpressions.toLocaleString() : 0} 회
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 이전 / 다음 버튼 */}
      <div className="flex justify-between pt-4 border-t border-slate-800">
        <button
          type="button"
          onClick={onPrev}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs px-6 py-3 rounded-xl border border-slate-700 transition"
        >
          ◀ 이전 (예산 설정)
        </button>
        <button
          type="button"
          onClick={onNext}
          className={`font-black text-xs px-8 py-3 rounded-xl shadow-lg transition text-slate-950 ${
            isVOD 
              ? 'bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400' 
              : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400'
          }`}
        >
          다음 (타겟팅 설정) ▶
        </button>
      </div>
    </div>
  );
}