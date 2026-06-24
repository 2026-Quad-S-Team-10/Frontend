import { useEffect, useCallback } from 'react';
import { useState } from 'react';
import { useMemo } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Bookmark } from 'lucide-react';
import { getNewsDetail, getNewsSummary, addBookmark, removeBookmark } from '../api/news.js';
import '../styles/pages/news-page.css';

export default function NewsDetailPage() {
  const navigate = useNavigate();
  const { articleId } = useParams();

  const [article, setArticle] = useState(null);
  const [summary, setSummary] = useState(null);
  const [isScraped, setIsScraped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  useEffect(() => {
    if (!articleId) return;
    setLoading(true);
    getNewsDetail(articleId)
      .then((data) => {
        setArticle(data);
        setIsScraped(data.isBookmarked ?? false);
      })
      .catch((e) => setError(e.message ?? '뉴스를 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, [articleId]);

  useEffect(() => {
    if (!articleId || !article) return;
    setSummaryLoading(true);
    getNewsSummary(articleId)
      .then(setSummary)
      .catch(() => setSummary(null))
      .finally(() => setSummaryLoading(false));
  }, [articleId, article]);

  const toggleScrap = useCallback(async () => {
    if (!articleId) return;
    try {
      if (isScraped) {
        await removeBookmark(articleId);
      } else {
        await addBookmark(articleId);
      }
      setIsScraped((prev) => !prev);
    } catch (e) {
      alert(e.message ?? '스크랩 처리에 실패했습니다.');
    }
  }, [articleId, isScraped]);

  if (loading) {
    return (
      <div className="news-page news-page--state" role="status" aria-live="polite">
        <div className="news-detail__header">
          <button type="button" className="news-detail__back" onClick={() => navigate(-1)} aria-label="뒤로가기">
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
          <button type="button" className="news-detail__back" onClick={() => navigate(-1)} aria-label="뒤로가기">
            <ArrowLeft size={18} />
          </button>
          <h1 className="news-detail__title">뉴스 상세</h1>
        </div>
        <p className="news-page__state-msg" role="alert">{error}</p>
      </div>
    );
  }

  if (!article) return <Navigate to="/news" replace />;

  const summaryBullets = summary?.bullets ?? summary?.summaryPoints ?? [];

  return (
    <article className="news-page news-detail-page" data-name="뉴스 상세">
      <header className="news-detail__header">
        <button type="button" className="news-detail__back" onClick={() => navigate(-1)} aria-label="뒤로가기">
          <ArrowLeft size={24} />
        </button>
      </header>

      <section className="news-detail__hero" aria-hidden="true" />

      <section className="news-detail__meta-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {article.category && <span className="news-detail__badge">{article.category}</span>}
            {(article.keywords ?? article.tags ?? []).map((kw) => (
              <span key={kw} className="news-detail__keyword">#{kw}</span>
            ))}
          </div>
          <Bookmark
            size={24}
            color={isScraped ? '#EAB308' : '#72787E'}
            fill={isScraped ? '#EAB308' : 'none'}
            style={{ cursor: 'pointer' }}
            onClick={toggleScrap}
          />
        </div>
        <h2 className="news-detail__article-title">{article.title ?? '글제목'}</h2>
        <p className="news-detail__category">{article.source ?? article.publisher ?? '출처'} · {article.publishedAt ?? article.date ?? ''}</p>
      </section>

      <section className="news-detail__ai-summary">
        <div className="news-detail__ai-summary-title">
          <span>✨</span> AI요약
        </div>
        {summaryLoading ? (
          <p style={{ color: '#9CA3AF', fontSize: '14px' }}>요약 불러오는 중...</p>
        ) : summaryBullets.length > 0 ? (
          <ul className="news-detail__ai-bullet-list">
            {summaryBullets.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        ) : (
          <ul className="news-detail__ai-bullet-list">
            <li>{summary?.content ?? 'AI 요약을 불러올 수 없습니다.'}</li>
          </ul>
        )}
      </section>

      <section className="news-detail__content">
        <p style={{ whiteSpace: 'pre-line', lineHeight: '1.7' }}>
          {article.content ?? article.body ?? ''}
        </p>
      </section>
    </article>
  );
}
