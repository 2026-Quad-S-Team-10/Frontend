import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ROUTES } from '../constants/routes.js';
import '../styles/pages/quiz-page.css';

const QUIZ_STEPS = [
  {
    id: 1,
    label: '경제 개념',
    title: '금리',
    description: '빌려준 돈이나 예금 따위에 붙는 이자. 또는 그 비율.',
    tips: "'돈의 가치'로 이해하면 쉬워요",
  },
  {
    id: 2,
    label: '뉴스로 보는 경제',
    title: '경제 기사 제목',
    description:
      '뉴스 내용을 가져와요 뉴스 내용을 가져와요 뉴스 내용을 가져와요 뉴스 내용을 가져와요.',
    tips: '끝까지 읽으면 다음 단계로 넘어갈 수 있어요',
  },
  {
    id: 3,
    label: '문제 풀이',
    title: '퀴즈명',
    description: '부가설명(optional)',
    tips: 'O 또는 X를 눌러 정답을 선택하세요.',
  },
];

const QUIZ_QUESTION = {
  prompt: '인플레이션이 발생하면 화폐 가치가 하락한다. O일까 X일까?',
  answer: 'O',
};

export default function QuizPage() {
  const navigate = useNavigate();
  const [stage, setStage] = useState(1);
  const [isNextEnabled, setIsNextEnabled] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [result, setResult] = useState(null);

  const currentStep = useMemo(
    () => QUIZ_STEPS.find((item) => item.id === stage) ?? QUIZ_STEPS[0],
    [stage],
  );

  useEffect(() => {
    if (stage === 3) {
      setIsNextEnabled(true);
      return undefined;
    }

    setIsNextEnabled(false);
    const timer = setTimeout(() => setIsNextEnabled(true), 5000);
    return () => clearTimeout(timer);
  }, [stage]);

  const handleBack = () => {
    navigate(ROUTES.home);
  };

  const handleNext = () => {
    if (stage >= 3) {
      navigate(ROUTES.home);
      return;
    }

    setStage((current) => current + 1);
    setSelectedAnswer(null);
    setResult(null);
  };

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    setResult(answer === QUIZ_QUESTION.answer ? 'correct' : 'wrong');
  };

  return (
    <div className="page-container">
      <div className="quiz-page">
        <header className="quiz-header">
          <button type="button" className="quiz-header__back" onClick={handleBack}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="quiz-header__title">경제 퀴즈</h1>
        </header>

        <div className="quiz-card-stack" aria-label="퀴즈 카드 스택">
          <div className="quiz-card-stack__back-layer" />
          <div className="quiz-card-stack__front-layer" />
          <section className="quiz-card quiz-card--main">
            <div className="quiz-card__badge">{currentStep.id}</div>
            <p className="quiz-card__section-label">{currentStep.label}</p>
            <h2 className="quiz-card__title">{currentStep.title}</h2>
            <p className="quiz-card__description">{currentStep.description}</p>
            {stage < 3 ? (
              <div className="quiz-card__tips">
                <strong>Tips</strong>
                <span>{currentStep.tips}</span>
              </div>
            ) : (
              <p className="quiz-card__tips">{currentStep.tips}</p>
            )}
          </section>
        </div>

        {stage < 3 ? (
          <div className="quiz-footer">
            <div className="quiz-dots" aria-label="단계 표시">
              {QUIZ_STEPS.slice(0, 2).map((step) => (
                <span
                  key={step.id}
                  className={`quiz-dot ${step.id === stage ? 'quiz-dot--active' : ''}`}
                />
              ))}
            </div>
            <p className="quiz-footer__text">끝까지 읽으면 다음 단계로 넘어갈 수 있어요</p>
            <button
              type="button"
              className="quiz-next-button"
              onClick={handleNext}
              disabled={!isNextEnabled}
            >
              다음 단계 →
            </button>
          </div>
        ) : (
          <section className="quiz-answer-section" aria-label="OX 퀴즈 선택">
            <div className="quiz-actions">
              <button
                type="button"
                className={`quiz-answer-button ${
                  selectedAnswer === 'O' && result === 'correct'
                    ? 'quiz-answer-button--correct'
                    : selectedAnswer === 'O' && result === 'wrong'
                    ? 'quiz-answer-button--wrong'
                    : ''
                }`}
                onClick={() => handleAnswer('O')}
              >
                O
              </button>
              <button
                type="button"
                className={`quiz-answer-button ${
                  selectedAnswer === 'X' && result === 'correct'
                    ? 'quiz-answer-button--correct'
                    : selectedAnswer === 'X' && result === 'wrong'
                    ? 'quiz-answer-button--wrong'
                    : ''
                }`}
                onClick={() => handleAnswer('X')}
              >
                X
              </button>
            </div>
            {result ? (
              <div className="quiz-result" role="status">
                <p className="quiz-result__title">
                  {result === 'correct' ? '정답입니다!' : '아쉽지만 오답입니다.'}
                </p>
                <p className="quiz-result__text">
                  {result === 'correct'
                    ? '정답을 잘 선택하셨습니다.'
                    : '다음에 더 잘 맞출 수 있어요.'}
                </p>
              </div>
            ) : null}
          </section>
        )}
      </div>
    </div>
  );
}
