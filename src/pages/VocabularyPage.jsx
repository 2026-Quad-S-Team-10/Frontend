import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, Lock } from 'lucide-react';
import { getGradesDetail } from '../api/learning.js';
import './SubPage.css';

const CHOSEONG = [
  'ㄱ',
  'ㄲ',
  'ㄴ',
  'ㄷ',
  'ㄸ',
  'ㄹ',
  'ㅁ',
  'ㅂ',
  'ㅃ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅉ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
];

function getInitial(word = '') {
  if (!word) return '#';

  const firstChar = word[0];
  const code = firstChar.charCodeAt(0) - 44032;

  if (code < 0 || code > 11171) {
    return firstChar.toUpperCase();
  }

  const initialIndex = Math.floor(code / 588);
  return CHOSEONG[initialIndex] ?? firstChar;
}

function sortInitials(a, b) {
  const aIndex = CHOSEONG.indexOf(a);
  const bIndex = CHOSEONG.indexOf(b);

  if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
  if (aIndex !== -1) return -1;
  if (bIndex !== -1) return 1;

  return a.localeCompare(b, 'ko');
}

function normalizeWords(data) {
  const grades = Array.isArray(data?.grades) ? data.grades : [];

  return grades.flatMap((gradeItem) => {
    const grade = gradeItem?.grade;
    const isUnlocked = gradeItem?.isUnlocked ?? true;
    const words = Array.isArray(gradeItem?.words) ? gradeItem.words : [];

    return words
      .map((wordItem) => {
        const keyword =
          wordItem?.keyword ??
          wordItem?.word ??
          wordItem?.term ??
          '';

        return {
          id: wordItem?.wordId ?? wordItem?.id ?? `${grade}-${keyword}`,
          word: keyword,
          meaning:
            wordItem?.meaning ??
            wordItem?.definition ??
            wordItem?.description ??
            '',
          grade,
          isUnlocked,
          locked: !isUnlocked,
        };
      })
      .filter((item) => item.word);
  });
}

const VocabularyPage = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGradesDetail()
      .then((data) => {
        const vocabList = normalizeWords(data);
        setWords(vocabList);
      })
      .catch(() => setWords([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = words.filter((item) => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return true;

    return (
      item.word.toLowerCase().includes(term) ||
      item.meaning.toLowerCase().includes(term) ||
      `${item.grade ?? ''}등급`.includes(term)
    );
  });

  const grouped = filtered.reduce((acc, item) => {
    const initial = getInitial(item.word);

    if (!acc[initial]) acc[initial] = [];
    acc[initial].push(item);

    return acc;
  }, {});

  const sortedInitials = Object.keys(grouped).sort(sortInitials);

  return (
    <div className="page-container subpage-container bg-gray-page">
      <header className="sub-header">
        <button
          type="button"
          className="back-button"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={28} strokeWidth={2.5} />
        </button>
        <span>경제 단어집</span>
      </header>

      <div className="subpage-content">
        <div className="search-bar">
          <Search size={22} color="#9CA3AF" />
          <input
            type="text"
            className="search-input"
            placeholder="단어명을 입력하세요"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '40px', color: '#9CA3AF' }}>
            불러오는 중...
          </div>
        ) : sortedInitials.length > 0 ? (
          sortedInitials.map((initial) => (
            <div key={initial} className="vocab-group">
              <div className="vocab-initial">{initial}</div>

              {grouped[initial].map((item) => (
                <div key={item.id} className="card vocab-card">
                  <div className="vocab-info">
                    <span className="vocab-word">{item.word}</span>
                    <span className="vocab-desc">
                      {item.meaning ||
                        `${item.grade ?? '-'}등급 학습 완료 단어`}
                    </span>
                  </div>

                  {item.locked && (
                    <Lock
                      className="vocab-lock"
                      size={24}
                      strokeWidth={1.5}
                    />
                  )}
                </div>
              ))}
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', marginTop: '60px', color: '#9CA3AF' }}>
            {searchTerm ? (
              <p>검색 결과가 없습니다.</p>
            ) : (
              <>
                <p style={{ fontSize: '48px', marginBottom: '16px' }}>📚</p>
                <p style={{ fontSize: '16px', fontWeight: 600, color: '#374151' }}>
                  아직 배운 단어가 없어요
                </p>
                <p style={{ fontSize: '14px', marginTop: '8px' }}>
                  퀴즈를 완료하면 단어가 쌓여요!
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VocabularyPage;