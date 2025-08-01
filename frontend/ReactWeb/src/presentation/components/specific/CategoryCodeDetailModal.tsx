import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../common';

interface CategoryCode {
  id: string;
  code: string;
  description: string;
  category: string;
  examples?: string[];
}

interface CategoryCodeDetailModalProps {
  code: CategoryCode | null;
  isOpen: boolean;
  onClose: () => void;
}

const CategoryCodeDetailModal: React.FC<CategoryCodeDetailModalProps> = ({
  code,
  isOpen,
  onClose
}) => {
  const { t } = useTranslation();

  if (!code) return null;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'relationship':
        return '💕';
      case 'topic':
        return '💬';
      case 'emotion':
        return '❤️';
      default:
        return '📋';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'relationship':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-200 border border-pink-200 dark:border-pink-800';
      case 'topic':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200 border border-blue-200 dark:border-blue-800';
      case 'emotion':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200 border border-red-200 dark:border-red-800';
      default:
        return 'bg-secondary text-text-secondary border border-border';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="카테고리 코드 상세 정보"
      size="lg"
    >
      <div className="space-y-8">
        {/* Code Header */}
        <div className="flex items-center space-x-4 p-6 bg-secondary rounded-xl">
          <div className="text-4xl">{getCategoryIcon(code.category)}</div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-text leading-tight">
              {code.code}
            </h3>
            <p className="text-text-secondary leading-relaxed">
              {code.description}
            </p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getCategoryColor(code.category)}`}>
            {code.category}
          </span>
        </div>

        {/* Code Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-xl font-bold text-text mb-4 leading-tight">
              코드 정보
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                <span className="text-text-secondary font-medium">코드 ID:</span>
                <span className="font-mono text-text font-semibold">{code.id}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                <span className="text-text-secondary font-medium">카테고리:</span>
                <span className="text-text font-semibold capitalize">{code.category}</span>
              </div>
              <div className="flex justify-between items-start p-3 bg-secondary rounded-lg">
                <span className="text-text-secondary font-medium">설명:</span>
                <span className="text-text font-semibold text-right">{code.description}</span>
              </div>
            </div>
          </div>

          {/* Examples */}
          {code.examples && code.examples.length > 0 && (
            <div>
              <h4 className="text-xl font-bold text-text mb-4 leading-tight">
                사용 예시
              </h4>
              <div className="space-y-3">
                {code.examples.map((example, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-4 bg-primary/5 rounded-lg border border-primary/20"
                  >
                    <span className="text-primary text-lg font-bold">•</span>
                    <span className="text-text leading-relaxed">{example}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Usage Instructions */}
        <div className="bg-yellow-50 dark:bg-yellow-900/10 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
          <h4 className="text-xl font-bold text-yellow-800 dark:text-yellow-200 mb-3 leading-tight">
            사용 방법
          </h4>
          <p className="text-yellow-700 dark:text-yellow-300 leading-relaxed">
            이 코드를 AI 상담사와의 대화에서 언급하면, 해당 카테고리에 맞는 전문적인 조언을 받을 수 있습니다.
            예를 들어 "{code.examples?.[0] || '관련 주제'}"와 같은 내용으로 대화를 시작해보세요.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-border">
          <button
            onClick={onClose}
            className="btn btn-secondary px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
          >
            {t('close') || '닫기'}
          </button>
          <button
            onClick={() => {
              // TODO: 채팅으로 이동하는 로직
              onClose();
            }}
            className="btn btn-primary px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
          >
            {t('start_chat') || '대화 시작하기'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CategoryCodeDetailModal; 