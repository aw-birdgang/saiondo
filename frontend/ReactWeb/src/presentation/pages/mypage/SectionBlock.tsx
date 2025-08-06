import React from 'react';
import { cn } from '@/utils/cn';

interface SectionBlockProps {
  id?: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
  ariaLabelledby?: string;
  icon?: React.ReactNode;
}

const SectionBlock: React.FC<SectionBlockProps> = ({
  id,
  title,
  children,
  className,
  ariaLabelledby,
  icon,
}) => (
  <section
    id={id}
    aria-labelledby={ariaLabelledby}
    className={cn(
      'mb-8 rounded-xl shadow-sm bg-white dark:bg-gray-800 p-6 transition-all duration-300 hover:shadow-lg',
      'border border-gray-100 dark:border-gray-700',
      className
    )}
  >
    {(title || icon) && (
      <div className='flex items-center gap-2 mb-4'>
        {icon && <span className='text-xl text-blue-500'>{icon}</span>}
        {title && (
          <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
            {title}
          </h2>
        )}
      </div>
    )}
    {children}
  </section>
);

export default SectionBlock;
