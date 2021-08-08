module.exports = {
  presets: [
    [
      '@babel/preset-env',
      { targets: { node: 'current' } },
    ],
    '@babel/preset-typescript',
  ],
  plugins: [
    ['module-resolver', {
      alias: {
        '@src': './src',
        '@models': './src/models',
        '@utils': './src/utils',
        '@types': './src/@types',
        '@middlewares': './src/middlewares',
        '@routes': './src/routes',
        '@tests': './__tests__',
      },
    }],
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
  ],
  ignore: [
    '**/*.spec.ts',
  ],
};
