import { useState, useMemo } from 'react';
import { BTV_PACKAGE_BASE_CPV, BTV_FIXED_20S_BASE_CPV, ADDR3_PRIME_PACK_MAP, VIDEO_LENGTH_INFO } from '../constants/pricingData';
import { AUDIENCE_DATA } from '../constants/audienceData';

export function useSimulator(bonusRules, surchargeRules, promoRules) {
  const [currentStep, setCurrentStep] = useState(1);
  const [monthlyBudget, setMonthlyBudget] = useState(30000000);
  const [durationMonths, setDurationMonths] = useState(3);
  const [platformMode, setPlatformMode] = useState('BTV');
  const [productMode, setProductMode] = useState('PRIME_ESSENTIAL');
  const [videoLength, setVideoLength] = useState('15');
  const [channelPackage, setChannelPackage] = useState('ALL');

  const [selectedAudiences, setSelectedAudiences] = useState([]);
  const [categoryOperators, setCategoryOperators] = useState({ '데모그래픽': 'OR', '페르소나': 'OR', '상품': 'OR' });
  const [audTab, setAudTab] = useState('데모그래픽');

  const [regionTarget, setRegionTarget] = useState('ALL');
  const [timeTarget, setTimeTarget] = useState('ALL');
  const [channelTarget, setChannelTarget] = useState('ALL');

  const [selectedPromos, setSelectedPromos] = useState([
    'BTV_NEW', 'BTV_SANGSAENG', 'BTV_CONTINUOUS', 'BTV_CROSS_MEDIA', 'BTV_VOD_PLUS',
    'ADDR3_FIRST', 'ADDR3_3Q_PROMO', 'ADDR3_LONGTERM', 'ADDR3_LARGE_SCALE'
  ]);

  const totalBudget = useMemo(() => (Number(monthlyBudget) || 0) * (Number(durationMonths) || 0), [monthlyBudget, durationMonths]);

  // 볼륨 보너스 연산
  const volInfo = useMemo(() => {
    const list = bonusRules[platformMode] || [];
    const sorted = [...list].sort((a, b) => {
      const totA = (a.minMonthlyBudget || 0) * (a.minMonths || 1);
      const totB = (b.minMonthlyBudget || 0) * (b.minMonths || 1);
      return totB !== totA ? totB - totA : (b.rate || 0) - (a.rate || 0);
    });

    if (!monthlyBudget || !durationMonths) {
      return { rate: 0, label: '월 예산 및 집행 기간을 선택하세요', matched: null, nextTier: null };
    }

    let matched = sorted.find(r => monthlyBudget >= (r.minMonthlyBudget || 0) && durationMonths >= (r.minMonths || 1));
    if (!matched) matched = sorted[sorted.length - 1] || { minMonthlyBudget: 0, minMonths: 1, rate: 0 };

    const rateVal = matched ? matched.rate / 100 : 0;
    const minM = matched ? (matched.minMonthlyBudget / 10000).toLocaleString() : '0';
    const label = (matched.minMonthlyBudget > 0 || matched.minMonths > 1)
      ? `월 ${minM}만원 & ${matched.minMonths}개월 이상 (+${matched.rate}%)`
      : `기본 조건 (+${matched.rate}%)`;

    const higherRules = sorted.filter(r => (r.minMonthlyBudget > monthlyBudget || r.minMonths > durationMonths) && r.rate > (matched ? matched.rate : 0));
    const nextTierObj = higherRules.length > 0 ? higherRules[higherRules.length - 1] : null;

    return {
      rate: rateVal,
      matched,
      label,
      nextTier: nextTierObj ? `월 ${(nextTierObj.minMonthlyBudget / 10000).toLocaleString()}만원 & ${nextTierObj.minMonths}개월 (+${nextTierObj.rate}%)` : null
    };
  }, [platformMode, monthlyBudget, durationMonths, bonusRules]);

  // 불리언 타겟팅 수식 생성
  const audienceFormula = useMemo(() => {
    if (selectedAudiences.length === 0) return '선택된 오디언스 없음 (미선택)';

    const categoryGroups = { '데모그래픽': [], '페르소나': [], '상품': [] };
    selectedAudiences.forEach(id => {
      const match = id.match(/^\[(.*?)\]\s*(.*)$/);
      if (match) {
        let cat = match[1];
        if (cat.startsWith('상품:')) cat = '상품';
        if (categoryGroups[cat]) categoryGroups[cat].push(match[2]);
      }
    });

    const categoryBlocks = [];
    ['데모그래픽', '페르소나', '상품'].forEach(cat => {
      const list = categoryGroups[cat];
      if (list && list.length > 0) {
        const op = categoryOperators[cat] || 'OR';
        categoryBlocks.push(`[${cat}: ${list.length === 1 ? list[0] : `(${list.join(` ${op} `)})`}]`);
      }
    });

    return categoryBlocks.length > 0 ? categoryBlocks.join(' AND ') : '선택된 오디언스 없음 (미선택)';
  }, [selectedAudiences, categoryOperators]);

  // 최종 견적 및 제공 가치 환산
  const calculation = useMemo(() => {
    if (!platformMode || !videoLength || totalBudget <= 0) {
      return { items: [], grandTotalImp: 0, avgEffectiveCPV: 0, totalValueStr: '0 원', bonusValueStr: '+0 만원', calcBaseCPV: 0, calcAppliedCPV: 0, totalBonusSumRate: 0, totalSurchargeRate: 0, netBonusRate: 0, netBonusSummary: '총 0%' };
    }

    const lenObj = VIDEO_LENGTH_INFO[videoLength] || VIDEO_LENGTH_INFO['15'];
    let rawBaseCPV = 0;
    let packName = '';

    if (platformMode === 'BTV') {
      const btvPack = BTV_PACKAGE_BASE_CPV[channelPackage] || BTV_PACKAGE_BASE_CPV['ALL'];
      packName = btvPack.name;
      rawBaseCPV = videoLength === '20' ? (BTV_FIXED_20S_BASE_CPV[channelPackage] ?? 7.0) : Number((btvPack.baseCPV * lenObj.mult).toFixed(2));
    } else {
      const primePack = ADDR3_PRIME_PACK_MAP[productMode === 'PRIME_ALL_IN_ONE' ? 'PRIME_ALL_IN_ONE' : 'PRIME_ESSENTIAL'];
      packName = primePack.name;
      rawBaseCPV = videoLength === '20' ? Math.ceil(primePack.baseCPV15 * 1.33) : Number((primePack.baseCPV15 * lenObj.mult).toFixed(2));
    }

    const activeReg = (surchargeRules.region || []).find(r => r.id === regionTarget) || { rate: 0 };
    const activeTime = (surchargeRules.time || []).find(r => r.id === timeTarget) || { rate: 0 };
    const activeCh = (surchargeRules.channel || []).find(r => r.id === channelTarget) || { rate: 0 };

    const totalSurchargeRate = (activeReg.rate + activeTime.rate + activeCh.rate) / 100;
    let finalAppliedCPV = Number((rawBaseCPV * (1 + totalSurchargeRate)).toFixed(2));

    let totalBonusSumRate = volInfo.rate;
    const bonusTextArr = [];
    if (volInfo.matched?.rate > 0) bonusTextArr.push(`볼륨(${volInfo.matched.rate}%)`);

    const activePromos = promoRules[platformMode] || [];
    let vodPlusActive = null;

    activePromos.forEach(p => {
      if (selectedPromos.includes(p.id)) {
        if (p.type === 'VOD_PLUS') {
          vodPlusActive = p;
        } else if (p.type === 'SPECIAL_CPV') {
          if (platformMode === 'ADDR3' && productMode !== 'PRIME_ALL_IN_ONE') {
            const promoCPV15 = totalBudget >= 50000000 ? 3.6 : 4.0;
            finalAppliedCPV = videoLength === '20' ? Math.ceil(promoCPV15 * 1.33) : Number((promoCPV15 * lenObj.mult).toFixed(2));
            bonusTextArr.push(p.name);
          }
        } else if (p.rate > 0) {
          totalBonusSumRate += (p.rate / 100);
          bonusTextArr.push(`${p.name}(${p.rate}%)`);
        }
      }
    });

    const netBonusRate = totalBonusSumRate - totalSurchargeRate;
    const bonusValueAmount = Math.floor(totalBudget * netBonusRate);
    const totalExecutionValue = totalBudget + bonusValueAmount;

    const baseImp = Math.floor(totalBudget / finalAppliedCPV);
    const bonusImp = Math.floor(baseImp * totalBonusSumRate);
    const grandTotalImp = baseImp + bonusImp;

    const surchPctStr = (totalSurchargeRate * 100).toFixed(0);
    const bonusPctStr = (totalBonusSumRate * 100).toFixed(0);
    const netPctStr = (netBonusRate * 100).toFixed(0);
    const netBonusSummary = `보너스 ${bonusPctStr}% - ${totalSurchargeRate > 0 ? `할증 -${surchPctStr}%` : '할증 -'} = 총 ${netPctStr}%`;

    const items = [{
      name: platformMode === 'BTV' ? 'B tv AD+ (실시간)' : `Addr.TV ${packName}`,
      detail: platformMode === 'BTV' ? 'B tv 700만 가구 실시간 방송 단독' : `IPTV 3사 2,166만 가구 PRIME`,
      durationText: `${durationMonths}개월`,
      videoLengthText: `${lenObj.name}`,
      channelPackText: packName,
      netPaymentStr: `${(totalBudget / 10000).toLocaleString()} 만원`,
      executionValueStr: `${(totalExecutionValue / 10000).toLocaleString()} 만원`,
      basePriceText: `${rawBaseCPV}원`,
      surchargesApplied: totalSurchargeRate > 0 ? `-${surchPctStr}%` : '-',
      bonusesApplied: bonusTextArr.length > 0 ? bonusTextArr.join(' + ') : '기본',
      netBonusSummaryText: netBonusSummary,
      totalImpressions: grandTotalImp.toLocaleString() + ' 회',
      effectiveCPV: grandTotalImp > 0 ? (totalBudget / grandTotalImp).toFixed(2) + ' 원' : '0 원'
    }];

    if (vodPlusActive && platformMode === 'BTV') {
      items.push({
        name: 'B tv VOD',
        detail: 'VOD 플러스 프로모션 적용 (담당자 협의 필요)',
        durationText: `${durationMonths}개월`,
        videoLengthText: `${lenObj.name}`,
        channelPackText: 'VOD 전체',
        netPaymentStr: '0 원 (보너스)',
        executionValueStr: '담당자 협의',
        basePriceText: '협의 필요',
        surchargesApplied: '-',
        bonusesApplied: vodPlusActive.name,
        netBonusSummaryText: 'VOD 협의',
        totalImpressions: '협의 필요',
        effectiveCPV: '협의 필요'
      });
    }

    return {
      items,
      grandTotalImp,
      avgEffectiveCPV: grandTotalImp > 0 ? Number((totalBudget / grandTotalImp).toFixed(2)) : 0,
      totalValueStr: `${(totalExecutionValue / 10000).toLocaleString()} 만원`,
      bonusValueStr: `${bonusValueAmount >= 0 ? '+' : ''}${(bonusValueAmount / 10000).toLocaleString()} 만원`,
      calcBaseCPV: rawBaseCPV,
      calcAppliedCPV: finalAppliedCPV,
      totalBonusSumRate,
      totalSurchargeRate,
      netBonusRate,
      netBonusSummary
    };
  }, [platformMode, videoLength, totalBudget, channelPackage, productMode, regionTarget, timeTarget, channelTarget, selectedPromos, surchargeRules, promoRules, volInfo, durationMonths]);

  const validateStep = (step) => {
    if (step === 1 && (!monthlyBudget || !durationMonths)) { alert('1단계 필수 항목: [월 집행 금액]과 [집행 기간]을 모두 선택하세요.'); return false; }
    if (step === 2 && !platformMode) { alert('2단계 필수 항목: [매체 커버리지]를 선택하세요.'); return false; }
    if (step === 3) {
      if (platformMode === 'BTV' && (!channelPackage || !videoLength)) { alert('3단계 필수 항목: [B tv 채널 패키지]와 [소재 영상 길이]를 모두 선택하세요.'); return false; }
      if (platformMode === 'ADDR3' && (!productMode || !videoLength)) { alert('3단계 필수 항목: [IPTV 3사 PRIME 패키지]와 [소재 영상 길이]를 모두 선택하세요.'); return false; }
    }
    if (step === 4 && selectedAudiences.length === 0) { alert('4단계 필수 항목: 오디언스 타겟을 최소 1개 이상 선택하세요.'); return false; }
    if (step === 5 && (!regionTarget || !timeTarget || !channelTarget)) { alert('5단계 필수 항목: [지역], [시간대], [채널] 타겟팅 옵션을 선택하세요.'); return false; }
    return true;
  };

  const goToStep = (targetStep) => {
    if (targetStep > currentStep) {
      for (let i = currentStep; i < targetStep; i++) {
        if (!validateStep(i)) return;
      }
    }
    setCurrentStep(targetStep);
  };

  return {
    state: { currentStep, monthlyBudget, durationMonths, platformMode, productMode, videoLength, channelPackage, selectedAudiences, categoryOperators, audTab, regionTarget, timeTarget, channelTarget, selectedPromos, totalBudget },
    actions: { setCurrentStep, goToStep, setMonthlyBudget, setDurationMonths, setPlatformMode, setProductMode, setVideoLength, setChannelPackage, setSelectedAudiences, setCategoryOperators, setAudTab, setRegionTarget, setTimeTarget, setChannelTarget, setSelectedPromos },
    volInfo,
    audienceFormula,
    calculation
  };
}