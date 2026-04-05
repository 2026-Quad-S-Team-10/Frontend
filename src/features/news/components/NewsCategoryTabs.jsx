import { NEWS_CATEGORY_TABS } from '../constants.js';

/**
 * @param {{
 *   activeId: string;
 *   onChange: (id: string) => void;
 * }} props
 */
export function NewsCategoryTabs({ activeId, onChange }) {
  return (
    <nav className="news-page__tabs" aria-label="뉴스 카테고리">
      {NEWS_CATEGORY_TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={
            tab.id === activeId
              ? 'news-page__tab news-page__tab--active'
              : 'news-page__tab'
          }
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
