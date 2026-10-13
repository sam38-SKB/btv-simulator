export const BTV_PACKAGE_BASE_CPV = {
  'ALL': { name: 'ALL 채널 패키지', baseCPV: 5.0, desc: '전체 채널 기본 송출' },
  'TOP': { name: 'TOP 30 주요 채널', baseCPV: 6.0, desc: '시청률 상위 30개 인지도 패키지' },
  'PEAK': { name: 'Peak Time (17~24시)', baseCPV: 7.0, desc: '골든타임 집중 노출 패키지' },
  'SPORTS': { name: '스포츠 특화 패키지', baseCPV: 6.5, desc: '스포츠/레저 주요 채널 패키지' },
  'KIDS': { name: '키즈/애니 패키지', baseCPV: 6.0, desc: '영유아/어린이 가구 타겟 패키지' },
  'NIGHT': { name: 'Night Time 심야 패키지', baseCPV: 4.5, desc: '24시 이후 심야시간 효율 패키지' }
};

export const BTV_FIXED_20S_BASE_CPV = {
  'PEAK': 9.0, 'SPORTS': 8.0, 'ALL': 7.0, 'TOP': 8.0, 'KIDS': 7.0, 'NIGHT': 7.0
};

export const ADDR3_PRIME_PACK_MAP = {
  'PRIME_ESSENTIAL': { name: 'PRIME Essential Pack', packType: 'Essential Pack', baseCPV15: 10.0, desc: 'IPTV 3사 주요 30개 MP 채널' },
  'PRIME_ALL_IN_ONE': { name: 'PRIME All-in-one', packType: 'All-in-one', baseCPV15: 8.0, desc: 'IPTV 3사 117개 전체 채널 커버리지' }
};

export const VIDEO_LENGTH_INFO = {
  '6': { name: '6초 (숏폼)', btvMultStr: '-', addr3MultStr: '0.5x', mult: 0.5 },
  '15': { name: '15초 (표준)', btvMultStr: '1.0x', addr3MultStr: '1.0x', mult: 1.0 },
  '20': { name: '20초', btvMultStr: '지정고정가', addr3MultStr: '1.33x (올림)', mult: 1.33 },
  '30': { name: '30초', btvMultStr: '2.0x', addr3MultStr: '2.0x', mult: 2.0 },
  '40': { name: '40초', btvMultStr: '-', addr3MultStr: '2.67x', mult: 2.67 },
  '45': { name: '45초', btvMultStr: '3.0x', addr3MultStr: '3.0x', mult: 3.0 },
  '60': { name: '60초 (장문)', btvMultStr: '4.0x', addr3MultStr: '4.0x', mult: 4.0 }
};