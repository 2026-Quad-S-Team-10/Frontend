import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import './SubPage.css';

const IncorrectNotePage = () => {
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revealedIds, setRevealedIds] = useState([]);

  useEffect(() => {
    // 현재 백엔드 명세에는 오답노트 전용 조회 API가 없음.
    // API가 추가되면 이 위치에서 getIncorrectNotes() 같은 함수로 교체하면 됨.
    setNotes([]);
    setLoading(false);
  }, []);

  const toggleAnswer = (id) => {
    setRevealedIds((prev) =>
      prev.includes(id)
        ? prev.filter((revealedId) => revealedId !== id)
        : [...prev, id],
    );
  };

  return (
    <div className="page-container subpage-container bg-gray-page">
      <header className="sub-header">
        <button
          type="button"
          className="back-button"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={28} strokeWidth={2.5} />
        </button>
        <span>오답노트</span>
      </header>

      <div className="subpage-content">
        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '40px', color: '#9CA3AF' }}>
            불러오는 중...
          </div>
        ) : notes.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '60px', color: '#9CA3AF' }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</p>
            <p style={{ fontSize: '16px', fontWeight: 600, color: '#374151' }}>
              오답 기록이 없어요!
            </p>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>
              오답노트 API가 준비되면 틀린 문제가 여기에 나타나요.
            </p>
          </div>
        ) : (
          notes.map((note) => {
            const id = note.id ?? note.questionId;
            const isRevealed = revealedIds.includes(id);
            const answer = note.correctAnswer ?? note.answer;

            return (
              <div key={id} className="card quiz-card">
                <span className="note-quiz-badge">오늘의 퀴즈</span>

                {!isRevealed ? (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: '8px',
                      alignItems: 'flex-start',
                    }}
                  >
                    <p className="quiz-question" style={{ marginBottom: 0, flex: 1 }}>
                      {note.question ?? note.prompt}
                    </p>

                    <div className="quiz-actions" style={{ margin: 0 }}>
                      <button
                        type="button"
                        className="btn-answer"
                        onClick={() => toggleAnswer(id)}
                      >
                        정답보기
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="quiz-result"
                    onClick={() => toggleAnswer(id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '8px',
                        alignItems: 'flex-start',
                      }}
                    >
                      <p className="quiz-question" style={{ marginBottom: 0, flex: 1 }}>
                        {note.question ?? note.prompt}
                      </p>

                      {answer === true || answer === 'O' ? (
                        <div className="result-icon" />
                      ) : (
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            fontSize: '28px',
                            color: '#EF4444',
                            fontWeight: 'bold',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: '2px',
                            flexShrink: 0,
                            lineHeight: 1,
                          }}
                        >
                          X
                        </div>
                      )}
                    </div>

                    <p className="quiz-explanation">
                      {note.explanation}
                    </p>
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