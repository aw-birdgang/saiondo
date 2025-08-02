import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router-dom';
import {useDataLoader} from '../../hooks/useDataLoader';
import {CategoryCodeCard, CategoryCodeModal, LoadingState} from '../../components/specific';
import {PageContainer, PageHeader} from '../../components/layout';
import {CategoryCodeGrid, CategoryCodeGuideContainer, SearchBar} from '../../components/common';
import type {CategoryCode} from '../../../domain/types';

const CategoryCodeGuideScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCode, setSelectedCode] = useState<CategoryCode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use custom hook for data loading
  const { data: codes = [], loading: isLoading, error } = useDataLoader(
    async () => {
      // TODO: 실제 API 호출로 대체
      // const response = await getCategoryCodes();
      
      // 시뮬레이션을 위한 지연
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock 데이터
      const mockCodes: CategoryCode[] = [
        {
          id: '1',
          code: 'REL001',
          description: '연인 관계',
          category: 'relationship',
          examples: ['남자친구', '여자친구', '연인', '애인'],
        },
        {
          id: '2',
          code: 'REL002',
          description: '부부 관계',
          category: 'relationship',
          examples: ['남편', '아내', '배우자', '부부'],
        },
        {
          id: '3',
          code: 'REL003',
          description: '가족 관계',
          category: 'relationship',
          examples: ['부모', '자녀', '형제', '자매'],
        },
        {
          id: '4',
          code: 'REL004',
          description: '친구 관계',
          category: 'relationship',
          examples: ['친구', '동료', '지인', '알고 지내는 사람'],
        },
        {
          id: '5',
          code: 'TOP001',
          description: '일상 대화',
          category: 'topic',
          examples: ['날씨', '음식', '취미', '일상'],
        },
        {
          id: '6',
          code: 'TOP002',
          description: '감정 공유',
          category: 'topic',
          examples: ['기쁨', '슬픔', '화남', '불안'],
        },
        {
          id: '7',
          code: 'TOP003',
          description: '문제 해결',
          category: 'topic',
          examples: ['갈등', '의사결정', '계획', '목표'],
        },
        {
          id: '8',
          code: 'TOP004',
          description: '미래 계획',
          category: 'topic',
          examples: ['결혼', '취업', '이사', '여행'],
        },
        {
          id: '9',
          code: 'EMO001',
          description: '긍정적 감정',
          category: 'emotion',
          examples: ['행복', '설렘', '감사', '희망'],
        },
        {
          id: '10',
          code: 'EMO002',
          description: '부정적 감정',
          category: 'emotion',
          examples: ['우울', '분노', '불안', '실망'],
        },
      ];
      
      return mockCodes;
    },
    [],
    {
      autoLoad: true,
      errorMessage: '카테고리 코드를 불러오는데 실패했습니다.'
    }
  );

  const filteredCodes = codes.filter(code =>
    code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.examples.some(example => example.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCodeClick = (code: CategoryCode) => {
    setSelectedCode(code);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCode(null);
  };

  if (isLoading) {
    return (
      <LoadingState message={t('loading_category_codes') || '카테고리 코드를 불러오는 중...'} />
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {t('error_loading_codes') || '코드 로딩 오류'}
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {t('retry') || '다시 시도'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <CategoryCodeGuideContainer>
      {/* Header */}
      <PageHeader
        title={t('category_code_guide') || '카테고리 코드 가이드'}
        subtitle={t('category_code_description') || '대화 분석에 사용되는 카테고리 코드들을 확인하세요'}
        showBackButton
      />

      {/* Content */}
      <PageContainer>
        {/* Search */}
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder={t('search_codes') || '코드 검색...'}
        />

        {/* Codes Grid */}
        <CategoryCodeGrid>
          {filteredCodes.map((code) => (
            <CategoryCodeCard
              key={code.id}
              code={code}
              onClick={() => handleCodeClick(code)}
            />
          ))}
        </CategoryCodeGrid>

        {/* Modal */}
        {selectedCode && (
          <CategoryCodeModal
            code={selectedCode}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        )}
      </PageContainer>
    </CategoryCodeGuideContainer>
  );
};

export default CategoryCodeGuideScreen; 