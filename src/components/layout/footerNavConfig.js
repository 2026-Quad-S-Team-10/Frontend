import { NAV_ICONS } from '../../constants/navAssets.js';
import { ROUTES } from '../../constants/routes.js';

export const FOOTER_NAV_ITEMS = [
  { to: ROUTES.home, label: '홈', icon: NAV_ICONS.home, end: true },
  { to: ROUTES.news, label: '뉴스', icon: NAV_ICONS.news },
  { to: ROUTES.myPage, label: '마이페이지', icon: NAV_ICONS.myPage },
];
