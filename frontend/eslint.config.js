const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const prettierPlugin = require("eslint-plugin-prettier");
const prettierConfig = require("eslint-config-prettier");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
      prettierConfig,
    ],
    plugins: {
      prettier: prettierPlugin,
    },
    processor: angular.processInlineTemplates,
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-function-return-type": "error",
      "@angular-eslint/no-empty-lifecycle-method": "error",
      "prettier/prettier": ["error", { singleQuote: true, semi: true }],
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
      prettierConfig,
    ],
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "@angular-eslint/template/interactive-supports-focus": "error",
      "@angular-eslint/template/eqeqeq": "error",
      // "prettier/prettier": ["error", { singleQuote: true }],
    },
  },
);
