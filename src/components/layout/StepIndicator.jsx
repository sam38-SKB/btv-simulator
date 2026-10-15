import React from 'react';

export default function StepIndicator({ currentStep, goToStep, currentTab }) {
  const steps = [
    { num: 1, label: '예산 및 기간' },
    { num: 2, label: '플랫폼 & 소재' },
    { num: 3, label: '상품 & 보너스' },
    { num: 4, label: '타겟팅 설정' },
    { num: 5, label: '최종 견적' },
  ];

  const isBtv = currentTab === 'BTV';

  // 테마별 액센트 스타일 정의
  const activeBg = isBtv
    ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black shadow-lg shadow-amber-500/30 ring-2 ring-amber-300'
    : 'bg-gradient-to-r from-sky-400 to-blue-500 text-slate-950 font-black shadow-lg shadow-sky-500/30 ring-2 ring-sky-300';

  const badgeStyle = isBtv 
    ? 'text-amber-300 border-amber-500/40 bg-amber-500/10' 
    : 'text-sky-300 border-sky-500/40 bg-sky-500/10';

  const cardBorderStyle = isBtv
    ? 'border-amber-500/30 shadow-amber-500/5'
    : 'border-sky-500/30 shadow-sky-500/5';

  return (
    <div className={`bg-slate-950/70 border ${cardBorderStyle} p-5 rounded-2xl shadow-2xl backdrop-blur-md space-y-4 transition-all duration-300`}>
      {/* 탭 헤더 라벨 */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-2.5">
          <span className={`text-xs font-black px-3 py-1 rounded-full border ${badgeStyle} flex items-center space-x-1.5`}>
            <span>{isBtv ? '📺' : '🌐'}</span>
            <span>{isBtv ? 'B tv 단독 광고 모드' : 'IPTV 3사 통합 ADDR3 모드'}</span>
          </span>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            {isBtv ? 'SK브로드밴드 가입자 700만 대상 단독 패키지' : 'SKB · KT · LGU+ 2,166만 가구 Addressable TV'}
          </span>
        </div>
        <div className="text-xs font-mono font-semibold text-slate-400">
          STEP <span className={isBtv ? 'text-amber-400 font-extrabold text-sm' : 'text-sky-400 font-extrabold text-sm'}>{currentStep}</span> / 5
        </div>
      </div>

      {/* 스텝 서클 네비게이션 */}
      <div className="grid grid-cols-5 gap-2 relative">
        {steps.map((step) => {
          const isActive = currentStep === step.num;
          const isPassed = currentStep > step.num;

          return (
            <button
              key={step.num}
              onClick={() => goToStep(step.num)}
              className={`flex flex-col items-center justify-center p-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-slate-900/90 border border-slate-700 shadow-md scale-102'
                  : isPassed
                  ? 'bg-slate-900/40 text-slate-300 hover:bg-slate-800/60'
                  : 'bg-slate-900/20 text-slate-500 hover:bg-slate-800/30'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isActive
                    ? activeBg
                    : isPassed
                    ? isBtv
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 font-black'
                      : 'bg-sky-500/20 text-sky-300 border border-sky-500/50 font-black'
                    : 'bg-slate-800 text-slate-500 border border-slate-700'
                }`}
              >
                {isPassed ? '✓' : step.num}
              </div>
              <span
                className={`text-[11px] mt-1.5 font-bold transition-colors ${
                  isActive
                    ? isBtv ? 'text-amber-300 font-black' : 'text-sky-300 font-black'
                    : isPassed
                    ? 'text-slate-200'
                    : 'text-slate-500'
                }`}
              >
                {step.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}