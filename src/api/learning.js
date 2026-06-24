import { apiClient } from './client.js';

/**
 * 연속 학습일 조회
 * GET /api/learning
 */
export function getStreak() {
  return apiClient.get('/api/learning');
}

/**
 * 월간 캘린더 조회
 * GET /api/learning/streak/calendar?year={year}&month={month}
 */
export function getStreakCalendar(year, month) {
  return apiClient.get(`/api/learning/streak/calendar?year=${year}&month=${month}`);
}

/**
 * 현재 등급 및 진행도 조회
 * GET /api/learning/grade
 */
export function getGrade() {
  return apiClient.get('/api/learning/grade');
}

/**
 * 등급별 학습 현황 조회
 * GET /api/learning/grades/detail
 */
export function getGradesDetail() {
  return apiClient.get('/api/learning/grades/detail');
}
