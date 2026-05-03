import { Routes, Route } from 'react-router-dom';
import { NewsScreen } from '../features/news/components/NewsScreen.jsx';
import NewsDetailPage from './NewsDetailPage.jsx';

export default function NewsPage() {
  return (
    <div className="page-container">
      <Routes>
        <Route index element={<NewsScreen />} />
        <Route path=":articleId" element={<NewsDetailPage />} />
      </Routes>
    </div>
  );
}
