import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes.js';
import '../styles/pages/placeholder-page.css';

export default function QuizPage() {
  return (
    <div className="page-placeholder">
      <h1 className="page-placeholder__title">퀴즈</h1>
      <p className="page-placeholder__text">
        퀴즈 화면입니다. 하단 탭에는 없고 URL로만 진입합니다.
      </p>
      <nav className="page-placeholder__links" aria-label="빠른 이동">
        <Link to={ROUTES.home}>홈</Link>
        <Link to={ROUTES.news}>뉴스</Link>
      </nav>
    </div>
  );
}
