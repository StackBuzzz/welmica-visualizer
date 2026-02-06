import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import eslintPluginTypeScript from '@typescript-eslint/eslint-plugin';
import eslintPluginCSSModules from 'eslint-plugin-css-modules';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: {}
});

const eslintConfig = [
  {
    ignores: ['src/app/(payload)/*', 'src/payload/migrations/*']
  },
  ...compat.extends(
    'prettier',
    'eslint:recommended',
    'next/core-web-vitals',
    'next/typescript',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:css-modules/recommended'
  ),

  {
    plugins: {
      react: eslintPluginReact,
      'react-hooks': eslintPluginReactHooks,
      import: eslintPluginImport,
      '@typescript-eslint': eslintPluginTypeScript,
      'css-modules': eslintPluginCSSModules
    },
    settings: {
      react: {
        version: 'detect'
      },
      'import/resolver': {
        typescript: {}
      }
    },
    rules: {
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: false,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^(_|ignore)'
        }
      ],
      '@next/next/no-img-element': 'off',
      'react/jsx-filename-extension': ['warn', { extensions: ['.tsx'] }],
      'css-modules/no-unused-class': 2,
      'css-modules/no-undef-class': 2,
      'import/order': [
        'error',
        {
          'newlines-between': 'never',
          groups: [
            'builtin',
            'external',
            'internal',
            'unknown',
            'parent',
            'sibling',
            'index',
            'object',
            'type'
          ],
          pathGroups: [
            { pattern: 'components', group: 'internal' },
            { pattern: 'common', group: 'internal' },
            { pattern: 'routes/**', group: 'internal' },
            { pattern: 'assets/**', group: 'internal', position: 'after' },
            {
              pattern: '*.scss',
              group: 'index',
              patternOptions: { matchBase: true },
              position: 'after'
            }
          ],
          pathGroupsExcludedImportTypes: ['internal'],
          alphabetize: { order: 'asc' }
        }
      ],
      'import/newline-after-import': ['error', { count: 1 }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports' }
      ]
    }
  }
];

export default eslintConfig;
