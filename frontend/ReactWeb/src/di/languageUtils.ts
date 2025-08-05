import i18n from 'i18next';

export const availableLanguages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
];

export const getCurrentLanguage = (): string => {
  return i18n.language || 'en';
};

export const setLanguage = (languageCode: string): void => {
  i18n.changeLanguage(languageCode);
  localStorage.setItem('language', languageCode);
};

export const getLanguageName = (code: string): string => {
  const language = availableLanguages.find(lang => lang.code === code);
  return language ? language.name : code;
};

export const getNativeLanguageName = (code: string): string => {
  const language = availableLanguages.find(lang => lang.code === code);
  return language ? language.nativeName : code;
};

export const initializeLanguage = (): void => {
  const savedLanguage = localStorage.getItem('language');
  const browserLanguage = navigator.language.split('-')[0];
  const htmlLanguage = document.documentElement.lang;
  
  let preferredLanguage = 'en';
  
  if (savedLanguage && availableLanguages.some(lang => lang.code === savedLanguage)) {
    preferredLanguage = savedLanguage;
  } else if (availableLanguages.some(lang => lang.code === browserLanguage)) {
    preferredLanguage = browserLanguage;
  } else if (availableLanguages.some(lang => lang.code === htmlLanguage)) {
    preferredLanguage = htmlLanguage;
  }
  
  setLanguage(preferredLanguage);
}; 