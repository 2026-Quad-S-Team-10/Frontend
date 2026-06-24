import { apiClient } from './client.js';

/**
 * 캐릭터 기본 정보 조회
 * GET /api/characters/me
 */
export function getCharacterInfo() {
  return apiClient.get('/api/characters/me');
}

/**
 * 캐릭터 꾸미기 화면 전체 정보 조회
 * GET /api/characters/customization
 */
export function getCharacterCustomization() {
  return apiClient.get('/api/characters/customization');
}

/**
 * 탭별 아이템 목록 조회
 * GET /api/characters/customization/items?tabType={tabType}
 * tabType: 'CHARACTER' | 'OUTFIT' | 'BACKGROUND'
 */
export function getCustomizationItems(tabType) {
  return apiClient.get(`/api/characters/customization/items?tabType=${tabType}`);
}

/**
 * 아이템 장착/변경
 * PATCH /api/characters/customization/equip
 */
export function equipItem(body) {
  // body: { tabType, itemId }
  return apiClient.patch('/api/characters/customization/equip', body);
}

/**
 * 말풍선 문구 수정
 * PATCH /api/characters/customization/message
 */
export function updateSpeechBubble(body) {
  // body: { speechBubbleMessage }
  return apiClient.patch('/api/characters/customization/message', body);
}
