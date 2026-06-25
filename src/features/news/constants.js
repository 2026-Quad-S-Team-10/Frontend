/** @typedef {'clamp' | 'plain'} ListArticleVariant */

export const NEWS_CATEGORY_TABS = [
  { id: 'domestic', label: '국내', apiCode: 'DOMESTIC' },
  { id: 'intl', label: '국제', apiCode: 'GLOBAL' },
  { id: 'stocks', label: '주식', apiCode: 'STOCK' },
  { id: 'realestate', label: '부동산', apiCode: 'REAL_ESTATE' },
];

export function getNewsCategoryApiCode(categoryId) {
  return (
    NEWS_CATEGORY_TABS.find((tab) => tab.id === categoryId)?.apiCode ??
    'DOMESTIC'
  );
}