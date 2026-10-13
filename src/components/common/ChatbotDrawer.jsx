import React, { useState, useRef, useEffect } from 'react';

export default function ChatbotDrawer({ isOpen, onClose, onApplyRecommendation }) {
  const [messages, setMessages] = useState([
    { id: '1', sender: 'agent', text: '안녕하세요! B tv 단독 및 IPTV 3사 Addr.TV PRIME 정밀 정책 계산 Agent입니다. 👋\n\n문의 사항이 있으시면 말씀해 주세요!' }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const agentMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        text: '📡 요청하신 조건에 맞는 IPTV 3사 PRIME 상품 및 15초 표준 단가를 추천해 드립니다.',
        recommendation: { platformMode: 'ADDR3', productMode: 'PRIME_ESSENTIAL', monthlyBudget: 30000000, videoLength: '15', channelPackage: 'ALL' }
      };
      setMessages(prev => [...prev, agentMsg]);
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 w-[430px] max-w-[calc(100vw-2rem)] h-[620px] max-h-[calc(100vh-8rem)] bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-700 bg-slate-900">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-red-600 to-orange-500 p-2 rounded-xl text-lg shadow">🤖</div>
          <div><h3 className="font-bold text-white text-sm">B tv AI 광고 컨설턴트</h3><p className="text-[11px] text-slate-400">실시간 정책 문의</p></div>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white font-bold text-lg p-1">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[88%] rounded-2xl p-3.5 leading-relaxed whitespace-pre-wrap ${msg.sender === 'user' ? 'bg-red-600 text-white rounded-br-none' : 'bg-slate-900 border border-slate-700 text-slate-200 rounded-bl-none'}`}>
              {msg.text}
              {msg.recommendation && (
                <button onClick={() => onApplyRecommendation(msg.recommendation)} className="mt-3 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3 rounded-xl text-xs">✨ 추천 조건 반영</button>
              )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="p-3 bg-slate-900 border-t border-slate-700 flex space-x-2">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="질문 또는 조건 계산 요청..." className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-red-500" />
        <button onClick={handleSend} className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 rounded-xl text-xs">전송</button>
      </div>
    </div>
  );
}