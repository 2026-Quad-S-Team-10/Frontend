import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ROUTES } from '../constants/routes.js';
import { MainLayout } from '../components/layout/MainLayout.jsx';
import HomePage from '../pages/HomePage.jsx';
import NewsPage from '../pages/NewsPage.jsx';
import MyPage from '../pages/MyPage.jsx';
import QuizPage from '../pages/QuizPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={ROUTES.home} element={<HomePage />} />
          <Route path={ROUTES.news} element={<NewsPage />} />
          <Route path={ROUTES.myPage} element={<MyPage />} />
          <Route path={ROUTES.quiz} element={<QuizPage />} />
          <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
