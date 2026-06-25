import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Bookmark } from 'lucide-react';
import { getNewsList, getNewsDetail, removeBookmark } from '../api/news.js';
import './SubPage.css';

const CATEGORY_CODES = ['DOMESTIC', 'GLOBAL', 'STOCK', 'REAL_ESTATE'];

const CATEGORY_LABELS = {
  DOMESTIC: '국내',
  GLOBAL: '국제',
  STOCK: '주식',
  REAL_ESTATE: '부동산',
};

function getNewsId(news) {
  return news.newsId ?? news.id;
}

function getArticlesFromResponse(data) {
  if (Array.isArray(data)) return data;

  if (Array.isArray(data?.articles)) return data.articles;
  if (Array.isArray(data?.articles?.content)) return data.articles.content;
  if (Array.isArray(data?.newsList)) return data.newsList;
  if (Array.isArray(data?.content)) return data.content;

  return [];
}

function normalizeTags(news) {
  if (Array.isArray(news.keywords)) return news.keywords;
  if (Array.isArray(news.tags)) return news.tags;
  if (news.keyword) return [news.keyword];

  return [];
}

const ScrapPage = () => {
  const navigate = useNavigate();

  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('전체');

  useEffect(() => {
    let cancelled = false;

    async function fetchScrapList() {
      setLoading(true);
      setError(null);

      try {
        // 스크랩 목록 전용 API가 없어서:
        // 1. 카테고리별 뉴스 목록 조회
        // 2. 각 뉴스 상세 조회
        // 3. isBookmarked === true 인 뉴스만 필터링
        const categoryResults = await Promise.all(
          CATEGORY_CODES.map((category) =>
            getNewsList({
              category,
              page: 0,
              size: 50,
            }),
          ),
        );

        const allArticles = categoryResults.flatMap(getArticlesFromResponse);

        const uniqueArticlesMap = new Map();

        allArticles.forEach((article) => {
          const id = getNewsId(article);

          if (id) {
            uniqueArticlesMap.set(id, article);
          }
        });

        const uniqueArticles = Array.from(uniqueArticlesMap.values());

        const detailResults = await Promise.allSettled(
          uniqueArticles.map((article) => getNewsDetail(getNewsId(article))),
        );

        const scrapedArticles = detailResults
          .filter((result) => result.status === 'fulfilled')
          .map((result) => result.value)
          .filter((news) => news?.isBookmarked);

        if (!cancelled) {
          setNewsList(scrapedArticles);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e.message ?? '스크랩 목록을 불러오지 못했습니다.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchScrapList();

    return () => {
      cancelled = true;
    };
  }, []);

  const categories = [
    '전체',
    ...new Set(newsList.map((news) => news.category).filter(Boolean)),
  ];

  const filtered =
    selectedCategory === '전체'
      ? newsList
      : newsList.filter((news) => news.category === selectedCategory);

  const handleRemoveScrap = async (newsId) => {
    if (!newsId) return;

    try {
      await removeBookmark(newsId);

      setNewsList((prev) => prev.filter((news) => getNewsId(news) !== newsId));
    } catch (e) {
      alert(e.message ?? '스크랩 취소에 실패했습니다.');
    }
  };

  return (
    <div className="page-container subpage-container">
      <header className="sub-header">
        <button
          type="button"
          className="back-button"
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
        >
          <ChevronLeft size={28} strokeWidth={2.5} />
        </button>
        <span>스크랩한 뉴스</span>
      </header>

      <div className="subpage-content">
        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '40px', color: '#9CA3AF' }}>
            불러오는 중...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', marginTop: '40px', color: '#EF4444' }}>
            {error}
          </div>
        ) : (
          <>
            <div className="category-filters">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`filter-btn ${
                    selectedCategory === category ? 'active' : 'inactive'
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === '전체'
                    ? '전체'
                    : CATEGORY_LABELS[category] ?? category}
                </button>
              ))}
            </div>

            <div className="news-list">
              {filtered.length > 0 ? (
                filtered.map((news) => {
                  const id = getNewsId(news);
                  const tags = normalizeTags(news);

                  return (
                    <div
                      key={id}
                      className="news-card"
                      onClick={() => navigate(`/news/${id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="news-image">
                        {news.thumbnailUrl && (
                          <img
                            src={news.thumbnailUrl}
                            alt=""
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              borderRadius: 'inherit',
                            }}
                          />
                        )}
                      </div>

                      <div className="news-info">
                        <div className="news-tags">
                          {tags.map((tag) => (
                            <span key={tag}>#{tag}</span>
                          ))}
                        </div>

                        <h3 className="news-title">{news.title}</h3>

                        <div className="news-meta">
                          {news.source ?? news.publisher ?? ''}
                          {news.publishedAt || news.date
                            ? ` · ${news.publishedAt ?? news.date}`
                            : ''}
                        </div>
                      </div>

                      <button
                        type="button"
                        className="bookmark-icon-container"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveScrap(id);
                        }}
                        style={{
                          cursor: 'pointer',
                          border: 'none',
                          background: 'transparent',
                        }}
                        aria-label="스크랩 취소"
                      >
                        <Bookmark size={16} fill="#EAB308" color="#EAB308" />
                      </button>
                    </div>
                  );
                })
              ) : (
                <div style={{ textAlign: 'center', marginTop: '40px', color: '#9CA3AF' }}>
                  스크랩한 뉴스가 없습니다.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ScrapPage;