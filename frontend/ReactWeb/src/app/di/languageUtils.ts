import i18n from './i18n';

export const availableLanguages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
];

export const getCurrentLanguage = (): string => {
  return i18n.language;
};

export const setLanguage = (languageCode: string): void => {
  i18n.changeLanguage(languageCode);
  localStorage.setItem('i18nextLng', languageCode);
};

export const getLanguageName = (languageCode: string): string => {
  const language = availableLanguages.find(lang => lang.code === languageCode);
  return language ? language.name : languageCode;
};

export const getNativeLanguageName = (languageCode: string): string => {
  const language = availableLanguages.find(lang => lang.code === languageCode);
  return language ? language.nativeName : languageCode;
};

export const initializeLanguage = (): void => {
  const savedLanguage = localStorage.getItem('i18nextLng');
  const browserLanguage = navigator.language.split('-')[0];

  // Priority: saved language > browser language > default (en)
  const preferredLanguage =
    savedLanguage ||
    (availableLanguages.some(lang => lang.code === browserLanguage)
      ? browserLanguage
      : 'en');

  setLanguage(preferredLanguage);
};
