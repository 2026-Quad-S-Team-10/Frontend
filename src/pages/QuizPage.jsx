import { useEffect, useState, useCallback } from 'react';
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

// ─── 로딩 스피너 ────────────────────────────────────────────────────────────
function LoadingSpinner({ text = '불러오는 중...' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px', gap: '12px', color: '#9CA3AF' }}>
      <div style={{ width: '32px', height: '32px', border: '3px solid #E5E7EB', borderTop: '3px solid #EAB308', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <p>{text}</p>
    </div>
  );
}

// ─── 에러 상태 ────────────────────────────────────────────────────────────
function ErrorState({ message, onRetry }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6B7280' }}>
      <p style={{ marginBottom: '16px' }}>{message}</p>
      {onRetry && (
        <button onClick={onRetry} style={{ padding: '10px 24px', background: '#EAB308', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
          다시 시도
        </button>
      )}
    </div>
  );
}

export default function QuizPage() {
  const navigate = useNavigate();

  // 퀴즈 세션 상태
  const [quizSet, setQuizSet] = useState(null);     // GET /today 응답
  const [stage, setStage] = useState(1);             // 1=개념, 2=뉴스, 3=OX퀴즈
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Step2 뉴스 데이터
  const [newsData, setNewsData] = useState(null);
  const [newsLoading, setNewsLoading] = useState(false);

  // Step3 퀴즈 데이터
  const [questionData, setQuestionData] = useState(null);
  const [selectedChoiceId, setSelectedChoiceId] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);   // 제출 응답
  const [resultData, setResultData] = useState(null);        // GET /result 응답
  const [submitting, setSubmitting] = useState(false);

  // 다음 버튼 활성화 (5초 타이머)
  const [isNextEnabled, setIsNextEnabled] = useState(false);

  // ── 1. 퀴즈 세션 초기 로드 ────────────────────────────────────────────
  const loadTodayQuiz = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTodayQuiz();
      setQuizSet(data);
      // currentStep 기준으로 stage 설정
      const step = data.currentStep ?? 1;
      setStage(step);
    } catch (e) {
      setError(e.message ?? '퀴즈를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTodayQuiz();
  }, [loadTodayQuiz]);

  // ── 5초 타이머 (step 1, 2) ───────────────────────────────────────────
  useEffect(() => {
    if (stage === 3) {
      setIsNextEnabled(true);
      return;
    }
    setIsNextEnabled(false);
    const timer = setTimeout(() => setIsNextEnabled(true), 5000);
    return () => clearTimeout(timer);
  }, [stage]);

  // ── Step2 뉴스 로드 ──────────────────────────────────────────────────
  useEffect(() => {
    if (stage !== 2 || !quizSet?.quizSetId) return;
    setNewsLoading(true);
    getLearningNews(quizSet.quizSetId)
      .then(setNewsData)
      .catch(() => setNewsData(null))
      .finally(() => setNewsLoading(false));
  }, [stage, quizSet?.quizSetId]);

  // ── Step3 문제 로드 ──────────────────────────────────────────────────
  useEffect(() => {
    if (stage !== 3 || !quizSet?.quizSetId) return;
    getQuizQuestion(quizSet.quizSetId)
      .then(setQuestionData)
      .catch(() => setQuestionData(null));
  }, [stage, quizSet?.quizSetId]);

  // ── 단계 진행 완료 PATCH ─────────────────────────────────────────────
  const completeStep = async (step) => {
    if (!quizSet?.quizSetId) return;
    try {
      await updateQuizProgress({ quizSetId: quizSet.quizSetId, step, action: 'COMPLETE' });
    } catch {
      // 409 (이미 완료) 무시
    }
  };

  // ── 다음 단계 버튼 ────────────────────────────────────────────────────
  const handleNext = async () => {
    if (stage < 3) {
      await completeStep(stage);
      setStage((s) => s + 1);
      setIsNextEnabled(false);
    }
  };

  // ── 답안 제출 ─────────────────────────────────────────────────────────
  const handleSubmit = async (choiceId) => {
    if (submitting || !quizSet?.quizSetId || !questionData?.questionId) return;
    setSelectedChoiceId(choiceId);
    setSubmitting(true);
    try {
      const res = await submitQuizAnswer({
        quizSetId: quizSet.quizSetId,
        questionId: questionData.questionId,
        selectedChoiceId: choiceId,
      });
      setSubmitResult(res);

      // 결과 조회
      const result = await getQuizResult(quizSet.quizSetId, questionData.questionId);
      setResultData(result);
    } catch (e) {
      alert(e.message ?? '제출에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── 학습 종료 ─────────────────────────────────────────────────────────
  const handleFinish = async () => {
    if (!quizSet?.quizSetId) {
      navigate(ROUTES.home);
      return;
    }
    try {
      await finishQuiz({ quizSetId: quizSet.quizSetId });
    } catch {
      // 409 (이미 종료) 무시
    }
    navigate(ROUTES.home);
  };

  // ─── 렌더 ─────────────────────────────────────────────────────────────
  const handleBack = () => navigate(ROUTES.home);

  if (loading) {
    return (
      <div className="page-container">
        <div className="quiz-page">
          <header className="quiz-header">
            <button type="button" className="quiz-header__back" onClick={handleBack}>
              <ArrowLeft size={24} />
            </button>
            <h1 className="quiz-header__title">경제 퀴즈</h1>
          </header>
          <LoadingSpinner text="퀴즈를 불러오는 중..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="quiz-page">
          <header className="quiz-header">
            <button type="button" className="quiz-header__back" onClick={handleBack}>
              <ArrowLeft size={24} />
            </button>
            <h1 className="quiz-header__title">경제 퀴즈</h1>
          </header>
          <ErrorState message={error} onRetry={loadTodayQuiz} />
        </div>
      </div>
    );
  }

  // ─── Step 1: 개념 카드 ────────────────────────────────────────────────
  const renderStep1 = () => (
    <>
      <div className="quiz-card-stack" aria-label="퀴즈 카드 스택">
        <div className="quiz-card-stack__back-layer" />
        <div className="quiz-card-stack__front-layer" />
        <section className="quiz-card quiz-card--main">
          <div className="quiz-card__badge">1</div>
          <p className="quiz-card__section-label">경제 개념</p>
          <h2 className="quiz-card__title">{quizSet?.word ?? '오늘의 단어'}</h2>
          <p className="quiz-card__description">{quizSet?.conceptDescription ?? '개념 설명을 불러오는 중입니다.'}</p>
          <div className="quiz-card__tips">
            <strong>Tips</strong>
            <span>{quizSet?.conceptTip ?? '끝까지 읽으면 다음 단계로 넘어갈 수 있어요'}</span>
          </div>
        </section>
      </div>
      <div className="quiz-footer">
        <div className="quiz-dots">
          <span className="quiz-dot quiz-dot--active" />
          <span className="quiz-dot" />
        </div>
        <p className="quiz-footer__text">끝까지 읽으면 다음 단계로 넘어갈 수 있어요</p>
        <button type="button" className="quiz-next-button" onClick={handleNext} disabled={!isNextEnabled}>
          다음 단계 →
        </button>
      </div>
    </>
  );

  // ─── Step 2: 뉴스 읽기 ───────────────────────────────────────────────
  const renderStep2 = () => (
    <>
      <div className="quiz-card-stack" aria-label="퀴즈 카드 스택">
        <div className="quiz-card-stack__back-layer" />
        <div className="quiz-card-stack__front-layer" />
        <section className="quiz-card quiz-card--main">
          <div className="quiz-card__badge">2</div>
          <p className="quiz-card__section-label">뉴스로 보는 경제</p>
          {newsLoading ? (
            <LoadingSpinner text="뉴스 불러오는 중..." />
          ) : (
            <>
              <h2 className="quiz-card__title">{newsData?.title ?? '뉴스 제목'}</h2>
              <p className="quiz-card__description" style={{ whiteSpace: 'pre-line' }}>
                {newsData?.content ?? newsData?.summary ?? '뉴스 내용을 불러오는 중입니다.'}
              </p>
              {newsData?.source && (
                <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '8px' }}>
                  출처: {newsData.source}
                </p>
              )}
            </>
          )}
          <div className="quiz-card__tips">
            <strong>Tips</strong>
            <span>끝까지 읽으면 다음 단계로 넘어갈 수 있어요</span>
          </div>
        </section>
      </div>
      <div className="quiz-footer">
        <div className="quiz-dots">
          <span className="quiz-dot" />
          <span className="quiz-dot quiz-dot--active" />
        </div>
        <p className="quiz-footer__text">끝까지 읽으면 다음 단계로 넘어갈 수 있어요</p>
        <button type="button" className="quiz-next-button" onClick={handleNext} disabled={!isNextEnabled}>
          다음 단계 →
        </button>
      </div>
    </>
  );

  // ─── Step 3: O/X 퀴즈 ────────────────────────────────────────────────
  const getChoiceClass = (choiceId) => {
    if (!resultData) return '';
    const choice = resultData.choices?.find(c => c.choiceId === choiceId);
    if (!choice) return '';
    if (choice.state === 'CORRECT') return 'quiz-answer-button--correct';
    if (choice.state === 'WRONG') return 'quiz-answer-button--wrong';
    return '';
  };

  const renderStep3 = () => (
    <>
      <div className="quiz-card-stack" aria-label="퀴즈 카드 스택">
        <div className="quiz-card-stack__back-layer" />
        <div className="quiz-card-stack__front-layer" />
        <section className="quiz-card quiz-card--main">
          <div className="quiz-card__badge">3</div>
          <p className="quiz-card__section-label">문제 풀이</p>
          <h2 className="quiz-card__title">{questionData?.title ?? 'O/X 퀴즈'}</h2>
          <p className="quiz-card__description">{questionData?.prompt ?? '문제를 불러오는 중...'}</p>
          <p className="quiz-card__tips">O 또는 X를 눌러 정답을 선택하세요.</p>
        </section>
      </div>

      <section className="quiz-answer-section" aria-label="OX 퀴즈 선택">
        <div className="quiz-actions">
          {(questionData?.choices ?? [{ choiceId: 'O', label: 'O' }, { choiceId: 'X', label: 'X' }]).map((choice) => (
            <button
              key={choice.choiceId}
              type="button"
              className={`quiz-answer-button ${selectedChoiceId === choice.choiceId ? getChoiceClass(choice.choiceId) : ''}`}
              onClick={() => !resultData && handleSubmit(choice.choiceId)}
              disabled={!!resultData || submitting}
            >
              {choice.label}
            </button>
          ))}
        </div>

        {resultData && (
          <div className="quiz-result" role="status">
            <p className="quiz-result__title">
              {submitResult?.isCorrect ? '🎉 정답입니다!' : '😢 아쉽지만 오답입니다.'}
            </p>
            <p className="quiz-result__text">
              {resultData.explanation ?? (submitResult?.isCorrect ? '잘 선택하셨습니다!' : '다음에 더 잘 맞출 수 있어요.')}
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

  return (
    <div className="page-container">
      <div className="quiz-page">
        <header className="quiz-header">
          <button type="button" className="quiz-header__back" onClick={handleBack}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="quiz-header__title">경제 퀴즈</h1>
        </header>

        {stage === 1 && renderStep1()}
        {stage === 2 && renderStep2()}
        {stage === 3 && renderStep3()}
      </div>
    </div>
  );
}
