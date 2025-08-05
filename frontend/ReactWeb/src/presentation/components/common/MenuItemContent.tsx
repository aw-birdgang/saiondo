import React from 'react';

interface MenuItemContentProps {
  title: string;
  description: string;
  className?: string;
}

const MenuItemContent: React.FC<MenuItemContentProps> = ({
  title,
  description,
  className = '',
}) => {
  return (
    <div className={className}>
      <h3 className='font-semibold text-gray-900 dark:text-white'>{title}</h3>
      <p className='text-sm text-gray-600 dark:text-gray-400'>{description}</p>
    </div>
  );
};

export default MenuItemContent;
