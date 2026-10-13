import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useSimulator } from './hooks/useSimulator';
import { DEFAULT_BONUS_RULES, DEFAULT_SURCHARGE_RULES, DEFAULT_PROMO_RULES } from './constants/defaultRules';

import Header from './components/layout/Header';
import StepIndicator from './components/layout/StepIndicator';
import LoginView from './components/auth/LoginView';
import SignupView from './components/auth/SignupView';

import Step1Budget from './components/steps/Step1Budget';
import Step2Platform from './components/steps/Step2Platform';
import Step3Package from './components/steps/Step3Package';
import Step4Audience from './components/steps/Step4Audience';
import Step5Estimate from './components/steps/Step5Estimate';

import AdminPanel from './components/admin/AdminPanel';
import ChatbotDrawer from './components/common/ChatbotDrawer';
import ProposalModal from './components/common/ProposalModal';

export default function App() {
  const { users, currentUser, login, signup, logout, updateUserStatus, deleteUser } = useAuth();
  const [view, setView] = useState('DASHBOARD');
  
  const [bonusRules, setBonusRules] = useState(() => {
    try {
      const saved = localStorage.getItem('btv_bonus_rules');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.BTV?.length > 0 || parsed.ADDR3?.length > 0)) return parsed;
      }
    } catch (e) {}
    return DEFAULT_BONUS_RULES;
  });

  const [surchargeRules, setSurchargeRules] = useState(() => {
    try {
      const saved = localStorage.getItem('btv_surcharge_rules');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.BTV || parsed.ADDR3)) return parsed;
      }
    } catch (e) {}
    return DEFAULT_SURCHARGE_RULES;
  });

  const [promoRules, setPromoRules] = useState(() => {
    try {
      const saved = localStorage.getItem('btv_promo_rules');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.BTV?.length > 0 || parsed.ADDR3?.length > 0)) return parsed;
      }
    } catch (e) {}
    return DEFAULT_PROMO_RULES;
  });

  useEffect(() => {
    localStorage.setItem('btv_bonus_rules', JSON.stringify(bonusRules));
  }, [bonusRules]);

  useEffect(() => {
    localStorage.setItem('btv_surcharge_rules', JSON.stringify(surchargeRules));
  }, [surchargeRules]);

  useEffect(() => {
    localStorage.setItem('btv_promo_rules', JSON.stringify(promoRules));
  }, [promoRules]);

  const simulator = useSimulator(bonusRules, surchargeRules, promoRules);
  const { state, actions, volInfo, audienceFormula, calculation } = simulator;

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isProposalOpen, setIsProposalOpen] = useState(false);

  const handleLogin = (id, pw) => {
    const res = login(id, pw);
    if (!res.success) alert(res.message);
    else setView(res.role === 'ADMIN' ? 'ADMIN' : 'DASHBOARD');
  };

  const handleSignup = (form) => {
    const res = signup(form);
    if (!res.success) alert(res.message);
    else { alert('회원가입 신청이 완료되었습니다. 관리자 승인 후 로그인해 주세요.'); setView('LOGIN'); }
  };

  const handleUpdateBonus = (platform, actionType, index, field, value) => {
    setBonusRules(prev => {
      const updated = { ...prev };
      const list = [...(updated[platform] || [])];
      if (actionType === 'ADD') list.push({ minMonthlyBudget: 10000000, minMonths: 1, rate: 10 });
      else if (actionType === 'DELETE') list.splice(index, 1);
      else if (actionType === 'CHANGE') list[index] = { ...list[index], [field]: value };
      updated[platform] = list;
      return updated;
    });
  };

  // 매체별 타겟팅 할증 동적 변경 핸들러
  const handleUpdateSurcharge = (platform, category, actionType, index, field, value) => {
    setSurchargeRules(prev => {
      const updated = { ...prev };
      const platformObj = { ...(updated[platform] || DEFAULT_SURCHARGE_RULES[platform]) };
      const list = [...(platformObj[category] || [])];

      if (actionType === 'ADD') list.push({ id: `S_${Date.now()}`, name: '신규 할증 조건', rate: 10 });
      else if (actionType === 'DELETE') list.splice(index, 1);
      else if (actionType === 'CHANGE') list[index] = { ...list[index], [field]: value };

      platformObj[category] = list;
      updated[platform] = platformObj;
      return updated;
    });
  };

  const handleUpdatePromo = (platform, actionType, index, field, value) => {
    setPromoRules(prev => {
      const updated = { ...prev };
      const list = [...(updated[platform] || [])];
      if (actionType === 'ADD') list.push({ id: `${platform}_${Date.now()}`, name: '신규 프로모션', desc: '설명 입력', rate: 10, type: 'RATE' });
      else if (actionType === 'DELETE') list.splice(index, 1);
      else if (actionType === 'CHANGE') list[index] = { ...list[index], [field]: value };
      updated[platform] = list;
      return updated;
    });
  };

  const handleResetBonusRules = () => {
    localStorage.removeItem('btv_bonus_rules');
    setBonusRules(DEFAULT_BONUS_RULES);
  };

  const handleResetSurchargeRules = () => {
    localStorage.removeItem('btv_surcharge_rules');
    setSurchargeRules(DEFAULT_SURCHARGE_RULES);
  };

  const handleResetPromoRules = () => {
    localStorage.removeItem('btv_promo_rules');
    setPromoRules(DEFAULT_PROMO_RULES);
  };

  if (!currentUser) {
    return view === 'SIGNUP' ? <SignupView onSignup={handleSignup} onCancel={() => setView('LOGIN')} /> : <LoginView onLogin={handleLogin} onGoSignup={() => setView('SIGNUP')} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans relative flex flex-col">
      <Header user={currentUser} view={view} setView={setView} onLogout={logout} />

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 space-y-6">
        {view === 'ADMIN' ? (
          <AdminPanel
            users={users}
            bonusRules={bonusRules}
            surchargeRules={surchargeRules}
            promoRules={promoRules}
            onUpdateBonus={handleUpdateBonus}
            onUpdateSurcharge={handleUpdateSurcharge}
            onUpdatePromo={handleUpdatePromo}
            onStatusChange={updateUserStatus}
            onDeleteUser={deleteUser}
            onBackToDashboard={() => setView('DASHBOARD')}
            onResetBonusRules={handleResetBonusRules}
            onResetSurchargeRules={handleResetSurchargeRules}
            onResetPromoRules={handleResetPromoRules}
          />
        ) : (
          <>
            <StepIndicator currentStep={state.currentStep} goToStep={actions.goToStep} setCurrentStep={actions.setCurrentStep} />

            {state.currentStep === 1 && <Step1Budget state={state} actions={actions} volInfo={volInfo} onNext={() => actions.goToStep(2)} />}
            {state.currentStep === 2 && <Step2Platform state={state} actions={actions} onPrev={() => actions.setCurrentStep(1)} onNext={() => actions.goToStep(3)} />}
            {state.currentStep === 3 && <Step3Package state={state} actions={actions} calculation={calculation} onPrev={() => actions.setCurrentStep(2)} onNext={() => actions.goToStep(4)} />}
            {state.currentStep === 4 && <Step4Audience state={state} actions={actions} audienceFormula={audienceFormula} onPrev={() => actions.setCurrentStep(3)} onNext={() => actions.goToStep(5)} />}
            {state.currentStep === 5 && <Step5Estimate state={state} actions={actions} calculation={calculation} surchargeRules={surchargeRules} promoRules={promoRules} onPrev={() => actions.setCurrentStep(4)} onOpenProposal={() => setIsProposalOpen(true)} />}
          </>
        )}
      </main>

      {/* 챗봇 버튼 */}
      {view === 'DASHBOARD' && (
        <button onClick={() => setIsChatOpen(!isChatOpen)} className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold px-5 py-3.5 rounded-full shadow-2xl flex items-center space-x-2.5">
          <span className="text-xl">🤖</span>
          <span className="text-sm font-black">챗봇 문의</span>
        </button>
      )}

      <ChatbotDrawer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} onApplyRecommendation={(rec) => { actions.setPlatformMode(rec.platformMode); actions.setProductMode(rec.productMode); actions.setVideoLength(rec.videoLength); alert('추천 조건이 적용되었습니다!'); }} />
      <ProposalModal isOpen={isProposalOpen} onClose={() => setIsProposalOpen(false)} state={state} calculation={calculation} audienceFormula={audienceFormula} currentUser={currentUser} />
    </div>
  );
}

// 페이지 반영 테스트 