import { useMemo } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
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
          <ArrowLeft size={18} />
        </button>
        <h1 className="news-detail__title">뉴스 상세</h1>
      </header>

      <section className="news-detail__hero" aria-hidden="true" />

      <section className="news-detail__meta-section">
        <div className="news-detail__badge">헤드라인</div>
        <p className="news-detail__category">{article.meta}</p>
        <h2 className="news-detail__article-title">{article.title}</h2>
      </section>

      <section className="news-detail__content">
        <p className="news-detail__lead">
          뉴스 목록에서 선택한 기사의 주요 내용을 자세히 확인하세요. 실제 데이터가 없으므로 예시 텍스트로 화면을 구성합니다.
        </p>
        <p>
          이번 기사는 최신 뉴스 흐름과 핵심 포인트를 요약해 전달합니다. 클릭한 기사 제목 및 기사 사진을 통해 상세 페이지로 이동할 수 있습니다.
        </p>
        <ul className="news-detail__bullet-list">
          <li>핵심 요약 1: 주요 이슈와 배경</li>
          <li>핵심 요약 2: 관련 통계 및 시장 영향</li>
          <li>핵심 요약 3: 다음으로 주목할 변화</li>
        </ul>
        <p>
          기사 전문은 제공된 모의 데이터에 맞춰 기본 텍스트로 표현됩니다. 실제 API가 포함되면 여기에서 상세 본문 내용을 렌더링하도록 확장할 수 있습니다.
        </p>
      </section>

      <section className="news-detail__footer-tags" aria-label="관련 태그">
        <span className="news-detail__tag">#관련뉴스</span>
        <span className="news-detail__tag">#경제</span>
        <span className="news-detail__tag">#핫이슈</span>
      </section>
    </article>
  );
}
