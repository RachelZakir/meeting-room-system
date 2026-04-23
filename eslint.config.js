const js = require('@eslint/js'); // official JavaScript ruleset
const globals = require('globals'); // library defines global variables
const pluginPrettier = require('eslint-plugin-prettier'); // plugin makes ESLint enforce Prettier rules
const { defineConfig } = require('eslint/config'); // helper makes ESLint configs easier to read and validate

module.exports = defineConfig([
  {
    files: ['**/*.{js,cjs}'], // apply to all js files
    languageOptions: {
      globals: { ...globals.node }, // loads Node.js global variables
      sourceType: 'commonjs', // using CommonJS modules
    },
    plugins: {
      js,
      prettier: pluginPrettier,
    },
    rules: {
      ...js.configs.recommended.rules,
      'prettier/prettier': 'error',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
    },
  },
  {
    files: ['**/*.test.js'], //  apply only to test files
    languageOptions: {
      globals: { ...globals.jest }, //  load Jest globals so ESLint recognizes describe/it/expect/jest
    },
  },
]);
