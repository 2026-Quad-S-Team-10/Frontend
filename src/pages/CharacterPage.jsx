import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil } from 'lucide-react';
import './CharacterPage.css';

import {
  getCharacterCustomization,
  getCustomizationItems,
  equipItem,
  updateSpeechBubble,
} from '../api/character.js';

import normalExpression from '../assets/character/expressions/기본표정.png';
import embarrassedExpression from '../assets/character/expressions/당황표정.png';
import excitedExpression from '../assets/character/expressions/신남표정.png';
import smirkExpression from '../assets/character/expressions/썩소표정.png';
import tearyExpression from '../assets/character/expressions/울먹표정.png';
import sleepyExpression from '../assets/character/expressions/졸림표정.png';
import angryExpression from '../assets/character/expressions/화난표정.png';

import guitaristOutfit from '../assets/character/outfits/기타리스트옷.png';
import raincoatOutfit from '../assets/character/outfits/비옷.png';
import santaOutfit from '../assets/character/outfits/산타옷.png';
import faceModeOutfit from '../assets/character/outfits/열공모드옷.png';
import kingOutfit from '../assets/character/outfits/왕옷.png';
import bakerOutfit from '../assets/character/outfits/제빵사옷.png';

import bg3Days from '../assets/character/backgrounds/bg-3days.png';
import bg7Days from '../assets/character/backgrounds/bg-7days.png';
import bg10Days from '../assets/character/backgrounds/bg-10days.png';

const expressionImageMap = {
  normal: normalExpression,
  embarrassed: embarrassedExpression,
  excited: excitedExpression,
  smirk: smirkExpression,
  teary: tearyExpression,
  sleepy: sleepyExpression,
  angry: angryExpression,
};

const outfitImageMap = {
  guitarist: guitaristOutfit,
  raincoat: raincoatOutfit,
  santa: santaOutfit,
  faceMode: faceModeOutfit,
  king: kingOutfit,
  baker: bakerOutfit,
};

const backgroundImageMap = {
  default: null,
  bg3days: bg3Days,
  bg7days: bg7Days,
  bg10days: bg10Days,
};

const DISPLAY_QUIZ_COUNT = 1;
const DISPLAY_REQUIRED_QUIZ_COUNT = 7;
const DISPLAY_REMAINING_QUIZ = 6;

const TAB_CONFIG = {
  expression: {
    label: '표정',
    apiType: 'CHARACTER',
    fallbackItems: [
      { id: 'normal', assetKey: 'normal', label: '기본', acquired: true, isFallback: true },
      { id: 'embarrassed', assetKey: 'embarrassed', label: '당황', acquired: true, isFallback: true },
      { id: 'excited', assetKey: 'excited', label: '신남', acquired: true, isFallback: true },
      { id: 'smirk', assetKey: 'smirk', label: '썩소', acquired: true, isFallback: true },
      { id: 'teary', assetKey: 'teary', label: '울먹', acquired: true, isFallback: true },
      { id: 'sleepy', assetKey: 'sleepy', label: '졸림', acquired: true, isFallback: true },
      { id: 'angry', assetKey: 'angry', label: '화남', acquired: true, isFallback: true },
    ],
  },
  outfit: {
    label: '옷',
    apiType: 'OUTFIT',
    fallbackItems: [
      { id: 'guitarist', assetKey: 'guitarist', label: '기타리스트', acquired: true, isFallback: true },
      { id: 'raincoat', assetKey: 'raincoat', label: '비옷', acquired: true, isFallback: true },
      { id: 'santa', assetKey: 'santa', label: '산타', acquired: true, isFallback: true },
      { id: 'faceMode', assetKey: 'faceMode', label: '열공모드', acquired: true, isFallback: true },
      { id: 'king', assetKey: 'king', label: '왕', acquired: true, isFallback: true },
      { id: 'baker', assetKey: 'baker', label: '제빵사', acquired: true, isFallback: true },
    ],
  },
  background: {
    label: '배경',
    apiType: 'BACKGROUND',
    fallbackItems: [
      {
        id: 'default',
        assetKey: 'default',
        label: '기본',
        acquired: true,
        requirementText: '기본 제공',
        isFallback: true,
      },
      {
        id: 'bg3days',
        assetKey: 'bg3days',
        label: '3일 달성',
        acquired: false,
        requirementText: '3일 달성 시 획득',
        isFallback: true,
      },
      {
        id: 'bg7days',
        assetKey: 'bg7days',
        label: '7일 달성',
        acquired: false,
        requirementText: '7일 달성 시 획득',
        isFallback: true,
      },
      {
        id: 'bg10days',
        assetKey: 'bg10days',
        label: '10일 달성',
        acquired: false,
        requirementText: '10일 달성 시 획득',
        isFallback: true,
      },
    ],
  },
};

const tabItems = Object.entries(TAB_CONFIG).map(([key, value]) => ({
  key,
  label: value.label,
}));

function resolveExpressionKey(value) {
  if (!value) return null;

  const key = String(value).trim();
  if (expressionImageMap[key]) return key;

  const lower = key.toLowerCase();

  if (
    lower.includes('normal') ||
    lower.includes('basic') ||
    lower.includes('default') ||
    key.includes('기본')
  ) {
    return 'normal';
  }

  if (
    lower.includes('embarrassed') ||
    lower.includes('panic') ||
    key.includes('당황') ||
    key.includes('열정') ||
    key.includes('정열')
  ) {
    return 'embarrassed';
  }

  if (
    lower.includes('excited') ||
    lower.includes('happy') ||
    key.includes('신남') ||
    key.includes('설렘')
  ) {
    return 'excited';
  }

  if (lower.includes('smirk') || key.includes('썩소') || key.includes('미소')) {
    return 'smirk';
  }

  if (
    lower.includes('teary') ||
    lower.includes('sad') ||
    key.includes('울먹') ||
    key.includes('먹먹')
  ) {
    return 'teary';
  }

  if (lower.includes('sleepy') || key.includes('졸림')) {
    return 'sleepy';
  }

  if (lower.includes('angry') || key.includes('화난') || key === '화') {
    return 'angry';
  }

  return key;
}

function resolveOutfitKey(value) {
  if (!value) return null;

  const key = String(value).trim();
  if (outfitImageMap[key]) return key;

  const lower = key.toLowerCase();

  if (lower.includes('guitar') || key.includes('기타')) return 'guitarist';
  if (lower.includes('rain') || key.includes('비옷')) return 'raincoat';
  if (lower.includes('santa') || key.includes('산타')) return 'santa';
  if (
    lower.includes('study') ||
    lower.includes('facemode') ||
    key.includes('열공') ||
    key.includes('공부')
  ) {
    return 'faceMode';
  }
  if (lower.includes('king') || key.includes('왕') || key.includes('킹')) return 'king';
  if (lower.includes('baker') || key.includes('제빵') || key === '빵' || key.includes('빵집')) {
    return 'baker';
  }

  return key;
}

function resolveBackgroundKey(value) {
  if (!value) return 'default';

  const key = String(value).trim();
  if (backgroundImageMap[key]) return key;

  const lower = key.toLowerCase();

  if (
    lower.includes('3') ||
    lower.includes('three') ||
    lower.includes('bg_3') ||
    lower.includes('bg-3')
  ) {
    return 'bg3days';
  }

  if (
    lower.includes('7') ||
    lower.includes('seven') ||
    lower.includes('bg_7') ||
    lower.includes('bg-7')
  ) {
    return 'bg7days';
  }

  if (
    lower.includes('10') ||
    lower.includes('ten') ||
    lower.includes('bg_10') ||
    lower.includes('bg-10')
  ) {
    return 'bg10days';
  }

  if (lower.includes('default') || lower.includes('basic') || key.includes('기본')) {
    return 'default';
  }

  return key;
}

function resolveAssetKey(tabKey, value) {
  if (tabKey === 'expression') return resolveExpressionKey(value);
  if (tabKey === 'outfit') return resolveOutfitKey(value);
  if (tabKey === 'background') return resolveBackgroundKey(value);

  return value ?? 'default';
}

function getLocalImage(tabKey, value) {
  const key = resolveAssetKey(tabKey, value);

  if (tabKey === 'expression') return expressionImageMap[key] ?? null;
  if (tabKey === 'outfit') return outfitImageMap[key] ?? null;
  if (tabKey === 'background') return backgroundImageMap[key] ?? null;

  return null;
}

function normalizeItem(rawItem, tabKey) {
  const rawId =
    rawItem?.itemId ??
    rawItem?.id ??
    rawItem?.characterItemId ??
    rawItem?.customizationItemId ??
    rawItem?.assetKey;

  const rawAssetKey =
    rawItem?.assetKey ??
    rawItem?.key ??
    rawItem?.code ??
    rawItem?.name ??
    rawItem?.itemName ??
    rawId;

  const assetKey = resolveAssetKey(tabKey, rawAssetKey);

  return {
    id: rawId ?? assetKey,
    assetKey,
    label: rawItem?.name ?? rawItem?.itemName ?? rawItem?.label ?? assetKey,
    imageUrl: rawItem?.imageUrl ?? rawItem?.assetUrl ?? rawItem?.assetPath ?? null,
    acquired:
      rawItem?.isOwned ??
      rawItem?.owned ??
      rawItem?.acquired ??
      rawItem?.isAcquired ??
      rawItem?.isUnlocked ??
      false,
    isEquipped:
      rawItem?.isEquipped ??
      rawItem?.equipped ??
      rawItem?.isSelected ??
      false,
    isFallback: false,
  };
}

function extractItems(data) {
  if (Array.isArray(data)) return data;

  return (
    data?.items ??
    data?.content ??
    data?.characterItems ??
    data?.outfitItems ??
    data?.backgroundItems ??
    data?.data?.items ??
    []
  );
}

function normalizeItems(data, tabKey) {
  const list = extractItems(data);

  if (!Array.isArray(list) || list.length === 0) {
    return TAB_CONFIG[tabKey].fallbackItems;
  }

  const normalizedItems = list.map((item) => normalizeItem(item, tabKey));

  if (tabKey !== 'background') {
    return normalizedItems;
  }

  const existingKeys = new Set(
    normalizedItems.map((item) => item.assetKey ?? item.id),
  );

  const fallbackBackgrounds = TAB_CONFIG.background.fallbackItems.filter(
    (item) => !existingKeys.has(item.assetKey),
  );

  return [...normalizedItems, ...fallbackBackgrounds];
}

const CharacterPage = () => {
  const navigate = useNavigate();

  const [characterMessage, setCharacterMessage] = useState('작심삼일을 3일마다 하자...');
  const [activeTab, setActiveTab] = useState('expression');

  const [selectedExpression, setSelectedExpression] = useState('normal');
  const [selectedOutfit, setSelectedOutfit] = useState(null);
  const [selectedBackground, setSelectedBackground] = useState('default');

  const [itemsByTab, setItemsByTab] = useState({
    expression: TAB_CONFIG.expression.fallbackItems,
    outfit: TAB_CONFIG.outfit.fallbackItems,
    background: TAB_CONFIG.background.fallbackItems,
  });

  const [loading, setLoading] = useState(true);
  const [itemsLoading, setItemsLoading] = useState(false);

  const progressPercent =
    DISPLAY_REQUIRED_QUIZ_COUNT > 0
      ? Math.min((DISPLAY_QUIZ_COUNT / DISPLAY_REQUIRED_QUIZ_COUNT) * 100, 100)
      : 100;

  useEffect(() => {
    let cancelled = false;

    getCharacterCustomization()
      .then((data) => {
        if (cancelled) return;

        setCharacterMessage(
          data?.speechBubbleMessage ??
            data?.speechBubbleText ??
            data?.message ??
            '작심삼일을 3일마다 하자...',
        );

        setSelectedExpression(
          resolveAssetKey(
            'expression',
            data?.equippedCharacterAssetKey ??
              data?.equippedFaceAssetKey ??
              data?.selectedExpression ??
              data?.characterAssetKey ??
              'normal',
          ),
        );

        setSelectedOutfit(
          resolveAssetKey(
            'outfit',
            data?.equippedOutfitAssetKey ??
              data?.selectedOutfit ??
              data?.outfitAssetKey ??
              null,
          ),
        );

        setSelectedBackground(
          resolveAssetKey(
            'background',
            data?.equippedBackgroundAssetKey ??
              data?.selectedBackground ??
              data?.backgroundAssetKey ??
              'default',
          ),
        );
      })
      .catch(() => {
        // 캐릭터 정보를 불러오지 못해도 기본 캐릭터로 화면을 유지
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const apiType = TAB_CONFIG[activeTab].apiType;

    setItemsLoading(true);

    getCustomizationItems(apiType)
      .then((data) => {
        if (cancelled) return;

        const normalized = normalizeItems(data, activeTab);

        setItemsByTab((prev) => ({
          ...prev,
          [activeTab]: normalized,
        }));

        const equippedItem = normalized.find((item) => item.isEquipped);

        if (equippedItem) {
          const nextValue = equippedItem.assetKey ?? equippedItem.id;

          if (activeTab === 'expression') setSelectedExpression(nextValue);
          if (activeTab === 'outfit') setSelectedOutfit(nextValue);
          if (activeTab === 'background') setSelectedBackground(nextValue);
        }
      })
      .catch(() => {
        setItemsByTab((prev) => ({
          ...prev,
          [activeTab]: TAB_CONFIG[activeTab].fallbackItems,
        }));
      })
      .finally(() => {
        if (!cancelled) setItemsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  const activeItems = useMemo(() => {
    return itemsByTab[activeTab] ?? TAB_CONFIG[activeTab].fallbackItems;
  }, [activeTab, itemsByTab]);

  const selectedExpressionItem = useMemo(() => {
    return itemsByTab.expression.find(
      (item) =>
        item.id === selectedExpression ||
        item.assetKey === selectedExpression,
    );
  }, [itemsByTab.expression, selectedExpression]);

  const selectedOutfitItem = useMemo(() => {
    return itemsByTab.outfit.find(
      (item) =>
        item.id === selectedOutfit ||
        item.assetKey === selectedOutfit,
    );
  }, [itemsByTab.outfit, selectedOutfit]);

  const selectedExpressionImage =
    getLocalImage('expression', selectedExpression) ??
    selectedExpressionItem?.imageUrl ??
    normalExpression;

  const selectedOutfitImage =
    getLocalImage('outfit', selectedOutfit) ??
    selectedOutfitItem?.imageUrl ??
    null;

  const selectedBackgroundImage =
    getLocalImage('background', selectedBackground);

  const handleEditMessage = async () => {
    const nextMessage = window.prompt('말풍선 문구를 입력하세요.', characterMessage);

    if (nextMessage === null) return;

    const trimmedMessage = nextMessage.trim() || '작심삼일을 3일마다 하자...';
    const previousMessage = characterMessage;

    setCharacterMessage(trimmedMessage);

    try {
      await updateSpeechBubble({
        speechBubbleMessage: trimmedMessage,
      });
    } catch {
      setCharacterMessage(previousMessage);
      alert('말풍선 문구 수정에 실패했습니다.');
    }
  };

  const setSelectedByTab = (tabKey, value) => {
    if (tabKey === 'expression') setSelectedExpression(value);
    if (tabKey === 'outfit') setSelectedOutfit(value);
    if (tabKey === 'background') setSelectedBackground(value);
  };

  const getSelectedByTab = (tabKey) => {
    if (tabKey === 'expression') return selectedExpression;
    if (tabKey === 'outfit') return selectedOutfit;
    return selectedBackground;
  };

  const handleSelectItem = async (item) => {
    if (!item.acquired) return;

    const selectedValue = item.assetKey ?? item.id;
    const previousValue = getSelectedByTab(activeTab);

    setSelectedByTab(activeTab, selectedValue);

    if (item.isFallback) {
      return;
    }

    try {
      await equipItem({
        tabType: TAB_CONFIG[activeTab].apiType,
        itemId: item.id,
      });
    } catch {
      setSelectedByTab(activeTab, previousValue);
      alert('아이템 장착에 실패했습니다.');
    }
  };

  return (
    <div className="page-container character-page-container">
      <header className="character-header">
        <button
          type="button"
          className="character-back-button"
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
        >
          <ArrowLeft size={28} strokeWidth={2.4} />
        </button>
        <h1>캐릭터 꾸미기</h1>
      </header>

      <main className="character-content">
        <section className="character-hero">
          <div className="character-speech-bubble">
            <p>{loading ? '불러오는 중...' : characterMessage}</p>

            <button
              type="button"
              className="character-edit-button"
              onClick={handleEditMessage}
              aria-label="멘트 수정"
            >
              <Pencil size={18} strokeWidth={2.2} />
            </button>
          </div>

          <div
            className={`character-display background-${selectedBackground}`}
            style={
              selectedBackgroundImage
                ? {
                    backgroundImage: `url(${selectedBackgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }
                : undefined
            }
          >
            <div className="character-image-wrap">
              <img
                src={selectedExpressionImage}
                alt="선택된 캐릭터"
                className="character-base-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = normalExpression;
                }}
              />

              {selectedOutfitImage && (
                <img
                  src={selectedOutfitImage}
                  alt="선택된 옷"
                  className="character-outfit-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
            </div>
          </div>
        </section>

        <section className="character-progress">
          <div className="character-progress-bar">
            <div className="character-progress-track">
              <div
                className="character-progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="character-progress-count">
              {DISPLAY_QUIZ_COUNT}/{DISPLAY_REQUIRED_QUIZ_COUNT}
            </div>

            <div className="character-help">?</div>
          </div>
        </section>

        <section className="character-reward-card">
          <h2>
            퀴즈 <strong>{DISPLAY_REMAINING_QUIZ}</strong>번만 더 풀면?
          </h2>

          <div className="character-reward-divider" />

          <div className="character-reward-row">
            <div className="character-reward-item">
              <span className="character-reward-icon" />
              <span>새로운 옷 1개 획득</span>
            </div>

            <div className="character-reward-item">
              <span className="character-reward-icon" />
              <span>새로운 표정 1개 획득</span>
            </div>
          </div>
        </section>

        <section className="character-items">
          <div className="character-tab-list">
            {tabItems.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={`character-tab ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="character-item-grid">
            {itemsLoading ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#9CA3AF' }}>
                불러오는 중...
              </div>
            ) : (
              activeItems.map((item) => {
                const selectedValue = getSelectedByTab(activeTab);
                const isSelected =
                  selectedValue === item.id ||
                  selectedValue === item.assetKey ||
                  item.isEquipped;

                const itemImage =
                  getLocalImage(activeTab, item.assetKey ?? item.id) ??
                  item.imageUrl;

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`character-item ${isSelected ? 'selected' : ''} ${!item.acquired ? 'locked' : ''}`}
                    onClick={() => handleSelectItem(item)}
                    disabled={!item.acquired}
                    title={item.requirementText ?? item.label}
                  >
                    {itemImage ? (
                      <img
                        src={itemImage}
                        alt={item.label}
                        className="character-item-image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: '12px', color: '#6B7280' }}>
                        {item.label}
                      </span>
                    )}

                    {!item.acquired && <span className="character-lock">⌕</span>}
                  </button>
                );
              })
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default CharacterPage;