import React, { useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  showLabel = false,
  size = 'md',
}) => {
  const { isDarkMode, toggleTheme, setTheme, theme, isSystemTheme } =
    useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  const getThemeIcon = () => {
    if (isSystemTheme()) {
      return (
        <svg
          className={iconSizeClasses[size]}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
          />
        </svg>
      );
    }

    if (isDarkMode) {
      return (
        <svg
          className={iconSizeClasses[size]}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'
          />
        </svg>
      );
    }

    return (
      <svg
        className={iconSizeClasses[size]}
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'
        />
      </svg>
    );
  };

  return (
    <div className={`relative ${className}`}>
      {showLabel ? (
        // Dropdown version with labels
        <div className='relative'>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`${sizeClasses[size]} flex items-center justify-center rounded-lg border transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-txt)',
            }}
            aria-label='Toggle theme'
          >
            {getThemeIcon()}
          </button>

          {isOpen && (
            <>
              {/* Backdrop */}
              <div
                className='fixed inset-0 z-10'
                onClick={() => setIsOpen(false)}
              />

              {/* Dropdown */}
              <div
                className='absolute right-0 top-full mt-2 z-20 min-w-[200px] rounded-lg border shadow-lg'
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                  boxShadow: '0 10px 15px -3px var(--color-shadow)',
                }}
              >
                <div className='p-2'>
                  <button
                    onClick={() => handleThemeChange('light')}
                    className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                      theme === 'light'
                        ? 'bg-primary text-on-primary'
                        : 'hover:bg-focus'
                    }`}
                    style={{
                      backgroundColor:
                        theme === 'light'
                          ? 'var(--color-primary)'
                          : 'transparent',
                      color:
                        theme === 'light'
                          ? 'var(--color-on-primary)'
                          : 'var(--color-txt)',
                    }}
                  >
                    <svg
                      className='w-4 h-4 mr-3'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'
                      />
                    </svg>
                    Light
                  </button>

                  <button
                    onClick={() => handleThemeChange('dark')}
                    className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                      theme === 'dark'
                        ? 'bg-primary text-on-primary'
                        : 'hover:bg-focus'
                    }`}
                    style={{
                      backgroundColor:
                        theme === 'dark'
                          ? 'var(--color-primary)'
                          : 'transparent',
                      color:
                        theme === 'dark'
                          ? 'var(--color-on-primary)'
                          : 'var(--color-txt)',
                    }}
                  >
                    <svg
                      className='w-4 h-4 mr-3'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'
                      />
                    </svg>
                    Dark
                  </button>

                  <button
                    onClick={() => handleThemeChange('system')}
                    className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                      theme === 'system'
                        ? 'bg-primary text-on-primary'
                        : 'hover:bg-focus'
                    }`}
                    style={{
                      backgroundColor:
                        theme === 'system'
                          ? 'var(--color-primary)'
                          : 'transparent',
                      color:
                        theme === 'system'
                          ? 'var(--color-on-primary)'
                          : 'var(--color-txt)',
                    }}
                  >
                    <svg
                      className='w-4 h-4 mr-3'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                      />
                    </svg>
                    System
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        // Simple toggle button
        <button
          onClick={toggleTheme}
          className={`${sizeClasses[size]} flex items-center justify-center rounded-lg border transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 hover:scale-105`}
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-txt)',
          }}
          aria-label='Toggle theme'
          title={`Current theme: ${theme === 'system' ? 'System' : theme === 'dark' ? 'Dark' : 'Light'}`}
        >
          {getThemeIcon()}
        </button>
      )}
    </div>
  );
};
