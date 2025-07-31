module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': ['./src'],
            '@/core': ['./src/core'],
            '@/data': ['./src/data'],
            '@/domain': ['./src/domain'],
            '@/presentation': ['./src/presentation'],
            '@/di': ['./src/di'],
            '@/test': ['./src/test'],
          },
        },
      ],
    ],
  };
}; 