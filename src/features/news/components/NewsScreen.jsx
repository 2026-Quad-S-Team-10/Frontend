import { useMemo, useState } from 'react';
import { NEWS_CATEGORY_TABS } from '../constants.js';
import { useNews } from '../hooks/useNews.js';
import { NewsArticleList } from './NewsArticleList.jsx';
import { NewsCategoryTabs } from './NewsCategoryTabs.jsx';
import { NewsHeader } from './NewsHeader.jsx';
import { NewsLearningSection } from './NewsLearningSection.jsx';

import '../../../styles/pages/news-page.css';

export function NewsScreen() {
  const { data, loading, error } = useNews();
  const [categoryId, setCategoryId] = useState(
    () => NEWS_CATEGORY_TABS[0]?.id ?? 'domestic',
  );

  const feed = useMemo(() => data, [data]);

  if (loading && !feed) {
    return (
      <div className="news-page news-page--state" role="status" aria-live="polite">
        <NewsHeader />
        <NewsCategoryTabs activeId={categoryId} onChange={setCategoryId} />
        <p className="news-page__state-msg">불러오는 중…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="news-page news-page--state">
        <NewsHeader />
        <NewsCategoryTabs activeId={categoryId} onChange={setCategoryId} />
        <p className="news-page__state-msg" role="alert">
          {error.message}
        </p>
      </div>
    );
  }

  if (!feed) {
    return null;
  }

  return (
    <div className="news-page" data-name="뉴스">
      <NewsHeader />
      <NewsCategoryTabs activeId={categoryId} onChange={setCategoryId} />
      <main className="news-page__main">
        <NewsLearningSection
          keyword={feed.keyword}
          articles={feed.learningArticles}
        />
        <NewsArticleList articles={feed.listArticles} />
      </main>
    </div>
  );
}
