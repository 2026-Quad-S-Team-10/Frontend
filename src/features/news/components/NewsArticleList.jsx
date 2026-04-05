/**
 * @param {{
 *   articles: { title: string; meta: string; variant: 'clamp' | 'plain' }[];
 * }} props
 */
export function NewsArticleList({ articles }) {
  return (
    <section className="news-page__list" aria-label="뉴스 목록">
      {articles.map((article, i) => (
        <article
          key={i}
          className={`news-page__row news-page__row--${article.variant}`}
        >
          <div
            className={`news-page__thumb news-page__thumb--list ${article.variant === 'plain' ? 'news-page__thumb--list-plain' : ''}`}
            aria-hidden="true"
          />
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
      ))}
    </section>
  );
}
