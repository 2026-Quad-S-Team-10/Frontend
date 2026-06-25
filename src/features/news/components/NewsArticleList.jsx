import { Link } from 'react-router-dom';

/**
 * @param {{
 *   articles: {
 *     id?: number | string;
 *     newsId?: number | string;
 *     title: string;
 *     meta: string;
 *     variant: 'clamp' | 'plain';
 *     thumbnailUrl?: string | null;
 *   }[];
 * }} props
 */
export function NewsArticleList({ articles = [] }) {
  if (articles.length === 0) {
    return (
      <section className="news-page__list" aria-label="뉴스 목록">
        <p className="news-page__state-msg">표시할 뉴스가 없습니다.</p>
      </section>
    );
  }

  return (
    <section className="news-page__list" aria-label="뉴스 목록">
      {articles.map((article) => {
        const articleId = article.newsId ?? article.id;

        return (
          <Link
            key={articleId}
            className="news-page__row-link"
            to={`${articleId}`}
            aria-label={`기사 상세 보기: ${article.title}`}
          >
            <article className={`news-page__row news-page__row--${article.variant}`}>
              <div
                className={`news-page__thumb news-page__thumb--list ${
                  article.variant === 'plain' ? 'news-page__thumb--list-plain' : ''
                }`}
                aria-hidden="true"
              >
                {article.thumbnailUrl && (
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
                )}
              </div>

              <div className="news-page__row-body">
                <h2 className="news-page__list-title">{article.title}</h2>
                <p
                  className={
                    article.variant === 'clamp'
                      ? 'news-page__meta'
                      : 'news-page__meta news-page__meta--muted'
                  }
                >
                  {article.meta}
                </p>
              </div>
            </article>
          </Link>
        );
      })}
    </section>
  );
}