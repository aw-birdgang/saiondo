import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDataLoader } from '../../hooks/useDataLoader';
import { CategoryCodeCard, CategoryCodeModal, LoadingState } from '../../components/specific';
import { CategoryCodeGrid } from '../../components/specific';
import type { CategoryCode } from '../../../domain/types';

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
    }
  );

  // 검색 필터링
  const filteredCodes = (codes || []).filter(code =>
    code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.examples?.some(example => 
      example.toLowerCase().includes(searchTerm.toLowerCase())
    )
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
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            오류가 발생했습니다
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            카테고리 코드를 불러오는 중 문제가 발생했습니다.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 헤더 */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                카테고리 코드 가이드
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                대화 분석에 사용되는 카테고리 코드들을 확인하세요
              </p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              뒤로 가기
            </button>
          </div>
        </div>
      </div>

      {/* 검색 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="코드, 설명, 카테고리로 검색..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* 결과 */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            {filteredCodes.length}개의 카테고리 코드를 찾았습니다.
          </p>
        </div>

        {/* 카테고리 코드 그리드 */}
        <CategoryCodeGrid 
          codes={filteredCodes} 
          onCodeClick={handleCodeClick}
        />

        {/* 모달 */}
        <CategoryCodeModal
          code={selectedCode}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
};

export default CategoryCodeGuideScreen; 