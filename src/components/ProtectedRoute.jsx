import { Outlet } from 'react-router-dom';

/**
 * 개발 중 임시 비활성화 — 로그인 없이 모든 페이지 접근 가능
 * 구글 OAuth 연동 완료 후 아래 주석 해제하면 됨
 */
export default function ProtectedRoute() {
  // TODO: 구글 CLIENT_ID 설정 완료 후 아래 코드로 교체
  //
  // import { Navigate, Outlet } from 'react-router-dom';
  // import { useAuth } from '../context/AuthContext.jsx';
  // import { ROUTES } from '../constants/routes.js';
  //
  // const { user, loading } = useAuth();
  // if (loading) return <div>로딩 중...</div>;
  // if (!user) return <Navigate to={ROUTES.login} replace />;

  return <Outlet />;
}
