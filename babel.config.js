module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@components': './src/components',
          '@views': './src/views',
          '@assets': './src/assets',
          '@stores': './src/stores',
          '@services': './src/services'
        },
      },
    ]
   ]
};
