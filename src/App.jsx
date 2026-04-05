import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import MyPage from './pages/MyPage';
import ScrapPage from './pages/ScrapPage';
import IncorrectNotePage from './pages/IncorrectNotePage';
import VocabularyPage from './pages/VocabularyPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* 기본 경로는 빈 페이지나 임시 리다이렉트로 구성 */}
          <Route index element={<Navigate to="/mypage" replace />} />

          {/* 마이페이지 라우팅 */}
          <Route path="mypage" element={<MyPage />} />
          <Route path="mypage/scrap" element={<ScrapPage />} />
          <Route path="mypage/note" element={<IncorrectNotePage />} />
          <Route path="mypage/wordbook" element={<VocabularyPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;