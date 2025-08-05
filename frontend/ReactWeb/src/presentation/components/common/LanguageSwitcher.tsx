import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  setLanguage,
  getCurrentLanguage,
  availableLanguages,
} from '../../../app/di/languageUtils';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'dropdown' | 'buttons';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className = '',
  variant = 'dropdown',
}) => {
  const { t } = useTranslation();
  const currentLanguage = getCurrentLanguage();

  const handleLanguageChange = (languageCode: string) => {
    setLanguage(languageCode);
  };

  if (variant === 'buttons') {
    return (
      <div className={`flex gap-2 ${className}`}>
        {availableLanguages.map(language => (
          <button
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              currentLanguage === language.code
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {language.nativeName}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <select
        value={currentLanguage}
        onChange={e => handleLanguageChange(e.target.value)}
        className='px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
      >
        {availableLanguages.map(language => (
          <option key={language.code} value={language.code}>
            {language.nativeName}
          </option>
        ))}
      </select>
    </div>
  );
};
