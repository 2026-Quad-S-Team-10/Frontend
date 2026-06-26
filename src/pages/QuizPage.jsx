import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ROUTES } from '../constants/routes.js';
import {
  getTodayQuiz,
  updateQuizProgress,
  getLearningNews,
  getQuizQuestion,
  submitQuizAnswer,
  getQuizResult,
  finishQuiz,
} from '../api/quiz.js';
import '../styles/pages/quiz-page.css';

function LoadingSpinner({ text = '불러오는 중...' }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        gap: '12px',
        color: '#9CA3AF',
      }}
    >
      <div
        style={{
          width: '32px',
          height: '32px',
          border: '3px solid #E5E7EB',
          borderTop: '3px solid #EAB308',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      <p>{text}</p>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6B7280' }}>
      <p style={{ marginBottom: '16px' }}>{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          style={{
            padding: '10px 24px',
            background: '#EAB308',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          다시 시도
        </button>
      )}
    </div>
  );
}

function normalizeStep(value) {
  const step = Number(value ?? 1);

  if (step >= 1 && step <= 3) return step;

  return 1;
}

function getQuizSetId(quizSet) {
  return quizSet?.quizSetId ?? quizSet?.id;
}

function getConcept(quizSet) {
  return (
    quizSet?.concept ??
    quizSet?.steps?.find((s) => s.type === 'CONCEPT')?.concept ??
    {}
  );
}

function getQuestionId(questionData) {
  return questionData?.questionId ?? questionData?.id;
}

function isSameChoiceId(a, b) {
  if (a === null || a === undefined || b === null || b === undefined) {
    return false;
  }

  return String(a) === String(b);
}

function normalizeChoices(questionData) {
  const choices = questionData?.choices ?? questionData?.options;

  if (Array.isArray(choices) && choices.length > 0) {
    return choices.map((choice, index) => ({
      choiceId: choice.choiceId ?? choice.id ?? index + 1,
      label: choice.label ?? choice.content ?? choice.text ?? choice.value ?? String(index),
    }));
  }

  return [
    { choiceId: 1, label: 'O' },
    { choiceId: 2, label: 'X' },
  ];
}

export default function QuizPage() {
  const navigate = useNavigate();

  const [quizSet, setQuizSet] = useState(null);
  const [stage, setStage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newsData, setNewsData] = useState(null);
  const [newsLoading, setNewsLoading] = useState(false);

  const [questionData, setQuestionData] = useState(null);
  const [questionLoading, setQuestionLoading] = useState(false);
  const [selectedChoiceId, setSelectedChoiceId] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [resultData, setResultData] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [isNextEnabled, setIsNextEnabled] = useState(false);

  const quizSetId = getQuizSetId(quizSet);
  const concept = getConcept(quizSet);

  const loadTodayQuiz = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getTodayQuiz();

      setQuizSet(data);
      setStage(normalizeStep(data?.step ?? data?.currentStep));

      setNewsData(null);
      setQuestionData(null);
      setSelectedChoiceId(null);
      setSubmitResult(null);
      setResultData(null);
    } catch (e) {
      setError(e?.message ?? '퀴즈를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTodayQuiz();
  }, [loadTodayQuiz]);

  useEffect(() => {
    if (stage === 3) {
      setIsNextEnabled(true);
      return;
    }

    setIsNextEnabled(false);

    const timer = setTimeout(() => {
      setIsNextEnabled(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [stage]);

  useEffect(() => {
    if (stage !== 2 || !quizSetId) return;

    let cancelled = false;

    async function fetchLearningNews() {
      setNewsLoading(true);

      try {
        const data = await getLearningNews(quizSetId);

        if (!cancelled) {
          setNewsData(data);
        }
      } catch {
        if (!cancelled) {
          setNewsData(null);
        }
      } finally {
        if (!cancelled) {
          setNewsLoading(false);
        }
      }
    }

    fetchLearningNews();

    return () => {
      cancelled = true;
    };
  }, [stage, quizSetId]);

  useEffect(() => {
    if (stage !== 3 || !quizSetId) return;

    let cancelled = false;

    async function fetchQuestion() {
      setQuestionLoading(true);
      setSelectedChoiceId(null);
      setSubmitResult(null);
      setResultData(null);

      try {
        const data = await getQuizQuestion(quizSetId);

        if (!cancelled) {
          setQuestionData(data);
        }
      } catch {
        if (!cancelled) {
          setQuestionData(null);
        }
      } finally {
        if (!cancelled) {
          setQuestionLoading(false);
        }
      }
    }

    fetchQuestion();

    return () => {
      cancelled = true;
    };
  }, [stage, quizSetId]);

  const completeStep = async (step) => {
    if (!quizSetId) return;

    try {
      await updateQuizProgress({
        quizSetId,
        step,
        action: 'COMPLETE',
      });
    } catch {
      // 이미 완료된 단계일 수 있으므로 화면 진행은 유지
    }
  };

  const handleNext = async () => {
    if (stage >= 3) return;

    await completeStep(stage);
    setStage((prev) => prev + 1);
    setIsNextEnabled(false);
  };

  const handleSubmit = async (choiceId) => {
    const questionId = getQuestionId(questionData);

    if (submitting || !quizSetId || !questionId) return;

    setSelectedChoiceId(choiceId);
    setSubmitting(true);

    try {
      const submitData = await submitQuizAnswer({
        quizSetId,
        questionId,
        selectedChoiceId: choiceId,
      });

      setSubmitResult(submitData);

      const result = await getQuizResult(quizSetId, questionId);
      setResultData(result);
    } catch (e) {
      alert(e?.message ?? '제출에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinish = async () => {
    if (!quizSetId) {
      navigate(ROUTES.home);
      return;
    }

    try {
      await finishQuiz({ quizSetId });
    } catch {
      // 이미 종료된 경우일 수 있으므로 홈으로 이동
    }

    navigate(ROUTES.home);
  };

  const handleBack = () => {
    navigate(ROUTES.home);
  };

  const questionChoices = useMemo(
    () => normalizeChoices(questionData),
    [questionData],
  );

  const isCorrect =
    resultData?.isCorrect ??
    resultData?.correct ??
    submitResult?.isCorrect ??
    submitResult?.correct ??
    false;

  const getChoiceClass = (choiceId) => {
    if (!resultData && !submitResult) return '';

    const isSelected = isSameChoiceId(selectedChoiceId, choiceId);

    const resultChoices = resultData?.choices ?? resultData?.options ?? [];
    const choice = resultChoices.find((item) =>
      isSameChoiceId(item.choiceId ?? item.id, choiceId),
    );

    const choiceState = String(choice?.state ?? '').toUpperCase();

    if (
      choiceState === 'CORRECT' ||
      choice?.isCorrect === true ||
      choice?.correct === true
    ) {
      return 'quiz-answer-button--correct';
    }

    if (
      choiceState === 'WRONG' ||
      choiceState === 'INCORRECT' ||
      choice?.isSelected === true ||
      choice?.selected === true
    ) {
      return 'quiz-answer-button--wrong';
    }

    if (isSelected && isCorrect) {
      return 'quiz-answer-button--correct';
    }

    if (isSelected && !isCorrect) {
      return 'quiz-answer-button--wrong';
    }

    return '';
  };

  const renderLayout = (children) => (
    <div className="page-container">
      <div className="quiz-page">
        <header className="quiz-header">
          <button type="button" className="quiz-header__back" onClick={handleBack}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="quiz-header__title">경제 퀴즈</h1>
        </header>

        {children}
      </div>
    </div>
  );

  if (loading) {
    return renderLayout(<LoadingSpinner text="퀴즈를 불러오는 중..." />);
  }

  if (error) {
    return renderLayout(<ErrorState message={error} onRetry={loadTodayQuiz} />);
  }

  const renderStep1 = () => (
    <>
      <div className="quiz-card-stack quiz-card-stack--step-1" aria-label="퀴즈 카드 스택">
        <div className="quiz-card-stack__back-layer" />
        <div className="quiz-card-stack__front-layer" />

        <section className="quiz-card quiz-card--main">
          <div className="quiz-card__badge">1</div>

          <h2 className="quiz-card__title">
            {concept.keyword ?? concept.title ?? quizSet?.word ?? quizSet?.keyword ?? '오늘의 단어'}
          </h2>

          <p className="quiz-card__description">
            {concept.description ??
              quizSet?.conceptDescription ??
              quizSet?.description ??
              '개념 설명을 불러오는 중입니다.'}
          </p>

          {Array.isArray(concept.examples) && concept.examples.length > 0 && (
            <div className="quiz-card__tips">
              <strong>예시</strong>
              <span>{concept.examples.join(' / ')}</span>
            </div>
          )}
        </section>
      </div>

      <div className="quiz-footer">
        <button
          type="button"
          className="quiz-next-button"
          onClick={handleNext}
          disabled={!isNextEnabled}
        >
          다음 단계 →
        </button>
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <div className="quiz-card-stack quiz-card-stack--step-2" aria-label="퀴즈 카드 스택">
        <div className="quiz-card-stack__back-layer" />
        <div className="quiz-card-stack__front-layer" />

        <section className="quiz-card quiz-card--main">
          <div className="quiz-card__badge">2</div>

          {newsLoading ? (
            <LoadingSpinner text="뉴스 불러오는 중..." />
          ) : (
            <>
              <h2 className="quiz-card__title">
                {newsData?.title ?? newsData?.newsTitle ?? '뉴스 제목'}
              </h2>

              <p className="quiz-card__description" style={{ whiteSpace: 'pre-line' }}>
                {newsData?.content ??
                  newsData?.summary ??
                  newsData?.description ??
                  '뉴스 내용을 불러오는 중입니다.'}
              </p>

              {(newsData?.source || newsData?.publishedAt) && (
                <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '8px' }}>
                  {[newsData?.source, newsData?.publishedAt].filter(Boolean).join(' · ')}
                </p>
              )}
            </>
          )}
        </section>
      </div>

      <div className="quiz-footer">
        <button
          type="button"
          className="quiz-next-button"
          onClick={handleNext}
          disabled={!isNextEnabled}
        >
          다음 단계 →
        </button>
      </div>
    </>
  );

  const renderStep3 = () => (
    <>
      <div className="quiz-card-stack quiz-card-stack--step-3" aria-label="퀴즈 카드 스택">
        <div className="quiz-card-stack__back-layer" />
        <div className="quiz-card-stack__front-layer" />

        <section className="quiz-card quiz-card--main">
          <div className="quiz-card__badge">3</div>

          {questionLoading ? (
            <LoadingSpinner text="문제 불러오는 중..." />
          ) : (
            <>
              <h2 className="quiz-card__title">
                {questionData?.title ?? 'O/X 퀴즈'}
              </h2>

              <p className="quiz-card__description">
                {questionData?.prompt ??
                  questionData?.question ??
                  questionData?.content ??
                  '문제를 불러오는 중...'}
              </p>

              <p className="quiz-card__tips">O 또는 X를 눌러 정답을 선택하세요.</p>
            </>
          )}
        </section>
      </div>

      <section className="quiz-answer-section" aria-label="OX 퀴즈 선택">
        <div className="quiz-actions">
          {questionChoices.map((choice) => {
            const isSelected = isSameChoiceId(selectedChoiceId, choice.choiceId);

            return (
              <button
                key={choice.choiceId}
                type="button"
                className={`quiz-answer-button ${
                  isSelected ? getChoiceClass(choice.choiceId) : ''
                }`}
                onClick={() => !resultData && handleSubmit(choice.choiceId)}
                disabled={!!resultData || submitting || questionLoading}
              >
                {choice.label}
              </button>
            );
          })}
        </div>

        {resultData && (
          <div className="quiz-result" role="status">
            <p className="quiz-result__title">
              {isCorrect ? '🎉 정답입니다!' : '😢 아쉽지만 오답입니다.'}
            </p>

            <p className="quiz-result__text">
              {resultData?.explanation ??
                resultData?.commentary ??
                resultData?.message ??
                (isCorrect ? '잘 선택하셨습니다!' : '다음에 더 잘 맞출 수 있어요.')}
            </p>

            <button
              type="button"
              className="quiz-next-button"
              style={{ marginTop: '16px' }}
              onClick={handleFinish}
            >
              학습 완료 🏁
            </button>
          </div>
        )}
      </section>
    </>
  );

  return renderLayout(
    <>
      {stage === 1 && renderStep1()}
      {stage === 2 && renderStep2()}
      {stage === 3 && renderStep3()}
    </>,
  );
}