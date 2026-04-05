import { Outlet } from 'react-router-dom';
import { AppFooter } from './AppFooter.jsx';
import '../../styles/layout/app-shell.css';

export function MainLayout() {
  return (
    <div className="app-shell">
      <div className="app-shell__content">
        <Outlet />
      </div>
      <AppFooter />
    </div>
  );
}
