import React from 'react';

export default function AdminPanel({ users, bonusRules, promoRules, onUpdateBonus, onUpdatePromo, onStatusChange, onDeleteUser, onBackToDashboard, onResetBonusRules, onResetPromoRules }) {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-purple-900/60 to-slate-800 border border-purple-700 p-6 rounded-2xl shadow-xl flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-purple-200">🛡️ B tv Agent 시스템 관리자 페이지</h2>
          <p className="text-sm text-purple-300/80 mt-1">사용자 가입 승인, 볼륨 보너스율, 프로모션 정책을 통제합니다.</p>
        </div>
        <button onClick={onBackToDashboard} className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm">📊 시뮬레이터로 이동</button>
      </div>

      <div className="grid grid-cols-3 gap-5 text-center text-xs">
        <div className="bg-slate-800 border border-slate-700 p-5 rounded-2xl"><div className="text-slate-400 font-bold">전체 등록 사용자</div><div className="text-3xl font-black text-white mt-1">{users.length} 명</div></div>
        <div className="bg-slate-800 border border-amber-700/60 p-5 rounded-2xl"><div className="text-amber-400 font-bold">승인 대기 중</div><div className="text-3xl font-black text-amber-300 mt-1">{users.filter(u => u.status === 'PENDING').length} 명</div></div>
        <div className="bg-slate-800 border border-emerald-700/60 p-5 rounded-2xl"><div className="text-emerald-400 font-bold">정상 승인 계정</div><div className="text-3xl font-black text-emerald-300 mt-1">{users.filter(u => u.status === 'APPROVED').length} 명</div></div>
      </div>

      {/* 매체별 프로모션 관리 */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex justify-between items-center border-b border-slate-700 pb-3">
          <h3 className="text-lg font-bold text-white flex items-center"><span className="text-amber-400 mr-2">🎁</span> 프로모션 & 우대 보너스 조건 관리</h3>
          <button onClick={onResetPromoRules} className="bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-600">🔄 프로모션 초기화</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {['BTV', 'ADDR3'].map(platform => (
            <div key={platform} className="bg-slate-900 border border-slate-700 p-4 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-amber-400">{platform === 'BTV' ? '📺 B tv 단독 프로모션' : '🌐 IPTV 3사 PRIME 프로모션'}</span>
                <button onClick={() => onUpdatePromo(platform, 'ADD')} className="bg-slate-800 hover:bg-slate-700 text-white px-2.5 py-1 rounded font-bold">+ 추가</button>
              </div>
              {(promoRules[platform] || []).map((rule, idx) => (
                <div key={rule.id || idx} className="bg-slate-800 p-3 rounded-lg border border-slate-700 space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="text" value={rule.name} onChange={(e) => onUpdatePromo(platform, 'CHANGE', idx, 'name', e.target.value)} className="flex-1 bg-slate-900 border border-slate-600 rounded px-2.5 py-1 font-bold text-white" />
                    <button onClick={() => onUpdatePromo(platform, 'DELETE', idx)} className="text-red-400 font-bold px-1">✕</button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="text" value={rule.desc} onChange={(e) => onUpdatePromo(platform, 'CHANGE', idx, 'desc', e.target.value)} className="flex-1 bg-slate-900 border border-slate-600 rounded px-2.5 py-1 text-slate-300" />
                    {rule.type !== 'VOD_PLUS' && rule.type !== 'SPECIAL_CPV' && (
                      <input type="number" step={5} value={rule.rate} onChange={(e) => onUpdatePromo(platform, 'CHANGE', idx, 'rate', Number(e.target.value))} className="w-16 bg-slate-900 border border-slate-600 rounded px-2 py-1 text-right font-bold text-emerald-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 사용자 목록 표 */}
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
                <td className="p-3"><span className={`text-xs px-2.5 py-1 rounded-full font-bold ${u.status === 'APPROVED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'}`}>{u.status}</span></td>
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