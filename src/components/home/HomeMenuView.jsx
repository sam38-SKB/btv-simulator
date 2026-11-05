import React from 'react';

export default function HomeMenuView({ onSelectTab }) {
  const menuCards = [
    {
      id: 'BTV',
      title: '실시간 채널 광고',
      img: '/Adressable_TV_Menu.png',
      borderColor: 'hover:border-amber-500/80 hover:shadow-amber-500/30',
    },
    {
      id: 'ADDR3',
      title: 'B tv VOD 광고',
      img: '/VOD_Menu.png',
      borderColor: 'hover:border-sky-500/80 hover:shadow-sky-500/30',
    },
    {
      id: 'INFO',
      title: '홈 배너 광고',
      img: '/banner_Menu.png',
      borderColor: 'hover:border-purple-500/80 hover:shadow-purple-500/30',
    },
  ];

  return (
    <div className="space-y-8 py-4">
      {/* 상단 타이틀 헤더 */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          B tv 광고 매체를 선택하세요
        </h2>
        <p className="text-xs md:text-sm text-slate-400 font-medium">
          원하시는 광고 상품을 선택하시면 맞춤형 견적 산출 및 매체 가이드를 확인하실 수 있습니다.
        </p>
      </div>

      {/* 3개 광고 메뉴 이미지 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {menuCards.map((card) => (
          <div
            key={card.id}
            onClick={() => onSelectTab(card.id)}
            className={`bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-2 shadow-2xl ${card.borderColor} group p-2.5 flex items-center justify-center`}
          >
            <img
              src={card.img}
              alt={card.title}
              className="w-full h-auto object-contain rounded-xl group-hover:scale-[1.02] transition-transform duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
}