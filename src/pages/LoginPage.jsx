import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import '../styles/pages/auth.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // 로그인 처리 로직 
    navigate(ROUTES.home);
  };

  return (
    <div className="auth-page app-container">
      <div className="auth-header">
        <h1 className="auth-title">다시 만나서 반가워요!</h1>
        <p className="auth-subtitle">퀴즈를 풀고 금융 상식을 높여보세요.</p>
      </div>

      <form className="auth-form" onSubmit={handleLogin}>
        <div className="input-group">
          <label className="input-label">이메일</label>
          <input
            type="email"
            className="auth-input"
            placeholder="이메일 주소를 입력해주세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label className="input-label">비밀번호</label>
          <input
            type="password"
            className="auth-input"
            placeholder="비밀번호를 입력해주세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="auth-button">로그인</button>
      </form>

      <div className="sns-login-section">
        <div className="sns-divider">SNS 간편 로그인</div>
        <div className="sns-buttons">
          <button className="sns-button kakao" aria-label="카카오 로그인">K</button>
          <button className="sns-button naver" aria-label="네이버 로그인">N</button>
          <button className="sns-button google" aria-label="구글 로그인">G</button>
        </div>
      </div>

      <div className="auth-footer">
        아직 계정이 없으신가요?
        <Link to={ROUTES.signup} className="auth-link">회원가입</Link>
      </div>
    </div>
  );
}
