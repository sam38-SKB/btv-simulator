import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// 환경변수 로드 상태 확인 (F12 콘솔용)
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error("❌ [Firebase 설정 오류] 환경변수를 읽을 수 없습니다. Netlify 환경변수 및 재배포 상태를 확인하세요.", firebaseConfig);
} else {
  console.log("✅ [Firebase 정상 연결 준비 완료] Project ID:", firebaseConfig.projectId);
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);