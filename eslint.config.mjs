import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';

export default [
  js.configs.recommended,

  // TypeScript
  ...tseslint.configs.recommended,

  // Astro (includes parsing .astro)
  ...astro.configs.recommended,

  {
    ignores: [
      "dist/**",
      "node_modules/**",
      ".astro/**"
    ]
  },

  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    rules: {
      // Keep it strict but not noisy early on
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }]
    }
  }
];
