import React, { useState } from 'react';

export default function LoginView({ onLogin, onGoSignup }) {
  const [loginId, setLoginId] = useState('');
  const [loginPw, setLoginPw] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(loginId, loginPw);
  };

  return (
    <div className="max-w-md mx-auto my-16 bg-slate-800 border border-slate-700 p-8 rounded-2xl shadow-2xl">
      <h2 className="text-2xl font-bold text-center text-white mb-2">B tv Agent 로그인</h2>
      <p className="text-sm text-center text-slate-400 mb-6">승인 완료된 계정으로 로그인해 주세요</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-bold text-slate-300">아이디</label>
          <input type="text" required value={loginId} onChange={(e) => setLoginId(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white mt-1" />
        </div>
        <div>
          <label className="text-sm font-bold text-slate-300">비밀번호</label>
          <input type="password" required value={loginPw} onChange={(e) => setLoginPw(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white mt-1" />
        </div>
        <button type="submit" className="w-full bg-red-600 hover:bg-red-500 font-bold py-3.5 rounded-xl text-white text-base mt-2 transition">로그인</button>
      </form>
      <div className="mt-6 pt-4 border-t border-slate-700 text-xs text-slate-400 space-y-2">
        <div className="font-bold text-slate-300">⚡ 빠른 로그인 테스트</div>
        <div className="flex justify-between bg-slate-900 p-2.5 rounded-lg items-center">
          <span>승인완료 계정: <code className="text-emerald-400 font-bold">user_kim</code></span>
          <button onClick={() => { setLoginId('user_kim'); setLoginPw('1234'); }} className="text-red-400 underline font-bold">자동 입력</button>
        </div>
        <div className="flex justify-between bg-slate-900 p-2.5 rounded-lg items-center">
          <span>관리자 계정: <code className="text-purple-400 font-bold">admin</code></span>
          <button onClick={() => { setLoginId('admin'); setLoginPw('1234'); }} className="text-red-400 underline font-bold">자동 입력</button>
        </div>
      </div>
      <div className="mt-6 text-center text-sm text-slate-400">
        계정이 없으신가요? <button onClick={onGoSignup} className="text-red-400 underline font-bold ml-1">회원가입 신청</button>
      </div>
    </div>
  );
}