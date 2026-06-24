import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { redirectToGoogleLogin } from '../api/auth.js';
import '../styles/pages/auth.css';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    redirectToGoogleLogin();
  };

  return (
    <div className="auth-page app-container">
      <div className="auth-header">
        <h1 className="auth-title">다시 만나서 반가워요!</h1>
        <p className="auth-subtitle">퀴즈를 풀고 금융 상식을 높여보세요.</p>
      </div>

      <div className="sns-login-section">
        <div className="sns-divider">SNS 간편 로그인</div>
        <div className="sns-buttons">
          <button
            className="sns-button google"
            aria-label="구글 로그인"
            onClick={handleGoogleLogin}
          >
            G
          </button>
        </div>
      </div>

      <div className="auth-footer">
        처음 오셨나요?&nbsp;
        <span
          className="auth-link"
          onClick={() => navigate(ROUTES.signup)}
          style={{ cursor: 'pointer' }}
        >
          회원가입
        </span>
        은 구글 로그인 후 자동으로 진행됩니다.
      </div>
    </div>
  );
}
