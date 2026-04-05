import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import './SubPage.css';

// 임시 가짜 데이터 (Mock Data)
const mockIncorrectNotes = [
  {
    id: 1,
    question: "Q. 물가가 전반적, 지속적으로 상승하는 경제 현상을 인플레이션이라고 한다.",
    correctAnswer: "O",
    explanation: "인플레이션(Inflation)은 화폐가치가 하락하여 물가가 지속적으로 오르는 현상입니다."
  },
  {
    id: 2,
    question: "Q. 중앙은행이 기준금리를 내리면 시중에 돈이 줄어든다.",
    correctAnswer: "X",
    explanation: "기준금리를 내리면 대출이자가 싸져서 시중에 돈이 풀리게(늘어나게) 됩니다."
  },
  {
    id: 3,
    question: "Q. 경기가 침체될 때 물가까지 상승하는 현상을 스태그플레이션이라고 한다.",
    correctAnswer: "O",
    explanation: "침체(Stagnation)와 물가상승(Inflation)의 합성어로, 매우 안 좋은 경제 상황을 뜻합니다."
  }
];

const IncorrectNotePage = () => {
  const navigate = useNavigate();
  // 정답이 보여지고 있는 항목들의 id를 저장하는 상태 배열
  const [revealedIds, setRevealedIds] = useState([]);

  // 정답보기 토글 함수
  const toggleAnswer = (id) => {
    // 이미 포함되어 있으면 빼고, 없으면 추가
    setRevealedIds((prev) =>
      prev.includes(id) ? prev.filter(revealedId => revealedId !== id) : [...prev, id]
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
        {mockIncorrectNotes.map((note) => {
          // 현재 항목이 정답 보기 상태인지 확인
          const isRevealed = revealedIds.includes(note.id);

          return (
            <div key={note.id} className="card quiz-card">
              <span className="quiz-badge">오늘의 퀴즈</span>

              {!isRevealed ? (
                // 1. 정답 보기 전 화면
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'flex-start' }}>
                  <p className="quiz-question" style={{ marginBottom: 0, flex: 1 }}>{note.question}</p>
                  <div className="quiz-actions" style={{ margin: 0 }}>
                    <button className="btn-answer" onClick={() => toggleAnswer(note.id)}>
                      정답보기
                    </button>
                  </div>
                </div>
              ) : (
                // 2. 정답 본 후 화면 (결과와 해설)
                <div className="quiz-result" onClick={() => toggleAnswer(note.id)} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'flex-start' }}>
                    <p className="quiz-question" style={{ marginBottom: 0, flex: 1 }}>{note.question}</p>

                    {/* 정답 아이콘 (O 또는 X) */}
                    {note.correctAnswer === 'O' ? (
                      <div className="result-icon"></div> // 파란색 빈 동그라미 (SubPage.css 의존)
                    ) : (
                      <div style={{
                        width: '32px', height: '32px', fontSize: '28px', color: '#EF4444',
                        fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center',
                        marginTop: '2px', flexShrink: 0, lineHeight: 1
                      }}>X</div>
                    )}
                  </div>
                  <p className="quiz-explanation">{note.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IncorrectNotePage;
