import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { createAccount } from '../api/auth.js';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/pages/auth.css';

export default function SignupPage() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [nickname, setNickname] = useState('');
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!nickname.trim()) {
      setError('닉네임을 입력해주세요.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await createAccount({ nickname: nickname.trim(), goal: goal.trim() });
      await refreshUser();
      navigate(ROUTES.home, { replace: true });
    } catch (err) {
      setError(err.message ?? '회원가입에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page app-container">
      <div className="auth-header">
        <h1 className="auth-title">환영합니다!</h1>
        <p className="auth-subtitle">닉네임과 학습 목표를 설정하면 바로 시작할 수 있어요.</p>
      </div>

      <form className="auth-form" onSubmit={handleSignup}>
        <div className="input-group">
          <label className="input-label">닉네임 *</label>
          <input
            type="text"
            className="auth-input"
            placeholder="사용하실 닉네임을 입력해주세요"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={20}
            required
          />
        </div>

        <div className="input-group">
          <label className="input-label">한줄 다짐 (선택)</label>
          <input
            type="text"
            className="auth-input"
            placeholder="예: 매일 경제 공부하기!"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            maxLength={50}
          />
        </div>

        {error && (
          <p style={{ color: '#ff4d6d', fontSize: '13px', marginTop: '4px' }}>{error}</p>
        )}

        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? '처리 중...' : '시작하기'}
        </button>
      </form>
    </div>
  );
}
