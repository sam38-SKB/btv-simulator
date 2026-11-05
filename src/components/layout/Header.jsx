import React from 'react';

export default function Header({ user, currentTab, onSelectTab, onLogout, onGoLogin }) {
  return (
    <header className="bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 sticky top-0 z-40 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        
        {/* 1. 로고 클릭 시 메인 홈(HomeMenuView)으로 이동 */}
        <div 
          onClick={() => onSelectTab('HOME')} 
          className="flex items-center space-x-2 cursor-pointer group shrink-0"
        >
          <div className="w-8 h-8 bg-gradient-to-tr from-red-600 via-orange-500 to-amber-400 rounded-xl flex items-center justify-center font-black text-white text-base shadow-md shadow-red-600/30 group-hover:scale-105 transition-all ring-1 ring-red-500/40">
            B
          </div>
          <div>
            <div className="font-black text-white text-sm leading-tight tracking-tight flex items-center space-x-1">
              <span>B tv 광고 안내</span>
              <span className="text-[9px] font-bold bg-gradient-to-r from-red-600 to-orange-500 text-white px-1.5 py-0.2 rounded-full shadow-sm uppercase tracking-wider">
                AGENT
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-semibold">
              상품 문의 및 견적 산출 시스템
            </div>
          </div>
        </div>

        {/* 2. 대형 GNB 메뉴 */}
        <nav className="flex items-center space-x-1.5 bg-slate-900/90 p-1.5 rounded-2xl border-2 border-slate-700/80 shadow-2xl text-xs font-extrabold backdrop-blur-md shrink-0">
          <button
            onClick={() => onSelectTab('BTV')}
            className={`px-3.5 py-2 rounded-xl transition-all duration-200 flex items-center space-x-1.5 relative whitespace-nowrap ${
              currentTab === 'BTV' 
                ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-slate-950 font-black shadow-lg shadow-amber-500/30 scale-102 ring-2 ring-amber-300' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800/90'
            }`}
          >
            <span className="text-base">📺</span>
            <span className="text-xs font-black tracking-tight">실시간 광고(AD+)</span>
            {currentTab === 'BTV' && (
              <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping absolute top-1.5 right-1.5" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('ADDR3')}
            className={`px-3.5 py-2 rounded-xl transition-all duration-200 flex items-center space-x-1.5 relative whitespace-nowrap ${
              currentTab === 'ADDR3' 
                ? 'bg-gradient-to-r from-sky-400 via-sky-500 to-blue-600 text-slate-950 font-black shadow-lg shadow-sky-500/30 scale-102 ring-2 ring-sky-300' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800/90'
            }`}
          >
            <span className="text-base">🌐</span>
            <span className="text-xs font-black tracking-tight">로딩광고(VOD)</span>
            {currentTab === 'ADDR3' && (
              <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping absolute top-1.5 right-1.5" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('INFO')}
            className={`px-3.5 py-2 rounded-xl transition-all duration-200 flex items-center space-x-1.5 relative whitespace-nowrap ${
              currentTab === 'INFO' 
                ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white font-black shadow-lg shadow-purple-500/30 scale-102 ring-2 ring-purple-300' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800/90'
            }`}
          >
            <span className="text-base">📖</span>
            <span className="text-xs font-black tracking-tight">배너광고</span>
            {currentTab === 'INFO' && (
              <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping absolute top-1.5 right-1.5" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('NEWS')}
            className={`px-3.5 py-2 rounded-xl transition-all duration-200 flex items-center space-x-1.5 relative whitespace-nowrap ${
              currentTab === 'NEWS' 
                ? 'bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600 text-slate-950 font-black shadow-lg shadow-emerald-500/30 scale-102 ring-2 ring-emerald-300' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800/90'
            }`}
          >
            <span className="text-base">📰</span>
            <span className="text-xs font-black tracking-tight">B tv 매체 소식</span>
            {currentTab === 'NEWS' && (
              <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping absolute top-1.5 right-1.5" />
            )}
          </button>
        </nav>

        {/* 3. 계정 영역 및 로그인/로그아웃 */}
        <div className="flex items-center space-x-2 shrink-0">
          {user ? (
            <>
              <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl shadow-inner">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ring-2 ring-emerald-500/20" />
                <div className="text-xs font-bold text-slate-200 whitespace-nowrap">
                  <span>{user?.name || '담당자'}</span>
                  <span className="text-slate-400 text-[11px] font-normal ml-1">({user?.company || 'SKB'})</span>
                </div>
                
                {user?.role === 'ADMIN' && (
                  <button
                    onClick={() => onSelectTab('ADMIN')}
                    className={`ml-1.5 px-2 py-0.5 rounded-lg text-[11px] font-extrabold transition-all flex items-center space-x-1 border shadow-sm ${
                      currentTab === 'ADMIN'
                        ? 'bg-purple-600 border-purple-400 text-white ring-1 ring-purple-300'
                        : 'bg-purple-950/80 border-purple-800/80 text-purple-300 hover:bg-purple-900 hover:text-white'
                    }`}
                  >
                    <span>🛡️</span>
                    <span>관리자</span>
                  </button>
                )}
              </div>

              <button
                onClick={onLogout}
                className="bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs px-3 py-2 rounded-xl border border-slate-700 transition-all shadow whitespace-nowrap"
              >
                로그아웃
              </button>
            </>
          ) : (
            <button
              onClick={onGoLogin}
              className="bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-lg transition-all whitespace-nowrap"
            >
              로그인
            </button>
          )}
        </div>

      </div>
    </header>
  );
}