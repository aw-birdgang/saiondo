module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
        'prettier',
        '@nestjs',
    ],
    extends: ['@nestjs/eslint-config', 'plugin:prettier/recommended'],
    ignorePatterns: ['dist/', 'node_modules/'],
    rules: {
        // Prettier와 충돌 방지
        'prettier/prettier': ['error'],
        // NestJS 컨벤션 강화
        '@nestjs/no-missing-dependencies': 'error',
        // 필요에 따라 추가/수정
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        'no-console': 'warn',
        // 기타 커스텀 룰
    },
};
