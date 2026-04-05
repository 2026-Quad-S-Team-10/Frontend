import { NavLink, useLocation } from 'react-router-dom';
import { Home, User } from 'lucide-react';

const BottomNavigation = () => {
  const location = useLocation();
  const isMyPageActive = location.pathname.startsWith('/mypage');

  return (
    <nav className="bottom-nav">
      <NavLink 
        to="/" 
        className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
      >
        <Home size={24} />
        <span>홈</span>
      </NavLink>
      <NavLink 
        to="/news" 
        className={`nav-item ${location.pathname === '/news' ? 'active' : ''}`}
      >
        <div className="custom-icon">
          <span className="custom-icon-text">N</span>
        </div>
        <span>뉴스</span>
      </NavLink>
      <NavLink 
        to="/mypage" 
        className={`nav-item ${isMyPageActive ? 'active' : ''}`}
      >
        <User size={24} />
        <span>마이페이지</span>
      </NavLink>
    </nav>
  );
};

export default BottomNavigation;
