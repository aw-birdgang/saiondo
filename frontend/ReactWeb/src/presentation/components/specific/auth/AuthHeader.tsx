import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../../../utils/cn';
import type { AuthHeaderProps } from '../../../pages/auth/types/authTypes';

const AuthHeader: React.FC<AuthHeaderProps> = ({
  title,
  subtitle,
  linkText,
  linkTo,
  className,
}) => {
  return (
    <div className={cn('text-center', className)}>
      <h2 className='text-3xl font-bold text-txt mb-2'>{title}</h2>
      {subtitle && <p className='text-txt-secondary mb-4'>{subtitle}</p>}
      {linkText && linkTo && (
        <p className='text-sm text-txt-secondary'>
          <Link
            to={linkTo}
            className='text-primary hover:text-primary-dark underline'
          >
            {linkText}
          </Link>
        </p>
      )}
    </div>
  );
};

export default AuthHeader;
