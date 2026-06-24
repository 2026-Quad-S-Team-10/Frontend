import { useState, Fragment, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, CheckCircle2, ChevronDown } from 'lucide-react';
import { ROUTES } from '../constants/routes.js';
import { getStreak, getStreakCalendar, getGrade } from '../api/learning.js';
import { getCharacterInfo } from '../api/character.js';
import './HomePage.css';

const DAYS = ['월', '화', '수', '목', '금', '토', '일'];

function CalendarBottomSheet({ onClose }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    getStreakCalendar(year, month + 1)
      .then(setCalendarData)
      .catch(() => setCalendarData(null));
  }, [year, month]);

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  let firstDay = getFirstDayOfMonth(year, month);
  firstDay = firstDay === 0 ? 6 : firstDay - 1;

  const dates = [];
  for (let i = 0; i < firstDay; i++) dates.push(null);
  for (let i = 1; i <= daysInMonth; i++) dates.push(i);

  const learnedDates = calendarData?.attendanceDates ?? [];
  const todayDate = new Date().getDate();

  return (
    <div className="bottom-sheet-overlay" onClick={onClose}>
      <div className="bottom-sheet-content" onClick={(e) => e.stopPropagation()}>
        <div className="bottom-sheet-handle"></div>

        <div className="calendar-header">
          <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2rem', padding: '0 10px' }}>{'<'}</button>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <select value={year}
                onChange={(e) => setCurrentDate(new Date(parseInt(e.target.value), month, 1))}
                style={{ appearance: 'none', background: 'transparent', border: 'none', fontSize: '1.1rem', fontWeight: 800, color: '#111827', paddingRight: '20px', cursor: 'pointer', outline: 'none' }}>
                {Array.from({ length: 5 }, (_, i) => year - 2 + i).map(y => (
                  <option key={y} value={y}>{y}년</option>
                ))}
              </select>
              <ChevronDown size={18} style={{ position: 'absolute', right: 0, pointerEvents: 'none' }} />
            </div>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <select value={month}
                onChange={(e) => setCurrentDate(new Date(year, parseInt(e.target.value), 1))}
                style={{ appearance: 'none', background: 'transparent', border: 'none', fontSize: '1.1rem', fontWeight: 800, color: '#111827', paddingRight: '20px', cursor: 'pointer', outline: 'none' }}>
                {Array.from({ length: 12 }, (_, i) => i).map(m => (
                  <option key={m} value={m}>{m + 1}월</option>
                ))}
              </select>
              <ChevronDown size={18} style={{ position: 'absolute', right: 0, pointerEvents: 'none' }} />
            </div>
          </div>
          <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2rem', padding: '0 10px' }}>{'>'}</button>
        </div>

        <div className="calendar-grid">
          {DAYS.map((day) => (
            <div key={day} className="cal-day-name">{day}</div>
          ))}
          {dates.map((date, index) => {
            if (!date) return <div key={`empty-${index}`}></div>;
            const hasStar = learnedDates.includes(date);
            const isToday = date === todayDate && new Date().getMonth() === month && new Date().getFullYear() === year;
            return (
              <div key={date} className={`cal-date ${hasStar ? 'has-star' : ''} ${isToday ? 'today-bg' : ''}`}>
                {hasStar ? '⭐' : date}
              </div>
            );
          })}
        </div>

        <div className="summary-cards">
          <div className="summary-card">
            <span>현재 연속 학습일</span>
            <span className="summary-value">{calendarData?.currentConsecutiveDays ?? 0}일</span>
          </div>
          <div className="summary-card">
            <span>이달 최대 연속 학습일</span>
            <span className="summary-value">{calendarData?.maxConsecutiveDays ?? 0}일</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function GradeBottomSheet({ onClose, gradeData }) {
  if (!gradeData) return null;
  return (
    <div className="bottom-sheet-overlay" onClick={onClose}>
      <div className="bottom-sheet-content" onClick={(e) => e.stopPropagation()}>
        <div className="bottom-sheet-handle"></div>
        <div style={{ padding: '8px 0 16px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '16px' }}>내 등급 정보</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#FEF3C7', borderRadius: '10px' }}>
              <span style={{ fontWeight: 600 }}>현재 등급</span>
              <span style={{ fontWeight: 700, color: '#D97706' }}>{gradeData.currentGrade ?? '초급'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#F9FAFB', borderRadius: '10px' }}>
              <span style={{ fontWeight: 600 }}>학습 진행</span>
              <span style={{ fontWeight: 700 }}>{gradeData.correctQuizCount ?? 0} / {gradeData.requiredQuizCount ?? 10} 문제</span>
            </div>
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

  const [streakData, setStreakData] = useState(null);
  const [gradeData, setGradeData] = useState(null);
  const [characterData, setCharacterData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      getStreak(),
      getGrade(),
      getCharacterInfo(),
    ]).then(([streakRes, gradeRes, charRes]) => {
      if (streakRes.status === 'fulfilled') setStreakData(streakRes.value);
      if (gradeRes.status === 'fulfilled') setGradeData(gradeRes.value);
      if (charRes.status === 'fulfilled') setCharacterData(charRes.value);
    }).finally(() => setLoading(false));
  }, []);

  const streakDays = streakData?.currentStreakDays ?? 0;
  const currentGrade = gradeData?.currentGrade ?? '초급';
  const gradeProgress = gradeData ? `${gradeData.correctQuizCount ?? 0}/${gradeData.requiredQuizCount ?? 10}` : '0/10';
  const currentWord = characterData?.speechBubbleText ?? '오늘도 학습해요!';
  const characterImageUrl = characterData?.equippedFaceAssetKey ?? null;

  // 연속 학습일 기반 요일 표시 (오늘 기준 앞뒤 표시)
  const today = new Date();
  const todayDayIdx = today.getDay() === 0 ? 6 : today.getDay() - 1;
  const weekDays = DAYS.map((d, i) => ({
    label: d,
    isToday: i === todayDayIdx,
    isFilled: i <= todayDayIdx && todayDayIdx - i < streakDays,
  }));

  return (
    <div className="homepage-container">
      <header className="home-header">
        <span>퀴즈 홈</span>
      </header>

      <div className="home-content">
        <div className="grade-bar" onClick={() => setIsSettingsOpen(true)}>
          <div className="grade-level">
            {loading ? '로딩중...' : currentGrade}
            <div className="grade-color-circle"></div>
          </div>
          <div className="grade-progress">{loading ? '-' : gradeProgress}</div>
        </div>

        <div className="main-card">
          <div className="settings-icon-wrapper" onClick={() => navigate(ROUTES.character)}>
            <Settings size={28} />
          </div>

          <div className="character-display">
            <img
              src={characterImageUrl || '/image-0.png'}
              alt="캐릭터"
              className="character-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/image-0.png';
              }}
            />
          </div>

          <div className="quiz-badge">
            오늘의 퀴즈 <CheckCircle2 size={16} fill="#D1D5DB" color="#FFFFFF" />
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
            {weekDays.map((d) => (
              d.isFilled ? (
                <span key={d.label} className="streak-day-icon">⭐</span>
              ) : (
                <span key={d.label} className={`streak-day-item${d.isToday ? ' today' : ''}`}>{d.label}</span>
              )
            ))}
            <span className="streak-count">{streakDays}일</span>
          </div>
        </div>
      </div>

      {isSettingsOpen && (
        <GradeBottomSheet
          onClose={() => setIsSettingsOpen(false)}
          gradeData={gradeData}
        />
      )}
      {isCalendarOpen && (
        <CalendarBottomSheet onClose={() => setIsCalendarOpen(false)} />
      )}
    </div>
  );
};

export default HomePage;
