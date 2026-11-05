import React, { useEffect, useMemo } from 'react';
import { 
  BTV_PACKAGE_BASE_CPV, 
  BTV_FIXED_20S_BASE_CPV, 
  ADDR3_PRIME_PACK_MAP, 
  VIDEO_LENGTH_INFO 
} from '../../constants/pricingData';

// VOD 3가지 상품 유형 정의
const VOD_TYPES = [
  {
    id: 'PRE_ROLL',
    name: 'VOD Pre-roll',
    billing: 'CPV',
    desc: 'VOD 시청 직전 스킵 없는 동영상 광고',
    prices: '7초 이하 10원 / 15초 이하 20원 / 30초 이하 40원'
  },
  {
    id: 'POST_ROLL',
    name: 'VOD Post-roll',
    billing: 'CPM',
    desc: 'VOD 시청 완료 직후 엔딩 동영상 광고',
    prices: '15초 이하 15,000원 / 15초 초과 20,000원'
  },
  {
    id: 'MOBILE_BTV',
    name: '모바일 B tv',
    billing: 'CPM',
    desc: '모바일 B tv 앱 내 전/후 동영상 광고',
    prices: '60초 이하 10,000원'
  }
];

// VOD 유형별 하단 동적 소재 영상 길이 및 단가 옵션 맵
const VOD_LENGTH_OPTIONS = {
  PRE_ROLL: [
    { id: '7', label: '7초 이하', priceText: '10원' },
    { id: '15', label: '15초 이하', priceText: '20원' },
    { id: '30', label: '30초 이하', priceText: '40원' }
  ],
  POST_ROLL: [
    { id: '15', label: '15초 이하', priceText: '15,000원/CPM' },
    { id: '30', label: '15초 초과', priceText: '20,000원/CPM' }
  ],
  MOBILE_BTV: [
    { id: '60', label: '60초 이하', priceText: '10,000원/CPM' }
  ]
};

export default function Step3Package({ state, actions, calculation, onPrev, onNext }) {
  const isBtv = state.platformMode === 'BTV';

  // 실시간 BTV 모드 전용 소재 영상 길이
  const btvVideoLengths = ['15', '20', '30', '45', '60'];

  // 현재 선택된 VOD 광고 유형
  const currentVodType = state.productMode || state.vodType || 'PRE_ROLL';

  // 🌟 로딩광고(ADDR3) 처음 진입 시 VOD Pre-roll 및 15초 이하 기본 세팅
  useEffect(() => {
    if (!isBtv) {
      const validVodTypes = ['PRE_ROLL', 'POST_ROLL', 'MOBILE_BTV'];
      
      // VOD 유형이 미정되거나 지정값이 없을 경우 PRE_ROLL로 초기화
      if (!validVodTypes.includes(state.productMode)) {
        if (actions.setProductMode) actions.setProductMode('PRE_ROLL');
        if (actions.setVodType) actions.setVodType('PRE_ROLL');
        if (actions.setVideoLength) actions.setVideoLength('15');
      } else {
        // 선택된 VOD 유형에 맞춰 유효한 길이가 아닌 경우 기본 15초(또는 첫번째 길이) 세팅
        const validLengths = (VOD_LENGTH_OPTIONS[currentVodType] || []).map(o => o.id);
        if (!validLengths.includes(String(state.videoLength))) {
          if (actions.setVideoLength) actions.setVideoLength(validLengths[0] || '15');
        }
      }
    }
  }, [isBtv, state.productMode, state.videoLength, currentVodType, actions]);

  // VOD 유형 클릭 핸들러 (유형 변경 시 해당 유형의 첫 번째 영상 길이를 자동 선택)
  const handleSelectVodType = (vodId) => {
    if (actions.setProductMode) actions.setProductMode(vodId);
    if (actions.setVodType) actions.setVodType(vodId);
    
    const defaultLength = VOD_LENGTH_OPTIONS[vodId]?.[0]?.id || '15';
    if (actions.setVideoLength) actions.setVideoLength(defaultLength);
  };

  // VOD 과금 방식 및 단가 연산 (요약 카드 표기용)
  const vodPriceData = useMemo(() => {
    const bonusRate = calculation?.bonusRate || 0;
    
    if (currentVodType === 'POST_ROLL') {
      const base = String(state.videoLength) === '30' ? 20000 : 15000;
      const applied = Math.round(base * (1 - bonusRate / 100));
      return {
        billingLabel: 'CPM',
        basePrice: base,
        appliedPrice: applied
      };
    }
    
    if (currentVodType === 'MOBILE_BTV') {
      const base = 10000;
      const applied = Math.round(base * (1 - bonusRate / 100));
      return {
        billingLabel: 'CPM',
        basePrice: base,
        appliedPrice: applied
      };
    }

    // 기본: PRE_ROLL (CPV)
    let base = 20;
    if (String(state.videoLength) === '7') base = 10;
    else if (String(state.videoLength) === '15') base = 20;
    else if (String(state.videoLength) === '30') base = 40;

    const applied = Number((base * (1 - bonusRate / 100)).toFixed(1));
    return {
      billingLabel: 'CPV',
      basePrice: base,
      appliedPrice: applied
    };
  }, [currentVodType, state.videoLength, calculation]);

  return (
    <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl space-y-6">
      {/* 1. 상단 타이틀 */}
      <div className="flex justify-between items-center border-b border-slate-700 pb-3">
        <h3 className="text-base font-bold text-white flex items-center">
          <span className="text-amber-500 font-extrabold mr-1.5">2.</span> 
          {isBtv 
            ? '[실시간 광고(AD+)] 패키지 및 소재 길이 선택' 
            : '[로딩광고(VOD)] 상품 유형 및 소재 길이 선택'
          }
          <span className="text-red-400 text-xs ml-3 font-normal">필수 선택</span>
        </h3>
      </div>

      {/* 2. 패키지 / 상품 유형 선택 영역 */}
      {!isBtv ? (
        /* ================= [ADDR3] 로딩광고 VOD 3가지 유형 선택 ================= */
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-200 block">
            VOD 광고 유형 선택 (3가지)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {VOD_TYPES.map((vod) => {
              const isSelected = currentVodType === vod.id;
              return (
                <button
                  key={vod.id}
                  type="button"
                  onClick={() => handleSelectVodType(vod.id)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-sky-950 border-sky-400 text-white ring-1 ring-sky-400 shadow-lg'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm text-sky-300">{vod.name}</span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-sky-900/80 text-sky-200 border border-sky-700">
                      {vod.billing} 과금
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 mt-1">{vod.desc}</div>
                  <div className="text-xs text-amber-300 font-mono mt-2 font-bold leading-tight">
                    {vod.prices}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* ================= [BTV] 실시간 광고(AD+) 패키지 선택 ================= */
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-200 block">
            B tv 채널 패키지 선택
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Object.keys(BTV_PACKAGE_BASE_CPV).map((pk) => (
              <button 
                key={pk} 
                type="button"
                onClick={() => actions.setChannelPackage(pk)} 
                className={`p-3.5 rounded-xl border text-left transition ${
                  state.channelPackage === pk 
                    ? 'bg-slate-900 border-amber-500 text-white ring-1 ring-amber-500 shadow-md' 
                    : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                <div className="font-bold text-sm text-white">
                  {BTV_PACKAGE_BASE_CPV[pk].name}
                </div>
                <div className="text-xs text-amber-300 font-mono mt-1 font-semibold">
                  기본 CPV: {String(state.videoLength) === '20' 
                    ? BTV_FIXED_20S_BASE_CPV[pk] 
                    : BTV_PACKAGE_BASE_CPV[pk].baseCPV
                  }원
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. 소재 영상 길이 선택 (VOD 유형별 동적 변경) */}
      <div className="space-y-2 pt-3 border-t border-slate-700/60">
        <label className="text-sm font-bold text-slate-200 block">
          소재 영상 길이 선택
        </label>
        
        {isBtv ? (
          /* 실시간 광고(AD+) 모드 */
          <div className="grid grid-cols-5 gap-2">
            {btvVideoLengths.map((len) => {
              const isSelected = String(state.videoLength) === String(len);
              const multStr = VIDEO_LENGTH_INFO[len]?.btvMultStr || '기본';
              return (
                <button 
                  key={len} 
                  type="button"
                  onClick={() => actions.setVideoLength(len)} 
                  className={`py-3 rounded-xl border font-bold text-sm transition text-center ${
                    isSelected 
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md ring-1 ring-amber-300 font-black' 
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  {len}초
                  <span className="block text-xs font-normal opacity-80 mt-0.5">
                    ({multStr})
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          /* 로딩광고(VOD) 모드: 유형별 동적 선택 옵션 */
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(VOD_LENGTH_OPTIONS[currentVodType] || VOD_LENGTH_OPTIONS.PRE_ROLL).map((opt) => {
              const isSelected = String(state.videoLength) === String(opt.id);
              return (
                <button 
                  key={opt.id} 
                  type="button"
                  onClick={() => actions.setVideoLength(opt.id)} 
                  className={`py-3.5 px-4 rounded-xl border font-bold text-sm transition text-center flex flex-col items-center justify-center space-y-0.5 ${
                    isSelected 
                      ? 'bg-sky-600 text-white border-sky-400 shadow-md ring-1 ring-sky-300' 
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <span>{opt.label}</span>
                  <span className={`text-xs font-semibold ${isSelected ? 'text-amber-200' : 'text-amber-400'}`}>
                    ({opt.priceText})
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. 선택한 조건 및 산출 단가 요약 카드 */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm gap-3">
        <div>
          <span className="text-slate-400">선택한 조건:</span>{' '}
          <strong className="text-white text-base">
            {state.videoLength ? `${state.videoLength}초` : '소재 미선택'}
          </strong>{' '}
          /{' '}
          <strong className="text-amber-300 text-base">
            {isBtv 
              ? BTV_PACKAGE_BASE_CPV[state.channelPackage]?.name 
              : (VOD_TYPES.find(v => v.id === currentVodType)?.name || 'VOD Pre-roll')
            }
          </strong>
        </div>

        <div className="flex space-x-6 text-right w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-800 pt-2 sm:pt-0">
          <div>
            <div className="text-xs text-slate-400 font-medium">
              {isBtv ? '산출 기본 CPV' : `산출 기본 ${vodPriceData.billingLabel}`}
            </div>
            <div className="text-lg font-bold text-slate-200 font-mono">
              {isBtv 
                ? `${(calculation?.calcBaseCPV ?? 0).toLocaleString()} 원`
                : `${vodPriceData.basePrice.toLocaleString()} 원`
              }
            </div>
          </div>
          <div>
            <div className="text-xs text-emerald-400 font-bold">
              {isBtv ? '최종 적용 CPV' : `최종 적용 ${vodPriceData.billingLabel}`}
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              {isBtv 
                ? `${(calculation?.calcAppliedCPV ?? 0).toLocaleString()} 원`
                : `${vodPriceData.appliedPrice.toLocaleString()} 원`
              }
            </div>
          </div>
        </div>
      </div>

      {/* 5. 이전 / 다음 단계 버튼 */}
      <div className="pt-4 flex justify-between">
        <button 
          type="button"
          onClick={onPrev} 
          className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-6 py-3 rounded-xl font-bold text-sm transition"
        >
          ◀ 이전 (예산 설정)
        </button>
        <button 
          type="button"
          onClick={onNext} 
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black px-7 py-3 rounded-xl transition shadow-lg text-sm"
        >
          다음 단계 (오디언스 선택) ▶
        </button>
      </div>
    </div>
  );
}