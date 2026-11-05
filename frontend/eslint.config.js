const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['.expo/**', '.tsupgrader/**', 'dist/**', 'web-build/**'],
  },
  {
    settings: {
      'import/resolver': {
        alias: {
          map: [['@', './src']],
          extensions: ['.js', '.jsx', '.json'],
        },
      },
    },
  },
  {
    files: [
      'src/hooks/useLocation.js',
      'src/screens/HistoryScreen.jsx',
      'src/screens/SearchScreen.jsx',
    ],
    rules: {
      'react-hooks/set-state-in-effect': 'off',
    },
  },
]);
