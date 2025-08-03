# Internationalization (i18n) Setup

This directory contains the internationalization configuration for the React Web application using `react-i18next`.

## Files Structure

```
di/
├── i18n.ts                 # Main i18n configuration
├── languageUtils.ts        # Language utility functions
├── translations/           # Translation files
│   ├── en.json            # English translations
│   └── ko.json            # Korean translations
└── README.md              # This file
```

## Configuration

### Main Configuration (`i18n.ts`)

The main i18n configuration file sets up:
- Language resources (English and Korean)
- Default language (English)
- Fallback language (English)
- Debug mode (enabled in development)
- React integration with `useSuspense: false` for SSR compatibility
- Language detection from localStorage, navigator, and HTML tag

### Language Utilities (`languageUtils.ts`)

Provides utility functions for:
- Getting current language
- Setting language
- Getting language names
- Initializing language based on user preferences

## Usage

### Basic Translation

```tsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <p>{t('home.subtitle')}</p>
    </div>
  );
};
```

### Language Switcher

```tsx
import { LanguageSwitcher } from '../components/common/LanguageSwitcher';

const MyComponent = () => {
  return (
    <div>
      <LanguageSwitcher variant="dropdown" />
      {/* or */}
      <LanguageSwitcher variant="buttons" />
    </div>
  );
};
```

### Language Utilities

```tsx
import { setLanguage, getCurrentLanguage } from '../di/languageUtils';

// Set language
setLanguage('ko');

// Get current language
const currentLang = getCurrentLanguage(); // 'ko'
```

## Translation Keys Structure

The translation files are organized into logical sections:

### Common (`common`)
- Basic UI elements: loading, error, success, buttons, etc.
- Navigation: back, next, close, etc.
- Status: empty, noResults, etc.

### Authentication (`auth`)
- Login/register forms
- User authentication messages
- Validation messages

### Navigation (`navigation`)
- Main navigation items
- Menu labels

### Pages (`home`, `dashboard`, `analytics`, etc.)
- Page-specific content
- Section headers
- Feature descriptions

### Errors (`errors`)
- Error messages
- Network errors
- Validation errors

### Validation (`validation`)
- Form validation messages
- Input requirements

## Adding New Languages

1. Create a new translation file in `translations/` directory (e.g., `ja.json`)
2. Add the language to the `availableLanguages` array in `languageUtils.ts`
3. Import and add the translation to the resources in `i18n.ts`

Example for Japanese:

```typescript
// languageUtils.ts
export const availableLanguages = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "ko", name: "Korean", nativeName: "한국어" },
  { code: "ja", name: "Japanese", nativeName: "日本語" }
];

// i18n.ts
import jaTranslations from "./translations/ja.json";

const resources = {
  en: { translation: enTranslations },
  ko: { translation: koTranslations },
  ja: { translation: jaTranslations }
};
```

## Best Practices

1. **Use nested keys**: Organize translations in logical groups (e.g., `common.loading`, `auth.signIn`)
2. **Be consistent**: Use the same key structure across all languages
3. **Use interpolation**: For dynamic values, use `{{variable}}` syntax
4. **Provide fallbacks**: Always have a fallback language (English)
5. **Test thoroughly**: Verify translations work correctly in all supported languages

## Debugging

In development mode, i18n debug information is logged to the console. You can see:
- Missing translation keys
- Language changes
- Interpolation errors

To disable debug mode, set `debug: false` in the i18n configuration. 