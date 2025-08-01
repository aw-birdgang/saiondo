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
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-200';
      case 'topic':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200';
      case 'emotion':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="카테고리 코드 상세 정보"
      size="lg"
    >
      <div className="space-y-6">
        {/* Code Header */}
        <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-3xl">{getCategoryIcon(code.category)}</div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {code.code}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {code.description}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(code.category)}`}>
            {code.category}
          </span>
        </div>

        {/* Code Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              코드 정보
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">코드 ID:</span>
                <span className="font-mono text-gray-900 dark:text-white">{code.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">카테고리:</span>
                <span className="text-gray-900 dark:text-white capitalize">{code.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">설명:</span>
                <span className="text-gray-900 dark:text-white">{code.description}</span>
              </div>
            </div>
          </div>

          {/* Examples */}
          {code.examples && code.examples.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                사용 예시
              </h4>
              <div className="space-y-2">
                {code.examples.map((example, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 p-2 bg-blue-50 dark:bg-blue-900/10 rounded-lg"
                  >
                    <span className="text-blue-500">•</span>
                    <span className="text-gray-700 dark:text-gray-300">{example}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Usage Instructions */}
        <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
            사용 방법
          </h4>
          <p className="text-yellow-700 dark:text-yellow-300 text-sm">
            이 코드를 AI 상담사와의 대화에서 언급하면, 해당 카테고리에 맞는 전문적인 조언을 받을 수 있습니다.
            예를 들어 "{code.examples?.[0] || '관련 주제'}"와 같은 내용으로 대화를 시작해보세요.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            {t('close') || '닫기'}
          </button>
          <button
            onClick={() => {
              // TODO: 채팅으로 이동하는 로직
              onClose();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {t('start_chat') || '대화 시작하기'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CategoryCodeDetailModal; 