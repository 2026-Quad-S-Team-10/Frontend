import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import '../styles/pages/quiz-page.css';

export default function QuizPage() {
  const navigate = useNavigate();
  // step ranges from 1 to 5
  // 1: 개념, 2: 뉴스, 3: 퀴즈1, 4: 퀴즈2, 5: 퀴즈3
  const [step, setStep] = useState(1);
  const scrollRef = useRef(null);

  // 퀴즈 3개의 데이터를 배열로 관리
  const quizzes = [
    { step: 3, title: '첫 번째 퀴즈', desc: '금리가 오르면 보통 예금 이자도 함께 오른다.', answer: 'O', explanation: '중앙은행이 기준금리를 올리면, 시중은행들도 예금과 대출 금리를 올립니다.' },
    { step: 4, title: '두 번째 퀴즈', desc: '금리가 낮아지면 사람들은 저축을 더 많이 한다.', answer: 'X', explanation: '금리가 낮아지면 이자가 적어지므로, 저축보다는 투자나 소비를 늘리는 경향이 있습니다.' },
    { step: 5, title: '세 번째 퀴즈', desc: '예금 금리는 대출 금리보다 높다.', answer: 'X', explanation: '은행은 대출 이자를 더 높게 받아 예대마진(이익)을 남기므로 일반적으로 대출 금리가 높습니다.' },
  ];

  // 사용자의 답안 저장소: { 3: 'O', 4: 'X', 5: 'X' }
  const [answers, setAnswers] = useState({});

  // 1, 2단계를 끝까지 읽었는지 추적
  const [readSteps, setReadSteps] = useState({ 1: false, 2: false });
  const bottomRef = useRef(null);

  // 스크롤이 트리거 요소(bottomRef)에 닿으면 해당 단계를 읽은 것으로 간주
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && (step === 1 || step === 2)) {
        setReadSteps(prev => ({ ...prev, [step]: true }));
      }
    }, { root: null, rootMargin: "0px", threshold: 0.1 });

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }
    return () => observer.disconnect();
  }, [step]);

  // 탭 클릭 시 스크롤 이동
  const handleTabClick = (targetStep) => {
    setStep(targetStep);
    if (scrollRef.current) {
      const containerWidth = scrollRef.current.offsetWidth;
      scrollRef.current.scrollTo({
        left: (targetStep - 1) * containerWidth,
        behavior: 'smooth'
      });
    }
  };

  // 스와이프(스크롤) 시 스텝 자동 업데이트 및 틸트(기울기) 효과
  const handleScroll = (e) => {
    const scrollLeft = e.target.scrollLeft;
    const containerWidth = e.target.offsetWidth;

    // 어느 인덱스에 가까운지 계산 (0, 1, 2)
    const newIndex = Math.round(scrollLeft / containerWidth);
    if (newIndex + 1 !== step) {
      setStep(newIndex + 1);
    }

    // 카드 틸트 애니메이션!
    // 각 카드를 돌면서 위치에 따라 rotateZ를 계산합니다.
    const cards = document.querySelectorAll('.quiz-card');
    cards.forEach((card, index) => {
      // 카드의 상대적인 오프셋 위치 (-1 ~ 1)
      const centerPos = (index * containerWidth) - scrollLeft;
      const ratio = centerPos / containerWidth;

      // 스와이프될 때 중심에서 멀어지면 살짝 기울어집니다 (최대 5도)
      // 오른쪽으로 스와이프 => 카드가 우측으로 밀리면서 살짝 갸우뚱
      const rotateZ = ratio * 8;

      // transform 적용 (드래그 중에만 적용되고 스냅되면 스르륵 원래대로)
      card.style.transform = `rotateZ(${rotateZ}deg)`;
    });
  };

  // 다음 단계 버튼
  const handleNextStep = () => {
    if (step < 5) {
      handleTabClick(step + 1);
    }
  };

  // OX 버튼 클릭 (해당 스텝의 정답 기록)
  const handleOptionClick = (currentStep, option) => {
    if (answers[currentStep]) return; // 이미 풀었으면 무시
    setAnswers(prev => ({ ...prev, [currentStep]: option }));
  };

  // 다음 문제 / 완료 버튼 (추가 가능)
  const handleFinish = () => {
    navigate(-1); // 임시로 이전 화면으로 돌아감
  };

  const maxUnlockedStep = (() => {
    let max = 1;
    if (readSteps[1]) max = 2;
    if (readSteps[1] && readSteps[2]) max = 3;
    if (readSteps[1] && readSteps[2] && answers[3]) max = 4;
    if (readSteps[1] && readSteps[2] && answers[3] && answers[4]) max = 5;
    return max;
  })();

  return (
    <div className="quiz-page-container">
      {/* 헤더 */}
      <header className="quiz-header">
        <button className="quiz-back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft size={28} />
        </button>
        <span>경제 퀴즈</span>
      </header>

      <main className="quiz-main">
        {/* 폴더 탭 영역 (전체 배경을 포함하는 컨테이너) */}
        <div className="quiz-tabs-container">
          <div className="quiz-tabs">
            <div className={`quiz-tab ${step === 1 ? 'active' : ''}`}>
              {step === 1 && <span className="tab-circle">1</span>}
            </div>
            <div className={`quiz-tab ${step === 2 ? 'active' : ''}`}>
              {step === 2 && <span className="tab-circle">2</span>}
            </div>
            <div className={`quiz-tab ${step >= 3 ? 'active' : ''}`}>
              {step >= 3 && <span className="tab-circle">3</span>}
            </div>
          </div>
        </div>

        {/* 캐러셀(스와이프) 컨테이너 */}
        <div
          className="swipe-container"
          ref={scrollRef}
          onScroll={handleScroll}
        >
          {/* Step 1: 경제 개념 */}
          {1 <= maxUnlockedStep && (
            <div className="quiz-card-wrapper">
              <div className="quiz-card" style={{ borderTopLeftRadius: 0 }}>
                <div className="card-subtitle">경제 개념</div>
                <div className="card-title blue">금리</div>
                <div className="card-desc">
                  빌려준 돈이나 예금 따위에 붙는 이자.<br />
                  또는 그 비율.
                </div>
                <div className="card-tips-wrapper">
                  <div className="card-tips-title">Tips</div>
                  <div className="card-tips-content">'돈의 가치' 로 이해하면 쉬워요</div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: 뉴스로 보는 경제 */}
          {2 <= maxUnlockedStep && (
            <div className="quiz-card-wrapper">
              <div className="quiz-card" style={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
                <div className="card-subtitle">뉴스로 보는 경제</div>
                <div className="card-title">제목제목제목제목제목</div>
                <div className="card-desc" style={{ textAlign: 'left' }}>
                  뉴스 내용을 가져와요 뉴스 내용을 가져와요 뉴스 내용을 가져와요 뉴스 내용을 가져와요
                  뉴스 내용을 가져와요 뉴스 내용을 가져와요 뉴스 내용을 가져와요 뉴스 내용을 가져와요
                  뉴스 내용을 가져와요 뉴스 내용을 가져와요 뉴스 내용을 가져와요 뉴스 내용을 가져와요
                </div>
              </div>
            </div>
          )}

          {/* Step 3, 4, 5: 문제 풀이 */}
          {quizzes.map((quiz) => {
            if (quiz.step > maxUnlockedStep) return null;

            const userAnswer = answers[quiz.step];
            return (
              <div className="quiz-card-wrapper" key={quiz.step}>
                <div className="quiz-card" style={{ borderTopRightRadius: 0 }}>
                  <div className="card-subtitle">문제 풀이 ({quiz.step - 2}/3)</div>
                  <div className="card-title">{quiz.title}</div>
                  <div className="card-desc">
                    {quiz.desc}
                  </div>

                  {userAnswer && (
                    <div className="answer-feedback">
                      <div className="feedback-title">
                        {userAnswer === quiz.answer ? '정답입니다!' : '오답입니다!'}
                      </div>
                      <div className="feedback-desc">
                        {quiz.explanation}
                      </div>

                      {quiz.step === 5 && (
                        <button className="btn-next enabled" style={{ marginTop: '36px' }} onClick={handleFinish}>
                          테스트 완료하기
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 점 표시 (페이지네이션) */}
        <div className="pagination-dots">
          {[1, 2, 3, 4, 5].map((num) => (
            <span key={num} className={`dot ${step === num ? 'active' : ''}`} />
          ))}
        </div>

        {/* 동적 하단 액션 영역 */}
        {step === 1 || step === 2 ? (
          <div className="action-area info">
            {/* 스크롤 감지용 투명 요소 */}
            <div ref={bottomRef} style={{ width: '100%', height: '10px' }} />

            <div className="action-hint">끝까지 읽으면 다음 단계로 넘어갈 수 있어요</div>
            <button
              className={`btn-next ${readSteps[step] ? 'enabled' : ''}`}
              onClick={() => {
                if (readSteps[step]) handleNextStep();
              }}
            >
              다음 단계 &rarr;
            </button>
          </div>
        ) : (() => {
          // Step 3, 4, 5 의 UI 렌더링
          const currentQuizIndex = step - 3;
          const currentQuiz = quizzes[currentQuizIndex];
          const userAnswer = answers[step];

          return (
            <div className="action-area quiz">
              {!userAnswer && (
                <div className="action-locked-hint-box">문제를 풀어야 다음으로 넘어갈 수 있어요</div>
              )}

              <div className={`ox-buttons-wrapper ${userAnswer ? 'answered' : ''}`}>
                <button
                  onClick={() => handleOptionClick(step, 'O')}
                  className={`ox-btn btn-o 
                    ${userAnswer === 'O' ? 'selected' : ''} 
                    ${userAnswer === 'O' && userAnswer === currentQuiz.answer ? 'correct' : ''} 
                    ${userAnswer === 'O' && userAnswer !== currentQuiz.answer ? 'wrong' : ''}
                  `}
                >
                  O
                </button>
                <button
                  onClick={() => handleOptionClick(step, 'X')}
                  className={`ox-btn btn-x 
                    ${userAnswer === 'X' ? 'selected' : ''} 
                    ${userAnswer === 'X' && userAnswer === currentQuiz.answer ? 'correct' : ''} 
                    ${userAnswer === 'X' && userAnswer !== currentQuiz.answer ? 'wrong' : ''}
                  `}
                >
                  X
                </button>
              </div>
            </div>
          );
        })()}
      </main>
    </div>
  );
}
