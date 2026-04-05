import { Outlet } from 'react-router-dom';
import BottomNavigation from '../BottomNavigation.jsx';

export function MainLayout() {
  return (
    <div className="app-container">
      <Outlet />
      <BottomNavigation />
    </div>
  );
}
