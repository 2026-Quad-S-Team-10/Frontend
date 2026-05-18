import { useMemo, useState, useEffect } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Bookmark } from 'lucide-react';
import { useNews } from '../features/news/hooks/useNews.js';
import '../styles/pages/news-page.css';

export default function NewsDetailPage() {
  const navigate = useNavigate();
  const { articleId } = useParams();
  const { data, loading, error } = useNews();

  const article = useMemo(() => {
    if (!data || typeof articleId !== 'string') {
      return null;
    }
    const index = Number(articleId);
    if (Number.isNaN(index) || index < 0 || index >= data.listArticles.length) {
      return null;
    }
    return data.listArticles[index];
  }, [data, articleId]);

  const [isScraped, setIsScraped] = useState(false);

  useEffect(() => {
    if (article) {
      const saved = localStorage.getItem('scrapedNews');
      if (saved) {
        const scrapedNews = JSON.parse(saved);
        const exists = scrapedNews.some(item => String(item.id) === String(articleId));
        setIsScraped(exists);
      }
    }
  }, [article, articleId]);

  const toggleScrap = () => {
    if (!article) return;
    
    const saved = localStorage.getItem('scrapedNews');
    let scrapedNews = saved ? JSON.parse(saved) : [];
    
    if (isScraped) {
      scrapedNews = scrapedNews.filter(item => String(item.id) !== String(articleId));
    } else {
      scrapedNews.push({
        id: articleId,
        category: '국제', // 임의 카테고리
        tags: ['#키워드', '#키워드2'],
        title: article.title || '글제목',
        source: '출처',
        date: article.meta || '26.02.14'
      });
    }
    
    localStorage.setItem('scrapedNews', JSON.stringify(scrapedNews));
    setIsScraped(!isScraped);
  };

  if (loading && !data) {
    return (
      <div className="news-page news-page--state" role="status" aria-live="polite">
        <div className="news-detail__header">
          <button
            type="button"
            className="news-detail__back"
            onClick={() => navigate(-1)}
            aria-label="뒤로가기"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="news-detail__title">뉴스 상세</h1>
        </div>
        <p className="news-page__state-msg">불러오는 중…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="news-page news-page--state">
        <div className="news-detail__header">
          <button
            type="button"
            className="news-detail__back"
            onClick={() => navigate(-1)}
            aria-label="뒤로가기"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="news-detail__title">뉴스 상세</h1>
        </div>
        <p className="news-page__state-msg" role="alert">
          {error.message}
        </p>
      </div>
    );
  }

  if (!article) {
    return <Navigate to="/news" replace />;
  }

  return (
    <article className="news-page news-detail-page" data-name="뉴스 상세">
      <header className="news-detail__header">
        <button
          type="button"
          className="news-detail__back"
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
        >
          <ArrowLeft size={24} />
        </button>
      </header>

      <section className="news-detail__hero" aria-hidden="true" />

      <section className="news-detail__meta-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span className="news-detail__badge">국제</span>
            <span className="news-detail__keyword">#키워드</span>
            <span className="news-detail__keyword">#키워드2</span>
          </div>
          <Bookmark 
            size={24} 
            color={isScraped ? "#EAB308" : "#72787E"} 
            fill={isScraped ? "#EAB308" : "none"} 
            style={{ cursor: 'pointer' }} 
            onClick={toggleScrap}
          />
        </div>
        <h2 className="news-detail__article-title">{article.title || '글제목'}</h2>
        <p className="news-detail__category">출처 - {article.meta || '26.02.14'}</p>
      </section>

      <section className="news-detail__ai-summary">
        <div className="news-detail__ai-summary-title">
          <span>✨</span> AI요약
        </div>
        <ul className="news-detail__ai-bullet-list">
          <li>내용</li>
          <li>내용</li>
          <li>내용</li>
        </ul>
      </section>

      <section className="news-detail__content">
        <p>
          글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용글내용
        </p>
      </section>

      <div className="news-detail__divider"></div>

      <section className="news-detail__related">
        <h3 className="news-detail__related-title">
          <span className="news-detail__keyword">#키워드</span> 관련 뉴스
        </h3>
        
        <div className="news-detail__related-list">
          <div className="news-page__row">
            <div className="news-page__thumb news-page__thumb--list"></div>
            <div className="news-page__row-body">
              <h4 className="news-page__list-title">기사 제목기사 제목기사 제목기사 제목기사 제목기사 제목</h4>
              <p className="news-page__meta news-page__meta--muted">출처 - 26.02.14</p>
            </div>
          </div>
          <div className="news-page__row">
            <div className="news-page__thumb news-page__thumb--list"></div>
            <div className="news-page__row-body">
              <h4 className="news-page__list-title">기사 제목기사 제목기사 제목기사 제목기사 제목기사 제목</h4>
              <p className="news-page__meta news-page__meta--muted">출처 - 26.02.14</p>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
