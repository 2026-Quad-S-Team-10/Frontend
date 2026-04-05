import { Outlet, useLocation } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';

const Layout = () => {
  const location = useLocation();
  // 마이페이지 서브페이지들인지 확인하여 바텀 네비게이션 표시 여부 결정
  // (스샷 상 서브페이지들은 바텀 네비게이션을 가지고 있는 것으로 보입니다)

  return (
    <div className="app-container">
      <Outlet />
      {/* 서브페이지에서도 하단 바를 유지한다면 그대로 둡니다 */}
      <BottomNavigation />
    </div>
  );
};

export default Layout;
