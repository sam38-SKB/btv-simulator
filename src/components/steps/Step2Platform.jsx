import React from 'react';

export default function Step2Platform({ state, actions, onPrev, onNext }) {
  const handleSelect = (mode) => {
    actions.setPlatformMode(mode);
    actions.setProductMode('');
    actions.setChannelPackage('');
    actions.setVideoLength('');
  };

  return (
    <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl space-y-6">
      <div className="text-base font-bold text-slate-300 flex items-center border-b border-slate-700 pb-3">
        <span className="text-red-500 font-extrabold mr-1.5">2.</span> 매체 커버리지 선택 <span className="text-red-400 text-xs ml-3 font-normal">* 필수 선택</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => handleSelect('BTV')} className={`p-6 rounded-2xl border text-left transition ${state.platformMode === 'BTV' ? 'bg-gradient-to-r from-red-950/80 to-slate-900 border-red-500 text-white shadow-lg ring-2 ring-red-500' : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:text-white'}`}>
          <div className="font-bold text-xl flex items-center text-red-400">📺 B tv 단독 (700만 가구)</div>
          <div className="text-sm text-slate-300 mt-2">15/20/30/45/60초 (B tv AD+ 단독 송출)</div>
          <div className="text-xs text-amber-300 mt-3 font-bold">{state.platformMode === 'BTV' ? '✓ 현재 선택됨' : '선택하려면 클릭하세요'}</div>
        </button>
        <button onClick={() => handleSelect('ADDR3')} className={`p-6 rounded-2xl border text-left transition ${state.platformMode === 'ADDR3' ? 'bg-gradient-to-r from-sky-950/80 to-slate-900 border-sky-500 text-white shadow-lg ring-2 ring-sky-500' : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:text-white'}`}>
          <div className="font-bold text-xl flex items-center text-sky-400">🌐 IPTV 3사 Addr.TV PRIME (2,166만 가구)</div>
          <div className="text-sm text-slate-300 mt-2">6초~60초 (Essential Pack 10.0원 / All-in-one 8.0원)</div>
          <div className="text-xs text-amber-300 mt-3 font-bold">{state.platformMode === 'ADDR3' ? '✓ 현재 선택됨' : '선택하려면 클릭하세요'}</div>
        </button>
      </div>
      <div className="pt-4 flex justify-between">
        <button onClick={onPrev} className="bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-xl font-bold text-sm">◀ 이전</button>
        <button onClick={onNext} className="bg-red-600 hover:bg-red-500 text-white font-bold px-7 py-3 rounded-xl transition shadow-lg text-sm">다음 단계 (패키지/소재 선택) ▶</button>
      </div>
    </div>
  );
}