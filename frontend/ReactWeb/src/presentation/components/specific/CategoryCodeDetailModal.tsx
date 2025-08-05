import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../common';
import { ROUTES } from '../../../shared/constants/app';
import { toast } from 'react-hot-toast';

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
  onClose,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!code) return null;

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      relationship: '💕',
      communication: '💬',
      emotion: '😊',
      conflict: '⚡',
      intimacy: '💝',
      family: '👨‍👩‍👧‍👦',
      future: '🔮',
      personal: '👤',
      social: '🌍',
      health: '💪',
      finance: '💰',
      career: '💼',
      hobby: '🎨',
      travel: '✈️',
      food: '🍽️',
      default: '📋',
    };
    return icons[category.toLowerCase()] || icons.default;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      relationship:
        'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      communication:
        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      emotion:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      conflict: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      intimacy:
        'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      family:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      future:
        'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      personal: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      social: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
      health:
        'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
      finance:
        'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
      career:
        'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200',
      hobby:
        'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      travel: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
      food: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
      default: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    };
    return colors[category.toLowerCase()] || colors.default;
  };

  const handleStartChat = () => {
    try {
      // 채팅 페이지로 이동하면서 카테고리 코드 정보를 전달
      const chatParams = new URLSearchParams({
        categoryCode: code.code,
        category: code.category,
        description: code.description,
      });

      navigate(`${ROUTES.CHAT}?${chatParams.toString()}`);

      // 성공 메시지 표시
      toast.success(
        t('chat.started_with_category') ||
          `${code.category} 카테고리로 대화를 시작합니다.`
      );

      // 모달 닫기
      onClose();
    } catch (error) {
      console.error('Failed to navigate to chat:', error);
      toast.error(
        t('chat.navigation_error') ||
          '채팅 페이지로 이동하는 중 오류가 발생했습니다.'
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title='카테고리 코드 상세 정보'
      size='lg'
    >
      <div className='space-y-8'>
        {/* Code Header */}
        <div className='flex items-center space-x-4 p-6 bg-secondary rounded-xl'>
          <div className='text-4xl'>{getCategoryIcon(code.category)}</div>
          <div className='flex-1'>
            <h3 className='text-2xl font-bold text-txt leading-tight'>
              {code.code}
            </h3>
            <p className='text-txt-secondary leading-relaxed'>
              {code.description}
            </p>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${getCategoryColor(code.category)}`}
          >
            {code.category}
          </span>
        </div>

        {/* Code Information */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div>
            <h4 className='text-xl font-bold text-txt mb-4 leading-tight'>
              코드 정보
            </h4>
            <div className='space-y-4'>
              <div className='flex justify-between items-center p-3 bg-secondary rounded-lg'>
                <span className='text-txt-secondary font-medium'>코드 ID:</span>
                <span className='font-mono text-txt font-semibold'>
                  {code.id}
                </span>
              </div>
              <div className='flex justify-between items-center p-3 bg-secondary rounded-lg'>
                <span className='text-txt-secondary font-medium'>
                  카테고리:
                </span>
                <span className='text-txt font-semibold capitalize'>
                  {code.category}
                </span>
              </div>
              <div className='flex justify-between items-start p-3 bg-secondary rounded-lg'>
                <span className='text-txt-secondary font-medium'>설명:</span>
                <span className='text-txt font-semibold text-right'>
                  {code.description}
                </span>
              </div>
            </div>
          </div>

          {/* Examples */}
          {code.examples && code.examples.length > 0 && (
            <div>
              <h4 className='text-xl font-bold text-txt mb-4 leading-tight'>
                사용 예시
              </h4>
              <div className='space-y-3'>
                {code.examples.map((example, index) => (
                  <div
                    key={index}
                    className='flex items-center space-x-3 p-4 bg-primary/5 rounded-lg border border-primary/20'
                  >
                    <span className='text-primary text-lg font-bold'>•</span>
                    <span className='text-txt leading-relaxed'>{example}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Usage Instructions */}
        <div className='bg-yellow-50 dark:bg-yellow-900/10 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl p-6'>
          <h4 className='text-xl font-bold text-yellow-800 dark:text-yellow-200 mb-3 leading-tight'>
            사용 방법
          </h4>
          <p className='text-yellow-700 dark:text-yellow-300 leading-relaxed'>
            이 코드를 AI 상담사와의 대화에서 언급하면, 해당 카테고리에 맞는
            전문적인 조언을 받을 수 있습니다. 예를 들어 "
            {code.examples?.[0] || '관련 주제'}"와 같은 내용으로 대화를
            시작해보세요.
          </p>
        </div>

        {/* Action Buttons */}
        <div className='flex justify-end space-x-4 pt-6 border-t border-border'>
          <button
            onClick={onClose}
            className='btn btn-secondary px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105'
          >
            {t('close') || '닫기'}
          </button>
          <button
            onClick={handleStartChat}
            className='btn btn-primary px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105'
          >
            {t('start_chat') || '대화 시작하기'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CategoryCodeDetailModal;
