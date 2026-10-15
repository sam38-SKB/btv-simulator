import React from 'react';

export default function Header({ user, currentTab, onSelectTab, onLogout }) {
  return (
    <header className="bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 sticky top-0 z-40 shadow-2xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
        
        {/* 로고 & 브랜딩 */}
        <div 
          onClick={() => onSelectTab('BTV')} 
          className="flex items-center space-x-3 cursor-pointer group shrink-0"
        >
          <div className="w-11 h-11 bg-gradient-to-tr from-red-600 via-orange-500 to-amber-400 rounded-2xl flex items-center justify-center font-black text-white text-2xl shadow-xl shadow-red-600/30 group-hover:scale-105 transition-all ring-2 ring-red-500/40">
            B
          </div>
          <div>
            <div className="font-black text-white text-lg leading-tight tracking-tight flex items-center space-x-1.5">
              <span>B tv Simulator</span>
              <span className="text-[10px] font-bold bg-gradient-to-r from-red-600 to-orange-500 text-white px-2 py-0.5 rounded-full shadow-sm uppercase tracking-wider">
                AGENT
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-semibold mt-0.5">
              SK broadband AD Media Planner
            </div>
          </div>
        </div>

        {/* 🌟 시각적으로 확장되고 눈에 띄는 대형 GNB 메뉴 */}
        <nav className="flex items-center space-x-2 bg-slate-900/90 p-2 rounded-2xl border-2 border-slate-700/80 shadow-2xl text-sm font-extrabold backdrop-blur-md">
          {/* B tv 단독 광고 버튼 */}
          <button
            onClick={() => onSelectTab('BTV')}
            className={`px-6 py-2.5 rounded-xl transition-all duration-200 flex items-center space-x-2 relative ${
              currentTab === 'BTV' 
                ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-slate-950 font-black shadow-lg shadow-amber-500/30 scale-105 ring-2 ring-amber-300' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800/90 hover:scale-102'
            }`}
          >
            <span className="text-lg">📺</span>
            <span className="text-sm font-black tracking-tight">B tv 단독 광고</span>
            {currentTab === 'BTV' && (
              <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping absolute top-2 right-2" />
            )}
          </button>

          {/* IPTV 3사 광고 버튼 */}
          <button
            onClick={() => onSelectTab('ADDR3')}
            className={`px-6 py-2.5 rounded-xl transition-all duration-200 flex items-center space-x-2 relative ${
              currentTab === 'ADDR3' 
                ? 'bg-gradient-to-r from-sky-400 via-sky-500 to-blue-600 text-slate-950 font-black shadow-lg shadow-sky-500/30 scale-105 ring-2 ring-sky-300' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800/90 hover:scale-102'
            }`}
          >
            <span className="text-lg">🌐</span>
            <span className="text-sm font-black tracking-tight">IPTV 3사 광고</span>
            {currentTab === 'ADDR3' && (
              <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping absolute top-2 right-2" />
            )}
          </button>

          {/* 상품 소개 버튼 */}
          <button
            onClick={() => onSelectTab('INFO')}
            className={`px-6 py-2.5 rounded-xl transition-all duration-200 flex items-center space-x-2 relative ${
              currentTab === 'INFO' 
                ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white font-black shadow-lg shadow-purple-500/30 scale-105 ring-2 ring-purple-300' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800/90 hover:scale-102'
            }`}
          >
            <span className="text-lg">📖</span>
            <span className="text-sm font-black tracking-tight">상품 소개</span>
          </button>
        </nav>

        {/* 오른쪽 유저 정보 & 관리자 / 로그아웃 */}
        <div className="flex items-center space-x-3 shrink-0">
          {user?.role === 'ADMIN' && (
            <button
              onClick={() => onSelectTab('ADMIN')}
              className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all flex items-center space-x-1.5 border-2 shadow-lg ${
                currentTab === 'ADMIN'
                  ? 'bg-purple-900/90 border-purple-400 text-purple-200 shadow-purple-900/50 scale-105 ring-2 ring-purple-400/50'
                  : 'bg-slate-900/80 border-purple-800/60 text-purple-300 hover:bg-purple-950/80 hover:border-purple-600'
              }`}
            >
              <span className="text-sm">🛡️</span>
              <span>관리자</span>
            </button>
          )}

          <div className="hidden lg:flex items-center space-x-2.5 bg-slate-900/90 border border-slate-800 px-3.5 py-2 rounded-xl shadow-inner">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse ring-4 ring-emerald-500/20" />
            <div className="text-xs font-bold text-slate-200">
              <span>{user?.name || '담당자'}</span>
              <span className="text-slate-400 text-[11px] font-normal ml-1">({user?.company || 'SKB'})</span>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 transition-all shadow"
          >
            로그아웃
          </button>
        </div>

      </div>
    </header>
  );
}