import React from 'react';

export default function Header({ user, view, setView, onLogout }) {
  return (
    <header className="border-b border-slate-800 bg-slate-950 px-8 py-4 flex justify-between items-center sticky top-0 z-40">
      <div className="flex items-center space-x-4">
        <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white font-black text-2xl px-4 py-1.5 rounded-xl shadow">B tv</div>
        <span className="font-bold text-xl text-slate-100">B tv / IPTV 3사 PRIME 광고 견적 시뮬레이터</span>
      </div>
      {user && (
        <div className="flex items-center space-x-4">
          <div className="text-right text-sm">
            <span className="font-bold text-white text-base">{user.name}</span>
            <span className="text-slate-400 ml-1.5 font-medium">({user.company})</span>
          </div>
          {user.role === 'ADMIN' && (
            <div className="flex space-x-2 bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button onClick={() => setView('DASHBOARD')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${view === 'DASHBOARD' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}>📊 시뮬레이터</button>
              <button onClick={() => setView('ADMIN')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${view === 'ADMIN' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}>🛡️ 관리자 페이지</button>
            </div>
          )}
          <button onClick={onLogout} className="text-slate-400 hover:text-white text-sm bg-slate-800 px-3 py-1.5 rounded-lg">로그아웃</button>
        </div>
      )}
    </header>
  );
}