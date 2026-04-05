/**
 * @param {{
 *   keyword: string;
 *   articles: { title: string; meta: string }[];
 * }} props
 */
export function NewsLearningSection({ keyword, articles }) {
  return (
    <section
      className="news-page__learning"
      aria-labelledby="learning-heading"
    >
      <div className="news-page__learning-head" id="learning-heading">
        <span className="news-page__learning-prefix">오늘 배운 </span>
        <span className="news-page__hash">#{keyword}</span>
        <span className="news-page__learning-suffix">에 대한 뉴스</span>
      </div>
      <div className="news-page__learning-grid">
        {articles.map((article, i) => (
          <article key={i} className="news-page__learning-card">
            <div
              className="news-page__thumb news-page__thumb--learning"
              aria-hidden="true"
            />
            <h2 className="news-page__learning-article-title">{article.title}</h2>
            <p className="news-page__meta">{article.meta}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
