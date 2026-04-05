import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes.js';
import '../styles/pages/placeholder-page.css';

export default function HomePage() {
  return (
    <div className="page-placeholder">
      <h1 className="page-placeholder__title">홈</h1>
      <p className="page-placeholder__text">
        홈 화면입니다. 뉴스·퀴즈·마이페이지로 이동할 수 있습니다.
      </p>
      <nav className="page-placeholder__links" aria-label="빠른 이동">
        <Link to={ROUTES.news}>뉴스</Link>
        <Link to={ROUTES.quiz}>퀴즈</Link>
        <Link to={ROUTES.myPage}>마이페이지</Link>
      </nav>
    </div>
  );
}
