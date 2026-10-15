import React from 'react';

export default function ProductInfoView({ onGoSimulator }) {
  return (
    <div className="space-y-8 text-slate-100 pb-12">
      {/* 헤더 배너 */}
      <div className="bg-gradient-to-r from-slate-800 via-purple-950 to-slate-800 border border-slate-700 p-8 rounded-3xl shadow-2xl text-center space-y-3">
        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          SK broadband B tv AD Platform
        </span>
        <h2 className="text-3xl font-black text-white">B tv & IPTV 3사 광고 상품 안내</h2>
        <p className="text-slate-300 text-sm max-w-2xl mx-auto leading-relaxed">
          대한민국 대표 IPTV 매체인 **B tv 단독 상품**과 **IPTV 3사(SKB·KT·LGU+) 통합 커버리지(ADDR3)** 상품을 비교하고 최적의 미디어 믹스를 구성해 보세요.
        </p>
      </div>

      {/* 매체 비교 카드 2종 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* B tv 단독 카드 */}
        <div className="bg-slate-800/80 border border-slate-700 hover:border-amber-500/50 transition-all p-6 rounded-2xl shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-2xl">📺</span>
              <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-2.5 py-1 rounded-lg">700만 가구 단독</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-amber-400">B tv 단독 광고</h3>
              <p className="text-xs text-slate-400 mt-1">SK브로드밴드 B tv 가입자 대상 정밀 타겟팅 및 오리지널 광고 패키지</p>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 border-t border-slate-700/60 pt-4">
              <li className="flex items-center space-x-2">
                <span className="text-amber-400">✓</span>
                <span><strong>B tv VOD 상영전 광고</strong> (15초/30초 고화질 타겟팅)</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-amber-400">✓</span>
                <span><strong>로딩창 & 홈보드 배너</strong> 독점 노출</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-amber-400">✓</span>
                <span><strong>볼륨 보너스 최대 40%</strong> 및 단독 프로모션 제공</span>
              </li>
            </ul>
          </div>
          <button
            onClick={() => onGoSimulator('BTV')}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl text-xs shadow-lg transition-all"
          >
            B tv 단독 견적 시뮬레이션하기 →
          </button>
        </div>

        {/* IPTV 3사 ADDR3 카드 */}
        <div className="bg-slate-800/80 border border-slate-700 hover:border-sky-500/50 transition-all p-6 rounded-2xl shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-2xl">🌐</span>
              <span className="bg-sky-500/20 text-sky-300 text-xs font-bold px-2.5 py-1 rounded-lg">2,166만 커버리지</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-sky-400">IPTV 3사 통합 광고 (PRIME)</h3>
              <p className="text-xs text-slate-400 mt-1">SKB + KT + LGU+ IPTV 3사 연합 Addressable TV 통합 타겟팅</p>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 border-t border-slate-700/60 pt-4">
              <li className="flex items-center space-x-2">
                <span className="text-sky-400">✓</span>
                <span><strong>전국 IPTV 가구 90% 이상</strong> 단일 캠페인 커버</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-sky-400">✓</span>
                <span><strong>Addressable TV 기반</strong> 가구 단위 빅데이터 타겟팅</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-sky-400">✓</span>
                <span><strong>통합 리포팅 및 단일 정산</strong> 시스템 구축</span>
              </li>
            </ul>
          </div>
          <button
            onClick={() => onGoSimulator('ADDR3')}
            className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold py-3 rounded-xl text-xs shadow-lg transition-all"
          >
            IPTV 3사 견적 시뮬레이션하기 →
          </button>
        </div>
      </div>

      {/* 타겟팅 & 주요 특징 상세표 */}
      <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl space-y-4">
        <h3 className="font-bold text-white text-base">📊 매체별 핵심 비교 가이드</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 uppercase">
              <tr>
                <th className="p-3">구분</th>
                <th className="p-3 text-amber-300">B tv 단독 광고</th>
                <th className="p-3 text-sky-300">IPTV 3사 PRIME (ADDR3)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700 text-slate-200">
              <tr>
                <td className="p-3 font-bold text-slate-400">전체 커버리지</td>
                <td className="p-3 font-bold text-white">약 700만 가구</td>
                <td className="p-3 font-bold text-white">약 2,166만 가구 (전국 단위)</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-400">기본 CPV (VOD)</td>
                <td className="p-3 font-mono">15원 ~ 30원</td>
                <td className="p-3 font-mono">20원 ~ 35원</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-400">타겟팅 옵션</td>
                <td className="p-3">지역/시간/채널 + B tv 오리지널 세그먼트</td>
                <td className="p-3">3사 빅데이터 연합 통합 가구 타겟팅</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-400">추천 집행 목적</td>
                <td className="p-3">B tv 고객 맞춤 브랜딩 및 효율 중심 캠페인</td>
                <td className="p-3">대규모 신제품 런칭 및 전국 인지도 극대화</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}