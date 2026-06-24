import { apiClient } from './client.js';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

/**
 * 구글 OAuth2 로그인 페이지로 리다이렉트
 */
export function redirectToGoogleLogin() {
  window.location.href = `${BASE_URL}/oauth2/authorization/google`;
}

/**
 * 회원가입 완성 (닉네임 + 한줄다짐 설정)
 * POST /api/auth/create
 */
export function createAccount(body) {
  return apiClient.post('/api/auth/create', body);
}

/**
 * 로그아웃
 * POST /api/auth/logout
 */
export function logout() {
  const refreshToken = localStorage.getItem('refreshToken');
  return apiClient.post('/api/auth/logout', { refreshToken });
}
