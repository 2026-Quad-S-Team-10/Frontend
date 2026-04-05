import { useState } from 'react';
import { Bell, Settings, CheckCircle2 } from 'lucide-react';
import './HomePage.css';

const HomePage = () => {
  // 모달(바텀 시트) 상태 관리
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // 적용할 가짜 데이터 상태 관리
  const [currentGrade, setCurrentGrade] = useState("등급3");
  const [currentWord, setCurrentWord] = useState("금리");

  // 가짜 달력 데이타 (간단히 표현)
  const days = ['월', '화', '수', '목', '금', '토', '일'];
  const dates = [
    null, null, 3, 4, 5, 6, 7,
    8, 9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28,
    29, 30, 31
  ]; // 달력 시작 빈칸 맞추기용

  // 가짜 단어 모음 데이터
  const mockWords = [
    "단어1", "단어2", "금리",
    "단어4", "단어5", "단어6",
    "단어7", "단어8", "단어9"
  ];

  const mockGrades = ["등급1", "등급2", "등급3", "초보졸업"];

  // 등급/단어 설정 모달 내용 정의
  const SettingsBottomSheet = () => (
    <div className="bottom-sheet-overlay" onClick={() => setIsSettingsOpen(false)}>
      {/* e.stopPropagation()을 통해 오버레이 클릭 시에만 닫히도록 설정 */}
      <div className="bottom-sheet-content" onClick={(e) => e.stopPropagation()}>
        <div className="bottom-sheet-handle"></div>

        {/* 등급 선택 영역 */}
        <div className="grade-select-row">
          {mockGrades.map((grade) => (
            <div
              key={grade}
              className={`grade-option ${currentGrade === grade ? 'active' : ''}`}
              onClick={() => setCurrentGrade(grade)}
            >
              {/* 임시 컬러 박스, 등급명으로 활성화 여부 스타일 처리 */}
              <div className={`grade-color ${currentGrade === grade ? 'active' : ''}`}></div>
              <span className="grade-name">{grade}</span>
            </div>
          ))}
        </div>

        {/* 단어 선택 스크롤 영역 */}
        <div className="word-grid">
          {mockWords.map((word) => (
            <div
              key={word}
              className={`word-item ${currentWord === word ? 'active' : ''}`}
              onClick={() => {
                setCurrentWord(word);
                setIsSettingsOpen(false); // 단어 선택 시 자동으로 모달 닫기
              }}
            >
              {word}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // 달력 모달 내용 정의
  const CalendarBottomSheet = () => (
    <div className="bottom-sheet-overlay" onClick={() => setIsCalendarOpen(false)}>
      <div className="bottom-sheet-content" onClick={(e) => e.stopPropagation()}>
        <div className="bottom-sheet-handle"></div>

        <div className="calendar-header">
          <span>2025년</span>
          <span>3월</span>
        </div>

        <div className="calendar-grid">
          {days.map(day => <div key={day} className="cal-day-name">{day}</div>)}

          {/* 가짜 달력 채우기 */}
          {dates.map((date, index) => {
            if (!date) return <div key={index}></div>;
            // 1일, 2일은 별표 표시(has-star), 3, 4일 등은 일반
            const hasStar = date === 1 || date === 2 || date === 10;
            const isToday = date === 3;

            return (
              <div key={index} className={`cal-date ${hasStar ? 'has-star' : ''} ${isToday ? 'today-bg' : ''}`}>
                {hasStar ? '⭐' : date}
              </div>
            );
          })}
        </div>

        <div className="summary-cards">
          <div className="summary-card">
            <span>현재 연속 학습일</span>
            <span className="summary-value">0일</span>
          </div>
          <div className="summary-card">
            <span>이달 최대 연속 학습일</span>
            <span className="summary-value">0일</span>
          </div>
        </div>
      </div>
    </div>
  );


  return (
    <div className="homepage-container">
      {/* 헤더 */}
      <header className="home-header">
        <span>퀴즈 홈</span>
        <Bell size={24} color="#111827" />
      </header>

      <div className="home-content">
        {/* 상단 등급 표시 공간 -> 클릭 시 설정 모달 열림 */}
        <div className="grade-bar" onClick={() => setIsSettingsOpen(true)}>
          <div className="grade-level">
            {currentGrade}
            <div className="grade-color-circle"></div>
          </div>
          <div className="grade-progress">2/12</div>
        </div>

        {/* 메인 캐릭터 & 퀴즈 영역 */}
        <div className="main-card">
          {/* 우측 상단 톱니바퀴 (장식용 또는 같이 모달열기 용도) */}
          <div className="settings-icon-wrapper" onClick={() => setIsSettingsOpen(true)}>
            <Settings size={28} />
          </div>

          <div className="character-display">
            <img src="/image-0.png" alt="캐릭터" className="character-img"
              onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/160?text=Baby"; }} />
          </div>

          <div className="quiz-badge">
            오늘의 퀴즈 <CheckCircle2 size={16} fill="#3B82F6" color="#FFFFFF" />
          </div>

          <div className="current-word">
            {currentWord}
          </div>

          <button className="btn-start-quiz">퀴즈 시작</button>
        </div>

        {/* 연속 학습일 표시 공간 -> 클릭 시 달력 모달 열림 */}
        <div className="streak-card" onClick={() => setIsCalendarOpen(true)}>
          <span className="streak-title">연속 학습일</span>
          <div className="streak-days">
            <span className="streak-day-icon">⭐</span>
            <span className="streak-day-icon">⭐</span>
            <span className="streak-day-item today">수</span>
            <span className="streak-day-item">목</span>
            <span className="streak-day-item">금</span>
            <span className="streak-day-item">토</span>
            <span className="streak-day-item">일</span>
            <span className="streak-count">0일</span>
          </div>
        </div>
      </div>

      {/* 모달 렌더링 영역 */}
      {isSettingsOpen && <SettingsBottomSheet />}
      {isCalendarOpen && <CalendarBottomSheet />}
    </div>
  );
};

export default HomePage;
