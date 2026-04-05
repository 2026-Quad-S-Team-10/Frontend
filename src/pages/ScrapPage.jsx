import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Bookmark } from 'lucide-react';
import './SubPage.css';

const ScrapPage = () => {
  const navigate = useNavigate();
  // 현재 선택된 카테고리 상태 (기본값: '국내')
  const [selectedCategory, setSelectedCategory] = useState('국내');

  // 백엔드에서 받아올 가짜 데이터 (category 속성 추가됨)
  const mockNews = [
    { id: 1, category: '국내', tags: ['#금리인하', '#한국은행'], title: '한국은행, 기준금리 0.25%p 전격 인하... 시장 반응은?', source: '한국경제', date: '26.02.14' },
    { id: 2, category: '국내', tags: ['#물가상승', '#소비자물가'], title: '사과 한 개 5천원 시대... 체감 물가 상승률 10년만에 최고치', source: '매일경제', date: '26.02.13' },
    { id: 3, category: '국제', tags: ['#금리동결', '#연준'], title: '미 연준 또 기준금리 동결... 파월 "인플레이션 확실한 둔화 필요"', source: '블룸버그', date: '26.02.14' },
    { id: 4, category: '주식', tags: ['#코스피', '#외국인순매수'], title: '코스피, 외국인 \'사자\'에 5000선 돌파... 반도체주 강세', source: '서울경제', date: '26.02.14' },
    { id: 5, category: '부동산', tags: ['#전세사기', '#특별법'], title: '전세사기 특별법 개정안 통과... 피해자 구제 범위 넓어진다', source: '조선비즈', date: '26.02.12' },
  ];

  // 카테고리 목록
  const categories = ['국내', '국제', '주식', '부동산'];

  // 선택된 카테고리에 맞게 뉴스 필터링
  const filteredNews = mockNews.filter(news => news.category === selectedCategory);

  return (
    <div className="page-container subpage-container">
      <header className="sub-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ChevronLeft size={28} strokeWidth={2.5} />
        </button>
        <span>스크랩한 뉴스</span>
      </header>

      <div className="subpage-content">
        <div className="category-filters">
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-btn ${selectedCategory === category ? 'active' : 'inactive'}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="news-list">
          {filteredNews.length > 0 ? (
            filteredNews.map((news) => (
              <div key={news.id} className="news-card">
                <div className="news-image"></div>
                <div className="news-info">
                  <div className="news-tags">
                    {news.tags.map(tag => <span key={tag}>{tag}</span>)}
                  </div>
                  <h3 className="news-title">{news.title}</h3>
                  <div className="news-meta">
                    {news.source} · {news.date}
                  </div>
                </div>
                <div className="bookmark-icon-container">
                  <Bookmark size={16} fill="#EAB308" color="#EAB308" />
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', marginTop: '40px', color: '#9CA3AF' }}>
              해당 카테고리에 스크랩한 뉴스가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScrapPage;
