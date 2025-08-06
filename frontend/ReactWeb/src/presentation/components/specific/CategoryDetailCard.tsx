import React from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/shared/constants/app';
import { Button } from '@/presentation/components/common';

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
  className = '',
}) => {
  const navigate = useNavigate();

  const handleStartChat = () => {
    navigate(`${ROUTES.CHAT}?category=${category.id}`);
  };

  return (
    <div className={`card overflow-hidden ${className}`}>
      {/* Header */}
      <div className='bg-gradient-to-r from-primary to-primary-container p-8 text-white'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <div className='text-4xl'>{category.icon}</div>
            <div>
              <h3 className='text-2xl font-bold leading-tight'>
                {category.name}
              </h3>
              <p className='text-white/90 text-base leading-relaxed'>
                {category.description}
              </p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className='text-white hover:text-white/80 transition-all duration-200 hover:scale-110 p-2'
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className='p-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Examples */}
          <div>
            <h4 className='text-xl font-bold text-txt mb-6 flex items-center leading-tight'>
              <span className='w-3 h-3 bg-primary rounded-full mr-4'></span>
              이런 대화를 나누어보세요
            </h4>
            <ul className='space-y-4'>
              {category.examples.map((example, index) => (
                <li key={index} className='flex items-start space-x-4'>
                  <div className='w-3 h-3 bg-primary rounded-full mt-2 flex-shrink-0'></div>
                  <p className='text-txt-secondary text-base leading-relaxed'>
                    {example}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Tips */}
          <div>
            <h4 className='text-xl font-bold text-txt mb-6 flex items-center leading-tight'>
              <span className='w-3 h-3 bg-green-500 rounded-full mr-4'></span>
              대화 팁
            </h4>
            <ul className='space-y-4'>
              {category.tips.map((tip, index) => (
                <li key={index} className='flex items-start space-x-4'>
                  <div className='w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0'></div>
                  <p className='text-txt-secondary text-base leading-relaxed'>
                    {tip}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Button */}
        <div className='mt-8 pt-8 border-t border-border'>
          <Button
            onClick={handleStartChat}
            variant='primary'
            fullWidth
            className='bg-gradient-to-r from-primary to-primary-container hover:from-primary/90 hover:to-primary-container/90 text-lg py-4 font-semibold transition-all duration-200 hover:scale-105'
          >
            {category.name} 카테고리로 대화 시작하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetailCard;
