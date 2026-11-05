import React from 'react';
import { BTV_PACKAGE_BASE_CPV, BTV_FIXED_20S_BASE_CPV, ADDR3_PRIME_PACK_MAP, VIDEO_LENGTH_INFO } from '../../constants/pricingData';

export default function Step3Package({ state, actions, calculation, onPrev, onNext }) {
  const btvVideoLengths = ['15', '20', '30', '45', '60'];
  const addr3VideoLengths = ['6', '15', '20', '30', '40', '45', '60'];
  const activeVideoLengths = state.platformMode === 'BTV' ? btvVideoLengths : addr3VideoLengths;

  return (
    <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl space-y-6">
      <div className="flex justify-between items-center border-b border-slate-700 pb-3">
        <h3 className="text-base font-bold text-white flex items-center">
          <span className="text-red-500 font-extrabold mr-1.5">3.</span> {state.platformMode === 'BTV' ? '[B tv 단독] 패키지 및 소재 길이 선택' : '[IPTV 3사 PRIME] 패키지 구분 및 소재 길이 선택'} <span className="text-red-400 text-xs ml-3 font-normal">* 필수 선택</span>
        </h3>
      </div>
      {state.platformMode === 'ADDR3' ? (
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-200">IPTV 3사 PRIME 패키지 선택</label>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => actions.setProductMode('PRIME_ESSENTIAL')} className={`p-4 rounded-xl border text-left transition ${state.productMode === 'PRIME_ESSENTIAL' ? 'bg-sky-950 border-sky-500 text-white ring-1 ring-sky-500' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>
              <div className="font-bold text-base text-sky-300">PRIME Essential Pack</div>
              <div className="text-sm text-slate-300 mt-1">시청률 상위 30개 주요 MP 채널</div>
              <div className="text-sm text-amber-300 font-mono mt-1 font-bold">15초 공시가 10.0원 (3Q 특가 3.6~4.0원)</div>
            </button>
            <button onClick={() => actions.setProductMode('PRIME_ALL_IN_ONE')} className={`p-4 rounded-xl border text-left transition ${state.productMode === 'PRIME_ALL_IN_ONE' ? 'bg-sky-950 border-sky-500 text-white ring-1 ring-sky-500' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>
              <div className="font-bold text-base text-sky-300">PRIME All-in-one</div>
              <div className="text-sm text-slate-300 mt-1">IPTV 3사 117개 전체 채널 커버리지</div>
              <div className="text-sm text-amber-300 font-mono mt-1 font-bold">15초 공시가 8.0원</div>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-200">B tv 채널 패키지 선택</label>
          <div className="grid grid-cols-3 gap-3">
            {Object.keys(BTV_PACKAGE_BASE_CPV).map((pk) => (
              <button key={pk} onClick={() => actions.setChannelPackage(pk)} className={`p-3.5 rounded-xl border text-left transition ${state.channelPackage === pk ? 'bg-slate-900 border-red-500 text-white ring-1 ring-red-500' : 'bg-slate-900/60 border-slate-700 text-slate-400'}`}>
                <div className="font-bold text-sm text-white">{BTV_PACKAGE_BASE_CPV[pk].name}</div>
                <div className="text-xs text-amber-300 font-mono mt-1 font-semibold">기본 CPV: {state.videoLength === '20' ? BTV_FIXED_20S_BASE_CPV[pk] : BTV_PACKAGE_BASE_CPV[pk].baseCPV}원</div>
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="space-y-2 pt-3 border-t border-slate-700/60">
        <label className="text-sm font-bold text-slate-200">소재 영상 길이 선택</label>
        <div className={`grid ${state.platformMode === 'BTV' ? 'grid-cols-5' : 'grid-cols-7'} gap-2`}>
          {activeVideoLengths.map((len) => (
            <button key={len} onClick={() => actions.setVideoLength(len)} className={`py-3 rounded-xl border font-bold text-sm transition text-center ${state.videoLength === len ? 'bg-red-600 text-white border-red-500 shadow-md ring-1 ring-red-400' : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'}`}>
              {len}초
              <span className="block text-xs font-normal opacity-80 mt-0.5">({VIDEO_LENGTH_INFO[len]?.[state.platformMode === 'BTV' ? 'btvMultStr' : 'addr3MultStr']})</span>
            </button>
          ))}
        </div>
      </div>
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-700 flex justify-between items-center text-sm">
        <div>
          <span className="text-slate-400">선택한 조건:</span> <strong className="text-white text-base">{state.videoLength ? `${state.videoLength}초` : '소재 미선택'}</strong> / <strong className="text-amber-300 text-base">{state.platformMode === 'BTV' ? BTV_PACKAGE_BASE_CPV[state.channelPackage]?.name : ADDR3_PRIME_PACK_MAP[state.productMode]?.name}</strong>
        </div>
        <div className="flex space-x-6 text-right">
          <div><div className="text-xs text-slate-400">산출 기본 CPV</div><div className="text-lg font-bold text-slate-200">{calculation.calcBaseCPV} 원</div></div>
          <div><div className="text-xs text-emerald-400 font-bold">최종 적용 CPV</div><div className="text-2xl font-black text-emerald-400">{calculation.calcAppliedCPV} 원</div></div>
        </div>
      </div>
      <div className="pt-4 flex justify-between">
        <button onClick={onPrev} className="bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-xl font-bold text-sm">◀ 이전</button>
        <button onClick={onNext} className="bg-red-600 hover:bg-red-500 text-white font-bold px-7 py-3 rounded-xl transition shadow-lg text-sm">다음 단계 (오디언스 선택) ▶</button>
      </div>
    </div>
  );
}