import { apiGet } from '../../../api/client.js';

/**
 * @typedef {object} LearningArticle
 * @property {string} title
 * @property {string} meta
 */

/**
 * @typedef {object} ListArticle
 * @property {string} title
 * @property {string} meta
 * @property {'clamp'|'plain'} variant
 */

/**
 * @typedef {object} NewsFeed
 * @property {string} keyword
 * @property {LearningArticle[]} learningArticles
 * @property {ListArticle[]} listArticles
 */

const MOCK_FEED = {
  keyword: '키워드',
  learningArticles: [
    { title: '기사 제목', meta: '언론사 ∙ 날짜' },
    { title: '기사 제목', meta: '언론사 ∙ 날짜' },
  ],
  listArticles: [
    { title: '기사 제목', meta: '언론사 ∙ 날짜', variant: 'clamp' },
    { title: '기사 제목', meta: '언론사 ∙ 날짜', variant: 'clamp' },
    { title: '기사 제목', meta: '언론사 ∙ 날짜', variant: 'clamp' },
    { title: '기사 제목', meta: '언론사 ∙ 날짜', variant: 'clamp' },
    { title: '기사 제목', meta: '언론사 ∙ 날짜', variant: 'plain' },
    { title: '기사 제목', meta: '언론사 ∙ 날짜', variant: 'plain' },
    { title: '기사 제목', meta: '언론사 ∙ 날짜', variant: 'plain' },
    { title: '기사 제목', meta: '언론사 ∙ 날짜', variant: 'plain' },
  ],
};

/**
 * 뉴스 피드 조회. 백엔드 연결 시 `VITE_API_BASE_URL`과 `GET /news/feed` 등으로 교체합니다.
 * @returns {Promise<NewsFeed>}
 */
export async function fetchNewsFeed() {
  const useMock =
    !import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_USE_MOCK_NEWS === 'true';

  if (useMock) {
    await new Promise((r) => setTimeout(r, 120));
    return structuredClone(MOCK_FEED);
  }

  return apiGet('news/feed');
}
