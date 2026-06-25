import { apiClient } from './client.js';

/**
 * 뉴스 목록 조회
 * GET /api/news?category=DOMESTIC&page=0&size=20
 */
export function getNewsList({ category = 'DOMESTIC', page = 0, size = 20 } = {}) {
  const params = new URLSearchParams();

  if (category) params.set('category', category);
  params.set('page', String(page));
  params.set('size', String(size));

  return apiClient.get(`/api/news?${params.toString()}`);
}

/**
 * 뉴스 상세 조회
 * GET /api/news/{newsId}
 */
export function getNewsDetail(newsId) {
  return apiClient.get(`/api/news/${newsId}`);
}

/**
 * 오늘 배운 키워드 기반 뉴스 조회
 * GET /api/news/learned-keyword
 */
export function getLearnedKeywordNews({ page = 0, size = 10 } = {}) {
  const params = new URLSearchParams();

  params.set('page', String(page));
  params.set('size', String(size));

  return apiClient.get(`/api/news/learned-keyword?${params.toString()}`);
}

/**
 * AI 요약 뉴스 조회
 * GET /api/news/{newsId}/summary
 */
export function getNewsSummary(newsId) {
  return apiClient.get(`/api/news/${newsId}/summary`);
}

/**
 * 뉴스 스크랩 추가
 * POST /api/news/{newsId}/bookmark
 */
export function addBookmark(newsId) {
  return apiClient.post(`/api/news/${newsId}/bookmark`, {});
}

/**
 * 뉴스 스크랩 취소
 * DELETE /api/news/{newsId}/bookmark
 */
export function removeBookmark(newsId) {
  return apiClient.delete(`/api/news/${newsId}/bookmark`);
}