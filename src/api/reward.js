import { apiClient } from './client.js';

/**
 * 퀴즈 횟수 기반 보상 미리보기
 * GET /api/rewards/unlock-preview
 */
export function getRewardUnlockPreview() {
  return apiClient.get('/api/rewards/unlock-preview');
}

/**
 * 획득 가능한 보상 목록 조회
 * GET /api/rewards/claimable
 */
export function getClaimableRewards() {
  return apiClient.get('/api/rewards/claimable');
}

/**
 * 보상 수령 처리
 * POST /api/rewards/claim
 */
export function claimReward(body) {
  return apiClient.post('/api/rewards/claim', body);
}
