import { getNewsList } from '../../../api/news.js';
import { getNewsCategoryApiCode } from '../constants.js';

function formatDateTime(value) {
  if (!value) return '';

  try {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch {
    return value;
  }
}

function toListArticle(article, index = 0) {
  return {
    id: article.newsId,
    newsId: article.newsId,
    title: article.title ?? '제목 없음',
    meta: [article.source, formatDateTime(article.publishedAt)]
      .filter(Boolean)
      .join(' · '),
    source: article.source,
    publishedAt: article.publishedAt,
    thumbnailUrl: article.thumbnailUrl,
    keyword: article.keyword,
    category: article.category,
    variant: index === 0 ? 'clamp' : 'plain',
  };
}

/**
 * 뉴스 피드 조회
 * GET /api/news?category=DOMESTIC&page=0&size=20
 */
export async function fetchNewsFeed(categoryId = 'domestic') {
  const category = getNewsCategoryApiCode(categoryId);

  const response = await getNewsList({
    category,
    page: 0,
    size: 20,
  });

  // apiClient가 ApiResponse 전체를 반환하므로 여기서 data만 꺼냄
  const data = response?.data ?? response;

  const learnedKeywordSection = data?.learnedKeywordSection;
  const articlePage = data?.articles;
  const articleContent = articlePage?.content ?? [];

  return {
    selectedCategory: data?.selectedCategory ?? category,
    categories: data?.categories ?? [],

    keyword: learnedKeywordSection?.keyword ?? '',
    learningArticles:
      learnedKeywordSection?.articles?.map((article, index) =>
        toListArticle(article, index),
      ) ?? [],

    listArticles: articleContent.map((article, index) =>
      toListArticle(article, index),
    ),

    page: articlePage?.page ?? 0,
    size: articlePage?.size ?? 20,
    totalElements: articlePage?.totalElements ?? 0,
    totalPages: articlePage?.totalPages ?? 0,
    hasNext: articlePage?.hasNext ?? false,
  };
}