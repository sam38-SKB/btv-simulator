import React from 'react';
import { DEFAULT_BONUS_RULES, DEFAULT_SURCHARGE_RULES, DEFAULT_PROMO_RULES } from '../../constants/defaultRules';

export default function AdminPanel({ 
  users = [], 
  bonusRules = {}, 
  surchargeRules = {}, 
  promoRules = {}, 
  onUpdateBonus,
  onUpdateSurcharge, 
  onUpdatePromo, 
  onStatusChange, 
  onDeleteUser, 
  onBackToDashboard, 
  onResetBonusRules,
  onResetSurchargeRules, 
  onResetPromoRules 
}) {
  // 데이터가 비어있을 경우 기본 UI 폼이 무조건 출력되도록 안전 구문 처리
  const btvBonus = (bonusRules.BTV && bonusRules.BTV.length > 0) ? bonusRules.BTV : DEFAULT_BONUS_RULES.BTV;
  const addr3Bonus = (bonusRules.ADDR3 && bonusRules.ADDR3.length > 0) ? bonusRules.ADDR3 : DEFAULT_BONUS_RULES.ADDR3;
  const currentBonusRules = { BTV: btvBonus, ADDR3: addr3Bonus };

  const currentSurchargeRules = {
    region: (surchargeRules.region && surchargeRules.region.length > 0) ? surchargeRules.region : DEFAULT_SURCHARGE_RULES.region,
    time: (surchargeRules.time && surchargeRules.time.length > 0) ? surchargeRules.time : DEFAULT_SURCHARGE_RULES.time,
    channel: (surchargeRules.channel && surchargeRules.channel.length > 0) ? surchargeRules.channel : DEFAULT_SURCHARGE_RULES.channel
  };

  const currentPromoRules = {
    BTV: (promoRules.BTV && promoRules.BTV.length > 0) ? promoRules.BTV : DEFAULT_PROMO_RULES.BTV,
    ADDR3: (promoRules.ADDR3 && promoRules.ADDR3.length > 0) ? promoRules.ADDR3 : DEFAULT_PROMO_RULES.ADDR3
  };

  const surchargeCategoryNames = {
    region: '📍 지역 타겟팅 할증',
    time: '⏰ 시간대 타겟팅 할증',
    channel: '📺 채널 타겟팅 할증'
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-purple-900/60 to-slate-800 border border-purple-700 p-6 rounded-2xl shadow-xl flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-purple-200">🛡️ B tv Agent 시스템 관리자 페이지</h2>
          <p className="text-sm text-purple-300/80 mt-1">
            사용자 가입 승인, 볼륨 보너스 요율, 타겟팅 할증 요율, 프로모션 정책을 통제합니다.
          </p>
        </div>
        <button onClick={onBackToDashboard} className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg">
          📊 시뮬레이터로 이동
        </button>
      </div>

      {/* 사용자 통계 카드 */}
      <div className="grid grid-cols-3 gap-5 text-center text-xs">
        <div className="bg-slate-800 border border-slate-700 p-5 rounded-2xl">
          <div className="text-slate-400 font-bold">전체 등록 사용자</div>
          <div className="text-3xl font-black text-white mt-1">{users.length} 명</div>
        </div>
        <div className="bg-slate-800 border border-amber-700/60 p-5 rounded-2xl">
          <div className="text-amber-400 font-bold">승인 대기 중</div>
          <div className="text-3xl font-black text-amber-300 mt-1">{users.filter(u => u.status === 'PENDING').length} 명</div>
        </div>
        <div className="bg-slate-800 border border-emerald-700/60 p-5 rounded-2xl">
          <div className="text-emerald-400 font-bold">정상 승인 계정</div>
          <div className="text-3xl font-black text-emerald-300 mt-1">{users.filter(u => u.status === 'APPROVED').length} 명</div>
        </div>
      </div>

      {/* 📊 [월 집행 금액 & 집행 기간] 볼륨 보너스 구간 관리 UI */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex justify-between items-center border-b border-slate-700 pb-3">
          <h3 className="text-lg font-bold text-white flex items-center">
            <span className="text-amber-400 mr-2">📊</span> [월 집행 금액 & 집행 기간] 볼륨 보너스 구간 설정 UI
          </h3>
          <button onClick={onResetBonusRules} className="bg-red-900/60 hover:bg-red-800 text-red-200 text-xs font-bold px-3 py-1.5 rounded-lg border border-red-700">
            🔄 보너스 구간 기본값 초기화
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {['BTV', 'ADDR3'].map(platform => (
            <div key={platform} className="bg-slate-900 border border-slate-700 p-4 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="font-bold text-amber-400 text-sm">
                  {platform === 'BTV' ? '📺 B tv 단독 볼륨 보너스 구간' : '🌐 IPTV 3사 PRIME 볼륨 보너스 구간'}
                </span>
                <button 
                  onClick={() => onUpdateBonus(platform, 'ADD')} 
                  className="bg-amber-600 hover:bg-amber-500 text-white px-3 py-1 rounded-lg font-bold text-xs shadow"
                >
                  + 구간 추가
                </button>
              </div>

              {currentBonusRules[platform].map((rule, idx) => (
                <div key={idx} className="bg-slate-800 p-3.5 rounded-xl border border-slate-700 space-y-2.5 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200 text-xs">구간 {idx + 1} 조건 설정</span>
                    <button 
                      onClick={() => onUpdateBonus(platform, 'DELETE', idx)} 
                      className="text-red-400 font-bold text-xs hover:text-red-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-700"
                    >
                      ✕ 삭제
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-slate-300">
                    <div>
                      <label className="block text-[11px] text-slate-400 font-bold mb-1">최소 월예산</label>
                      <div className="flex items-center space-x-1">
                        <input 
                          type="number" 
                          step={500} 
                          value={rule.minMonthlyBudget ? rule.minMonthlyBudget / 10000 : 0} 
                          onChange={(e) => onUpdateBonus(platform, 'CHANGE', idx, 'minMonthlyBudget', Number(e.target.value) * 10000)} 
                          className="w-full bg-slate-900 border border-slate-600 rounded-lg px-2.5 py-1.5 text-right font-bold text-white text-xs" 
                        />
                        <span className="text-[11px] text-slate-400 font-bold whitespace-nowrap">만원</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 font-bold mb-1">최소 기간</label>
                      <div className="flex items-center space-x-1">
                        <select
                          value={rule.minMonths || 1}
                          onChange={(e) => onUpdateBonus(platform, 'CHANGE', idx, 'minMonths', Number(e.target.value))}
                          className="w-full bg-slate-900 border border-slate-600 rounded-lg px-2 py-1.5 font-bold text-white text-xs"
                        >
                          <option value={1}>1개월</option>
                          <option value={2}>2개월</option>
                          <option value={3}>3개월</option>
                          <option value={6}>6개월</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 font-bold mb-1">보너스율</label>
                      <div className="flex items-center space-x-1">
                        <input 
                          type="number" 
                          step={5} 
                          value={rule.rate || 0} 
                          onChange={(e) => onUpdateBonus(platform, 'CHANGE', idx, 'rate', Number(e.target.value))} 
                          className="w-full bg-slate-900 border border-slate-600 rounded-lg px-2 py-1.5 text-right font-bold text-emerald-400 text-xs" 
                        />
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

      {/* ⚙️ 타겟팅 할증 요율 관리 */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex justify-between items-center border-b border-slate-700 pb-3">
          <h3 className="text-lg font-bold text-white flex items-center">
            <span className="text-red-400 mr-2">⚙️</span> 타겟팅 할증 요율 관리 (지역 / 시간대 / 채널)
          </h3>
          <button onClick={onResetSurchargeRules} className="bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-600">
            🔄 할증 요율 초기화
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {['region', 'time', 'channel'].map(cat => (
            <div key={cat} className="bg-slate-900 border border-slate-700 p-4 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="font-bold text-amber-400">{surchargeCategoryNames[cat]}</span>
                <button onClick={() => onUpdateSurcharge(cat, 'ADD')} className="bg-slate-800 hover:bg-slate-700 text-white px-2 py-1 rounded font-bold text-[11px]">
                  + 항목 추가
                </button>
              </div>
              {currentSurchargeRules[cat].map((rule, idx) => (
                <div key={rule.id || idx} className="bg-slate-800 p-3 rounded-lg border border-slate-700 space-y-2">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="text" 
                      value={rule.name} 
                      onChange={(e) => onUpdateSurcharge(cat, 'CHANGE', idx, 'name', e.target.value)} 
                      className="flex-1 bg-slate-900 border border-slate-600 rounded px-2 py-1 font-bold text-white text-xs" 
                    />
                    {rule.id !== 'ALL' && (
                      <button onClick={() => onUpdateSurcharge(cat, 'DELETE', idx)} className="text-red-400 font-bold px-1 hover:text-red-300">
                        ✕
                      </button>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>할증 비율:</span>
                    <div className="flex items-center space-x-1">
                      <input 
                        type="number" 
                        step={5} 
                        value={rule.rate} 
                        onChange={(e) => onUpdateSurcharge(cat, 'CHANGE', idx, 'rate', Number(e.target.value))} 
                        className="w-16 bg-slate-900 border border-slate-600 rounded px-2 py-1 text-right font-bold text-red-400 text-xs" 
                      />
                      <span className="font-bold text-red-400">%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 🎁 프로모션 & 우대 보너스 조건 관리 */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex justify-between items-center border-b border-slate-700 pb-3">
          <h3 className="text-lg font-bold text-white flex items-center">
            <span className="text-amber-400 mr-2">🎁</span> 프로모션 & 우대 보너스 조건 관리
          </h3>
          <button onClick={onResetPromoRules} className="bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-600">
            🔄 프로모션 초기화
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {['BTV', 'ADDR3'].map(platform => (
            <div key={platform} className="bg-slate-900 border border-slate-700 p-4 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-amber-400">
                  {platform === 'BTV' ? '📺 B tv 단독 프로모션' : '🌐 IPTV 3사 PRIME 프로모션'}
                </span>
                <button onClick={() => onUpdatePromo(platform, 'ADD')} className="bg-slate-800 hover:bg-slate-700 text-white px-2.5 py-1 rounded font-bold">
                  + 추가
                </button>
              </div>
              {currentPromoRules[platform].map((rule, idx) => (
                <div key={rule.id || idx} className="bg-slate-800 p-3 rounded-lg border border-slate-700 space-y-2">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="text" 
                      value={rule.name} 
                      onChange={(e) => onUpdatePromo(platform, 'CHANGE', idx, 'name', e.target.value)} 
                      className="flex-1 bg-slate-900 border border-slate-600 rounded px-2.5 py-1 font-bold text-white" 
                    />
                    <button onClick={() => onUpdatePromo(platform, 'DELETE', idx)} className="text-red-400 font-bold px-1">✕</button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="text" 
                      value={rule.desc} 
                      onChange={(e) => onUpdatePromo(platform, 'CHANGE', idx, 'desc', e.target.value)} 
                      className="flex-1 bg-slate-900 border border-slate-600 rounded px-2.5 py-1 text-slate-300" 
                    />
                    {rule.type !== 'VOD_PLUS' && rule.type !== 'SPECIAL_CPV' && (
                      <input 
                        type="number" 
                        step={5} 
                        value={rule.rate} 
                        onChange={(e) => onUpdatePromo(platform, 'CHANGE', idx, 'rate', Number(e.target.value))} 
                        className="w-16 bg-slate-900 border border-slate-600 rounded px-2 py-1 text-right font-bold text-emerald-400" 
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 사용자 계정 목록 표 */}
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
            {users.map(u => (
              <tr key={u.id}>
                <td className="p-3 text-xs text-slate-400 font-mono">{u.createdAt}</td>
                <td className="p-3 font-bold">{u.name} <span className="text-xs text-slate-400 font-normal">({u.id})</span></td>
                <td className="p-3 font-bold text-amber-300">{u.company}</td>
                <td className="p-3 text-xs"><div>{u.phone}</div><div className="text-slate-400">{u.email}</div></td>
                <td className="p-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${u.status === 'APPROVED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'}`}>
                    {u.status}
                  </span>
                </td>
                <td className="p-3 text-center space-x-2">
                  {u.role !== 'ADMIN' && (
                    <>
                      <button onClick={() => onStatusChange(u.id, 'APPROVED')} className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg">승인</button>
                      <button onClick={() => onStatusChange(u.id, 'REJECTED')} className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg">거절</button>
                    </>
                  )}
                </td>
                <td className="p-3 text-center">
                  {u.role !== 'ADMIN' && <button onClick={() => onDeleteUser(u.id)} className="bg-red-900/60 hover:bg-red-800 text-red-200 px-2.5 py-1 text-xs font-bold rounded-lg">삭제</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}