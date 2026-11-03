import React from 'react';

export default function Step5Estimate({ state, actions, calculation, surchargeRules, promoRules, onPrev, onOpenProposal }) {
  const togglePromo = (id) => {
    if (state.selectedPromos.includes(id)) actions.setSelectedPromos(state.selectedPromos.filter(i => i !== id));
    else actions.setSelectedPromos([...state.selectedPromos, id]);
  };

  // 1. 선택된 매체(BTV / ADDR3)의 할증 및 프로모션 옵션 가져오기
  const activeSurcharges = surchargeRules[state.platformMode] || surchargeRules;
  const rawPromo = promoRules?.[state.platformMode] || (Array.isArray(promoRules) ? promoRules : []);
  const promoList = Array.isArray(rawPromo) ? rawPromo : (rawPromo && typeof rawPromo === 'object' ? Object.values(rawPromo) : []);

  // 2. 약정 집행 기간 개월 수 안전 추출 (이전 단계 선택값 연동)
  const executionMonths = state.months || state.period || state.duration || state.contractMonths || state.contractPeriod || state.executionMonths || state.month || calculation?.months || calculation?.period || 1;

  // 3. 'VOD 플러스' 프로모션 선택 여부 감지
  const isVodPlusSelected = (state.selectedPromos || []).some(id => {
    const p = promoList.find(item => item.id === id);
    const pName = p?.name || '';
    return pName.includes('VOD') || String(id).toLowerCase().includes('vod');
  });

  // 4. 하단 산출 내역 표 항목 필터링/적용 (VOD 플러스 선택 시에만 B tv VOD 내역 표출)
  const rawItems = calculation?.items || [];
  const hasVodInItems = rawItems.some(row => row.name && (row.name.includes('VOD') || row.name.includes('Vod')));

  let itemsToRender = rawItems.filter(row => {
    const isVodItem = row.name && (row.name.includes('VOD') || row.name.includes('Vod'));
    if (isVodItem) return isVodPlusSelected;
    return true;
  });

  // VOD 플러스를 선택했으나 기본 items에 VOD 항목이 없는 경우 표에 VOD 보너스 행 적용
  if (isVodPlusSelected && !hasVodInItems) {
    itemsToRender = [
      ...itemsToRender,
      {
        name: 'B tv VOD 플러스 (보너스)',
        videoLengthText: '15초/30초 소재',
        channelPackText: 'B tv 프리미엄 VOD',
        netPaymentStr: '0 원 (프로모션)',
        executionValueStr: '보너스 반영',
        netBonusSummaryText: 'VOD+ 보너스 적용',
        totalImpressions: '추가 노출 보장',
        effectiveCPV: '무료'
      }
    ];
  }

  return (
    <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl space-y-6">
      <div className="flex justify-between items-center border-b border-slate-700 pb-3">
        <h3 className="text-base font-bold text-white flex items-center">
          <span className="text-red-500 font-extrabold mr-1.5">5.</span> [{state.platformMode === 'BTV' ? 'B tv 단독' : 'IPTV 3사 PRIME'}] 할증 · 보너스 · 프로모션 세부 옵션
        </h3>
      </div>

      {/* 타겟팅 설정 (매체별 할증 조건) */}
      <div>
        <label className="text-sm font-bold text-slate-200 block mb-2">⚙️ 타겟팅 설정 (매체별 할증 조건)</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-900 p-3 rounded-xl border border-slate-700">
            <label className="text-slate-400 block mb-1">📍 지역 타겟팅</label>
            <select value={state.regionTarget} onChange={(e) => actions.setRegionTarget(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-bold">
              {(activeSurcharges?.region || []).map(r => <option key={r.id} value={r.id}>{r.name} {r.rate > 0 ? `(-${r.rate}%)` : '(-)'}</option>)}
            </select>
          </div>
          <div className="bg-slate-900 p-3 rounded-xl border border-slate-700">
            <label className="text-slate-400 block mb-1">⏰ 시간대 타겟팅</label>
            <select value={state.timeTarget} onChange={(e) => actions.setTimeTarget(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-bold">
              {(activeSurcharges?.time || []).map(t => <option key={t.id} value={t.id}>{t.name} {t.rate > 0 ? `(-${t.rate}%)` : '(-)'}</option>)}
            </select>
          </div>
          <div className="bg-slate-900 p-3 rounded-xl border border-slate-700">
            <label className="text-slate-400 block mb-1">📺 채널 타겟팅</label>
            <select value={state.channelTarget} onChange={(e) => actions.setChannelTarget(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-bold">
              {(activeSurcharges?.channel || []).map(c => <option key={c.id} value={c.id}>{c.name} {c.rate > 0 ? `(-${c.rate}%)` : '(-)'}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* 프로모션 혜택 및 우대 조건 선택 */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 text-sm space-y-3">
        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
          <span className="font-bold text-slate-200">🎁 프로모션 혜택 및 우대 조건 선택</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {promoList.map((p) => {
            const isChecked = state.selectedPromos.includes(p.id);
            return (
              <label key={p.id} className={`flex items-start space-x-3 cursor-pointer p-3 rounded-xl border transition ${isChecked ? 'bg-slate-800 border-red-500/80 text-white shadow-md' : 'bg-slate-900/80 border-slate-800 text-slate-400'}`}>
                <input type="checkbox" checked={isChecked} onChange={() => togglePromo(p.id)} className="mt-1 w-4 h-4 accent-red-500 rounded cursor-pointer" />
                <div>
                  <div className="font-bold text-sm text-slate-200">{p.name} {p.rate > 0 && <span className="text-xs text-emerald-400">(+{p.rate}%)</span>}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{p.description || p.desc}</div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* 청약 요약 KPI 카드 (집행 기간 포함 4컬럼 청약 명세 구성) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 border border-slate-700 p-4.5 rounded-2xl text-center shadow">
          <div className="text-xs text-slate-400 font-bold">📅 약정 집행 기간</div>
          <div className="text-2xl font-black text-sky-300 mt-1">{executionMonths}개월</div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono font-bold">선택 집행 기간</div>
        </div>
        <div className="bg-slate-800 border border-slate-700 p-4.5 rounded-2xl text-center shadow">
          <div className="text-xs text-slate-400 font-bold">💳 총 청약 집행 금액</div>
          <div className="text-2xl font-black text-amber-300 mt-1">{(state.totalBudget / 10000).toLocaleString()} 만원</div>
          <div className="text-[11px] text-emerald-400 mt-1 font-mono font-bold">총 제공가치: {calculation.totalValueStr || '-'}</div>
        </div>
        <div className="bg-slate-800 border border-slate-700 p-4.5 rounded-2xl text-center shadow">
          <div className="text-xs text-slate-400 font-bold">🎯 총 보장 노출수</div>
          <div className="text-2xl font-black text-white mt-1">{(calculation.grandTotalImp || 0).toLocaleString()} 회</div>
          <div className="text-[11px] text-sky-400 mt-1 font-mono font-bold">실질 CPV: {calculation.avgEffectiveCPV || '-'}원</div>
        </div>
        <div className="bg-slate-800 border border-emerald-500/60 p-4.5 rounded-2xl text-center shadow">
          <div className="text-xs text-emerald-400 font-bold">🎁 총 보너스율</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">총 {((calculation.netBonusRate || 0) * 100).toFixed(0)}%</div>
          <div className="text-xs text-amber-300 font-extrabold mt-1 font-mono">{calculation.netBonusSummary}</div>
        </div>
      </div>

      {/* 정밀 산출 내역서 표 */}
      <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl space-y-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900 text-slate-300 text-xs uppercase border-b border-slate-700">
            <tr>
              <th className="p-3.5">상품명</th>
              <th className="p-3.5">소재/패키지</th>
              <th className="p-3.5 text-amber-300">실제 지불 예산</th>
              <th className="p-3.5 text-emerald-400">총 제공 집행 가치</th>
              <th className="p-3.5">할증/보너스 산출식</th>
              <th className="p-3.5">노출 보장 수</th>
              <th className="p-3.5">실질 CPV</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700 text-slate-200 font-medium">
            {itemsToRender.map((row, idx) => (
              <tr key={idx}>
                <td className="p-3.5 font-bold text-white">{row.name}</td>
                <td className="p-3.5">{row.videoLengthText} ({row.channelPackText})</td>
                <td className="p-3.5 font-bold text-amber-300">{row.netPaymentStr}</td>
                <td className="p-3.5 font-bold text-emerald-400">{row.executionValueStr}</td>
                <td className="p-3.5 font-mono text-xs text-amber-300">{row.netBonusSummaryText}</td>
                <td className="p-3.5 font-bold text-white">{row.totalImpressions}</td>
                <td className="p-3.5 font-bold text-sky-400">{row.effectiveCPV}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pt-2 flex justify-center">
        <button onClick={onOpenProposal} className="w-full md:w-2/3 bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 text-white font-extrabold rounded-2xl py-4 px-8 shadow-2xl transition transform hover:scale-[1.01]">
          📄 견적서 출력 & 청약 제출하기
        </button>
      </div>

      <div className="pt-2 flex justify-between">
        <button onClick={onPrev} className="bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-xl font-bold text-sm">◀ 이전</button>
      </div>
    </div>
  );
}