import { useEffect, useCallback, useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Bookmark } from 'lucide-react';
import {
  getNewsDetail,
  getNewsSummary,
  addBookmark,
  removeBookmark,
} from '../api/news.js';
import '../styles/pages/news-page.css';

export default function NewsDetailPage() {
  const navigate = useNavigate();
  const { articleId } = useParams();

  const [article, setArticle] = useState(null);
  const [summary, setSummary] = useState(null);
  const [isScraped, setIsScraped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!articleId) return;

    let ignore = false;

    const fetchArticle = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getNewsDetail(articleId);

        if (ignore) return;

        setArticle(data);
        setIsScraped(data?.isBookmarked ?? false);
      } catch (e) {
        if (ignore) return;

        setError(e?.message ?? '뉴스를 불러오지 못했습니다.');
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchArticle();

    return () => {
      ignore = true;
    };
  }, [articleId]);

  useEffect(() => {
    if (!articleId || !article) return;

    let ignore = false;

    const fetchSummary = async () => {
      setSummaryLoading(true);

      try {
        const data = await getNewsSummary(articleId);

        if (!ignore) {
          setSummary(data);
        }
      } catch {
        if (!ignore) {
          setSummary(null);
        }
      } finally {
        if (!ignore) {
          setSummaryLoading(false);
        }
      }
    };

    fetchSummary();

    return () => {
      ignore = true;
    };
  }, [articleId, article]);

  const keywords = useMemo(() => {
    if (!article) return [];

    if (Array.isArray(article.keywords)) return article.keywords;
    if (Array.isArray(article.tags)) return article.tags;
    if (article.keyword) return [article.keyword];

    return [];
  }, [article]);

  const summaryText = useMemo(() => {
    if (!summary) return '';

    if (typeof summary === 'string') return summary;

    return (
      summary.summary ??
      summary.content ??
      article?.summary ??
      ''
    );
  }, [summary, article]);

  const toggleScrap = useCallback(async () => {
    if (!articleId) return;

    const nextScrapState = !isScraped;

    try {
      setIsScraped(nextScrapState);

      if (isScraped) {
        await removeBookmark(articleId);
      } else {
        await addBookmark(articleId);
      }
    } catch (e) {
      setIsScraped(!nextScrapState);
      alert(e?.message ?? '스크랩 처리에 실패했습니다.');
    }
  }, [articleId, isScraped]);

  if (loading) {
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
          {error}
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

      {article.thumbnailUrl ? (
        <section className="news-detail__hero" aria-hidden="true">
          <img
            src={article.thumbnailUrl}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: 'inherit',
            }}
          />
        </section>
      ) : (
        <section className="news-detail__hero" aria-hidden="true" />
      )}

      <section className="news-detail__meta-section">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            {article.category && (
              <span className="news-detail__badge">{article.category}</span>
            )}

            {keywords.map((keyword) => (
              <span key={keyword} className="news-detail__keyword">
                #{keyword}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={toggleScrap}
            aria-label={isScraped ? '스크랩 취소' : '스크랩 추가'}
            style={{
              border: 'none',
              background: 'transparent',
              padding: 0,
              cursor: 'pointer',
            }}
          >
            <Bookmark
              size={24}
              color={isScraped ? '#EAB308' : '#72787E'}
              fill={isScraped ? '#EAB308' : 'none'}
            />
          </button>
        </div>

        <h2 className="news-detail__article-title">
          {article.title ?? '뉴스 제목'}
        </h2>

        <p className="news-detail__category">
          {article.source ?? article.publisher ?? '출처'}
          {article.publishedAt || article.date ? ` · ${article.publishedAt ?? article.date}` : ''}
        </p>
      </section>

      <section className="news-detail__ai-summary">
        <div className="news-detail__ai-summary-title">
          <span>✨</span> AI요약
        </div>

        {summaryLoading ? (
          <p style={{ color: '#9CA3AF', fontSize: '14px' }}>
            요약 불러오는 중...
          </p>
        ) : summaryText ? (
          <p style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
            {summaryText}
          </p>
        ) : (
          <p style={{ color: '#9CA3AF', fontSize: '14px' }}>
            AI 요약을 불러올 수 없습니다.
          </p>
        )}
      </section>

      <section className="news-detail__content">
        <p style={{ whiteSpace: 'pre-line', lineHeight: '1.7' }}>
          {article.content ?? article.body ?? ''}
        </p>
      </section>

      {article.url && (
        <section style={{ marginTop: '20px' }}>
          <a
            href={article.url}
            target="_blank"
            rel="noreferrer"
            className="auth-link"
          >
            원문 기사 보러가기
          </a>
        </section>
      )}
    </article>
  );
}