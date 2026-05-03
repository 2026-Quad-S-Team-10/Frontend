import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Settings, CheckCircle2 } from 'lucide-react';
import { ROUTES } from '../constants/routes.js';
import './HomePage.css';

const DAYS = ['월', '화', '수', '목', '금', '토', '일'];
const DATES = [
  null, null, 3, 4, 5, 6, 7,
  8, 9, 10, 11, 12, 13, 14,
  15, 16, 17, 18, 19, 20, 21,
  22, 23, 24, 25, 26, 27, 28,
  29, 30, 31,
];

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
          {mockGrades.map((grade) => (
            <div
              key={grade}
              className={`grade-option ${currentGrade === grade ? 'active' : ''}`}
              onClick={() => onSelectGrade(grade)}
            >
              <div className={`grade-color ${currentGrade === grade ? 'active' : ''}`}></div>
              <span className="grade-name">{grade}</span>
            </div>
          ))}
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
  return (
    <div className="bottom-sheet-overlay" onClick={onClose}>
      <div className="bottom-sheet-content" onClick={(e) => e.stopPropagation()}>
        <div className="bottom-sheet-handle"></div>

        <div className="calendar-header">
          <span>2025년</span>
          <span>3월</span>
        </div>

        <div className="calendar-grid">
          {DAYS.map((day) => (
            <div key={day} className="cal-day-name">
              {day}
            </div>
          ))}

          {DATES.map((date, index) => {
            if (!date) return <div key={index}></div>;
            const hasStar = date === 1 || date === 2 || date === 10;
            const isToday = date === 3;

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
}

const HomePage = () => {
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [currentGrade, setCurrentGrade] = useState('등급3');
  const [currentWord, setCurrentWord] = useState('금리');

  const mockWords = [
    '단어1', '단어2', '금리',
    '단어4', '단어5', '단어6',
    '단어7', '단어8', '단어9',
  ];

  const mockGrades = ['등급1', '등급2', '등급3', '초보졸업'];

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

          <button
            type="button"
            className="btn-start-quiz"
            onClick={() => navigate(ROUTES.quiz)}
          >
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
