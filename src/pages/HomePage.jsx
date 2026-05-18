import { useState, Fragment } from 'react';
import { Bell, Settings, CheckCircle2, ChevronDown } from 'lucide-react';
import './HomePage.css';

const DAYS = ['월', '화', '수', '목', '금', '토', '일'];

function SettingsBottomSheet({
  onClose,
  currentGrade,
  onSelectGrade,
  currentWord,
  onSelectWord,
  mockGrades,
  mockWords,
}) {
  return (
    <div className="bottom-sheet-overlay" onClick={onClose}>
      <div className="bottom-sheet-content" onClick={(e) => e.stopPropagation()}>
        <div className="bottom-sheet-handle"></div>

        <div className="grade-select-row">
          {mockGrades.map((grade, index) => {
            const isActive = currentGrade === grade;
            const activeIndex = mockGrades.indexOf(currentGrade);
            const isPast = index < activeIndex;
            
            let circleClass = 'grade-color';
            if (isActive) circleClass += ' active';
            else if (isPast) circleClass += ' past';

            return (
              <Fragment key={grade}>
                <div
                  className={`grade-option ${isActive ? 'active' : ''}`}
                  onClick={() => onSelectGrade(grade)}
                >
                  <div className={circleClass}></div>
                  <span className="grade-name">{grade}</span>
                </div>
                {index < mockGrades.length - 1 && (
                  <div className={`grade-line ${index < activeIndex ? 'active' : ''}`}>
                    |||||
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>

        <div className="word-grid">
          {mockWords.map((word) => (
            <div
              key={word}
              className={`word-item ${currentWord === word ? 'active' : ''}`}
              onClick={() => onSelectWord(word)}
            >
              {word}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CalendarBottomSheet({ onClose }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  
  const calendarDates = Array(startOffset).fill(null);
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDates.push(i);
  }

  // 백엔드 연동 전 화면 확인을 위한 가짜(Mock) 데이터입니다.
  // 실제로는 백엔드에서 유저의 학습 날짜 배열을 받아와야 합니다.
  const mockLearnedDates = ['2025-03-01', '2025-03-02', '2025-03-03', '2025-03-04', '2025-03-10'];
  
  // 임시 표시용 스트릭 값
  const currentStreak = 4;
  const maxStreak = 4;

  return (
    <div className="bottom-sheet-overlay" onClick={onClose}>
      <div className="bottom-sheet-content" onClick={(e) => e.stopPropagation()}>
        <div className="bottom-sheet-handle"></div>

        <div className="calendar-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={handlePrevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#6B7280' }}>&lt;</button>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <select
                value={year}
                onChange={(e) => setCurrentDate(new Date(parseInt(e.target.value), month, 1))}
                style={{ appearance: 'none', WebkitAppearance: 'none', background: 'transparent', border: 'none', fontSize: 'inherit', fontWeight: 'inherit', color: 'inherit', cursor: 'pointer', paddingRight: '20px', outline: 'none' }}
              >
                {[2024, 2025, 2026, 2027, 2028].map(y => <option key={y} value={y}>{y}년</option>)}
              </select>
              <ChevronDown size={18} style={{ position: 'absolute', right: 0, pointerEvents: 'none' }} />
            </div>
            
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <select
                value={month}
                onChange={(e) => setCurrentDate(new Date(year, parseInt(e.target.value), 1))}
                style={{ appearance: 'none', WebkitAppearance: 'none', background: 'transparent', border: 'none', fontSize: 'inherit', fontWeight: 'inherit', color: 'inherit', cursor: 'pointer', paddingRight: '20px', outline: 'none' }}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i}>{i + 1}월</option>
                ))}
              </select>
              <ChevronDown size={18} style={{ position: 'absolute', right: 0, pointerEvents: 'none' }} />
            </div>
            <button onClick={handleNextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#6B7280' }}>&gt;</button>
          </div>
        </div>

        <div className="calendar-grid">
          {DAYS.map((day) => (
            <div key={day} className="cal-day-name">
              {day}
            </div>
          ))}

          {calendarDates.map((date, index) => {
            if (!date) return <div key={`empty-${index}`}></div>;
            
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
            const hasStar = mockLearnedDates.includes(dateStr);
            
            const today = new Date();
            const isToday = year === today.getFullYear() && month === today.getMonth() && date === today.getDate();

            return (
              <div
                key={index}
                className={`cal-date ${hasStar ? 'has-star' : ''} ${isToday ? 'today-bg' : ''}`}
              >
                {hasStar ? '⭐' : date}
              </div>
            );
          })}
        </div>

        <div className="summary-cards">
          <div className="summary-card">
            <span>현재 연속 학습일</span>
            <span className="summary-value">{currentStreak}일</span>
          </div>
          <div className="summary-card">
            <span>이달 최대 연속 학습일</span>
            <span className="summary-value">{maxStreak}일</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const HomePage = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [currentGrade, setCurrentGrade] = useState('고급');
  const [currentWord, setCurrentWord] = useState('단어2');

  const mockWords = [
    '단어1', '단어2', '단어3',
    '단어4', '단어5', '단어6',
    '단어7', '단어8', '단어9',
  ];

  const mockGrades = ['초급', '중급', '고급', '졸업'];

  const handleSelectWord = (word) => {
    setCurrentWord(word);
    setIsSettingsOpen(false);
  };

  return (
    <div className="homepage-container">
      <header className="home-header">
        <span>퀴즈 홈</span>
        <Bell size={24} color="#111827" />
      </header>

      <div className="home-content">
        <div className="grade-bar" onClick={() => setIsSettingsOpen(true)}>
          <div className="grade-level">
            {currentGrade}
            <div className="grade-color-circle"></div>
          </div>
          <div className="grade-progress">2/12</div>
        </div>

        <div className="main-card">
          <div className="settings-icon-wrapper" onClick={() => setIsSettingsOpen(true)}>
            <Settings size={28} />
          </div>

          <div className="character-display">
            <img
              src="/image-0.png"
              alt="캐릭터"
              className="character-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/160?text=Baby';
              }}
            />
          </div>

          <div className="quiz-badge">
            오늘의 퀴즈 <CheckCircle2 size={16} fill="#3B82F6" color="#FFFFFF" />
          </div>

          <div className="current-word">{currentWord}</div>

          <button type="button" className="btn-start-quiz">
            퀴즈 시작
          </button>
        </div>

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

      {isSettingsOpen && (
        <SettingsBottomSheet
          onClose={() => setIsSettingsOpen(false)}
          currentGrade={currentGrade}
          onSelectGrade={setCurrentGrade}
          currentWord={currentWord}
          onSelectWord={handleSelectWord}
          mockGrades={mockGrades}
          mockWords={mockWords}
        />
      )}
      {isCalendarOpen && (
        <CalendarBottomSheet onClose={() => setIsCalendarOpen(false)} />
      )}
    </div>
  );
};

export default HomePage;
