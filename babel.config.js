module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['@babel/plugin-transform-flow-strip-types'],
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '~': './',
          '@': './src',
        },
      },
    ],
    ['import', { libraryName: '@ant-design/react-native' }],
  ],
};