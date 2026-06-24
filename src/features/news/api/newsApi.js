import { apiClient } from '../../../api/client.js';

/**
 * 뉴스 목록 조회 — GET /api/news
 */
export async function fetchNewsFeed() {
  const data = await apiClient.get('/api/news');
  // 기존 NewsFeed 형태로 변환 (백엔드 응답 구조에 맞게 조정)
  return {
    keyword: data.keyword ?? data.learnedKeyword ?? '오늘의 키워드',
    learningArticles: data.learningArticles ?? data.featuredNews ?? [],
    listArticles: (data.articles ?? data.newsList ?? data.content ?? []).map((a) => ({
      id: a.id ?? a.newsId,
      title: a.title,
      meta: `${a.source ?? a.publisher ?? ''} · ${a.publishedAt ?? a.date ?? ''}`,
      variant: 'clamp',
    })),
  };
}
