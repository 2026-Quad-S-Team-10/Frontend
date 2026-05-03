import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ROUTES } from '../constants/routes.js';
import { MainLayout } from '../components/layout/MainLayout.jsx';
import HomePage from '../pages/HomePage.jsx';
import NewsPage from '../pages/NewsPage.jsx';
import MyPage from '../pages/MyPage.jsx';
import QuizPage from '../pages/QuizPage.jsx';
import ScrapPage from '../pages/ScrapPage.jsx';
import IncorrectNotePage from '../pages/IncorrectNotePage.jsx';
import VocabularyPage from '../pages/VocabularyPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="news/*" element={<NewsPage />} />
          <Route path="mypage" element={<MyPage />} />
          <Route path="mypage/scrap" element={<ScrapPage />} />
          <Route path="mypage/note" element={<IncorrectNotePage />} />
          <Route path="mypage/wordbook" element={<VocabularyPage />} />
          <Route path="quiz" element={<QuizPage />} />
          <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
