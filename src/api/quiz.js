import { apiClient } from './client.js';

/**
 * 오늘의 퀴즈 조회 / 세션 생성
 * GET /api/quizzes/today
 */
export function getTodayQuiz() {
  return apiClient.get('/api/quizzes/today');
}

/**
 * 퀴즈 단계 진행 상태 업데이트
 * PATCH /api/quizzes/today/progress
 */
export function updateQuizProgress(body) {
  return apiClient.patch('/api/quizzes/today/progress', body);
}

/**
 * 학습용 뉴스 조회
 * GET /api/quizzes/today/learning-news?quizSetId={quizSetId}
 */
export function getLearningNews(quizSetId) {
  const params = new URLSearchParams({
    quizSetId: String(quizSetId),
  });

  return apiClient.get(`/api/quizzes/today/learning-news?${params.toString()}`);
}

/**
 * O/X 퀴즈 문제 조회
 * GET /api/quizzes/today/question?quizSetId={quizSetId}
 */
export function getQuizQuestion(quizSetId) {
  const params = new URLSearchParams({
    quizSetId: String(quizSetId),
  });

  return apiClient.get(`/api/quizzes/today/question?${params.toString()}`);
}

/**
 * O/X 퀴즈 답안 제출
 * POST /api/quizzes/today/question/submit
 */
export function submitQuizAnswer(body) {
  return apiClient.post('/api/quizzes/today/question/submit', body);
}

/**
 * 퀴즈 결과 조회
 * GET /api/quizzes/today/result?quizSetId={quizSetId}&questionId={questionId}
 */
export function getQuizResult(quizSetId, questionId) {
  const params = new URLSearchParams({
    quizSetId: String(quizSetId),
    questionId: String(questionId),
  });

  return apiClient.get(`/api/quizzes/today/result?${params.toString()}`);
}

/**
 * 오늘의 퀴즈 학습 종료
 * POST /api/quizzes/today/finish
 */
export function finishQuiz(body) {
  return apiClient.post('/api/quizzes/today/finish', body);
}