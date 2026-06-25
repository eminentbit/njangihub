import js from "@eslint/js";
import globals from "globals";

export default [
  {
    // Build artifacts, deps, coverage, and legacy backups are not linted.
    ignores: [
      "node_modules/**",
      "coverage/**",
      "backup/**",
    ],
  },
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // Unused vars are real noise; allow intentionally-ignored args/vars
      // via a leading underscore (common for Express `next`, catch bindings).
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrors: "none",
        },
      ],
      "no-undef": "error",
    },
  },
  {
    // Jest test files and setup helpers get the Jest + Node globals.
    files: ["**/__tests__/**/*.js", "**/*.test.js"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
  },
];
