/**
 * 공통 HTTP 클라이언트
 * - VITE_API_BASE_URL 환경 변수로 베이스 URL 설정
 * - JWT accessToken 자동 첨부
 * - 401 응답 시 refreshToken으로 재발급 후 재시도
 */

const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

function buildUrl(path) {
  return `${BASE_URL}/${String(path).replace(/^\//, '')}`;
}

function getAccessToken() {
  return localStorage.getItem('accessToken');
}

function getRefreshToken() {
  return localStorage.getItem('refreshToken');
}

function setTokens(accessToken, refreshToken) {
  localStorage.setItem('accessToken', accessToken);
  if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
}

function clearTokens() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userId');
}

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token');

  const res = await fetch(buildUrl('/api/auth/refresh'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    clearTokens();
    window.location.href = '/login';
    throw new Error('Token refresh failed');
  }

  const data = await res.json();
  setTokens(data.accessToken, data.refreshToken);
  return data.accessToken;
}

async function request(path, init = {}) {
  const url = buildUrl(path);
  const token = getAccessToken();

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...init.headers,
  };

  let res = await fetch(url, { ...init, headers });

  // 401이면 토큰 재발급 후 재시도
  if (res.status === 401) {
    try {
      const newToken = await refreshAccessToken();
      headers.Authorization = `Bearer ${newToken}`;
      res = await fetch(url, { ...init, headers });
    } catch {
      throw new Error('Unauthorized');
    }
  }

  if (!res.ok) {
    let errorMsg = `${res.status}`;
    try {
      const errData = await res.json();
      errorMsg = errData.message ?? errData.error ?? errorMsg;
    } catch {
      errorMsg = await res.text().catch(() => errorMsg);
    }
    throw new Error(errorMsg);
  }

  // 204 No Content
  if (res.status === 204) return null;

  return res.json();
}

export const apiClient = {
  get: (path, init = {}) => request(path, { ...init, method: 'GET' }),
  post: (path, body, init = {}) =>
    request(path, { ...init, method: 'POST', body: JSON.stringify(body) }),
  patch: (path, body, init = {}) =>
    request(path, { ...init, method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path, init = {}) => request(path, { ...init, method: 'DELETE' }),
  setTokens,
  clearTokens,
  getAccessToken,
};

// 하위 호환성 유지 (기존 apiGet 사용 코드)
export async function apiGet(path, init = {}) {
  return apiClient.get(path, init);
}
