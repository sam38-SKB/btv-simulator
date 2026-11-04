import React from 'react';

export default function HomeMenuView({ onSelectTab }) {
  const menuCards = [
    {
      id: 'BTV',
      title: '실시간 채널 광고',
      subTitle: 'Addressable TV',
      highlight: '100여개 실시간 제휴채널 대상 오디언스 정밀 타깃 노출',
      desc: '데이터 기반 정밀 오디언스 타겟팅 ("같은 채널, 다른 광고!")',
      img: '/Adressable_TV_Menu.png',
      badge: 'Audience Targeting',
      badgeColor: 'from-amber-500 to-orange-500',
      borderColor: 'hover:border-amber-500/80 hover:shadow-amber-500/20',
    },
    {
      id: 'ADDR3',
      title: 'B tv VOD 광고',
      subTitle: 'VOD Pre-Roll',
      highlight: 'VOD 시청 직전 광고 노출로 광고 몰입도 극대화',
      desc: '스킵 없는 100% 시청, 극대화된 몰입도',
      img: '/VOD_Menu.png',
      badge: 'Engagement',
      badgeColor: 'from-sky-500 to-blue-600',
      borderColor: 'hover:border-sky-500/80 hover:shadow-sky-500/20',
    },
    {
      id: 'INFO',
      title: '홈 배너 광고',
      subTitle: 'Big Banner & 브랜드관',
      highlight: '셋톱박스 홈 진입시 노출되는 광고상품으로 브랜드 인지도 확보',
      desc: '압도적 Big Screen을 통한 강력한 브랜딩 효과',
      img: '/banner_Menu.png',
      badge: 'Viewability',
      badgeColor: 'from-purple-500 to-indigo-600',
      borderColor: 'hover:border-purple-500/80 hover:shadow-purple-500/20',
    },
  ];

  return (
    <div className="space-y-8 py-4">
      {/* 타이틀 헤더 */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          B tv 광고 매체를 선택하세요
        </h2>
        <p className="text-xs md:text-sm text-slate-400 font-medium">
          원하시는 광고 상품을 선택하시면 맞춤형 견적 산출 및 매체 가이드를 확인하실 수 있습니다.
        </p>
      </div>

      {/* 3개 광고 메뉴 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {menuCards.map((card) => (
          <div
            key={card.id}
            onClick={() => onSelectTab(card.id)}
            className={`bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-2 shadow-2xl ${card.borderColor} flex flex-col group`}
          >
            {/* 이미지 영역 */}
            <div className="h-64 w-full bg-slate-950 overflow-hidden relative border-b border-slate-800/80 flex items-center justify-center p-2">
              <img
                src={card.img}
                alt={card.title}
                className="w-full h-full object-contain group-hover:scale-102 transition-transform duration-300"
              />
              <span className={`absolute top-3 right-3 text-[10px] font-extrabold text-white px-2.5 py-1 rounded-full bg-gradient-to-r ${card.badgeColor} shadow-md`}>
                {card.badge}
              </span>
            </div>

            {/* 카드 하단 이동 버튼 */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors">
                    {card.title}
                  </h3>
                  <span className="text-xs font-semibold text-slate-400">{card.subTitle}</span>
                </div>
                <p className="text-xs text-amber-400/90 font-bold mt-1">
                  {card.highlight}
                </p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {card.desc}
                </p>
              </div>
              <div className="pt-2 flex items-center text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                <span>시뮬레이션 시작하기</span>
                <span className="ml-1 text-sm">▶</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}