import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, Lock } from 'lucide-react';
import { getLearnedKeywordNews } from '../api/news.js';
import './SubPage.css';

const VocabularyPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 단어집 전용 API가 생기면 교체 예정
    // 현재는 배운 키워드 기반 뉴스에서 키워드 목록 추출
    getLearnedKeywordNews()
      .then((data) => {
        // 백엔드 응답에서 words/vocabulary 배열이 있으면 사용
        const vocabList = data.vocabulary ?? data.words ?? data.learnedWords ?? [];
        setWords(vocabList);
      })
      .catch(() => setWords([]))
      .finally(() => setLoading(false));
  }, []);

  const getInitial = (word) => {
    const code = word.charCodeAt(0) - 44032;
    if (code < 0) return word[0].toUpperCase();
    const initialIndex = Math.floor(code / 588);
    const initials = ['ㄱ','ㄴ','ㄷ','ㄹ','ㅁ','ㅂ','ㅅ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
    return initials[initialIndex] ?? word[0];
  };

  const filtered = words.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      (item.word ?? item.term ?? '').includes(term) ||
      (item.meaning ?? item.definition ?? '').includes(term)
    );
  });

  const grouped = filtered.reduce((acc, item) => {
    const w = item.word ?? item.term ?? '';
    const initial = getInitial(w);
    if (!acc[initial]) acc[initial] = [];
    acc[initial].push(item);
    return acc;
  }, {});

  const sortedInitials = Object.keys(grouped).sort();

  return (
    <div className="page-container subpage-container bg-gray-page">
      <header className="sub-header">
        <button className="back-button" onClick={() => navigate(-1)}>
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
            placeholder="단어명 또는 뜻을 입력하세요"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '40px', color: '#9CA3AF' }}>불러오는 중...</div>
        ) : sortedInitials.length > 0 ? (
          sortedInitials.map((initial) => (
            <div key={initial} className="vocab-group">
              <div className="vocab-initial">{initial}</div>
              {grouped[initial].map((item) => {
                const id = item.id ?? item.word ?? item.term;
                return (
                  <div key={id} className="card vocab-card">
                    <div className="vocab-info">
                      <span className="vocab-word">{item.word ?? item.term}</span>
                      <span className="vocab-desc">
                        {item.meaning ?? item.definition}
                        {item.easyMeaning && <><br />{item.easyMeaning}</>}
                      </span>
                    </div>
                    {item.locked && <Lock className="vocab-lock" size={24} strokeWidth={1.5} />}
                  </div>
                );
              })}
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', marginTop: '60px', color: '#9CA3AF' }}>
            {searchTerm ? (
              <p>검색 결과가 없습니다.</p>
            ) : (
              <>
                <p style={{ fontSize: '48px', marginBottom: '16px' }}>📚</p>
                <p style={{ fontSize: '16px', fontWeight: 600, color: '#374151' }}>아직 배운 단어가 없어요</p>
                <p style={{ fontSize: '14px', marginTop: '8px' }}>퀴즈를 풀면 단어가 쌓여요!</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VocabularyPage;
