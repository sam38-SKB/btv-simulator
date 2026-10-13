import React, { useState } from 'react';

export default function SignupView({ onSignup, onCancel }) {
  const [form, setForm] = useState({ id: '', password: '', name: '', company: '', email: '', phone: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSignup(form);
  };

  return (
    <div className="max-w-lg mx-auto my-12 bg-slate-800 border border-slate-700 p-8 rounded-2xl shadow-2xl">
      <h2 className="text-2xl font-bold text-center text-white mb-2">회원가입 신청</h2>
      <p className="text-sm text-center text-slate-400 mb-6">입력 정보는 관리자 승인용으로 사용됩니다</p>
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div className="grid grid-cols-2 gap-3">
          <input type="text" placeholder="아이디" required value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-white" />
          <input type="password" placeholder="비밀번호" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-white" />
        </div>
        <input type="text" placeholder="이름 (담당자)" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white" />
        <input type="text" placeholder="재직 회사명 (대행사/광고주)" required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white" />
        <div className="grid grid-cols-2 gap-3">
          <input type="email" placeholder="이메일" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-white" />
          <input type="tel" placeholder="휴대폰 번호" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-white" />
        </div>
        <div className="pt-4 flex space-x-3">
          <button type="button" onClick={onCancel} className="w-1/3 bg-slate-700 p-3 rounded-xl font-bold">취소</button>
          <button type="submit" className="w-2/3 bg-red-600 hover:bg-red-500 p-3 rounded-xl font-bold text-white">가입 신청 제출</button>
        </div>
      </form>
    </div>
  );
}