import React, { useState, useEffect } from 'react';
import { DEFAULT_BONUS_RULES, DEFAULT_SURCHARGE_RULES, DEFAULT_PROMO_RULES } from '../../constants/defaultRules';

export default function AdminPanel({ 
  users = [], 
  proposals = [],
  bonusRules = DEFAULT_BONUS_RULES, 
  surchargeRules = DEFAULT_SURCHARGE_RULES, 
  promoRules = DEFAULT_PROMO_RULES, 
  onSaveRules,
  onStatusChange, 
  onDeleteUser, 
  onUpdateProposalStatus,
  onDeleteProposal,
  onBackToDashboard
}) {
  // 1. 임시 편집용 로컬 상태 (Local Draft State)
  const [draftBonus, setDraftBonus] = useState(bonusRules);
  const [draftSurcharge, setDraftSurcharge] = useState(surchargeRules);
  const [draftPromo, setDraftPromo] = useState(promoRules);
  const [isDirty, setIsDirty] = useState(false);
  const [selectedDetailProp, setSelectedDetailProp] = useState(null);

  // DB에서 수신된 props가 변경되면 로컬 드래프트에 반영
  useEffect(() => { setDraftBonus(bonusRules); }, [bonusRules]);
  useEffect(() => { setDraftSurcharge(surchargeRules); }, [surchargeRules]);
  useEffect(() => { setDraftPromo(promoRules); }, [promoRules]);

  const safeBonusRules = {
    BTV: (draftBonus && draftBonus.BTV && Array.isArray(draftBonus.BTV)) ? draftBonus.BTV : DEFAULT_BONUS_RULES.BTV,
    ADDR3: (draftBonus && draftBonus.ADDR3 && Array.isArray(draftBonus.ADDR3)) ? draftBonus.ADDR3 : DEFAULT_BONUS_RULES.ADDR3
  };

  const safeSurchargeRules = {
    BTV: (draftSurcharge && draftSurcharge.BTV) ? draftSurcharge.BTV : DEFAULT_SURCHARGE_RULES.BTV,
    ADDR3: (draftSurcharge && draftSurcharge.ADDR3) ? draftSurcharge.ADDR3 : DEFAULT_SURCHARGE_RULES.ADDR3
  };

  const safePromoRules = {
    BTV: (draftPromo && draftPromo.BTV && Array.isArray(draftPromo.BTV)) ? draftPromo.BTV : DEFAULT_PROMO_RULES.BTV,
    ADDR3: (draftPromo && draftPromo.ADDR3 && Array.isArray(draftPromo.ADDR3)) ? draftPromo.ADDR3 : DEFAULT_PROMO_RULES.ADDR3
  };

  const surchargeCategoryNames = {
    region: '📍 지역 타겟팅',
    time: '⏰ 시간대 타겟팅',
    channel: '📺 채널 타겟팅'
  };

  // 💾 [저장 버튼] 클릭 이벤트 핸들러
  const handleSaveAll = async () => {
    if (onSaveRules) {
      await onSaveRules(draftBonus, draftSurcharge, draftPromo);
      setIsDirty(false);
      alert('모든 정책 및 요율이 Firebase DB에 성공적으로 저장되었습니다!');
    }
  };

  // 보너스 변경
  const handleBonusChange = (platform, actionType, index, field, value) => {
    setIsDirty(true);
    setDraftBonus(prev => {
      const updated = { ...prev };
      const list = [...(updated[platform] || [])];
      if (actionType === 'ADD') list.push({ minMonthlyBudget: 10000000, minMonths: 1, rate: 10 });
      else if (actionType === 'DELETE') list.splice(index, 1);
      else if (actionType === 'CHANGE') list[index] = { ...list[index], [field]: value };
      updated[platform] = list;
      return updated;
    });
  };

  // 할증 요율 변경
  const handleSurchargeChange = (platform, category, actionType, index, field, value) => {
    setIsDirty(true);
    setDraftSurcharge(prev => {
      const updated = { ...prev };
      const platformObj = { ...(updated[platform] || DEFAULT_SURCHARGE_RULES[platform]) };
      const list = [...(platformObj[category] || [])];

      if (actionType === 'ADD') list.push({ id: `S_${Date.now()}`, name: '신규 할증 조건', rate: 10 });
      else if (actionType === 'DELETE') list.splice(index, 1);
      else if (actionType === 'CHANGE') list[index] = { ...list[index], [field]: value };

      platformObj[category] = list;
      updated[platform] = platformObj;
      return updated;
    });
  };

  // 프로모션 변경
  const handlePromoChange = (platform, actionType, index, field, value) => {
    setIsDirty(true);
    setDraftPromo(prev => {
      const updated = { ...prev };
      const list = [...(updated[platform] || [])];
      if (actionType === 'ADD') list.push({ id: `${platform}_${Date.now()}`, name: '신규 프로모션', desc: '설명 입력', rate: 10, type: 'RATE' });
      else if (actionType === 'DELETE') list.splice(index, 1);
      else if (actionType === 'CHANGE') list[index] = { ...list[index], [field]: value };
      updated[platform] = list;
      return updated;
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-slate-100 pb-20">
      {/* 헤더 바 */}
      <div className="bg-gradient-to-r from-purple-900/60 to-slate-800 border border-purple-700 p-6 rounded-2xl shadow-xl flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-purple-200">🛡️ B tv Agent 시스템 관리자 페이지</h2>
          <p className="text-sm text-purple-300/80 mt-1">
            요율 편집 후 우측 상단의 <span className="text-amber-400 font-bold">[DB 저장하기]</span> 버튼을 눌러주세요.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleSaveAll} 
            className={`px-5 py-2.5 rounded-xl font-black text-sm shadow-xl transition-all flex items-center space-x-2 ${
              isDirty ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 animate-bounce' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            <span>💾 DB에 정책 저장하기</span>
            {isDirty && <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">수정됨</span>}
          </button>
          <button onClick={onBackToDashboard} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm">
            📊 시뮬레이터로 이동
          </button>
        </div>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-4 gap-4 text-center text-xs">
        <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl">
          <div className="text-slate-400 font-bold">전체 사용자</div>
          <div className="text-2xl font-black text-white mt-1">{(users || []).length} 명</div>
        </div>
        <div className="bg-slate-800 border border-amber-700/60 p-4 rounded-2xl">
          <div className="text-amber-400 font-bold">가입 승인 대기</div>
          <div className="text-2xl font-black text-amber-300 mt-1">{(users || []).filter(u => u.status === 'PENDING').length} 명</div>
        </div>
        <div className="bg-slate-800 border border-sky-700/60 p-4 rounded-2xl">
          <div className="text-sky-400 font-bold">제출된 청약/견적서</div>
          <div className="text-2xl font-black text-sky-300 mt-1">{(proposals || []).length} 건</div>
        </div>
        <div className="bg-slate-800 border border-emerald-700/60 p-4 rounded-2xl">
          <div className="text-emerald-400 font-bold">청약 완료 금액</div>
          <div className="text-2xl font-black text-emerald-300 mt-1">
            {((proposals || []).reduce((acc, cur) => acc + (cur.totalBudget || 0), 0) / 10000).toLocaleString()} 만원
          </div>
        </div>
      </div>

      {/* 제출된 청약/견적서 목록 */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4 overflow-x-auto">
        <h3 className="text-lg font-bold text-amber-400 flex items-center">
          <span className="mr-2">📋</span> 제출된 광고 청약 및 견적서 관리 목록
        </h3>

        {proposals.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs bg-slate-900 rounded-xl border border-slate-750">
            현재 제출된 청약/견적서 내역이 없습니다.
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-300 uppercase border-b border-slate-700">
              <tr>
                <th className="p-3">제출일시</th>
                <th className="p-3">담당자(회사)</th>
                <th className="p-3">매체구분</th>
                <th className="p-3 text-amber-300">집행예산</th>
                <th className="p-3 text-emerald-400">총제공가치</th>
                <th className="p-3">상태</th>
                <th className="p-3 text-center">상세보기</th>
                <th className="p-3 text-center">상태제어</th>
                <th className="p-3 text-center">삭제</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700 text-slate-200">
              {proposals.map(p => (
                <tr key={p.id}>
                  <td className="p-3 text-slate-400 font-mono">{p.createdAt}</td>
                  <td className="p-3 font-bold">{p.userName} <span className="text-slate-400 font-normal">({p.company})</span></td>
                  <td className="p-3">{p.platformMode === 'BTV' ? 'B tv 단독' : 'IPTV 3사 PRIME'}</td>
                  <td className="p-3 font-bold text-amber-300">{(p.totalBudget / 10000).toLocaleString()} 만원</td>
                  <td className="p-3 font-bold text-emerald-400">{p.totalValueStr}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${p.status === 'APPROVED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : p.status === 'REJECTED' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-amber-950 text-amber-400 border border-amber-800'}`}>
                      {p.status === 'APPROVED' ? '승인완료' : p.status === 'REJECTED' ? '청약반려' : '접수검토중'}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button onClick={() => setSelectedDetailProp(p)} className="bg-slate-700 hover:bg-slate-600 text-xs px-2.5 py-1 rounded font-bold">열람</button>
                  </td>
                  <td className="p-3 text-center space-x-1">
                    <button onClick={() => onUpdateProposalStatus && onUpdateProposalStatus(p.id, 'APPROVED')} className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded">승인</button>
                    <button onClick={() => onUpdateProposalStatus && onUpdateProposalStatus(p.id, 'REJECTED')} className="px-2 py-1 bg-red-800 hover:bg-red-700 text-white font-bold rounded">반려</button>
                  </td>
                  <td className="p-3 text-center">
                    <button onClick={() => onDeleteProposal && onDeleteProposal(p.id)} className="text-red-400 font-bold hover:text-red-300">✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 볼륨 보너스 구간 관리 */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex justify-between items-center border-b border-slate-700 pb-3">
          <h3 className="text-lg font-bold text-white flex items-center">
            <span className="text-amber-400 mr-2">📊</span> [월 집행 금액 & 집행 기간] 매체별 볼륨 보너스 구간 설정
          </h3>
          <button onClick={() => { setDraftBonus(DEFAULT_BONUS_RULES); setIsDirty(true); }} className="bg-red-900/60 hover:bg-red-800 text-red-200 text-xs font-bold px-3 py-1.5 rounded-lg border border-red-700">
            🔄 기본값으로 재설정
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {['BTV', 'ADDR3'].map(platform => (
            <div key={platform} className="bg-slate-900 border border-slate-700 p-4 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="font-bold text-amber-400 text-sm">
                  {platform === 'BTV' ? '📺 B tv 단독 볼륨 보너스' : '🌐 IPTV 3사 PRIME 볼륨 보너스'}
                </span>
                <button onClick={() => handleBonusChange(platform, 'ADD')} className="bg-amber-600 hover:bg-amber-500 text-white px-3 py-1 rounded-lg font-bold text-xs shadow">
                  + 구간 추가
                </button>
              </div>

              {(safeBonusRules[platform] || []).map((rule, idx) => (
                <div key={idx} className="bg-slate-800 p-3.5 rounded-xl border border-slate-700 space-y-2.5 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200 text-xs">구간 {idx + 1}</span>
                    <button onClick={() => handleBonusChange(platform, 'DELETE', idx)} className="text-red-400 font-bold text-xs hover:text-red-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                      ✕ 삭제
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-slate-300">
                    <div>
                      <label className="block text-[11px] text-slate-400 font-bold mb-1">최소 월예산</label>
                      <div className="flex items-center space-x-1">
                        <input type="number" step={500} value={rule.minMonthlyBudget ? rule.minMonthlyBudget / 10000 : 0} onChange={(e) => handleBonusChange(platform, 'CHANGE', idx, 'minMonthlyBudget', Number(e.target.value) * 10000)} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-2.5 py-1.5 text-right font-bold text-white text-xs" />
                        <span className="text-[11px] text-slate-400 font-bold whitespace-nowrap">만원</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 font-bold mb-1">최소 기간</label>
                      <select value={rule.minMonths || 1} onChange={(e) => handleBonusChange(platform, 'CHANGE', idx, 'minMonths', Number(e.target.value))} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-2 py-1.5 font-bold text-white text-xs">
                        <option value={1}>1개월</option>
                        <option value={2}>2개월</option>
                        <option value={3}>3개월</option>
                        <option value={6}>6개월</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 font-bold mb-1">보너스율</label>
                      <div className="flex items-center space-x-1">
                        <input type="number" step={5} value={rule.rate || 0} onChange={(e) => handleBonusChange(platform, 'CHANGE', idx, 'rate', Number(e.target.value))} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-2 py-1.5 text-right font-bold text-emerald-400 text-xs" />
                        <span className="text-[11px] font-bold text-emerald-400">%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 타겟팅 할증 요율 관리 */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex justify-between items-center border-b border-slate-700 pb-3">
          <h3 className="text-lg font-bold text-white flex items-center">
            <span className="text-red-400 mr-2">⚙️</span> [매체별 타겟팅 할증 요율 관리]
          </h3>
          <button onClick={() => { setDraftSurcharge(DEFAULT_SURCHARGE_RULES); setIsDirty(true); }} className="bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-600">
            🔄 기본값으로 재설정
          </button>
        </div>

        <div className="space-y-6">
          {['BTV', 'ADDR3'].map(platform => (
            <div key={platform} className="bg-slate-900 border border-slate-700 p-5 rounded-xl space-y-4">
              <div className="font-bold text-amber-400 text-sm border-b border-slate-800 pb-2">
                {platform === 'BTV' ? '📺 B tv 단독 타겟팅 할증 요율' : '🌐 IPTV 3사 PRIME 타겟팅 할증 요율'}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {['region', 'time', 'channel'].map(cat => (
                  <div key={cat} className="bg-slate-800 p-3.5 rounded-xl border border-slate-700 space-y-3 text-xs">
                    <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                      <span className="font-bold text-slate-200">{surchargeCategoryNames[cat]}</span>
                      <button onClick={() => handleSurchargeChange(platform, cat, 'ADD')} className="bg-slate-700 hover:bg-slate-600 text-white px-2 py-0.5 rounded font-bold text-[11px]">
                        + 추가
                      </button>
                    </div>

                    {(((safeSurchargeRules[platform] || {})[cat]) || []).map((rule, idx) => (
                      <div key={rule.id || idx} className="bg-slate-900 p-2.5 rounded-lg border border-slate-750 space-y-1.5">
                        <div className="flex items-center space-x-2">
                          <input type="text" value={rule.name || ''} onChange={(e) => handleSurchargeChange(platform, cat, 'CHANGE', idx, 'name', e.target.value)} className="flex-1 bg-slate-800 border border-slate-600 rounded px-2 py-1 font-bold text-white text-xs" />
                          {rule.id !== 'ALL' && (
                            <button onClick={() => handleSurchargeChange(platform, cat, 'DELETE', idx)} className="text-red-400 font-bold px-1 hover:text-red-300">✕</button>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-slate-400 text-[11px]">
                          <span>할증율:</span>
                          <div className="flex items-center space-x-1">
                            <input type="number" step={5} value={rule.rate || 0} onChange={(e) => handleSurchargeChange(platform, cat, 'CHANGE', idx, 'rate', Number(e.target.value))} className="w-16 bg-slate-800 border border-slate-600 rounded px-2 py-0.5 text-right font-bold text-red-400 text-xs" />
                            <span className="font-bold text-red-400">%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 사용자 관리 표 */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4 overflow-x-auto">
        <h3 className="text-lg font-bold text-white mb-2">사용자 승인 및 계정 관리</h3>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900 text-slate-300 text-xs uppercase border-b border-slate-700">
            <tr>
              <th className="p-3">신청일</th>
              <th className="p-3">담당자(ID)</th>
              <th className="p-3">회사명</th>
              <th className="p-3">연락처/이메일</th>
              <th className="p-3">상태</th>
              <th className="p-3 text-center">승인 제어</th>
              <th className="p-3 text-center">삭제</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700 text-slate-200">
            {(users || []).map(u => (
              <tr key={u.id}>
                <td className="p-3 text-xs text-slate-400 font-mono">{u.createdAt}</td>
                <td className="p-3 font-bold">{u.name} <span className="text-xs text-slate-400 font-normal">({u.id})</span></td>
                <td className="p-3 font-bold text-amber-300">{u.company}</td>
                <td className="p-3 text-xs"><div>{u.phone}</div><div className="text-slate-400">{u.email}</div></td>
                <td className="p-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${u.status === 'APPROVED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'}`}>{u.status}</span>
                </td>
                <td className="p-3 text-center space-x-2">
                  {u.role !== 'ADMIN' && (
                    <>
                      <button onClick={() => onStatusChange && onStatusChange(u.id, 'APPROVED')} className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg">승인</button>
                      <button onClick={() => onStatusChange && onStatusChange(u.id, 'REJECTED')} className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg">거절</button>
                    </>
                  )}
                </td>
                <td className="p-3 text-center">
                  {u.role !== 'ADMIN' && <button onClick={() => onDeleteUser && onDeleteUser(u.id)} className="bg-red-900/60 hover:bg-red-800 text-red-200 px-2.5 py-1 text-xs font-bold rounded-lg">삭제</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 청약 상세 모달 */}
      {selectedDetailProp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-2xl rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3">
              <h3 className="font-bold text-amber-400 text-lg">📄 제출 청약 상세 정보</h3>
              <button onClick={() => setSelectedDetailProp(null)} className="text-slate-400 hover:text-white font-bold text-lg">✕</button>
            </div>
            <div className="space-y-2 text-xs text-slate-200">
              <div><span className="text-slate-400">신청자:</span> {selectedDetailProp.userName} ({selectedDetailProp.company})</div>
              <div><span className="text-slate-400">연락처/이메일:</span> {selectedDetailProp.phone} / {selectedDetailProp.email}</div>
              <div><span className="text-slate-400">제출일시:</span> {selectedDetailProp.createdAt}</div>
              <div><span className="text-slate-400">총 집행 예산:</span> <span className="text-amber-300 font-bold">{(selectedDetailProp.totalBudget / 10000).toLocaleString()} 만원</span></div>
              <div><span className="text-slate-400">타겟팅 수식:</span> <span className="font-mono text-amber-200">{selectedDetailProp.audienceFormula}</span></div>
            </div>
            <div className="pt-3 flex justify-end">
              <button onClick={() => setSelectedDetailProp(null)} className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-xs font-bold">닫기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}