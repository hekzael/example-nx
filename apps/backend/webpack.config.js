const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
  resolve: {
    alias: {
      '@app': join(__dirname, 'src'),
      '@identity': join(__dirname, 'src', 'modules', 'identity'),
      '@projects': join(__dirname, 'src', 'modules', 'projects'),
      '@operations': join(__dirname, 'src', 'modules', 'operations'),
      '@audit': join(__dirname, 'src', 'modules', 'audit'),
      '@shared': join(__dirname, 'src', 'shared'),
    },
  },
  output: {
    path: join(__dirname, 'dist'),
    clean: true,
    ...(process.env.NODE_ENV !== 'production' && {
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    }),
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: false,
      sourceMap: true,
    }),
  ],
};
