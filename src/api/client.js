/**
 * 공통 HTTP 클라이언트
 * - VITE_API_BASE_URL 환경 변수로 베이스 URL 설정
 * - JWT accessToken 자동 첨부
 * - 백엔드 ApiResponse<T> 응답에서 data 자동 반환
 */

const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

function buildUrl(path) {
  return `${BASE_URL}/${String(path).replace(/^\//, '')}`;
}

function getAccessToken() {
  return localStorage.getItem('accessToken');
}

function setTokens(accessToken, refreshToken) {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
  }

  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }
}

function clearTokens() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('isNewUser');
}

async function parseResponse(res) {
  if (res.status === 204) {
    return null;
  }

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      body?.error?.message ??
      body?.message ??
      body?.error ??
      `${res.status}`;

    throw new Error(message);
  }

  if (body?.status === 'ERROR') {
    const message =
      body?.error?.message ??
      body?.error?.code ??
      '요청에 실패했습니다.';

    throw new Error(message);
  }

  // 백엔드 공통 응답: { status: "SUCCESS", data: ..., error: null }
  if (body && Object.prototype.hasOwnProperty.call(body, 'data')) {
    return body.data;
  }

  return body;
}

async function request(path, init = {}) {
  const token = getAccessToken();

  const headers = {
    Accept: 'application/json',
    ...(init.body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...init.headers,
  };

  const res = await fetch(buildUrl(path), {
    ...init,
    headers,
  });

  if (res.status === 401) {
    clearTokens();
    window.location.href = '/login';
    throw new Error('로그인이 필요합니다.');
  }

  return parseResponse(res);
}

export const apiClient = {
  get: (path, init = {}) => request(path, { ...init, method: 'GET' }),

  post: (path, body, init = {}) =>
    request(path, {
      ...init,
      method: 'POST',
      body: JSON.stringify(body ?? {}),
    }),

  patch: (path, body, init = {}) =>
    request(path, {
      ...init,
      method: 'PATCH',
      body: JSON.stringify(body ?? {}),
    }),

  delete: (path, init = {}) =>
    request(path, {
      ...init,
      method: 'DELETE',
    }),

  setTokens,
  clearTokens,
  getAccessToken,
};

// 하위 호환성 유지
export async function apiGet(path, init = {}) {
  return apiClient.get(path, init);
}