import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../../shared/constants/app';
import { Button } from '../common';

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  examples: string[];
  tips: string[];
}

interface CategoryDetailCardProps {
  category: Category;
  onClose?: () => void;
  className?: string;
}

const CategoryDetailCard: React.FC<CategoryDetailCardProps> = ({
  category,
  onClose,
  className = ''
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleStartChat = () => {
    navigate(`${ROUTES.CHAT}?category=${category.id}`);
  };

  return (
    <div className={`bg-white dark:bg-dark-secondary-container rounded-lg shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{category.icon}</div>
            <div>
              <h3 className="text-xl font-semibold">{category.name}</h3>
              <p className="text-blue-100 text-sm">{category.description}</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-white hover:text-blue-100 transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Examples */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              이런 대화를 나누어보세요
            </h4>
            <ul className="space-y-3">
              {category.examples.map((example, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {example}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Tips */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              대화 팁
            </h4>
            <ul className="space-y-3">
              {category.tips.map((tip, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {tip}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            onClick={handleStartChat}
            variant="primary"
            fullWidth
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            {category.name} 카테고리로 대화 시작하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetailCard; 