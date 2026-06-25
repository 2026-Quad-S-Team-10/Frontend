import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ROUTES } from '../constants/routes.js';

/**
 * 구글 OAuth2 로그인 콜백 페이지
 *
 * 백엔드 리다이렉트 예시:
 * /oauth2/redirect?accessToken=...&refreshToken=...&isNewUser=true
 */
export default function OAuth2RedirectPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithTokens } = useAuth();

  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const isNewUser = searchParams.get('isNewUser') === 'true';
    const userId = searchParams.get('userId');

    if (!accessToken) {
      alert('로그인에 실패했습니다. 다시 시도해주세요.');
      navigate(ROUTES.login, { replace: true });
      return;
    }

    localStorage.setItem('accessToken', accessToken);

    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }

    if (userId) {
      localStorage.setItem('userId', userId);
    }

    localStorage.setItem('isNewUser', String(isNewUser));

    loginWithTokens({
      accessToken,
      refreshToken,
      userId,
      isNewUser,
    });

    if (isNewUser) {
      navigate(ROUTES.signup, { replace: true });
      return;
    }

    navigate(ROUTES.home, { replace: true });
  }, [searchParams, navigate, loginWithTokens]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#0f1117',
        color: '#fff',
        fontSize: '16px',
      }}
    >
      로그인 처리 중...
    </div>
  );
}