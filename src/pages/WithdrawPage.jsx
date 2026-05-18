import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import './SubPage.css';

const WithdrawPage = () => {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  const handleWithdraw = () => {
    if (!agreed) {
      alert("안내 사항 확인 및 동의가 필요합니다.");
      return;
    }
    
    if (window.confirm("정말 계정을 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      // 계정 탈퇴 API 호출 등 처리
      alert("계정이 정상적으로 탈퇴되었습니다.");
      navigate('/login');
    }
  };

  return (
    <div className="page-container subpage-container">
      <header className="sub-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ChevronLeft size={28} strokeWidth={2.5} />
        </button>
        <span>계정 탈퇴</span>
      </header>

      <div className="subpage-content" style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ backgroundColor: '#FEF2F2', padding: '20px', borderRadius: '12px', border: '1px solid #FECACA' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#DC2626', marginBottom: '12px' }}>
            탈퇴 전 꼭 확인해주세요!
          </h2>
          <ul style={{ paddingLeft: '20px', color: '#4B5563', fontSize: '15px', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '8px', margin: 0 }}>
            <li>계정 탈퇴 시 즉시 로그아웃되며, 복구가 불가능합니다.</li>
            <li>지금까지 학습한 <strong>연속 학습일</strong> 및 <strong>학습 통계</strong>가 모두 삭제됩니다.</li>
            <li>저장해 둔 <strong>스크랩한 뉴스</strong>, <strong>오답노트</strong>, <strong>경제 단어집</strong> 내용이 영구적으로 삭제됩니다.</li>
            <li>동일한 이메일로 다시 가입하더라도 이전 데이터를 복구할 수 없습니다.</li>
          </ul>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              style={{ marginTop: '4px', width: '20px', height: '20px', accentColor: '#EAB308' }}
            />
            <span style={{ fontSize: '15px', color: '#374151', lineHeight: '1.5' }}>
              안내 사항을 모두 확인하였으며, 위 내용에 동의합니다.
            </span>
          </label>

          <button 
            type="button" 
            onClick={handleWithdraw}
            disabled={!agreed}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              border: 'none',
              fontSize: '16px',
              fontWeight: '700',
              color: '#FFFFFF',
              backgroundColor: agreed ? '#DC2626' : '#FCA5A5',
              cursor: agreed ? 'pointer' : 'not-allowed',
              transition: 'background-color 0.2s'
            }}
          >
            계정 탈퇴하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawPage;
