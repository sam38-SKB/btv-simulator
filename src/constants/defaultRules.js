export const DEFAULT_BONUS_RULES = {
  BTV: [
    { minMonthlyBudget: 60000000, minMonths: 1, rate: 80 },
    { minMonthlyBudget: 30000000, minMonths: 3, rate: 80 },
    { minMonthlyBudget: 30000000, minMonths: 1, rate: 70 },
    { minMonthlyBudget: 0, minMonths: 1, rate: 30 }
  ],
  ADDR3: [
    { minMonthlyBudget: 100000000, minMonths: 1, rate: 120 },
    { minMonthlyBudget: 30000000, minMonths: 3, rate: 100 },
    { minMonthlyBudget: 30000000, minMonths: 1, rate: 80 },
    { minMonthlyBudget: 0, minMonths: 1, rate: 40 }
  ]
};

export const DEFAULT_SURCHARGE_RULES = {
  region: [
    { id: 'GANGNAM_5', name: '강남 5개구 타겟팅', rate: 80 },
    { id: 'SIGUNGU', name: '일반 시/군/구 타겟팅', rate: 20 },
    { id: 'ALL', name: '전국 타겟팅 (기본)', rate: 0 }
  ],
  time: [
    { id: 'CONTINUOUS_8H', name: '연속 8시간 이상 선택 시간대', rate: 20 },
    { id: 'ALL', name: '전체 시간대 (기본)', rate: 0 }
  ],
  channel: [
    { id: 'SELECT7', name: '7개 이상의 특정 채널 선택', rate: 40 },
    { id: 'ALL', name: '전체 채널 (기본)', rate: 0 }
  ]
};

export const DEFAULT_PROMO_RULES = {
  BTV: [
    { id: 'BTV_NEW', name: 'B tv 신규 광고주 프로모션', desc: '최근 1년간 B tv 집행 이력이 없는 신규 광고주 대상', rate: 30, type: 'RATE' },
    { id: 'BTV_SANGSAENG', name: '상생 / 정책 특화 프로모션', desc: '중소기업, 소상공인 및 지자체/공공기관 우대 혜택', rate: 20, type: 'RATE' },
    { id: 'BTV_CONTINUOUS', name: 'B tv 연속 집행 / 다계좌 프로모션', desc: '2개월 이상 연속 청약 또는 Multi-Account 집행 광고주', rate: 15, type: 'RATE' },
    { id: 'BTV_CROSS_MEDIA', name: 'B tv 크로스미디어 결합 프로모션', desc: '모바일 / 디지털 매체 결합 집행 시 추가 우대', rate: 10, type: 'RATE' },
    { id: 'BTV_VOD_PLUS', name: 'VOD 플러스 프로모션', desc: 'VOD 연계 송출 (세부 집행 조건 담당자 협의 필요)', rate: 0, type: 'VOD_PLUS' }
  ],
  ADDR3: [
    { id: 'ADDR3_FIRST', name: 'IPTV 3사 생애 최초 집행 보너스', desc: 'Addr.TV PRIME 최초 청약 광고주 대상', rate: 50, type: 'RATE' },
    { id: 'ADDR3_3Q_PROMO', name: '3Q 특별 할인 프로모션', desc: 'Essential Pack 전용 (5천만 이상 3.6원 / 미만 4.0원 적용)', rate: 0, type: 'SPECIAL_CPV' },
    { id: 'ADDR3_LONGTERM', name: 'IPTV 3사 장기 집행 우대 프로모션', desc: '3개월 이상 연속 청약 시 추가 보너스 제공', rate: 20, type: 'RATE' },
    { id: 'ADDR3_LARGE_SCALE', name: '대형 광고주 특별 우대 프로모션', desc: '총 집행 금액 1억원 이상 청약 시 적용', rate: 30, type: 'RATE' }
  ]
};