import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import '../styles/pages/auth.css';

export default function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [nickname, setNickname] = useState('');

  const handleSignup = (e) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    // 회원가입 처리 로직 
    alert("회원가입이 완료되었습니다!");
    navigate(ROUTES.login);
  };

  return (
    <div className="auth-page app-container">
      <div className="auth-header">
        <h1 className="auth-title">환영합니다!</h1>
        <p className="auth-subtitle">1분 만에 가입하고 경제 퀴즈를 즐겨보세요.</p>
      </div>

      <form className="auth-form" onSubmit={handleSignup}>
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

        <div className="input-group">
          <label className="input-label">비밀번호 확인</label>
          <input
            type="password"
            className="auth-input"
            placeholder="비밀번호를 다시 한 번 입력해주세요"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label className="input-label">닉네임</label>
          <input
            type="text"
            className="auth-input"
            placeholder="사용하실 닉네임을 입력해주세요"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="auth-button">회원가입</button>
      </form>

      <div className="auth-footer" style={{ marginTop: '32px' }}>
        이미 계정이 있으신가요?
        <Link to={ROUTES.login} className="auth-link">로그인</Link>
      </div>
    </div>
  );
}
