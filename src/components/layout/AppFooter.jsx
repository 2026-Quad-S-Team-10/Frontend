import { NavLink } from 'react-router-dom';
import { FOOTER_NAV_ITEMS } from './footerNavConfig.js';
import '../../styles/components/app-footer.css';

export function AppFooter() {
  return (
    <footer className="app-footer">
      <nav className="app-footer__inner" aria-label="하단 메뉴">
        {FOOTER_NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `app-footer__link${isActive ? ' app-footer__link--active' : ''}`
            }
          >
            <span className="app-footer__icon-wrap">
              <img
                className="app-footer__icon"
                src={item.icon}
                alt=""
                aria-hidden
              />
            </span>
            <span className="app-footer__label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </footer>
  );
}
