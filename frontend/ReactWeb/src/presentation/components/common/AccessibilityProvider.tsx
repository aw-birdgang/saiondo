import React, { createContext, useContext, useEffect, useState } from 'react';

interface AccessibilityContextType {
  isReducedMotion: boolean;
  isHighContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  toggleReducedMotion: () => void;
  toggleHighContrast: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');

  // Check for user's motion preferences
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Apply accessibility settings to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply reduced motion
    if (isReducedMotion) {
      root.style.setProperty('--animation-duration', '0s');
      root.style.setProperty('--transition-duration', '0s');
    } else {
      root.style.removeProperty('--animation-duration');
      root.style.removeProperty('--transition-duration');
    }

    // Apply high contrast
    if (isHighContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Apply font size
    root.style.setProperty('--font-size-multiplier', 
      fontSize === 'small' ? '0.875' : 
      fontSize === 'large' ? '1.125' : '1'
    );
  }, [isReducedMotion, isHighContrast, fontSize]);

  const toggleReducedMotion = () => setIsReducedMotion(!isReducedMotion);
  const toggleHighContrast = () => setIsHighContrast(!isHighContrast);

  const value: AccessibilityContextType = {
    isReducedMotion,
    isHighContrast,
    fontSize,
    setFontSize,
    toggleReducedMotion,
    toggleHighContrast,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

// Accessibility controls component
export const AccessibilityControls: React.FC = () => {
  const { 
    isReducedMotion, 
    isHighContrast, 
    fontSize, 
    setFontSize, 
    toggleReducedMotion, 
    toggleHighContrast 
  } = useAccessibility();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-surface border border-border rounded-lg shadow-lg p-4 space-y-3 min-w-64">
        <h3 className="text-sm font-semibold text-txt">접근성 설정</h3>
        
        {/* Font Size */}
        <div className="space-y-2">
          <label className="text-xs text-txt-secondary">글자 크기</label>
          <div className="flex space-x-2">
            {(['small', 'medium', 'large'] as const).map((size) => (
              <button
                key={size}
                onClick={() => setFontSize(size)}
                className={`
                  px-3 py-1 text-xs rounded border transition-colors
                  ${fontSize === size 
                    ? 'bg-primary text-on-primary border-primary' 
                    : 'bg-surface text-txt border-border hover:bg-focus'
                  }
                `}
              >
                {size === 'small' && '작게'}
                {size === 'medium' && '보통'}
                {size === 'large' && '크게'}
              </button>
            ))}
          </div>
        </div>

        {/* High Contrast */}
        <div className="flex items-center justify-between">
          <label className="text-xs text-txt-secondary">고대비 모드</label>
          <button
            onClick={toggleHighContrast}
            className={`
              w-10 h-6 rounded-full transition-colors relative
              ${isHighContrast ? 'bg-primary' : 'bg-border'}
            `}
            aria-label={isHighContrast ? '고대비 모드 비활성화' : '고대비 모드 활성화'}
          >
            <div
              className={`
                w-4 h-4 bg-white rounded-full transition-transform absolute top-1
                ${isHighContrast ? 'translate-x-5' : 'translate-x-1'}
              `}
            />
          </button>
        </div>

        {/* Reduced Motion */}
        <div className="flex items-center justify-between">
          <label className="text-xs text-txt-secondary">모션 줄이기</label>
          <button
            onClick={toggleReducedMotion}
            className={`
              w-10 h-6 rounded-full transition-colors relative
              ${isReducedMotion ? 'bg-primary' : 'bg-border'}
            `}
            aria-label={isReducedMotion ? '모션 줄이기 비활성화' : '모션 줄이기 활성화'}
          >
            <div
              className={`
                w-4 h-4 bg-white rounded-full transition-transform absolute top-1
                ${isReducedMotion ? 'translate-x-5' : 'translate-x-1'}
              `}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

AccessibilityProvider.displayName = 'AccessibilityProvider'; 