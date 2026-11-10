import React from 'react';

export default function MediaNewsView() {
  return (
    <div className="space-y-8 py-2 text-slate-100">
      
      {/* 리포트 상단 타이틀 헤더 */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border border-emerald-500/30 p-6 md:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center space-x-2">
            <span className="bg-emerald-500 text-slate-950 font-black text-[11px] px-3 py-1 rounded-full uppercase tracking-wider">
              Monthly Media Report
            </span>
            <span className="text-xs text-slate-400 font-semibold">대행사 및 랩사 배포용</span>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/90 border border-emerald-800/80 px-3 py-1 rounded-xl">
            2026년 4월호
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          B tv 미디어 소식지 (2026년 4월호)
        </h1>
        <p className="text-xs md:text-sm text-emerald-300 font-bold mt-2">
          라이프스테이지 × 연령별 채널·프로그램·시간대 통합 분석 리포트
        </p>

        {/* 이달의 핵심 요약 */}
        <div className="mt-5 bg-slate-950/80 border border-emerald-500/20 p-4 rounded-2xl">
          <div className="text-xs font-bold text-emerald-400 mb-1 flex items-center space-x-1.5">
            <span>📌</span>
            <span>이달의 핵심 (Key Takeaway)</span>
          </div>
          <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-medium">
            <strong className="text-emerald-300 font-black">40대 이상(40+)이 B tv 실시간 시청의 83.7%를 점유</strong>합니다. 전 연령 공통 저녁 20~22시 피크 — B tv는 구매력 핵심 세대 40+의 미디어입니다.
          </p>
        </div>
      </div>

      {/* 4대 주요 지표 카드 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl flex flex-col justify-between">
          <div className="text-xs text-slate-400 font-bold">40대+ 실시간 시청 점유율</div>
          <div className="text-2xl md:text-3xl font-black text-emerald-400 mt-2 font-mono">83.7%</div>
          <div className="text-[11px] text-slate-400 mt-1">50대 26.9% · 40대 23.1% · 60대 21.9%</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl flex flex-col justify-between">
          <div className="text-xs text-slate-400 font-bold">40대+ 핫딜 이용 비중</div>
          <div className="text-2xl md:text-3xl font-black text-amber-400 mt-2 font-mono">81.3%</div>
          <div className="text-[11px] text-slate-400 mt-1">50대 27.8% · 60대 28.5% 주도</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl flex flex-col justify-between">
          <div className="text-xs text-slate-400 font-bold">전 연령 공통 1위 채널</div>
          <div className="text-xl md:text-2xl font-black text-sky-300 mt-2">MBC Every1</div>
          <div className="text-[11px] text-slate-400 mt-1">10대~70대 전 연령 시청 1위</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl flex flex-col justify-between">
          <div className="text-xs text-slate-400 font-bold">전 연령 공통 1위 프로그램</div>
          <div className="text-xl md:text-2xl font-black text-purple-300 mt-2">21세기 대군부인</div>
          <div className="text-[11px] text-slate-400 mt-1">MBC Every1 · 전 연령 합산 기준</div>
        </div>
      </div>

      {/* 01. 연령대별 시청 점유율 */}
      <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
        <h3 className="text-lg font-extrabold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
          <span className="text-emerald-400 font-mono">01</span>
          <span>연령대별 시청 점유율 — 40대 이상이 주도</span>
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          2026년 4월 B tv 실시간 채널 시청에서 40+(40대 이상)이 전체의 <strong>83.7%</strong>를 점유합니다. 50대(26.9%)가 1위, 40대(23.1%)가 2위로 구매력 최강 세대가 플랫폼을 주도하며, OTT 이탈이 많은 10~30대는 합산 15.9%에 그칩니다.
        </p>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="p-3">구분</th>
                <th className="p-3">10대이하</th>
                <th className="p-3">20대</th>
                <th className="p-3">30대</th>
                <th className="p-3 text-emerald-400">40대</th>
                <th className="p-3 text-emerald-400">50대</th>
                <th className="p-3 text-emerald-400">60대</th>
                <th className="p-3">70대</th>
                <th className="p-3">80대이상</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono text-slate-300">
              <tr>
                <td className="p-3 font-bold text-white font-sans">시청 점유율</td>
                <td className="p-3">0.8%</td>
                <td className="p-3">3.2%</td>
                <td className="p-3">11.9%</td>
                <td className="p-3 font-bold text-emerald-400">23.1%</td>
                <td className="p-3 font-bold text-emerald-400">26.9%</td>
                <td className="p-3 font-bold text-emerald-400">21.9%</td>
                <td className="p-3">9.6%</td>
                <td className="p-3">2.6%</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-white font-sans">피크 시간대</td>
                <td className="p-3">21~22시</td>
                <td className="p-3">21~22시</td>
                <td className="p-3">21~22시</td>
                <td className="p-3">21~22시</td>
                <td className="p-3">21~22시</td>
                <td className="p-3">21~22시</td>
                <td className="p-3">20~21시</td>
                <td className="p-3">20~21시</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-emerald-950/40 border border-emerald-500/30 p-4 rounded-xl text-xs space-y-1">
          <div className="font-extrabold text-emerald-300 flex items-center space-x-1.5">
            <span>💡</span>
            <span>광고주 인사이트</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            B tv는 40+ 전용 미디어입니다. 83.7% 점유는 단순 고령화가 아닌, 구매력 최강 40~60대가 플랫폼을 선택한 결과입니다. 특히 50대(26.9%)·40대(23.1%)가 볼륨을 주도하는 광고 효율 최강 구조입니다.
          </p>
        </div>
      </section>

      {/* 02. 시청시간대 분포 */}
      <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
        <h3 className="text-lg font-extrabold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
          <span className="text-emerald-400 font-mono">02</span>
          <span>시청시간대 분포 — 비피크에도 40+가 있다</span>
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          40+(40대 이상)은 오전(06~12시)과 오후(12~18시)를 합산하면 48~51%로, 저녁(18~24시, 32~34%)보다 오히려 높습니다. 저녁이 피크인 것은 사실이지만 B tv 40+ 시청자는 하루 종일 고르게 분포하여 비피크 시간대에도 도달이 충분히 가능합니다.
        </p>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="p-3">구간</th>
                <th className="p-3">10대이하</th>
                <th className="p-3">20대</th>
                <th className="p-3">30대</th>
                <th className="p-3">40대</th>
                <th className="p-3">50대</th>
                <th className="p-3">60대</th>
                <th className="p-3">70대</th>
                <th className="p-3">80대이상</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono text-slate-300">
              <tr>
                <td className="p-3 font-bold text-white font-sans">오전 06~12시</td>
                <td className="p-3">23.3%</td>
                <td className="p-3">23.5%</td>
                <td className="p-3">24.1%</td>
                <td className="p-3">23.6%</td>
                <td className="p-3">23.4%</td>
                <td className="p-3">24.3%</td>
                <td className="p-3">24.8%</td>
                <td className="p-3 font-bold text-amber-300">25.3%</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-white font-sans">오후 12~18시</td>
                <td className="p-3">24.5%</td>
                <td className="p-3">24.2%</td>
                <td className="p-3">24.8%</td>
                <td className="p-3">24.8%</td>
                <td className="p-3">24.0%</td>
                <td className="p-3">23.9%</td>
                <td className="p-3">24.7%</td>
                <td className="p-3 font-bold text-amber-300">25.8%</td>
              </tr>
              <tr className="bg-emerald-950/20 font-bold text-emerald-300">
                <td className="p-3 font-sans">오전+오후 합산</td>
                <td className="p-3">47.8%</td>
                <td className="p-3">47.7%</td>
                <td className="p-3">48.9%</td>
                <td className="p-3">48.4%</td>
                <td className="p-3">47.4%</td>
                <td className="p-3">48.2%</td>
                <td className="p-3">49.5%</td>
                <td className="p-3">51.1%</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-white font-sans">저녁 18~24시</td>
                <td className="p-3">34.4%</td>
                <td className="p-3">32.9%</td>
                <td className="p-3">31.1%</td>
                <td className="p-3">33.0%</td>
                <td className="p-3">34.1%</td>
                <td className="p-3">33.4%</td>
                <td className="p-3">33.0%</td>
                <td className="p-3">32.1%</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-400 font-sans">심야 00~06시</td>
                <td className="p-3 text-slate-400">17.8%</td>
                <td className="p-3 text-slate-400">19.4%</td>
                <td className="p-3 text-slate-400">20.0%</td>
                <td className="p-3 text-slate-400">18.7%</td>
                <td className="p-3 text-slate-400">18.4%</td>
                <td className="p-3 text-slate-400">18.4%</td>
                <td className="p-3 text-slate-400">17.6%</td>
                <td className="p-3 text-slate-400">16.8%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-emerald-950/40 border border-emerald-500/30 p-4 rounded-xl text-xs space-y-1">
          <div className="font-extrabold text-emerald-300 flex items-center space-x-1.5">
            <span>💡</span>
            <span>광고주 인사이트</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            시간대보다 채널·프로그램 선택이 타겟 분리의 핵심입니다. 저녁 황금 시간대(20~22시)는 전 연령 공통 집중 구간으로 시니어 전체 도달에 최적이며, 80대는 오후 시간대 교양 프로그램 광고가 효과적입니다.
          </p>
        </div>
      </section>

      {/* 03 & 04. 선호 채널 및 프로그램 TOP 5 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 03. 선호 채널 TOP 5 */}
        <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h3 className="text-base font-extrabold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
            <span className="text-emerald-400 font-mono">03</span>
            <span>연령대별 선호 채널 TOP 5</span>
          </h3>
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 font-bold border-b border-slate-800">
                <tr>
                  <th className="p-2.5">순위</th>
                  <th className="p-2.5">40대</th>
                  <th className="p-2.5">50대</th>
                  <th className="p-2.5">60대</th>
                  <th className="p-2.5">70대</th>
                  <th className="p-2.5">80대+</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                <tr className="font-bold text-amber-300 bg-amber-950/20">
                  <td className="p-2.5 text-white">1위</td>
                  <td className="p-2.5">MBC Every1</td>
                  <td className="p-2.5">MBC Every1</td>
                  <td className="p-2.5">MBC Every1</td>
                  <td className="p-2.5">MBC Every1</td>
                  <td className="p-2.5 text-purple-300 font-extrabold">KBS1</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-white">2위</td>
                  <td className="p-2.5">MBC</td>
                  <td className="p-2.5">YTN</td>
                  <td className="p-2.5">YTN</td>
                  <td className="p-2.5">KBS1</td>
                  <td className="p-2.5">MBC Every1</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-white">3위</td>
                  <td className="p-2.5">KBS1</td>
                  <td className="p-2.5">연합뉴스TV</td>
                  <td className="p-2.5">연합뉴스TV</td>
                  <td className="p-2.5">YTN</td>
                  <td className="p-2.5">연합뉴스TV</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-white">4위</td>
                  <td className="p-2.5">YTN</td>
                  <td className="p-2.5">KBS1</td>
                  <td className="p-2.5">KBS1</td>
                  <td className="p-2.5">연합뉴스TV</td>
                  <td className="p-2.5">YTN</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-white">5위</td>
                  <td className="p-2.5">tvN</td>
                  <td className="p-2.5">tvN</td>
                  <td className="p-2.5">MBN</td>
                  <td className="p-2.5">MBN</td>
                  <td className="p-2.5">TV CHOSUN</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="bg-emerald-950/40 border border-emerald-500/30 p-3.5 rounded-xl text-xs">
            <span className="font-bold text-emerald-300">💡 인사이트:</span> MBC Every1 단일 채널 집행으로 50~70대 전 연령 도달 가능. 80대 타겟은 KBS1 별도 집행 필요.
          </div>
        </section>

        {/* 04. 선호 프로그램 TOP 5 */}
        <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h3 className="text-base font-extrabold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
            <span className="text-emerald-400 font-mono">04</span>
            <span>연령대별 선호 프로그램 TOP 5</span>
          </h3>
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 font-bold border-b border-slate-800">
                <tr>
                  <th className="p-2.5">순위</th>
                  <th className="p-2.5">40대</th>
                  <th className="p-2.5">50대</th>
                  <th className="p-2.5">60대</th>
                  <th className="p-2.5">70대</th>
                  <th className="p-2.5">80대+</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                <tr className="font-bold text-sky-300 bg-sky-950/20">
                  <td className="p-2.5 text-white">1위</td>
                  <td className="p-2.5">21세기 대군부인</td>
                  <td className="p-2.5">21세기 대군부인</td>
                  <td className="p-2.5">21세기 대군부인</td>
                  <td className="p-2.5">21세기 대군부인</td>
                  <td className="p-2.5 text-amber-300">나는 자연인이다</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-white">2위</td>
                  <td className="p-2.5">나 혼자 산다</td>
                  <td className="p-2.5">나 혼자 산다</td>
                  <td className="p-2.5">나 혼자 산다</td>
                  <td className="p-2.5">나 혼자 산다</td>
                  <td className="p-2.5">21세기 대군부인</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-white">3위</td>
                  <td className="p-2.5">놀면 뭐하니?</td>
                  <td className="p-2.5">놀면 뭐하니?</td>
                  <td className="p-2.5">나는 자연인이다</td>
                  <td className="p-2.5">나는 자연인이다</td>
                  <td className="p-2.5">나 혼자 산다</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-white">4위</td>
                  <td className="p-2.5">전지적 참견 시점</td>
                  <td className="p-2.5">전지적 참견 시점</td>
                  <td className="p-2.5">뉴스START</td>
                  <td className="p-2.5">KBS 뉴스광장</td>
                  <td className="p-2.5 font-semibold text-purple-300">KBS 뉴스광장</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-white">5위</td>
                  <td className="p-2.5">히든 아이</td>
                  <td className="p-2.5">히든 아이</td>
                  <td className="p-2.5">놀면 뭐하니?</td>
                  <td className="p-2.5">YTN 뉴스 와이드</td>
                  <td className="p-2.5 font-semibold text-purple-300">아침마당</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="bg-emerald-950/40 border border-emerald-500/30 p-3.5 rounded-xl text-xs">
            <span className="font-bold text-emerald-300">💡 인사이트:</span> 80대는 KBS1 교양 집중 — 건강·생활 제품의 인간극장·아침마당 광고가 최적 포맷입니다.
          </div>
        </section>

      </div>

      {/* 05 & 06. MBC Every1 선호도 및 장르별 시청 점유 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 05. MBC Every1 분석 */}
        <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h3 className="text-base font-extrabold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
            <span className="text-emerald-400 font-mono">05</span>
            <span>MBC Every1 — 연령별 선호 프로그램</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            MBC Every1은 전 연령 공통 1위 채널로, <strong>나 혼자 산다</strong>가 전 연령에서 점유율 21% 이상으로 압도적 1위입니다.
          </p>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between items-center text-slate-300">
              <span className="font-bold text-white">1위: 나 혼자 산다</span>
              <span className="font-mono text-emerald-400 font-bold">점유율 21%+</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>2위: 놀면 뭐하니?</span>
              <span className="font-mono">12~13%</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>3위: 21세기 대군부인</span>
              <span className="font-mono">11~12%</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>4위: 히든 아이</span>
              <span className="font-mono">11%</span>
            </div>
          </div>
          <div className="bg-emerald-950/40 border border-emerald-500/30 p-3.5 rounded-xl text-xs">
            <span className="font-bold text-emerald-300">💡 인사이트:</span> 1개 프로그램 집행만으로 10대~80대 전 연령 동시 도달이 가능하며, 특히 40~60대 집중도가 높습니다.
          </div>
        </section>

        {/* 06. 장르별 시청 점유 */}
        <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h3 className="text-base font-extrabold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
            <span className="text-emerald-400 font-mono">06</span>
            <span>장르별 시청 점유 — 연령별 수렴 패턴</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            40대는 예능·드라마(32.1%)가 뉴스계열(16.9%)을 앞서지만, 60대 이상부터 역전되어 뉴스가 우세해지며 80대는 KBS 교양으로 완전 수렴합니다.
          </p>
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 font-bold border-b border-slate-800">
                <tr>
                  <th className="p-2.5">구분</th>
                  <th className="p-2.5">40대</th>
                  <th className="p-2.5">50대</th>
                  <th className="p-2.5">60대</th>
                  <th className="p-2.5">70대</th>
                  <th className="p-2.5">80대+</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono text-slate-300">
                <tr>
                  <td className="p-2.5 font-bold text-white font-sans">뉴스계열</td>
                  <td className="p-2.5">16.9%</td>
                  <td className="p-2.5">19.3%</td>
                  <td className="p-2.5 font-bold text-amber-300">25.5%</td>
                  <td className="p-2.5 font-bold text-amber-300">27.0%</td>
                  <td className="p-2.5 font-bold text-amber-300">22.4%</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-white font-sans">예능·드라마</td>
                  <td className="p-2.5 font-bold text-sky-300">32.1%</td>
                  <td className="p-2.5 font-bold text-sky-300">28.1%</td>
                  <td className="p-2.5">22.1%</td>
                  <td className="p-2.5">18.5%</td>
                  <td className="p-2.5">17.8%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="bg-emerald-950/40 border border-emerald-500/30 p-3.5 rounded-xl text-xs">
            <span className="font-bold text-emerald-300">💡 인사이트:</span> 40~50대는 예능 채널, 60~70대는 뉴스 채널, 80대는 KBS 교양으로 세분화 집행을 권장합니다.
          </div>
        </section>

      </div>

      {/* 07 & 08. B tv 핫딜 채널 서비스 및 이용 분석 */}
      <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
        <div className="border-b border-slate-800 pb-3 flex flex-wrap justify-between items-center gap-2">
          <h3 className="text-lg font-extrabold text-white flex items-center space-x-2">
            <span className="text-emerald-400 font-mono">07 & 08</span>
            <span>B tv 핫딜 채널 — 커머스 연결 및 이용 분석</span>
          </h3>
          <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full font-bold">
            40+ 이용 비중 81.3%
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          B tv 핫딜은 가입자가 리모컨 재핑 중 즉시 홈쇼핑 상품 홍보 영상이 재생되는 가상 채널입니다. 전화 주문 및 LMS 모바일 결제를 지원하며, 50대(27.8%)와 60대(28.5%)가 핵심 이용 세대(합산 56.3%)입니다.
        </p>

        {/* 핫딜 채널 이용 비중 표 */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-200">핫딜 채널 연령대별 이용 비중 (2026.04)</div>
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 font-bold border-b border-slate-800">
                <tr>
                  <th className="p-2.5">구분</th>
                  <th className="p-2.5">10대이하</th>
                  <th className="p-2.5">20대</th>
                  <th className="p-2.5">30대</th>
                  <th className="p-2.5 text-emerald-400">40대</th>
                  <th className="p-2.5 text-emerald-400">50대</th>
                  <th className="p-2.5 text-emerald-400">60대</th>
                  <th className="p-2.5">70대</th>
                  <th className="p-2.5">80대이상</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono text-slate-300">
                <tr>
                  <td className="p-2.5 font-bold text-white font-sans">이용 비중</td>
                  <td className="p-2.5">0.7%</td>
                  <td className="p-2.5">2.6%</td>
                  <td className="p-2.5">7.3%</td>
                  <td className="p-2.5 font-bold text-emerald-400">16.8%</td>
                  <td className="p-2.5 font-bold text-emerald-400">27.8%</td>
                  <td className="p-2.5 font-bold text-emerald-400">28.5%</td>
                  <td className="p-2.5">12.9%</td>
                  <td className="p-2.5">3.3%</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-white font-sans">집중도(인원)</td>
                  <td className="p-2.5 text-slate-500">-</td>
                  <td className="p-2.5 text-slate-500">-</td>
                  <td className="p-2.5 text-slate-500">-</td>
                  <td className="p-2.5">24,757명</td>
                  <td className="p-2.5 font-bold text-amber-300">41,010명</td>
                  <td className="p-2.5 font-bold text-amber-300">42,021명</td>
                  <td className="p-2.5">19,033명</td>
                  <td className="p-2.5">4,865명</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-emerald-950/40 border border-emerald-500/30 p-4 rounded-xl text-xs space-y-1">
          <div className="font-extrabold text-emerald-300 flex items-center space-x-1.5">
            <span>💡</span>
            <span>서비스 특장점 & 인사이트</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            50대·60대 TOP20 인기 상품이 100% 일치하여 동일 상품(활전복, 인견 투피스, 불닭발 등)으로 두 세대를 동시에 공략할 수 있습니다. TV 시청 중 바로 커머스로 연결되는 B tv만의 브랜딩+퍼포먼스 원스톱 상품입니다.
          </p>
        </div>
      </section>

      {/* 09. 연령별 추천 광고 업종 x 채널 매핑 */}
      <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
        <h3 className="text-lg font-extrabold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
          <span className="text-emerald-400 font-mono">09</span>
          <span>핵심 추천 광고 업종 × 연령 매핑</span>
        </h3>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="p-3">연령대</th>
                <th className="p-3">추천 업종 1순위</th>
                <th className="p-3">추천 업종 2순위</th>
                <th className="p-3">추천 채널</th>
                <th className="p-3">추천 시간대</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              <tr>
                <td className="p-3 font-bold text-emerald-400">40대</td>
                <td className="p-3 font-semibold text-white">보험·연금·IRP</td>
                <td className="p-3">스마트가전·식품</td>
                <td className="p-3">MBC Every1 / MBC</td>
                <td className="p-3 font-mono text-slate-400">저녁 20~22시 (피크) / 오전 06~12시</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-emerald-400">50대</td>
                <td className="p-3 font-semibold text-white">건강기능식품·웰니스</td>
                <td className="p-3">금융·여행·패션</td>
                <td className="p-3">MBC Every1 / YTN</td>
                <td className="p-3 font-mono text-slate-400">저녁 20~22시 (피크) / 오후 12~18시</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-emerald-400">60대</td>
                <td className="p-3 font-semibold text-white">여행·레저·패션</td>
                <td className="p-3">식품·홈케어</td>
                <td className="p-3">KBS1 / YTN / MBC Every1</td>
                <td className="p-3 font-mono text-slate-400">저녁 20~22시 (피크) / 오전 06~12시</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-emerald-400">70대</td>
                <td className="p-3 font-semibold text-white">의료기기·건강식품</td>
                <td className="p-3">여행·보험</td>
                <td className="p-3">KBS1 / YTN / 연합뉴스TV</td>
                <td className="p-3 font-mono text-slate-400">저녁 20~21시 (피크) / 오전 06~12시</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-emerald-400">80대이상</td>
                <td className="p-3 font-semibold text-white">의료·요양·건강관리</td>
                <td className="p-3">생활용품·식품</td>
                <td className="p-3">KBS1 / 연합뉴스TV</td>
                <td className="p-3 font-mono text-slate-400">저녁 20~21시 (피크) / 오전·오후 균등</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 하단 광고 집행 문의 푸터 */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
        <div>
          <div className="font-bold text-white text-sm">광고 집행 및 리포트 관련 문의</div>
          <div className="mt-1">B tv 광고 영업팀 | btv_ad@skbroadband.com</div>
        </div>
        <div className="text-right text-[11px]">
          ※ 본 소식지는 매월 초 자동 발행됩니다.
        </div>
      </div>

    </div>
  );
}