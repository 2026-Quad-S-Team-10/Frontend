import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { getGradesDetail } from '../api/learning.js';
import './SubPage.css';

const IncorrectNotePage = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [revealedIds, setRevealedIds] = useState([]);

  useEffect(() => {
    // 오답노트 전용 API가 생기면 교체 예정
    // 현재는 등급별 학습 현황에서 틀린 문제를 가져오거나 빈 배열 반환
    getGradesDetail()
      .then((data) => {
        const incorrects = data.incorrectQuestions ?? data.wrongAnswers ?? [];
        setNotes(incorrects);
      })
      .catch(() => setNotes([]))
      .finally(() => setLoading(false));
  }, []);

  const toggleAnswer = (id) => {
    setRevealedIds((prev) =>
      prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id]
    );
  };

  return (
    <div className="page-container subpage-container bg-gray-page">
      <header className="sub-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ChevronLeft size={28} strokeWidth={2.5} />
        </button>
        <span>오답노트</span>
      </header>

      <div className="subpage-content">
        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '40px', color: '#9CA3AF' }}>불러오는 중...</div>
        ) : error ? (
          <div style={{ textAlign: 'center', marginTop: '40px', color: '#EF4444' }}>{error}</div>
        ) : notes.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '60px', color: '#9CA3AF' }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</p>
            <p style={{ fontSize: '16px', fontWeight: 600, color: '#374151' }}>오답 기록이 없어요!</p>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>퀴즈를 풀면 틀린 문제가 여기 나타나요.</p>
          </div>
        ) : (
          notes.map((note) => {
            const id = note.id ?? note.questionId;
            const isRevealed = revealedIds.includes(id);
            return (
              <div key={id} className="card quiz-card">
                <span className="quiz-badge">오늘의 퀴즈</span>
                {!isRevealed ? (
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'flex-start' }}>
                    <p className="quiz-question" style={{ marginBottom: 0, flex: 1 }}>
                      {note.question ?? note.prompt}
                    </p>
                    <div className="quiz-actions" style={{ margin: 0 }}>
                      <button className="btn-answer" onClick={() => toggleAnswer(id)}>정답보기</button>
                    </div>
                  </div>
                ) : (
                  <div className="quiz-result" onClick={() => toggleAnswer(id)} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'flex-start' }}>
                      <p className="quiz-question" style={{ marginBottom: 0, flex: 1 }}>
                        {note.question ?? note.prompt}
                      </p>
                      {(note.correctAnswer ?? note.answer) === 'O' ? (
                        <div className="result-icon"></div>
                      ) : (
                        <div style={{ width: '32px', height: '32px', fontSize: '28px', color: '#EF4444', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2px', flexShrink: 0, lineHeight: 1 }}>X</div>
                      )}
                    </div>
                    <p className="quiz-explanation">{note.explanation}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default IncorrectNotePage;