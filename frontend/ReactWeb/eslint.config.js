import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import unusedImports from 'eslint-plugin-unused-imports';
import { globalIgnores } from 'eslint/config';

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      // 사용하지 않는 import는 에러로 처리
      'unused-imports/no-unused-imports': 'error',

      // 사용하지 않는 변수는 경고로 처리하고 언더스코어로 시작하는 변수는 허용
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      // TypeScript 관련 규칙 완화
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      // any 타입 사용을 경고로 변경 (개발 단계에서는 허용)
      '@typescript-eslint/no-explicit-any': 'warn',

      // Function 타입 사용을 경고로 변경
      '@typescript-eslint/no-unsafe-function-type': 'warn',

      // React Fast Refresh 관련 규칙 완화
      'react-refresh/only-export-components': 'warn',

      // React Hooks 의존성 배열 규칙 완화
      'react-hooks/exhaustive-deps': 'warn',
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
]);
