import { apiClient } from './client.js';

/**
 * 현재 로그인 유저 정보 조회
 * GET /api/user/me/{userId}
 */
export function getMe(userId) {
  return apiClient.get(`/api/user/me/${userId}`);
}

/**
 * 회원 정보 수정
 * PATCH /api/user/me/{userId}
 */
export function updateMe(userId, body) {
  return apiClient.patch(`/api/user/me/${userId}`, body);
}

/**
 * 회원 탈퇴
 * DELETE /api/user/me/{userId}
 */
export function deleteMe(userId) {
  return apiClient.delete(`/api/user/me/${userId}`);
}
