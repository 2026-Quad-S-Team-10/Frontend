/**
 * 공통 HTTP 클라이언트. 환경 변수로 베이스 URL을 바꿀 수 있습니다.
 * @param {string} path API 경로 (선행 슬래시 없이도 됨)
 * @param {RequestInit} [init]
 */
export async function apiGet(path, init = {}) {
  const base = import.meta.env.VITE_API_BASE_URL ?? '';
  const url = `${base.replace(/\/$/, '')}/${String(path).replace(/^\//, '')}`;
  const res = await fetch(url, {
    ...init,
    method: 'GET',
    headers: {
      Accept: 'application/json',
      ...init.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GET ${url} failed: ${res.status} ${text}`);
  }
  return res.json();
}
