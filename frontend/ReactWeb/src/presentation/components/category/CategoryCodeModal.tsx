import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Button } from '../common';
import type { CategoryCode } from '../../../domain/types/category';
import { cn } from '../../../utils/cn';

interface CategoryCodeModalProps {
  code: CategoryCode | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CategoryCodeModal: React.FC<CategoryCodeModalProps> = ({
  code,
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();

  if (!code) return null;

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'relationship':
        return 'bg-pink-100 text-pink-800';
      case 'topic':
        return 'bg-blue-100 text-blue-800';
      case 'emotion':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'relationship':
        return '💕';
      case 'topic':
        return '💬';
      case 'emotion':
        return '😊';
      default:
        return '📋';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className='p-6'>
        {/* 헤더 */}
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center space-x-3'>
            <span className='text-2xl'>{getCategoryIcon(code.category)}</span>
            <div>
              <h2 className='text-xl font-bold text-txt'>{code.description}</h2>
              <div className='flex items-center space-x-2 mt-1'>
                <span
                  className={cn(
                    'px-2 py-1 rounded text-sm font-medium',
                    getCategoryColor(code.category)
                  )}
                >
                  {code.category}
                </span>
                <span className='text-sm font-mono text-txt-secondary'>
                  {code.code}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 예시 */}
        {code.examples && code.examples.length > 0 && (
          <div className='mb-6'>
            <h3 className='text-lg font-semibold text-txt mb-3'>예시</h3>
            <div className='grid grid-cols-2 gap-2'>
              {code.examples.map((example, index) => (
                <div
                  key={index}
                  className='p-3 bg-secondary/30 rounded-lg border-l-4 border-primary'
                >
                  <p className='text-sm text-txt'>{example}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 설명 */}
        <div className='mb-6'>
          <h3 className='text-lg font-semibold text-txt mb-3'>사용법</h3>
          <div className='p-4 bg-secondary/20 rounded-lg'>
            <p className='text-sm text-txt-secondary'>
              이 카테고리 코드는 대화 분석에서 "{code.description}" 관련 내용을
              분류하는 데 사용됩니다. AI가 대화를 분석할 때 이 코드를 참고하여
              더 정확한 분석을 제공합니다.
            </p>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className='flex justify-end space-x-3'>
          <Button variant='outline' onClick={onClose}>
            닫기
          </Button>
        </div>
      </div>
    </Modal>
  );
};
