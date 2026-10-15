import React from 'react';

export default function Header({ user, currentTab, onSelectTab, onLogout }) {
  return (
    <header className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* 브랜드 로고 */}
        <div 
          onClick={() => onSelectTab('BTV')} 
          className="flex items-center space-x-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 bg-gradient-to-tr from-red-600 to-orange-500 rounded-xl flex items-center justify-center font-black text-white text-lg shadow-lg group-hover:scale-105 transition-all">
            B
          </div>
          <div>
            <div className="font-black text-white text-base leading-none tracking-tight flex items-center space-x-1">
              <span>B tv Simulator</span>
              <span className="text-[10px] bg-red-600/30 text-red-400 px-1.5 py-0.5 rounded border border-red-500/40">AGENT</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">SK broadband AD Calculator</div>
          </div>
        </div>

        {/* GNB 메인 메뉴 */}
        <nav className="flex items-center space-x-1 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => onSelectTab('BTV')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
              currentTab === 'BTV' 
                ? 'bg-amber-500 text-slate-950 font-black shadow-lg' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>📺</span>
            <span>B tv 단독 광고</span>
          </button>

          <button
            onClick={() => onSelectTab('ADDR3')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
              currentTab === 'ADDR3' 
                ? 'bg-sky-500 text-slate-950 font-black shadow-lg' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>🌐</span>
            <span>IPTV 3사 광고</span>
          </button>

          <button
            onClick={() => onSelectTab('INFO')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
              currentTab === 'INFO' 
                ? 'bg-purple-600 text-white font-black shadow-lg' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>📖</span>
            <span>상품 소개</span>
          </button>
        </nav>

        {/* 우측 유저 프로필 & 관리자 / 로그아웃 */}
        <div className="flex items-center space-x-3 text-xs">
          {user?.role === 'ADMIN' && (
            <button
              onClick={() => onSelectTab('ADMIN')}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center space-x-1 border ${
                currentTab === 'ADMIN'
                  ? 'bg-purple-900/80 border-purple-500 text-purple-200'
                  : 'bg-slate-800 border-slate-700 text-purple-300 hover:bg-slate-700'
              }`}
            >
              <span>🛡️</span>
              <span>관리자</span>
            </button>
          )}

          <div className="hidden sm:flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-slate-200">{user?.name || '담당자'}</span>
            <span className="text-[10px] text-slate-400">({user?.company || 'SKB'})</span>
          </div>

          <button
            onClick={onLogout}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-3 py-2 rounded-xl border border-slate-700 transition-all"
          >
            로그아웃
          </button>
        </div>

      </div>
    </header>
  );
}