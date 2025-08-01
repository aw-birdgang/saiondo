import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  LoadingState, 
  CategoryCodeErrorState,
  CategoryCodeHeader,
  CategoryCodeSearchBar,
  CategoryCodeList,
  PageBackground,
  PageContainer,
  CategoryCodeDetailModal
} from '../../components/specific';

interface CategoryCode {
  id: string;
  code: string;
  description: string;
  category: string;
  examples?: string[];
}

const CategoryCodeGuideScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [codes, setCodes] = useState<CategoryCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCode, setSelectedCode] = useState<CategoryCode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCategoryCodes();
  }, []);

  const fetchCategoryCodes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
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
      
      setCodes(mockCodes);
    } catch (err) {
      console.error('Failed to fetch category codes:', err);
      setError('카테고리 코드를 불러오는데 실패했습니다.');
      toast.error('카테고리 코드를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCodes = codes.filter(code =>
    code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.category.toLowerCase().includes(searchTerm.toLowerCase())
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
      <CategoryCodeErrorState
        error={error}
        onRetry={fetchCategoryCodes}
      />
    );
  }

  return (
    <PageBackground>
      {/* Header */}
      <CategoryCodeHeader codesCount={codes.length} />

      {/* Search Bar */}
      <CategoryCodeSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Content */}
      <PageContainer>
        <CategoryCodeList 
          codes={filteredCodes} 
          onCodeClick={handleCodeClick}
        />
      </PageContainer>

      {/* Category Code Detail Modal */}
      <CategoryCodeDetailModal
        code={selectedCode}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </PageBackground>
  );
};

export default CategoryCodeGuideScreen; 