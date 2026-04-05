import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, Lock } from 'lucide-react';
import './SubPage.css';

// 단어장 가짜 데이터
const mockWords = [
  { id: 1, word: '가산금리', meaning: '기준금리에 덧붙이는 위험가중 금리', easyMeaning: '대출받는 사람의 신용도에 따라 추가되는 이자', locked: false, initial: 'ㄱ' },
  { id: 2, word: '경기동향지수', meaning: '경기의 전반적 흐름을 파악하기 위한 지표', easyMeaning: '현재 경제 상황이 좋은지 나쁜지를 숫자로 나타낸 것', locked: true, initial: 'ㄱ' },
  { id: 3, word: '공매도', meaning: '주식이나 채권을 가지고 있지 않은 상태에서 매도 주문을 내는 행위', easyMeaning: '주가가 떨어질 것을 예상하고 주식을 빌려서 파는 투자 기법', locked: false, initial: 'ㄱ' },
  { id: 4, word: '낙수효과', meaning: '대규모 투자가 하청부문 등으로 파급되는 경제 효과', easyMeaning: '부자가 돈을 많이 벌면 가난한 사람에게도 혜택이 돌아간다는 현상', locked: false, initial: 'ㄴ' },
  { id: 5, word: '나스닥', meaning: '미국의 장외 주식 거래 시장', easyMeaning: '애플, 구글 등 주요 IT 기업들이 상장되어 있는 거래소', locked: true, initial: 'ㄴ' },
  { id: 6, word: '다우지수', meaning: '미국 다우존스사가 발표하는 주가지수', easyMeaning: '미국을 대표하는 우량 기업 30개의 주식 가격 평균', locked: false, initial: 'ㄷ' },
  { id: 7, word: '디플레이션', meaning: '경제 전반적으로 물가가 지속적으로 하락하는 현상', easyMeaning: '물가가 계속 떨어져서 경제가 활력을 잃는 현상', locked: true, initial: 'ㄷ' },
];

const VocabularyPage = () => {
  const navigate = useNavigate();
  // 검색어 상태 관리
  const [searchTerm, setSearchTerm] = useState('');

  // 1. 단어명, 의미, 쉬운 의미 기준으로 검색 필터링
  const filteredWords = mockWords.filter(item =>
    item.word.includes(searchTerm) ||
    item.meaning.includes(searchTerm) ||
    item.easyMeaning.includes(searchTerm)
  );

  // 2. 필터링된 단어들을 ㄱ, ㄴ, ㄷ 자음별로 그룹화
  const groupedWords = filteredWords.reduce((acc, current) => {
    if (!acc[current.initial]) {
      acc[current.initial] = [];
    }
    acc[current.initial].push(current);
    return acc;
  }, {});

  // 화면에 그리기 위해 객체를 배열로 변환하고 정렬 (가나다 순)
  const sortedIntials = Object.keys(groupedWords).sort();

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

        {/* 그룹화된 단어들 렌더링 */}
        {sortedIntials.length > 0 ? (
          sortedIntials.map(initial => (
            <div key={initial} className="vocab-group">
              <div className="vocab-initial">{initial}</div>

              {groupedWords[initial].map(item => (
                <div key={item.id} className="card vocab-card">
                  <div className="vocab-info">
                    <span className="vocab-word">{item.word}</span>
                    <span className="vocab-desc">{item.meaning}<br />{item.easyMeaning}</span>
                  </div>
                  {/* locked가 true면 자물쇠 아이콘 표시 */}
                  {item.locked && <Lock className="vocab-lock" size={24} strokeWidth={1.5} />}
                </div>
              ))}
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', marginTop: '40px', color: '#9CA3AF' }}>
            검색 결과가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default VocabularyPage;
