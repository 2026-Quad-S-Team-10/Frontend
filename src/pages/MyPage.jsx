import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bookmark, Pencil, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { getMe, updateMe } from '../api/user.js';
import { getGrade } from '../api/learning.js';
import { getStreak } from '../api/learning.js';
import { logout as logoutApi } from '../api/auth.js';
import { apiClient } from '../api/client.js';
import './MyPage.css';

const MyPage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [userName, setUserName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');
  const [stats, setStats] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uid = localStorage.getItem('userId');
    setUserId(uid);
    if (!uid) { setLoading(false); return; }

    Promise.allSettled([
      getMe(uid),
      getStreak(),
      getGrade(),
    ]).then(([meRes, streakRes, gradeRes]) => {
      if (meRes.status === 'fulfilled') {
        const me = meRes.value;
        setUserName(me.nickname ?? me.name ?? '유저');
      }
      setStats({
        totalDays: streakRes.status === 'fulfilled' ? (streakRes.value?.totalLearningDays ?? 0) : 0,
        maxStreak: streakRes.status === 'fulfilled' ? (streakRes.value?.maxStreakDays ?? 0) : 0,
        currentGrade: gradeRes.status === 'fulfilled' ? (gradeRes.value?.currentGrade ?? '-') : '-',
      });
    }).finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    if (!window.confirm('정말 로그아웃 하시겠습니까?')) return;
    try { await logoutApi(); } catch { /* 무시 */ }
    apiClient.clearTokens();
    setUser(null);
    navigate('/login');
  };

  const startEditing = () => { setTempName(userName); setIsEditingName(true); };

  const finishEditing = async () => {
    const newName = tempName.trim() || userName;
    setUserName(newName);
    setIsEditingName(false);
    if (userId && newName !== userName) {
      try { await updateMe(userId, { nickname: newName }); } catch { /* 무시 */ }
    }
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter') finishEditing(); };

  return (
    <div className="page-container mypage-container">
      <header className="mypage-header">마이페이지</header>

      <div className="mypage-content">
        <div className="profile-card">
          <div className="profile-image">
            <img
              src="/image-0.png"
              alt="캐릭터"
              className="character-img"
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/90?text=Face'; }}
            />
          </div>
          <div className="profile-name" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            {isEditingName ? (
              <>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  style={{ fontSize: 'inherit', fontWeight: 'inherit', textAlign: 'center', border: '1px solid #EAB308', borderRadius: '4px', padding: '2px 8px', width: '120px', outline: 'none' }}
                />
                <Check size={20} className="edit-icon" color="#EAB308" style={{ cursor: 'pointer' }} onClick={finishEditing} />
              </>
            ) : (
              <>
                {loading ? '로딩중...' : userName}
                <Pencil size={16} className="edit-icon" color="#9CA3AF" style={{ cursor: 'pointer' }} onClick={startEditing} />
              </>
            )}
          </div>

          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-label">전체학습<br />일수</span>
              <span className="stat-value">{stats?.totalDays ?? '-'}일</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-label">최대연속<br />학습일</span>
              <span className="stat-value">{stats?.maxStreak ?? '-'}일</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-label">현재 등급</span>
              <span className="stat-value">{stats?.currentGrade ?? '-'}</span>
            </div>
          </div>
        </div>

        <div className="menu-list">
          <Link to="/mypage/scrap" className="menu-item">
            <div className="menu-icon"><Bookmark size={24} fill="#D97706" color="#D97706" /></div>
            <span className="menu-text">스크랩한 뉴스</span>
          </Link>
          <div className="menu-divider"></div>
          <Link to="/mypage/note" className="menu-item">
            <div className="menu-icon"><Bookmark size={24} fill="#D97706" color="#D97706" /></div>
            <span className="menu-text">오답노트</span>
          </Link>
          <div className="menu-divider"></div>
          <Link to="/mypage/wordbook" className="menu-item">
            <div className="menu-icon"><Bookmark size={24} fill="#D97706" color="#D97706" /></div>
            <span className="menu-text">경제 단어집</span>
          </Link>
        </div>

        <div className="utility-menu">
          <button type="button" className="utility-btn" onClick={handleLogout}>로그아웃</button>
          <div className="utility-divider"></div>
          <button type="button" className="utility-btn" onClick={() => navigate('/mypage/withdraw')}>계정 탈퇴</button>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
