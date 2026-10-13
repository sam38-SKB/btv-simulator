import React from 'react';
import { AUDIENCE_DATA } from '../../constants/audienceData';

export default function Step4Audience({ state, actions, audienceFormula, onPrev, onNext }) {
  const getAudienceItems = (category) => {
    if (category === '데모그래픽' || category === '페르소나') {
      return Object.keys(AUDIENCE_DATA[category] || {}).map(sub1 => ({
        id: `[${category}] ${sub1}`,
        category,
        title: sub1,
        desc: AUDIENCE_DATA[category][sub1].desc
      }));
    } else if (category === '상품') {
      const items = [];
      const groupObj = AUDIENCE_DATA['상품'] || {};
      Object.keys(groupObj).forEach(group => {
        Object.keys(groupObj[group]).forEach(sub2 => {
          items.push({
            id: `[상품:${group}] ${sub2}`,
            category: '상품',
            group,
            title: `${group} > ${sub2}`,
            desc: groupObj[group][sub2]
          });
        });
      });
      return items;
    }
    return [];
  };

  const toggleAudience = (id) => {
    if (state.selectedAudiences.includes(id)) actions.setSelectedAudiences(state.selectedAudiences.filter(i => i !== id));
    else actions.setSelectedAudiences([...state.selectedAudiences, id]);
  };

  return (
    <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl space-y-4">
      <div className="flex justify-between items-center border-b border-slate-700 pb-3">
        <h3 className="text-base font-bold text-white flex items-center">
          <span className="text-red-500 font-extrabold mr-1.5">4.</span> 오디언스 타겟팅 선택 (대분류 간 AND 고정) <span className="text-red-400 text-xs ml-3 font-normal">* 최소 1개 필수</span>
        </h3>
        <span className="text-xs text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-800 px-3 py-1 rounded-lg">{state.selectedAudiences.length}개 선택됨</span>
      </div>

      <div className="flex space-x-2 border-b border-slate-700/60 pb-3">
        {['데모그래픽', '페르소나', '상품'].map(cat => {
          const count = getAudienceItems(cat).filter(i => state.selectedAudiences.includes(i.id)).length;
          const op = state.categoryOperators[cat] || 'OR';
          return (
            <button key={cat} onClick={() => actions.setAudTab(cat)} className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${state.audTab === cat ? 'bg-red-600 text-white shadow-lg ring-1 ring-red-400' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-700'}`}>
              <span>{cat}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${count > 0 ? 'bg-emerald-950 text-emerald-300 border border-emerald-700 font-extrabold' : 'bg-slate-800 text-slate-500'}`}>{count}개 {count > 1 ? `(${op})` : ''}</span>
            </button>
          );
        })}
      </div>

      <div className="bg-slate-950 p-4 rounded-xl border border-slate-700 space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-b border-slate-800 pb-3">
          <span className="font-bold text-white text-sm flex items-center"><span className="text-red-400 mr-1.5">🏷️</span> [{state.audTab}] 세부 항목 조합 연산자:</span>
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700 space-x-1">
            <button type="button" onClick={() => actions.setCategoryOperators({ ...state.categoryOperators, [state.audTab]: 'OR' })} className={`px-3.5 py-1.5 rounded-lg font-extrabold text-xs transition ${(state.categoryOperators[state.audTab] || 'OR') === 'OR' ? 'bg-red-600 text-white shadow-md ring-1 ring-red-400' : 'text-slate-400 hover:text-white'}`}>OR (합집합)</button>
            <button type="button" onClick={() => actions.setCategoryOperators({ ...state.categoryOperators, [state.audTab]: 'AND' })} className={`px-3.5 py-1.5 rounded-lg font-extrabold text-xs transition ${state.categoryOperators[state.audTab] === 'AND' ? 'bg-sky-600 text-white shadow-md ring-1 ring-sky-400' : 'text-slate-400 hover:text-white'}`}>AND (교집합)</button>
          </div>
        </div>

        <div className="max-h-64 overflow-y-auto pr-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
            {getAudienceItems(state.audTab).map((item) => {
              const isChecked = state.selectedAudiences.includes(item.id);
              return (
                <label key={item.id} className={`p-3 rounded-xl border cursor-pointer transition flex items-start space-x-3 ${isChecked ? 'bg-red-950/40 border-red-500 text-white shadow-md' : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-850'}`}>
                  <input type="checkbox" checked={isChecked} onChange={() => toggleAudience(item.id)} className="mt-1 accent-red-500 w-4 h-4 rounded cursor-pointer" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm flex justify-between items-center">
                      <span>{item.title}</span>
                      {isChecked && <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded font-mono font-bold">선택됨</span>}
                    </div>
                    <div className="text-xs text-slate-400 mt-1 leading-normal line-clamp-2">{item.desc}</div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-slate-950 p-4 rounded-xl border border-slate-700 space-y-2 text-xs">
        <span className="text-slate-300 font-bold block">🎯 최종 타겟팅 조합 산출식 (Boolean Formula):</span>
        <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 font-mono text-emerald-400 font-bold text-xs leading-relaxed break-words whitespace-pre-wrap">{audienceFormula}</div>
      </div>

      <div className="pt-4 flex justify-between">
        <button onClick={onPrev} className="bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-xl font-bold text-sm">◀ 이전</button>
        <button onClick={onNext} className="bg-red-600 hover:bg-red-500 text-white font-bold px-7 py-3 rounded-xl transition shadow-lg text-sm">다음 단계 (최종 견적 확인) ▶</button>
      </div>
    </div>
  );
}