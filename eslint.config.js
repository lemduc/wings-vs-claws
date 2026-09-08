import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist', 'node_modules', 'generated'] },
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      // Deliberate: reset-on-route-change and read-external-store-on-mount are
      // used in a few places (Layout, CommandPalette, Game high score). Kept as
      // a warning so it still surfaces rather than blocking the build.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
  {
    files: ['scripts/**/*.mjs', 'worker.js', 'eslint.config.js', 'vite.config.js'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.node, ...globals.worker },
      parserOptions: { sourceType: 'module' },
    },
    rules: js.configs.recommended.rules,
  },
  {
    files: ['test/**/*.test.js'],
    languageOptions: { ecmaVersion: 2022, globals: globals.node },
    rules: js.configs.recommended.rules,
  },
]
