import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, PenTool, BookOpen, Pencil, Check } from 'lucide-react';
import './MyPage.css';

const MyPage = () => {
  // 유저 이름과 수정 모드 상태 관리
  const [userName, setUserName] = useState("유저이름");
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState("");

  // 이름 수정 시작
  const startEditing = () => {
    setTempName(userName);
    setIsEditingName(true);
  };

  // 이름 수정 완료
  const finishEditing = () => {
    if (tempName.trim() === "") {
      setUserName("유저이름"); // 빈 칸일 경우 기본값
    } else {
      setUserName(tempName);
    }
    setIsEditingName(false);
  };

  // 엔터키 치면 저장되도록
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      finishEditing();
    }
  };

  return (
    <div className="page-container mypage-container">
      <header className="mypage-header">
        마이페이지
      </header>

      <div className="mypage-content">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-image">
            {/* 유저가 제공한 이미지의 경로를 맞춰줍니다. 우선 public이나 assets에 이미지가 있다고 가정합니다. */}
            <img src="/image-0.png" alt="캐릭터" className="character-img"
              onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/90?text=Face"; }} />
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
                  style={{
                    fontSize: 'inherit',
                    fontWeight: 'inherit',
                    textAlign: 'center',
                    border: '1px solid #EAB308',
                    borderRadius: '4px',
                    padding: '2px 8px',
                    width: '120px',
                    outline: 'none'
                  }}
                />
                <Check size={20} className="edit-icon" color="#EAB308" style={{ cursor: 'pointer' }} onClick={finishEditing} />
              </>
            ) : (
              <>
                {userName}
                <Pencil size={16} className="edit-icon" color="#9CA3AF" style={{ cursor: 'pointer' }} onClick={startEditing} />
              </>
            )}
          </div>

          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-label">전체학습<br />일수</span>
              <span className="stat-value">12일</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-label">최대연속<br />학습일</span>
              <span className="stat-value">5일</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-label">현재 진도</span>
              <span className="stat-value">금리</span>
            </div>
          </div>
        </div>

        {/* Menu List */}
        <div className="menu-list">
          <Link to="/mypage/scrap" className="menu-item">
            <div className="menu-icon">
              <Bookmark size={24} fill="#D97706" color="#D97706" />
            </div>
            <span className="menu-text">스크랩한 뉴스</span>
          </Link>
          <div className="menu-divider"></div>

          <Link to="/mypage/note" className="menu-item">
            <div className="menu-icon">
              <Bookmark size={24} fill="#D97706" color="#D97706" />
            </div>
            <span className="menu-text">오답노트</span>
          </Link>
          <div className="menu-divider"></div>

          <Link to="/mypage/wordbook" className="menu-item">
            <div className="menu-icon">
              <Bookmark size={24} fill="#D97706" color="#D97706" />
            </div>
            <span className="menu-text">경제 단어집</span>
          </Link>
        </div>

        {/* Utility Menu */}
        <div className="utility-menu">
          <button className="utility-btn">로그아웃</button>
          <div className="utility-divider"></div>
          <button className="utility-btn">계정 탈퇴</button>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
