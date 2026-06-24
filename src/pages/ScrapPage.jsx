import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Bookmark } from 'lucide-react';
import { getNewsList, removeBookmark } from '../api/news.js';
import './SubPage.css';

const ScrapPage = () => {
  const navigate = useNavigate();
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('전체');

  useEffect(() => {
    // 스크랩 전용 API가 없으므로 뉴스 목록에서 isBookmarked 필터링
    getNewsList()
      .then((data) => {
        const list = data.articles ?? data.newsList ?? data.content ?? data ?? [];
        const scraped = list.filter((n) => n.isBookmarked);
        setNewsList(scraped);
      })
      .catch((e) => setError(e.message ?? '스크랩 목록을 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['전체', ...new Set(newsList.map((n) => n.category ?? '기타').filter(Boolean))];
  const filtered = selectedCategory === '전체'
    ? newsList
    : newsList.filter((n) => (n.category ?? '기타') === selectedCategory);

  const handleRemoveScrap = async (newsId) => {
    try {
      await removeBookmark(newsId);
      setNewsList((prev) => prev.filter((n) => (n.id ?? n.newsId) !== newsId));
    } catch (e) {
      alert(e.message ?? '스크랩 취소에 실패했습니다.');
    }
  };

  return (
    <div className="page-container subpage-container">
      <header className="sub-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ChevronLeft size={28} strokeWidth={2.5} />
        </button>
        <span>스크랩한 뉴스</span>
      </header>

      <div className="subpage-content">
        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '40px', color: '#9CA3AF' }}>불러오는 중...</div>
        ) : error ? (
          <div style={{ textAlign: 'center', marginTop: '40px', color: '#EF4444' }}>{error}</div>
        ) : (
          <>
            <div className="category-filters">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`filter-btn ${selectedCategory === category ? 'active' : 'inactive'}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="news-list">
              {filtered.length > 0 ? (
                filtered.map((news) => {
                  const id = news.id ?? news.newsId;
                  const tags = news.keywords ?? news.tags ?? [];
                  return (
                    <div key={id} className="news-card">
                      <div className="news-image"></div>
                      <div className="news-info">
                        <div className="news-tags">
                          {tags.map((tag) => <span key={tag}>#{tag}</span>)}
                        </div>
                        <h3 className="news-title">{news.title}</h3>
                        <div className="news-meta">
                          {news.source ?? news.publisher ?? ''} · {news.publishedAt ?? news.date ?? ''}
                        </div>
                      </div>
                      <div className="bookmark-icon-container" onClick={() => handleRemoveScrap(id)} style={{ cursor: 'pointer' }}>
                        <Bookmark size={16} fill="#EAB308" color="#EAB308" />
                      </div>
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
