import { apiClient } from './client.js';

const BASE_URL = 'http://localhost:8080';

/**
 * 구글 OAuth2 로그인 페이지로 리다이렉트
 */
export const redirectToGoogleLogin = () => {
  window.location.href = `${BASE_URL}/oauth2/authorization/google`;
};

/**
 * 기존 코드 호환용
 */
export const loginWithGoogle = redirectToGoogleLogin;

/**
 * 회원가입 완성 = OAuth 로그인 후 프로필 설정
 * POST /api/auth/create
 *
 * 백엔드 요청 body:
 * {
 *   nickname: string,
 *   motto: string
 * }
 */
export function createAccount({ nickname, motto }) {
  return apiClient.post('/api/auth/create', {
    nickname,
    motto,
  });
}

/**
 * 내 정보 조회
 * GET /api/auth/me
 */
export function getMyInfo() {
  return apiClient.get('/api/auth/me');
}

/**
 * 로그아웃
 * POST /api/auth/logout
 */
export function logout() {
  const refreshToken = localStorage.getItem('refreshToken');

  return apiClient.post('/api/auth/logout', {
    // 백엔드 명세에서 refreshtoken처럼 받을 가능성이 있어서 이 키로 맞춤
    refreshtoken: refreshToken,
  });
}

/**
 * 프론트 토큰 삭제
 */
export function clearAuthStorage() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('isNewUser');
}