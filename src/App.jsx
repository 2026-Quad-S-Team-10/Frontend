import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
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
          {/* 기본 홈 화면 */}
          <Route index element={<HomePage />} />

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