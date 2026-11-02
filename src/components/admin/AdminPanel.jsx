import React, { useState, useEffect } from 'react';

export default function AdminPanel({
  users = [],
  proposals = [],
  bonusRules = [],
  surchargeRules = {},
  promoRules = [],
  onSaveRules,
  onStatusChange,
  onDeleteUser,
  onUpdateProposalStatus,
  onDeleteProposal,
  onBackToDashboard
}) {
  const [activeTab, setActiveTab] = useState('RULES'); // 'RULES' | 'PROPOSALS' | 'USERS'
  const [isSaving, setIsSaving] = useState(false);

  // 로컬 로드/편집 상태
  const [draftBonus, setDraftBonus] = useState([]);
  const [draftSurcharge, setDraftSurcharge] = useState({});
  const [draftPromo, setDraftPromo] = useState([]);

  useEffect(() => {
    if (bonusRules) setDraftBonus(JSON.parse(JSON.stringify(bonusRules)));
    if (surchargeRules) setDraftSurcharge(JSON.parse(JSON.stringify(surchargeRules)));
    if (promoRules) setDraftPromo(JSON.parse(JSON.stringify(promoRules)));
  }, [bonusRules, surchargeRules, promoRules]);

  // 프로모션 항목 수정 핸들러
  const handlePromoChange = (index, field, value) => {
    const updated = [...draftPromo];
    updated[index] = { ...updated[index], [field]: value };
    setDraftPromo(updated);
  };

  // 프로모션 항목 추가
  const handleAddPromo = () => {
    setDraftPromo([
      ...draftPromo,
      {
        id: `promo_${Date.now()}`,
        name: '신규 프로모션 혜택',
        rate: 10,
        description: '혜택 및 우대 조건 설명을 입력하세요.',
        isActive: true,
      }
    ]);
  };

  // 프로모션 항목 삭제
  const handleDeletePromo = (index) => {
    if (confirm('해당 프로모션 항목을 삭제하시겠습니까?')) {
      const updated = draftPromo.filter((_, i) => i !== index);
      setDraftPromo(updated);
    }
  };

  // 전체 정책 일괄 저장
  const handleSaveAllRules = async () => {
    setIsSaving(true);
    try {
      const result = await onSaveRules(draftBonus, draftSurcharge, draftPromo);
      if (result?.success) {
        alert('✅ 모든 정책(보너스, 할증, 프로모션)이 DB에 성공적으로 저장되었습니다!');
      } else {
        alert(`❌ 저장 실패: ${result?.error || '오류가 발생했습니다.'}`);
      }
    } catch (err) {
      alert(`❌ 저장 중 오류 발생: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* 관리자 패널 상단 헤더 */}
      <div className="bg-slate-900 border border-purple-500/40 p-6 rounded-3xl shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🛡️</span>
            <h2 className="text-2xl font-black text-white">B tv AD 관리자 콘솔</h2>
            <span className="bg-purple-600/30 text-purple-300 text-xs px-2.5 py-0.5 rounded-full font-bold border border-purple-500/40">
              System Admin
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            시뮬레이터 보너스·할증 요율, 프로모션 혜택 조건, 청약서 및 사용자 승인 권한을 관리합니다.
          </p>
        </div>

        <button
          onClick={onBackToDashboard}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 transition-all flex items-center space-x-1.5"
        >
          <span>←</span>
          <span>시뮬레이터로 돌아가기</span>
        </button>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('RULES')}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center space-x-2 ${
            activeTab === 'RULES'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <span>⚙️</span>
          <span>정책 및 프로모션 관리</span>
        </button>
        <button
          onClick={() => setActiveTab('PROPOSALS')}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center space-x-2 ${
            activeTab === 'PROPOSALS'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <span>📄</span>
          <span>제출된 청약 관리 ({proposals.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('USERS')}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center space-x-2 ${
            activeTab === 'USERS'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <span>👥</span>
          <span>사용자 계정 승인</span>
        </button>
      </div>

      {/* TAB 1: 정책 및 프로모션 설정 */}
      {activeTab === 'RULES' && (
        <div className="space-y-6">
          {/* 일괄 저장 하단 고정/상단 저장 툴바 */}
          <div className="bg-slate-900 border border-slate-700 p-4 rounded-2xl flex justify-between items-center shadow-lg">
            <span className="text-xs text-slate-300 font-semibold">
              ⚠️ 수정 후 **[💾 DB에 정책 저장하기]**를 눌러야 전체 단말에 즉시 적용됩니다.
            </span>
            <button
              onClick={handleSaveAllRules}
              disabled={isSaving}
              className={`px-6 py-2.5 rounded-xl font-black text-xs shadow-xl transition-all flex items-center space-x-2 ${
                isSaving
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 ring-2 ring-emerald-300'
              }`}
            >
              <span>{isSaving ? '⏳ 저장 중...' : '💾 DB에 정책 저장하기'}</span>
            </button>
          </div>

          {/* 🎁 1. 프로모션 혜택 및 우대 조건 관리 섹션 */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-amber-400 flex items-center space-x-2">
                  <span>🎁</span>
                  <span>프로모션 혜택 및 우대 조건 설정</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  견적서 단계에서 선택 가능한 특별 보너스 및 할인 프로모션 정책을 추가하거나 관리합니다.
                </p>
              </div>
              <button
                onClick={handleAddPromo}
                className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1"
              >
                <span>+</span>
                <span>프로모션 추가</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {draftPromo.map((promo, idx) => (
                <div
                  key={promo.id || idx}
                  className={`p-4 rounded-xl border transition-all space-y-3 ${
                    promo.isActive
                      ? 'bg-slate-950/80 border-amber-500/40'
                      : 'bg-slate-950/30 border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <label className="flex items-center space-x-2 text-xs font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={promo.isActive ?? true}
                        onChange={(e) => handlePromoChange(idx, 'isActive', e.target.checked)}
                        className="rounded accent-amber-500 w-4 h-4"
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
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100 focus:outline-none focus:border-amber-500"
                        placeholder="예: 신규광고주 런칭 보너스 (+10%)"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-slate-400 block mb-1 font-semibold">추가 보너스/할인율 (%)</span>
                        <input
                          type="number"
                          value={promo.rate ?? 0}
                          onChange={(e) => handlePromoChange(idx, 'rate', Number(e.target.value))}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-1 font-semibold">적용 설명</span>
                        <input
                          type="text"
                          value={promo.description || ''}
                          onChange={(e) => handlePromoChange(idx, 'description', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100 focus:outline-none focus:border-amber-500"
                          placeholder="혜택 설명"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 📈 2. 볼륨 보너스 구간 관리 섹션 */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-sky-400 border-b border-slate-800 pb-3 flex items-center space-x-2">
              <span>📈</span>
              <span>집행 청약금액별 볼륨 보너스 구간 설정</span>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase">
                  <tr>
                    <th className="p-3">구간 (이상 ~ 미만)</th>
                    <th className="p-3 text-amber-300">B tv 단독 보너스율 (%)</th>
                    <th className="p-3 text-sky-300">IPTV 3사(ADDR3) 보너스율 (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {draftBonus.map((rule, idx) => (
                    <tr key={idx} className="hover:bg-slate-850">
                      <td className="p-3 font-mono">
                        {rule.minBudget?.toLocaleString()}원 ~ {rule.maxBudget ? `${rule.maxBudget?.toLocaleString()}원` : '제한 없음'}
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={rule.btvBonusRate ?? 0}
                          onChange={(e) => {
                            const updated = [...draftBonus];
                            updated[idx].btvBonusRate = Number(e.target.value);
                            setDraftBonus(updated);
                          }}
                          className="w-24 bg-slate-950 border border-slate-700 rounded px-2.5 py-1 font-mono text-amber-300 focus:outline-none focus:border-amber-400"
                        /> %
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={rule.addr3BonusRate ?? 0}
                          onChange={(e) => {
                            const updated = [...draftBonus];
                            updated[idx].addr3BonusRate = Number(e.target.value);
                            setDraftBonus(updated);
                          }}
                          className="w-24 bg-slate-950 border border-slate-700 rounded px-2.5 py-1 font-mono text-sky-300 focus:outline-none focus:border-sky-400"
                        /> %
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ⚡ 3. 타겟팅 및 조건별 할증 요율 설정 */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-purple-400 border-b border-slate-800 pb-3 flex items-center space-x-2">
              <span>⚡</span>
              <span>타겟팅 및 기본 할증 요율 설정</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-slate-400 font-bold block">기본 지역 타겟팅 할증</span>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={draftSurcharge.location ?? 10}
                    onChange={(e) => setDraftSurcharge({ ...draftSurcharge, location: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 font-mono text-white focus:outline-none focus:border-purple-500"
                  />
                  <span>%</span>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-slate-400 font-bold block">시간대 지정 타겟팅 할증</span>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={draftSurcharge.time ?? 15}
                    onChange={(e) => setDraftSurcharge({ ...draftSurcharge, time: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 font-mono text-white focus:outline-none focus:border-purple-500"
                  />
                  <span>%</span>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-slate-400 font-bold block">관심사 세그먼트 타겟팅 할증</span>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={draftSurcharge.category ?? 20}
                    onChange={(e) => setDraftSurcharge({ ...draftSurcharge, category: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 font-mono text-white focus:outline-none focus:border-purple-500"
                  />
                  <span>%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 제출된 청약서 목록 관리 */}
      {activeTab === 'PROPOSALS' && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
            📋 청약 제출 접수 내역 ({proposals.length}건)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase">
                <tr>
                  <th className="p-3">제출일시</th>
                  <th className="p-3">캠페인명</th>
                  <th className="p-3">신청자/회사</th>
                  <th className="p-3">플랫폼</th>
                  <th className="p-3">집행예산</th>
                  <th className="p-3">상태</th>
                  <th className="p-3 text-right">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {proposals.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-6 text-center text-slate-500">
                      접수된 청약 내역이 없습니다.
                    </td>
                  </tr>
                ) : (
                  proposals.map((prop) => (
                    <tr key={prop.id} className="hover:bg-slate-850">
                      <td className="p-3 font-mono text-slate-400">
                        {prop.createdAt ? new Date(prop.createdAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="p-3 font-bold text-white">{prop.campaignName || '미지정'}</td>
                      <td className="p-3">{prop.userName} ({prop.userCompany})</td>
                      <td className="p-3 font-bold">
                        <span className={prop.platformMode === 'BTV' ? 'text-amber-300' : 'text-sky-300'}>
                          {prop.platformMode === 'BTV' ? 'B tv 단독' : 'IPTV 3사'}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-bold text-emerald-400">
                        {prop.budget?.toLocaleString()}원
                      </td>
                      <td className="p-3">
                        <select
                          value={prop.status || 'SUBMITTED'}
                          onChange={(e) => onUpdateProposalStatus(prop.id, e.target.value)}
                          className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs focus:outline-none"
                        >
                          <option value="SUBMITTED">접수완료</option>
                          <option value="REVIEWING">검토중</option>
                          <option value="APPROVED">승인완료</option>
                          <option value="REJECTED">반려</option>
                        </select>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => onDeleteProposal(prop.id)}
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

      {/* TAB 3: 사용자 계정 관리 */}
      {activeTab === 'USERS' && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
            👥 사용자 가입 승인 및 권한 관리 ({users.length}명)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase">
                <tr>
                  <th className="p-3">ID (이메일)</th>
                  <th className="p-3">이름</th>
                  <th className="p-3">회사/부서</th>
                  <th className="p-3">권한</th>
                  <th className="p-3">승인 상태</th>
                  <th className="p-3 text-right">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-850">
                    <td className="p-3 font-mono text-slate-300">{u.id}</td>
                    <td className="p-3 font-bold text-white">{u.name}</td>
                    <td className="p-3">{u.company}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role === 'ADMIN' ? 'bg-purple-900 text-purple-200' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {u.role === 'ADMIN' ? '관리자' : '일반사용자'}
                      </span>
                    </td>
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