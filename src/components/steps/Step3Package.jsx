import React from 'react';
import { 
  BTV_PACKAGE_BASE_CPV, 
  BTV_FIXED_20S_BASE_CPV, 
  ADDR3_PRIME_PACK_MAP, 
  VIDEO_LENGTH_INFO 
} from '../../constants/pricingData';

export default function Step3Package({ state, actions, calculation, onPrev, onNext }) {
  const isBtv = state.platformMode === 'BTV';

  // 소재 영상 길이 옵션
  const btvVideoLengths = ['15', '20', '30', '45', '60'];
  const addr3VideoLengths = ['6', '7', '15', '20', '30', '40', '45', '60'];
  const activeVideoLengths = isBtv ? btvVideoLengths : addr3VideoLengths;

  // VOD 3가지 상품 규격 정의 (ADDR3 모드)
  const vodTypes = [
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
            {vodTypes.map((vod) => {
              const isSelected = state.productMode === vod.id || (vod.id === 'PRE_ROLL' && !state.productMode);
              return (
                <button
                  key={vod.id}
                  type="button"
                  onClick={() => {
                    if (actions.setProductMode) actions.setProductMode(vod.id);
                    if (actions.setVodType) actions.setVodType(vod.id);
                  }}
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
        /* ================= [BTV] 실시간 광고(AD+) 패키지 선택 (기존 원본 복구) ================= */
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

      {/* 3. 소재 영상 길이 선택 (기존 원본 복구) */}
      <div className="space-y-2 pt-3 border-t border-slate-700/60">
        <label className="text-sm font-bold text-slate-200 block">
          소재 영상 길이 선택
        </label>
        <div className={`grid ${isBtv ? 'grid-cols-5' : 'grid-cols-4 sm:grid-cols-8'} gap-2`}>
          {activeVideoLengths.map((len) => {
            const isSelected = String(state.videoLength) === String(len);
            const multStr = VIDEO_LENGTH_INFO[len]?.[isBtv ? 'btvMultStr' : 'addr3MultStr'] || '기본';
            return (
              <button 
                key={len} 
                type="button"
                onClick={() => actions.setVideoLength(len)} 
                className={`py-3 rounded-xl border font-bold text-sm transition text-center ${
                  isSelected 
                    ? isBtv 
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md ring-1 ring-amber-300 font-black' 
                      : 'bg-sky-600 text-white border-sky-400 shadow-md ring-1 ring-sky-300'
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
      </div>

      {/* 4. 선택한 조건 및 산출 CPV 요약 카드 (기존 원본 복구) */}
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
              : (ADDR3_PRIME_PACK_MAP[state.productMode]?.name || state.productMode || 'VOD 기본')
            }
          </strong>
        </div>

        <div className="flex space-x-6 text-right w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-800 pt-2 sm:pt-0">
          <div>
            <div className="text-xs text-slate-400">산출 기본 CPV</div>
            <div className="text-lg font-bold text-slate-200">
              {calculation?.calcBaseCPV ?? 0} 원
            </div>
          </div>
          <div>
            <div className="text-xs text-emerald-400 font-bold">최종 적용 CPV</div>
            <div className="text-2xl font-black text-emerald-400">
              {calculation?.calcAppliedCPV ?? 0} 원
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