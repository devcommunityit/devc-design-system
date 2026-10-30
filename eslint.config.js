import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/storybook-static/**', '**/*.generated.*', 'packages/ui/src/tokens/generated.ts', 'apps/playground/vendor/**', '**/test-results/**', '**/playwright-report/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks, 'jsx-a11y': jsxA11y },
    languageOptions: { globals: { ...globals.browser } },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.flatConfigs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['**/*.{mjs,js}', '**/scripts/**', '**/*.config.ts', '**/build/**'],
    languageOptions: { globals: { ...globals.node } },
  },
  {
    // Playwright scripts: callbacks passed to evaluate() run in the browser.
    files: ['scripts/verify-package.mjs', 'e2e/**', 'playwright.config.ts'],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
);
