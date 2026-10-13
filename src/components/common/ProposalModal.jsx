import React from 'react';

export default function ProposalModal({ isOpen, onClose, state, calculation, audienceFormula, currentUser, onSubmitProposal }) {
  if (!isOpen) return null;

  // 📊 엑셀 다운로드 (한글 깨짐 방지 BOM 포함)
  const handleExportExcel = () => {
    const bom = '\uFEFF';
    let csv = 'B tv 광고 시뮬레이터 - 공식 견적서\n\n';
    csv += `작성일시,${new Date().toLocaleString('ko-KR')}\n`;
    csv += `신청자,${currentUser?.name || '미인증'} (${currentUser?.company || '회사미지정'})\n`;
    csv += `연락처,${currentUser?.phone || '-'}\n`;
    csv += `이메일,${currentUser?.email || '-'}\n\n`;

    csv += '구분,설명\n';
    csv += `매체 커버리지,${state.platformMode === 'BTV' ? 'B tv 단독 (700만 가구)' : 'IPTV 3사 PRIME (2,166만 가구)'}\n`;
    csv += `월 집행 예산,${(state.monthlyBudget / 10000).toLocaleString()} 만원\n`;
    csv += `집행 기간,${state.durationMonths} 개월\n`;
    csv += `총 집행 예산,${(state.totalBudget / 10000).toLocaleString()} 만원\n`;
    csv += `타겟팅 조건,${audienceFormula}\n\n`;

    csv += '상품명,소재/패키지,실제지불예산,총제공가치,할증/보너스 산출식,노출보장수,실질CPV\n';
    calculation.items.forEach(item => {
      csv += `"${item.name}","${item.videoLengthText} (${item.channelPackText})","${item.netPaymentStr}","${item.executionValueStr}","${item.netBonusSummaryText}","${item.totalImpressions}","${item.effectiveCPV}"\n`;
    });

    csv += `\n총 집행 가치,${calculation.totalValueStr}\n`;
    csv += `총 보장 노출수,${calculation.grandTotalImp.toLocaleString()} 회\n`;
    csv += `실질 CPV,${calculation.avgEffectiveCPV} 원\n`;

    const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Btv_광고견적서_${currentUser?.company || '고객'}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 📄 청약 제출 버튼 핸들러
  const handleSubmit = () => {
    if (onSubmitProposal) {
      onSubmitProposal({
        id: `PROP_${Date.now()}`,
        createdAt: new Date().toLocaleString('ko-KR'),
        userId: currentUser?.id || 'guest',
        userName: currentUser?.name || '담당자',
        company: currentUser?.company || '미지정',
        phone: currentUser?.phone || '-',
        email: currentUser?.email || '-',
        platformMode: state.platformMode,
        monthlyBudget: state.monthlyBudget,
        durationMonths: state.durationMonths,
        totalBudget: state.totalBudget,
        totalValueStr: calculation.totalValueStr,
        grandTotalImp: calculation.grandTotalImp,
        avgEffectiveCPV: calculation.avgEffectiveCPV,
        audienceFormula,
        items: calculation.items,
        status: 'SUBMITTED' // SUBMITTED(제출완료), APPROVED(승인), REJECTED(반려)
      });
      alert('청약 제출이 완료되었습니다! 관리자 페이지의 청약 목록에서 확인할 수 있습니다.');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-800 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* 상단 헤더 */}
        <div className="bg-slate-900 p-6 border-b border-slate-700 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-amber-400">📄 B tv 광고 청약 견적서</h2>
            <p className="text-xs text-slate-400 mt-1">신청자: {currentUser?.name} ({currentUser?.company})</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold text-xl px-2 py-1">✕</button>
        </div>

        {/* 요약 컨텐츠 */}
        <div className="p-6 space-y-6 text-sm text-slate-200 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-900 p-4 rounded-xl border border-slate-700 text-xs">
            <div>
              <div className="text-slate-400">매체 구분</div>
              <div className="font-bold text-white mt-0.5">{state.platformMode === 'BTV' ? 'B tv 단독' : 'IPTV 3사 PRIME'}</div>
            </div>
            <div>
              <div className="text-slate-400">총 집행 예산</div>
              <div className="font-bold text-amber-300 mt-0.5">{(state.totalBudget / 10000).toLocaleString()} 만원</div>
            </div>
            <div>
              <div className="text-slate-400">총 제공 가치</div>
              <div className="font-bold text-emerald-400 mt-0.5">{calculation.totalValueStr}</div>
            </div>
            <div>
              <div className="text-slate-400">실질 CPV</div>
              <div className="font-bold text-sky-400 mt-0.5">{calculation.avgEffectiveCPV} 원</div>
            </div>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-750 text-xs space-y-1">
            <div className="font-bold text-slate-400">📍 적용 타겟팅 조건:</div>
            <div className="font-mono text-amber-200">{audienceFormula}</div>
          </div>

          {/* 견적 테이블 */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 uppercase border-b border-slate-700">
                <tr>
                  <th className="p-3">상품명</th>
                  <th className="p-3">패키지/소재</th>
                  <th className="p-3 text-amber-300">실제지불예산</th>
                  <th className="p-3 text-emerald-400">제공가치</th>
                  <th className="p-3">산출 요약</th>
                  <th className="p-3">노출보장수</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {calculation.items.map((row, idx) => (
                  <tr key={idx}>
                    <td className="p-3 font-bold text-white">{row.name}</td>
                    <td className="p-3">{row.videoLengthText} ({row.channelPackText})</td>
                    <td className="p-3 font-bold text-amber-300">{row.netPaymentStr}</td>
                    <td className="p-3 font-bold text-emerald-400">{row.executionValueStr}</td>
                    <td className="p-3 font-mono text-[11px] text-slate-300">{row.netBonusSummaryText}</td>
                    <td className="p-3 font-bold">{row.totalImpressions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 하단 버튼 바 */}
        <div className="bg-slate-900 p-5 border-t border-slate-700 flex flex-wrap justify-between items-center gap-3">
          <button onClick={handleExportExcel} className="bg-emerald-700 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow flex items-center space-x-1.5">
            <span>📥 엑셀 견적서 다운로드</span>
          </button>
          <div className="flex space-x-3">
            <button onClick={onClose} className="bg-slate-700 hover:bg-slate-600 px-5 py-2.5 rounded-xl text-xs font-bold">닫기</button>
            <button onClick={handleSubmit} className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg">
              🚀 청약 최종 제출하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}