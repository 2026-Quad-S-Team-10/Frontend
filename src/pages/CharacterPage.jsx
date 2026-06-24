import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil } from 'lucide-react';
import './CharacterPage.css';
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

const LEVELS = ['초급', '중급', '고급', '졸업'];
const LEVEL_REQUIREMENTS = [5, 8, 10, 0];

const tabItems = [
  { key: 'expression', label: '표정' },
  { key: 'outfit', label: '옷' },
  { key: 'background', label: '배경' },
];

const expressionItems = [
  { id: 'normal', acquired: true },
  { id: 'embarrassed', acquired: true },
  { id: 'excited', acquired: true },
  { id: 'smirk', acquired: true },
  { id: 'teary', acquired: true },
  { id: 'sleepy', acquired: true },
  { id: 'angry', acquired: true },
];

const outfitItems = [
  { id: 'guitarist', acquired: true },
  { id: 'raincoat', acquired: true },
  { id: 'santa', acquired: true },
  { id: 'faceMode', acquired: true },
  { id: 'king', acquired: true },
  { id: 'baker', acquired: true },
];

const backgroundItems = [
  { id: 'default', acquired: true },
  { id: 'room', acquired: false },
  { id: 'park', acquired: false },
  { id: 'library', acquired: false },
  { id: 'cafe', acquired: false },
  { id: 'night', acquired: false },
];

const CharacterPage = () => {
  const navigate = useNavigate();

  const [characterMessage, setCharacterMessage] = useState('작심삼일을 3일마다 하자...');
  const [activeTab, setActiveTab] = useState('expression');
  const [selectedExpression, setSelectedExpression] = useState('normal');
  const [selectedOutfit, setSelectedOutfit] = useState('guitarist');
  const [selectedBackground, setSelectedBackground] = useState('default');

  const levelIndex = 0;
  const quizCount = 2;

  const currentLevel = LEVELS[levelIndex];
  const requiredQuizCount = LEVEL_REQUIREMENTS[levelIndex];
  const remainingQuiz = Math.max(requiredQuizCount - quizCount, 0);
  const progressPercent = requiredQuizCount > 0 ? (quizCount / requiredQuizCount) * 100 : 100;

  const activeItems = useMemo(() => {
    if (activeTab === 'expression') return expressionItems;
    if (activeTab === 'outfit') return outfitItems;
    return backgroundItems;
  }, [activeTab]);

  const handleEditMessage = () => {
    const nextMessage = window.prompt('말풍선 문구를 입력하세요.', characterMessage);

    if (nextMessage !== null) {
      setCharacterMessage(nextMessage.trim() || '작심삼일을 3일마다 하자...');
    }
  };

  const handleSelectItem = (item) => {
    if (!item.acquired) return;

    if (activeTab === 'expression') {
      setSelectedExpression(item.id);
    }

    if (activeTab === 'outfit') {
      setSelectedOutfit(item.id);
    }

    if (activeTab === 'background') {
      setSelectedBackground(item.id);
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
            <p>{characterMessage}</p>
            <button
              type="button"
              className="character-edit-button"
              onClick={handleEditMessage}
              aria-label="멘트 수정"
            >
              <Pencil size={18} strokeWidth={2.2} />
            </button>
          </div>

          <div className={`character-display background-${selectedBackground}`}>
            <div className="character-image-wrap">
              {expressionImageMap[selectedExpression] && (
                <img
                  src={expressionImageMap[selectedExpression]}
                  alt="선택된 캐릭터"
                  className="character-base-image"
                />
              )}

              {outfitImageMap[selectedOutfit] && (
                <img
                  src={outfitImageMap[selectedOutfit]}
                  alt="선택된 옷"
                  className="character-outfit-image"
                />
              )}
            </div>
          </div>
        </section>

        <section className="character-progress">
          <div className="character-progress-bar">
            <div className="character-level-pill">
              <span>{currentLevel}</span>
              <span className="character-level-dot" />
            </div>

            <div className="character-progress-track">
              <div
                className="character-progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="character-progress-count">
              {quizCount}/{requiredQuizCount}
            </div>

            <div className="character-help">?</div>
          </div>
        </section>

        <section className="character-reward-card">
          <h2>
            퀴즈 <strong>{remainingQuiz}</strong>번만 더 풀면?
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
            {activeItems.map((item) => {
              const isSelected =
                (activeTab === 'expression' && selectedExpression === item.id) ||
                (activeTab === 'outfit' && selectedOutfit === item.id) ||
                (activeTab === 'background' && selectedBackground === item.id);

              return (
                <button
                  key={item.id}
                  type="button"
                  className={`character-item ${isSelected ? 'selected' : ''} ${!item.acquired ? 'locked' : ''}`}
                  onClick={() => handleSelectItem(item)}
                  disabled={!item.acquired}
                >
                  {activeTab === 'expression' && expressionImageMap[item.id] && (
                    <img
                      src={expressionImageMap[item.id]}
                      alt="표정 아이템"
                      className="character-item-image"
                    />
                  )}

                  {activeTab === 'outfit' && outfitImageMap[item.id] && (
                    <img
                      src={outfitImageMap[item.id]}
                      alt="옷 아이템"
                      className="character-item-image"
                    />
                  )}

                  {!item.acquired && <span className="character-lock">⌕</span>}
                </button>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};

export default CharacterPage;