import React, { useState, useEffect } from 'react';

export default function AdminPanel({
  users,
  proposals,
  bonusRules,
  surchargeRules,
  promoRules,
  onSaveRules,
  onStatusChange,
  onDeleteUser,
  onUpdateProposalStatus,
  onDeleteProposal,
  onBackToDashboard
}) {
  const [activeTab, setActiveTab] = useState('RULES');
  const [isSaving, setIsSaving] = useState(false);

  // 로컬 편집 상태
  const [draftBonus, setDraftBonus] = useState(bonusRules || []);
  const [draftSurcharge, setDraftSurcharge] = useState(surchargeRules || {});
  const [draftPromo, setDraftPromo] = useState(promoRules || []);

  useEffect(() => {
    if (bonusRules) setDraftBonus(bonusRules);
    if (surchargeRules) setDraftSurcharge(surchargeRules);
    if (promoRules) setDraftPromo(promoRules);
  }, [bonusRules, surchargeRules, promoRules]);

  // DB 정책 저장
  const handleSave = async () => {
    setIsSaving(true);
    const res = await onSaveRules(draftBonus, draftSurcharge, draftPromo);
    setIsSaving(false);
    if (res?.success) {
      alert('💾 DB에 정책이 성공적으로 저장되었습니다!');
    } else {
      alert(`저장 실패: ${res?.error || '오류가 발생했습니다.'}`);
    }
  };

  // 프로모션 핸들러
  const handlePromoChange = (index, field, value) => {
    const next = [...draftPromo];
    next[index] = { ...next[index], [field]: value };
    setDraftPromo(next);
  };

  const handleAddPromo = () => {
    setDraftPromo([
      ...draftPromo,
      {
        id: `promo_${Date.now()}`,
        name: '신규 프로모션 혜택',
        rate: 10,
        description: '프로모션 상세 설명',
        isActive: true,
      }
    ]);
  };

  const handleDeletePromo = (index) => {
    if (confirm('해당 프로모션 항목을 삭제하시겠습니까?')) {
      setDraftPromo(draftPromo.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* 관리자 헤더 */}
      <div className="flex justify-between items-center bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            🛡️ B tv AD 관리자 콘솔
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            시뮬레이터 정책(보너스, 할증, 프로모션), 청약 제출 내역, 사용자 승인 권한을 관리합니다.
          </p>
        </div>
        <button
          onClick={onBackToDashboard}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-4 py-2 rounded-xl border border-slate-700 transition-all"
        >
          ← 시뮬레이터로 돌아가기
        </button>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('RULES')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'RULES' ? 'bg-purple-600 text-white shadow' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          ⚙️ 정책 및 프로모션 관리
        </button>
        <button
          onClick={() => setActiveTab('PROPOSALS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'PROPOSALS' ? 'bg-purple-600 text-white shadow' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          📋 제출된 청약 관리 ({proposals?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('USERS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'USERS' ? 'bg-purple-600 text-white shadow' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          👥 사용자 승인 관리 ({users?.length || 0})
        </button>
      </div>

      {/* TAB 1: 정책 및 프로모션 */}
      {activeTab === 'RULES' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-slate-900 p-4 rounded-xl border border-slate-800 shadow">
            <span className="text-xs text-slate-300 font-semibold">
              ⚠️ 수정 후 **[💾 DB에 정책 저장하기]**를 눌러야 전체 단말에 즉시 적용됩니다.
            </span>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-5 py-2 rounded-xl shadow transition-all"
            >
              {isSaving ? '저장 중...' : '💾 DB에 정책 저장하기'}
            </button>
          </div>

          {/* 🎁 프로모션 혜택 및 우대 조건 관리 (신규 추가 항목) */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                  🎁 프로모션 혜택 및 우대 조건 설정
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  견적서 단계에서 선택 가능한 특별 보너스 및 할인 프로모션 항목을 추가/관리합니다.
                </p>
              </div>
              <button
                onClick={handleAddPromo}
                className="bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 text-xs px-3 py-1.5 rounded-lg font-bold transition-all"
              >
                + 프로모션 추가
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {draftPromo?.length === 0 ? (
                <div className="col-span-2 text-center py-6 text-slate-500 text-xs">
                  등록된 프로모션이 없습니다. [+ 프로모션 추가] 버튼을 클릭해 보세요.
                </div>
              ) : (
                draftPromo?.map((promo, idx) => (
                  <div key={promo.id || idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="flex items-center space-x-2 text-xs text-slate-300 font-bold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={promo.isActive ?? true}
                          onChange={(e) => handlePromoChange(idx, 'isActive', e.target.checked)}
                          className="accent-amber-500 w-4 h-4 rounded"
                        />
                        <span className={promo.isActive ? 'text-amber-300' : 'text-slate-500'}>
                          {promo.isActive ? '활성화 (ON)' : '비활성화 (OFF)'}
                        </span>
                      </label>
                      <button
                        onClick={() => handleDeletePromo(idx)}
                        className="text-red-400 hover:text-red-300 text-xs font-bold"
                      >
                        삭제
                      </button>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-slate-400 block mb-1 font-semibold">프로모션 명칭</span>
                        <input
                          type="text"
                          value={promo.name || ''}
                          onChange={(e) => handlePromoChange(idx, 'name', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-amber-500"
                          placeholder="예: 신규광고주 런칭 보너스"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-slate-400 block mb-1 font-semibold">보너스/할인율 (%)</span>
                          <input
                            type="number"
                            value={promo.rate ?? 0}
                            onChange={(e) => handlePromoChange(idx, 'rate', Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white font-mono focus:outline-none focus:border-amber-500"
                          />
                        </div>
                        <div>
                          <span className="text-slate-400 block mb-1 font-semibold">적용 설명</span>
                          <input
                            type="text"
                            value={promo.description || ''}
                            onChange={(e) => handlePromoChange(idx, 'description', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-amber-500"
                            placeholder="혜택 조건 설명"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 📈 집행 금액별 볼륨 보너스 구간 */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-sky-400 border-b border-slate-800 pb-3">
              📈 집행 청약금액별 볼륨 보너스 구간 설정
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400">
                  <tr>
                    <th className="p-3">구간 (이상 ~ 미만)</th>
                    <th className="p-3 text-amber-300">B tv 단독 보너스율 (%)</th>
                    <th className="p-3 text-sky-300">IPTV 3사(ADDR3) 보너스율 (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {draftBonus?.map((rule, idx) => (
                    <tr key={idx} className="hover:bg-slate-850">
                      <td className="p-3 font-mono">
                        {rule.minBudget?.toLocaleString()}원 ~ {rule.maxBudget ? `${rule.maxBudget?.toLocaleString()}원` : '제한 없음'}
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={rule.btvBonusRate ?? 0}
                          onChange={(e) => {
                            const next = [...draftBonus];
                            next[idx].btvBonusRate = Number(e.target.value);
                            setDraftBonus(next);
                          }}
                          className="w-20 bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-amber-300 font-mono"
                        /> %
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={rule.addr3BonusRate ?? 0}
                          onChange={(e) => {
                            const next = [...draftBonus];
                            next[idx].addr3BonusRate = Number(e.target.value);
                            setDraftBonus(next);
                          }}
                          className="w-20 bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-sky-300 font-mono"
                        /> %
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ⚡ 타겟팅 할증 요율 */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-purple-400 border-b border-slate-800 pb-3">
              ⚡ 타겟팅 및 기본 할증 요율 설정
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
                <span className="text-slate-400 font-bold block">기본 지역 타겟팅 할증</span>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={draftSurcharge?.location ?? 10}
                    onChange={(e) => setDraftSurcharge({ ...draftSurcharge, location: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 font-mono text-white"
                  />
                  <span>%</span>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
                <span className="text-slate-400 font-bold block">시간대 지정 타겟팅 할증</span>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={draftSurcharge?.time ?? 15}
                    onChange={(e) => setDraftSurcharge({ ...draftSurcharge, time: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 font-mono text-white"
                  />
                  <span>%</span>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
                <span className="text-slate-400 font-bold block">관심사 세그먼트 타겟팅 할증</span>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={draftSurcharge?.category ?? 20}
                    onChange={(e) => setDraftSurcharge({ ...draftSurcharge, category: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 font-mono text-white"
                  />
                  <span>%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 청약 관리 */}
      {activeTab === 'PROPOSALS' && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
            📋 청약 제출 접수 내역 ({proposals?.length || 0}건)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400">
                <tr>
                  <th className="p-3">제출일시</th>
                  <th className="p-3">캠페인명</th>
                  <th className="p-3">신청자/회사</th>
                  <th className="p-3">집행예산</th>
                  <th className="p-3">상태</th>
                  <th className="p-3 text-right">삭제</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {proposals?.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-6 text-center text-slate-500">
                      접수된 청약 내역이 없습니다.
                    </td>
                  </tr>
                ) : (
                  proposals?.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-850">
                      <td className="p-3 font-mono text-slate-400">
                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="p-3 font-bold text-white">{p.campaignName || '미지정'}</td>
                      <td className="p-3">{p.userName} ({p.userCompany})</td>
                      <td className="p-3 font-mono font-bold text-emerald-400">
                        {p.budget?.toLocaleString()}원
                      </td>
                      <td className="p-3">
                        <select
                          value={p.status || 'SUBMITTED'}
                          onChange={(e) => onUpdateProposalStatus(p.id, e.target.value)}
                          className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs"
                        >
                          <option value="SUBMITTED">접수완료</option>
                          <option value="REVIEWING">검토중</option>
                          <option value="APPROVED">승인완료</option>
                          <option value="REJECTED">반려</option>
                        </select>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => onDeleteProposal(p.id)}
                          className="text-red-400 hover:text-red-300 text-xs font-bold"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: 사용자 승인 관리 */}
      {activeTab === 'USERS' && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
            👥 사용자 가입 승인 및 권한 관리 ({users?.length || 0}명)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400">
                <tr>
                  <th className="p-3">ID (이메일)</th>
                  <th className="p-3">이름</th>
                  <th className="p-3">회사/부서</th>
                  <th className="p-3">승인 상태</th>
                  <th className="p-3 text-right">삭제</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {users?.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-850">
                    <td className="p-3 font-mono text-slate-300">{u.id}</td>
                    <td className="p-3 font-bold text-white">{u.name}</td>
                    <td className="p-3">{u.company}</td>
                    <td className="p-3">
                      <button
                        onClick={() => onStatusChange(u.id, u.status === 'APPROVED' ? 'PENDING' : 'APPROVED')}
                        className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                          u.status === 'APPROVED'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {u.status === 'APPROVED' ? '승인됨 (Approved)' : '대기중 (Pending)'}
                      </button>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onDeleteUser(u.id)}
                        className="text-red-400 hover:text-red-300 text-xs font-bold"
                      >
                        계정 삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}