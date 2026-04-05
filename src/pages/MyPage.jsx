import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes.js';
import '../styles/pages/placeholder-page.css';

export default function MyPage() {
  return (
    <div className="page-placeholder">
      <h1 className="page-placeholder__title">마이페이지</h1>
      <p className="page-placeholder__text">프로필·설정 등은 이후 연결할 수 있습니다.</p>
      <nav className="page-placeholder__links" aria-label="빠른 이동">
        <Link to={ROUTES.home}>홈</Link>
        <Link to={ROUTES.news}>뉴스</Link>
      </nav>
    </div>
  );
}
