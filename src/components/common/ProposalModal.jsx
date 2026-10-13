import React, { useState } from 'react';

export default function ProposalModal({ isOpen, onClose, state, calculation, audienceFormula, currentUser }) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !currentUser) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 border border-slate-700 w-full max-w-xl rounded-2xl p-7 shadow-2xl space-y-5">
        <div className="flex justify-between items-center border-b border-slate-700 pb-3">
          <h3 className="text-xl font-bold text-white">B tv / IPTV 3사 PRIME 광고 청약 신청서</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg font-bold">✕</button>
        </div>

        {!isSubmitted ? (
          <div className="space-y-4 text-sm">
            <div className="bg-slate-900 p-5 rounded-xl space-y-2 border border-slate-700">
              <div><span className="text-slate-400">선택 매체:</span> <strong className="text-red-400">{state.platformMode === 'BTV' ? 'B tv 단독 AD+' : 'IPTV 3사 Addr.TV PRIME'}</strong></div>
              <div><span className="text-slate-400">오디언스 산출식:</span> <strong className="text-emerald-400 font-mono text-xs block mt-1 p-2 bg-slate-950 rounded border border-slate-800">{audienceFormula}</strong></div>
              <div><span className="text-slate-400">신청 광고주/대행사:</span> <strong className="text-white">{currentUser.company} ({currentUser.name})</strong></div>
              <div><span className="text-slate-400">총 제공 집행 가치:</span> <strong className="text-amber-300 text-base font-mono ml-1">{calculation.totalValueStr} (집행 예산 {(state.totalBudget/10000).toLocaleString()}만원 + 보너스 {calculation.bonusValueStr})</strong></div>
            </div>

            <div>
              <label className="text-slate-300 font-bold mb-1.5 block">추가 요청사항 / 집행 희망일</label>
              <textarea placeholder="집행 시작 희망일 및 기타 문의사항을 입력해 주세요." className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3.5 text-sm h-24 text-white focus:outline-none focus:border-red-500" />
            </div>

            <button onClick={() => setIsSubmitted(true)} className="w-full bg-red-600 hover:bg-red-500 font-bold py-3.5 rounded-xl text-white text-base shadow-lg transition">담당 SK브로드밴드 AE에게 청약 제출하기</button>
          </div>
        ) : (
          <div className="text-center py-8 space-y-4">
            <div className="text-5xl">✅</div>
            <h4 className="text-xl font-bold text-white">청약 접수가 성공적으로 완료되었습니다!</h4>
            <p className="text-sm text-slate-300">등록하신 연락처({currentUser.phone})로 1영업일 이내 담당 AE가 연락을 드립니다.</p>
            <button onClick={() => { setIsSubmitted(false); onClose(); }} className="bg-slate-700 hover:bg-slate-600 px-6 py-2.5 rounded-xl text-sm font-bold text-white">닫기</button>
          </div>
        )}
      </div>
    </div>
  );
}