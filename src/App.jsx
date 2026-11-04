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

import HomeMenuView from './components/home/HomeMenuView';
import Step1Budget from './components/steps/Step1Budget';
import Step3Package from './components/steps/Step3Package';
import Step4Audience from './components/steps/Step4Audience';
import Step5Estimate from './components/steps/Step5Estimate';

import ProductInfoView from './components/info/ProductInfoView';
import AdminPanel from './components/admin/AdminPanel';
import ChatbotDrawer from './components/common/ChatbotDrawer';
import ProposalModal from './components/common/ProposalModal';

export default function App() {
  const { users, currentUser, login, signup, logout, updateUserStatus, deleteUser } = useAuth();
  
  // 1. GNB 메뉴 초기 상태를 'HOME' 랜딩 화면으로 설정
  const [currentTab, setCurrentTab] = useState('HOME');

  // 2. 비로그인 유저가 다음 단계 진행 시 복귀할 위치 기억용 상태
  const [pendingRedirect, setPendingRedirect] = useState(null);

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

  // GNB 메뉴 선택 시 처리
  const handleSelectTab = (tab) => {
    setCurrentTab(tab);
    if (tab === 'BTV' || tab === 'ADDR3') {
      actions.setCurrentStep(1);
      actions.setPlatformMode(tab);
    }
  };

  // 비로그인 상태에서 '다음 단계' 이동 시 로그인 창 호출 로직
  const handleNextWithAuth = (targetStep) => {
    if (!currentUser) {
      setPendingRedirect({ tab: currentTab, step: targetStep });
      setCurrentTab('LOGIN');
    } else {
      actions.goToStep(targetStep);
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

  // 로그인 처리 (직전 보고 있던 페이지 및 스텝으로 복귀)
  const handleLogin = (id, pw) => {
    const res = login(id, pw);
    if (!res.success) {
      alert(res.message);
    } else {
      if (pendingRedirect) {
        setCurrentTab(pendingRedirect.tab);
        actions.goToStep(pendingRedirect.step);
        setPendingRedirect(null);
      } else {
        setCurrentTab(res.role === 'ADMIN' ? 'ADMIN' : 'HOME');
      }
    }
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

  // 3. 로그인 및 회원가입 전용 독립 화면 처리 (기존 if (!currentUser) 제거)
  if (currentTab === 'LOGIN') {
    return <LoginView onLogin={handleLogin} onGoSignup={() => setCurrentTab('SIGNUP')} />;
  }
  if (currentTab === 'SIGNUP') {
    return <SignupView onSignup={handleSignup} onCancel={() => setCurrentTab('LOGIN')} />;
  }

  // 테마 글로우 배경 (메뉴별 맞춤 컬러)
  const themeGlowClass = 
    currentTab === 'BTV' 
      ? 'from-amber-500/10 via-slate-900 to-slate-900 border-amber-500/20' 
      : currentTab === 'ADDR3' 
      ? 'from-sky-500/10 via-slate-900 to-slate-900 border-sky-500/20'
      : currentTab === 'INFO'
      ? 'from-purple-500/10 via-slate-900 to-slate-900 border-purple-500/20'
      : currentTab === 'NEWS'
      ? 'from-emerald-500/10 via-slate-900 to-slate-900 border-emerald-500/20'
      : 'from-slate-900 via-slate-900 to-slate-950 border-slate-800';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative flex flex-col">
      {/* 상단 GNB 헤더 */}
      <Header 
        user={currentUser} 
        currentTab={currentTab} 
        onSelectTab={handleSelectTab} 
        onLogout={logout} 
        onGoLogin={() => setCurrentTab('LOGIN')}
      />

      {/* 테마 배경 영역 */}
      <div className={`flex-1 max-w-6xl w-full mx-auto p-6 space-y-6 my-4 rounded-3xl bg-gradient-to-b ${themeGlowClass} border shadow-2xl transition-all duration-300`}>
        
        {/* 4. 첫 화면: 메인 랜딩 메뉴 카드 */}
        {currentTab === 'HOME' && (
          <HomeMenuView onSelectTab={handleSelectTab} />
        )}

        {/* 관리자 패널 */}
        {currentTab === 'ADMIN' && currentUser?.role === 'ADMIN' && (
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
            onBackToDashboard={() => handleSelectTab('HOME')}
          />
        )}

        {/* 배너광고 (기존 상품 소개) */}
        {currentTab === 'INFO' && (
          <ProductInfoView onGoSimulator={(mode) => handleSelectTab(mode)} />
        )}

        {/* B tv 매체 소식 */}
        {currentTab === 'NEWS' && (
          <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl shadow-xl space-y-4 text-center">
            <h3 className="text-xl font-bold text-emerald-400 flex items-center justify-center space-x-2">
              <span>📰</span>
              <span>B tv 매체 소식</span>
            </h3>
            <p className="text-sm text-slate-400">
              최신 B tv 광고 리포트, 월별 매체 상품 업데이트 및 프로모션 공지사항이 게재될 영역입니다.
            </p>
          </div>
        )}

        {/* 실시간 광고(AD+) & 로딩광고(VOD) 시뮬레이터 스텝 */}
        {(currentTab === 'BTV' || currentTab === 'ADDR3') && (
          <>
            <StepIndicator 
              currentStep={state.currentStep} 
              goToStep={(s) => handleNextWithAuth(s)} 
              currentTab={currentTab}
            />

            {/* Step 1: 예산 및 기간 */}
            {state.currentStep === 1 && (
              <Step1Budget 
                state={state} 
                actions={actions} 
                volInfo={volInfo} 
                onNext={() => handleNextWithAuth(2)} 
              />
            )}

            {/* Step 2: 상품 & 보너스 (Step3Package) */}
            {state.currentStep === 2 && (
              <Step3Package 
                state={state} 
                actions={actions} 
                calculation={calculation} 
                onPrev={() => actions.setCurrentStep(1)} 
                onNext={() => handleNextWithAuth(3)} 
              />
            )}

            {/* Step 3: 타겟팅 (Step4Audience) */}
            {state.currentStep === 3 && (
              <Step4Audience 
                state={state} 
                actions={actions} 
                audienceFormula={audienceFormula} 
                onPrev={() => actions.setCurrentStep(2)} 
                onNext={() => handleNextWithAuth(4)} 
              />
            )}

            {/* Step 4: 최종 견적 (Step5Estimate) */}
            {state.currentStep === 4 && (
              <Step5Estimate 
                state={state} 
                actions={actions} 
                calculation={calculation} 
                surchargeRules={surchargeRules} 
                promoRules={promoRules} 
                onPrev={() => actions.setCurrentStep(3)} 
                onOpenProposal={() => setIsProposalOpen(true)} 
              />
            )}
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