import React, { useState, useEffect } from 'react';
import { doc, collection, onSnapshot, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from './lib/firebase';

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

import ProductInfoView from './components/info/ProductInfoView';
import AdminPanel from './components/admin/AdminPanel';
import ChatbotDrawer from './components/common/ChatbotDrawer';
import ProposalModal from './components/common/ProposalModal';

export default function App() {
  const { users, currentUser, login, signup, logout, updateUserStatus, deleteUser } = useAuth();
  
  // GNB 메뉴 상태: 'BTV', 'ADDR3', 'INFO', 'ADMIN'
  const [currentTab, setCurrentTab] = useState('BTV');

  // Firebase DB 연동 상태
  const [proposals, setProposals] = useState([]);
  const [bonusRules, setBonusRules] = useState(DEFAULT_BONUS_RULES);
  const [surchargeRules, setSurchargeRules] = useState(DEFAULT_SURCHARGE_RULES);
  const [promoRules, setPromoRules] = useState(DEFAULT_PROMO_RULES);

  useEffect(() => {
    if (!db) return;

    const unsubRules = onSnapshot(
      doc(db, 'settings', 'rules'),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.bonusRules) setBonusRules(data.bonusRules);
          if (data.surchargeRules) setSurchargeRules(data.surchargeRules);
          if (data.promoRules) setPromoRules(data.promoRules);
        } else {
          setDoc(doc(db, 'settings', 'rules'), {
            bonusRules: DEFAULT_BONUS_RULES,
            surchargeRules: DEFAULT_SURCHARGE_RULES,
            promoRules: DEFAULT_PROMO_RULES
          }).catch(err => console.error("Firestore init error:", err));
        }
      },
      (error) => console.error("Firestore rules sync error:", error)
    );

    const unsubProps = onSnapshot(
      collection(db, 'proposals'),
      (snapshot) => {
        const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setProposals(list);
      },
      (error) => console.error("Firestore proposals sync error:", error)
    );

    return () => {
      unsubRules();
      unsubProps();
    };
  }, []);

  const simulator = useSimulator(bonusRules, surchargeRules, promoRules);
  const { state, actions, volInfo, audienceFormula, calculation } = simulator;

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isProposalOpen, setIsProposalOpen] = useState(false);

  // GNB 메뉴 선택 시 모드 자동 스위칭
  const handleSelectTab = (tab) => {
    setCurrentTab(tab);
    if (tab === 'BTV') {
      actions.setPlatformMode('BTV');
    } else if (tab === 'ADDR3') {
      actions.setPlatformMode('ADDR3');
    }
  };

  const handleSaveRules = async (newBonus, newSurcharge, newPromo) => {
    if (!db) return { success: false, error: 'Firebase DB 연결 없음' };

    try {
      const savePromise = setDoc(doc(db, 'settings', 'rules'), {
        bonusRules: newBonus,
        surchargeRules: newSurcharge,
        promoRules: newPromo
      });

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('네트워크 응답 시간 초과 (8초)')), 8000)
      );

      await Promise.race([savePromise, timeoutPromise]);

      setBonusRules(newBonus);
      setSurchargeRules(newSurcharge);
      setPromoRules(newPromo);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const handleLogin = (id, pw) => {
    const res = login(id, pw);
    if (!res.success) alert(res.message);
    else setCurrentTab(res.role === 'ADMIN' ? 'ADMIN' : 'BTV');
  };

  const handleSignup = (form) => {
    const res = signup(form);
    if (!res.success) alert(res.message);
    else { alert('회원가입 신청이 완료되었습니다. 관리자 승인 후 로그인해 주세요.'); setCurrentTab('LOGIN'); }
  };

  const handleSubmitProposal = async (newProposal) => {
    try {
      await setDoc(doc(db, 'proposals', newProposal.id), newProposal);
    } catch (error) {
      alert(`청약 제출 실패: ${error.message}`);
    }
  };

  const handleUpdateProposalStatus = async (id, newStatus) => {
    const target = proposals.find(p => p.id === id);
    if (target) {
      try { await setDoc(doc(db, 'proposals', id), { ...target, status: newStatus }); } catch (e) {}
    }
  };

  const handleDeleteProposal = async (id) => {
    if (confirm('해당 청약 제출 내역을 삭제하시겠습니까?')) {
      try { await deleteDoc(doc(db, 'proposals', id)); } catch (e) {}
    }
  };

  if (!currentUser) {
    return currentTab === 'SIGNUP' ? (
      <SignupView onSignup={handleSignup} onCancel={() => setCurrentTab('LOGIN')} />
    ) : (
      <LoginView onLogin={handleLogin} onGoSignup={() => setCurrentTab('SIGNUP')} />
    );
  }

  // GNB 메뉴별 메인 구역의 테마 글로우 배경
  const themeGlowClass = 
    currentTab === 'BTV' 
      ? 'from-amber-500/10 via-slate-900 to-slate-900 border-amber-500/20' 
      : currentTab === 'ADDR3' 
      ? 'from-sky-500/10 via-slate-900 to-slate-900 border-sky-500/20'
      : currentTab === 'INFO'
      ? 'from-purple-500/10 via-slate-900 to-slate-900 border-purple-500/20'
      : 'from-purple-900/20 via-slate-900 to-slate-900 border-purple-600/30';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative flex flex-col">
      {/* 상단 GNB 헤더 */}
      <Header 
        user={currentUser} 
        currentTab={currentTab} 
        onSelectTab={handleSelectTab} 
        onLogout={logout} 
      />

      {/* 테마 글로우 라이트 배경 컨테이너 */}
      <div className={`flex-1 max-w-6xl w-full mx-auto p-6 space-y-6 my-4 rounded-3xl bg-gradient-to-b ${themeGlowClass} border shadow-2xl transition-all duration-300`}>
        {currentTab === 'ADMIN' && (
          <AdminPanel
            users={users}
            proposals={proposals}
            bonusRules={bonusRules}
            surchargeRules={surchargeRules}
            promoRules={promoRules}
            onSaveRules={handleSaveRules}
            onStatusChange={updateUserStatus}
            onDeleteUser={deleteUser}
            onUpdateProposalStatus={handleUpdateProposalStatus}
            onDeleteProposal={handleDeleteProposal}
            onBackToDashboard={() => handleSelectTab('BTV')}
          />
        )}

        {currentTab === 'INFO' && (
          <ProductInfoView onGoSimulator={(mode) => handleSelectTab(mode)} />
        )}

        {(currentTab === 'BTV' || currentTab === 'ADDR3') && (
          <>
            <StepIndicator 
              currentStep={state.currentStep} 
              goToStep={actions.goToStep} 
              currentTab={currentTab}
            />

            {state.currentStep === 1 && <Step1Budget state={state} actions={actions} volInfo={volInfo} onNext={() => actions.goToStep(2)} />}
            {state.currentStep === 2 && <Step2Platform state={state} actions={actions} onPrev={() => actions.setCurrentStep(1)} onNext={() => actions.goToStep(3)} />}
            {state.currentStep === 3 && <Step3Package state={state} actions={actions} calculation={calculation} onPrev={() => actions.setCurrentStep(2)} onNext={() => actions.goToStep(4)} />}
            {state.currentStep === 4 && <Step4Audience state={state} actions={actions} audienceFormula={audienceFormula} onPrev={() => actions.setCurrentStep(3)} onNext={() => actions.goToStep(5)} />}
            {state.currentStep === 5 && <Step5Estimate state={state} actions={actions} calculation={calculation} surchargeRules={surchargeRules} promoRules={promoRules} onPrev={() => actions.setCurrentStep(4)} onOpenProposal={() => setIsProposalOpen(true)} />}
          </>
        )}
      </div>

      {/* 챗봇 floating 버튼 */}
      {currentTab !== 'ADMIN' && (
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)} 
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-slate-950 font-black px-5 py-3.5 rounded-full shadow-2xl flex items-center space-x-2 hover:scale-105 transition-all ring-2 ring-amber-300"
        >
          <span className="text-xl">🤖</span>
          <span className="text-xs font-black tracking-wide">챗봇 문의</span>
        </button>
      )}

      <ChatbotDrawer 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        onApplyRecommendation={(rec) => { 
          actions.setPlatformMode(rec.platformMode); 
          actions.setProductMode(rec.productMode); 
          actions.setVideoLength(rec.videoLength); 
          handleSelectTab(rec.platformMode);
          alert('추천 조건이 적용되었습니다!'); 
        }} 
      />
      
      <ProposalModal 
        isOpen={isProposalOpen} 
        onClose={() => setIsProposalOpen(false)} 
        state={state} 
        calculation={calculation} 
        audienceFormula={audienceFormula} 
        currentUser={currentUser} 
        onSubmitProposal={handleSubmitProposal} 
      />
    </div>
  );
}