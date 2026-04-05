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
          {/* 최초 접속 사이트를 기본적으로 마이페이지로 띄우기 */}
          <Route index element={<Navigate to="/mypage" replace />} />

          {/* 홈 탭이나 뉴스 탭을 누르면 나오게 될 빈 화면 */}
          <Route path="home" element={<div style={{ flex: 1, backgroundColor: '#111' }} />} />
          <Route path="news" element={<div style={{ flex: 1, backgroundColor: '#111' }} />} />

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