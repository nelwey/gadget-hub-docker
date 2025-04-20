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

      // Best practices
      "no-console": "warn", // Discourage console logs
      "no-debugger": "error", // Disallow debugger statements
      "no-alert": "warn", // Prevent the use of alert, confirm, and prompt
      "no-implicit-globals": "error", // Disallow implicit global variable declarations
      "consistent-return": "warn", // Require return statements to either always or never specify values
      "default-case": "warn", // Require default case in switch statements
      "dot-notation": "warn", // Encourage using dot notation over bracket notation where possible
      "eqeqeq": ["error", "always"], // Enforce strict equality


      // Performance & Security
      "no-eval": "error", // Disallow eval() for security reasons
      "no-implied-eval": "error", // Prevent implied use of eval()
      "no-new-func": "error", // Prevent creating functions with `new Function()`
      "no-prototype-builtins": "warn", // Prevent calling Object.prototype methods directly on objects
      "no-return-assign": "warn", // Disallow assignments in return statements
      "no-useless-concat": "warn", // Avoid unnecessary string concatenation

      // TypeScript-Specific Rules
      "@typescript-eslint/array-type": ["warn", { default: "array" }], // Enforce `Array<T>` over `T[]`
      "@typescript-eslint/consistent-type-definitions": ["warn", "interface"], // Prefer interfaces over types
      "@typescript-eslint/explicit-member-accessibility": ["warn", { accessibility: "explicit" }], // Require explicit accessibility modifiers
      "@typescript-eslint/method-signature-style": ["warn", "property"], // Prefer property-based method signatures
      "@typescript-eslint/no-extraneous-class": "off", // Prevent unnecessary class declarations
      "@typescript-eslint/no-floating-promises": "off", // Prevent unhandled promise rejections
      "@typescript-eslint/no-misused-promises": "off", // Prevent logical errors with promises
      "@typescript-eslint/strict-boolean-expressions": "off", // Enforce stricter boolean checks
      "@typescript-eslint/unified-signatures": "warn", // Suggest combining function overloads


      // Angular-Specific Rules
      "@angular-eslint/no-host-metadata-property": "off", // Discourage host metadata properties
      "@angular-eslint/no-inputs-metadata-property": "warn", // Prevent unnecessary @Input() in metadata
      "@angular-eslint/no-outputs-metadata-property": "warn", // Prevent unnecessary @Output() in metadata
      "@angular-eslint/no-lifecycle-call": "warn", // Prevent manual lifecycle hook calls
      "@angular-eslint/no-queries-metadata-property": "warn", // Discourage using @ViewChild() in metadata
      "@angular-eslint/template/banana-in-box": "off", // Enforce proper syntax for two-way data binding
      "@angular-eslint/template/no-negated-async": "off", // Prevent negation of async pipe results


      // Existing rules
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@angular-eslint/no-empty-lifecycle-method": "warn",
      "prettier/prettier": [
        "warn",
        {
          // Prettier options
          singleQuote: true, // Use single quotes instead of double quotes
          semi: true, // Add semicolons at the end of statements
          printWidth: 100, // Wrap lines longer than 100 characters
          tabWidth: 2, // Use 2 spaces for indentation
          useTabs: false, // Use spaces instead of tabs
          trailingComma: "es5", // Add trailing commas where valid in ES5 (objects, arrays, etc.)
          bracketSpacing: true, // Add spaces between brackets in object literals
          arrowParens: "always", // Always include parentheses around arrow function parameters
          endOfLine: "lf", // Use Unix-style line endings (LF)
          proseWrap: "preserve", // Preserve wrapping in markdown and other prose
          quoteProps: "as-needed", // Only add quotes around object properties when necessary
          jsxSingleQuote: false, // Use double quotes in JSX
          bracketSameLine: false, // Place the closing bracket of a multi-line JSX element on a new line
          htmlWhitespaceSensitivity: "css", // Respect CSS display property for HTML whitespace
          embeddedLanguageFormatting: "auto", // Automatically format embedded languages (e.g., CSS in JS)
        },
      ],

      // Additional rules
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-inferrable-types": "warn",
      "@typescript-eslint/no-empty-interface": "warn",
      "@typescript-eslint/no-this-alias": "warn",
      "@typescript-eslint/no-use-before-define": "warn",
      "@typescript-eslint/prefer-for-of": "warn",
      "@typescript-eslint/prefer-function-type": "warn",
      "@typescript-eslint/prefer-enum-initializers": "warn",
      "@typescript-eslint/prefer-as-const": "warn",
      "@typescript-eslint/prefer-ts-expect-error": "warn",

      // Angular-specific rules
      "@angular-eslint/component-class-suffix": "warn",
      "@angular-eslint/directive-class-suffix": "warn",
      "@angular-eslint/no-output-on-prefix": "warn",
      "@angular-eslint/no-input-rename": "warn",
      "@angular-eslint/no-output-rename": "warn",
      "@angular-eslint/use-lifecycle-interface": "warn",
      "@angular-eslint/use-pipe-transform-interface": "warn",
      "@angular-eslint/component-selector": [
        "off",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
      "@angular-eslint/directive-selector": [
        "warn",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
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
      "@angular-eslint/template/interactive-supports-focus": "warn",
      "@angular-eslint/template/eqeqeq": "warn",
      "@angular-eslint/template/interactive-supports-focus": "warn",
      "@angular-eslint/template/eqeqeq": "warn",
      "@angular-eslint/template/no-positive-tabindex": "warn",
      "@angular-eslint/template/alt-text": "warn", // Enforce alt attributes on images for accessibility
      "@angular-eslint/template/no-autofocus": "warn", // Prevent the use of the autofocus attribute
      "@angular-eslint/template/no-distracting-elements": "warn", // Avoid distracting elements like <blink> and <marquee>
      "@angular-eslint/template/no-inline-styles": "off", // Discourage inline styles for maintainability
      "@angular-eslint/template/no-self-closing": "off", // Enforce proper closing of elements
      "@angular-eslint/template/prefer-ng-container": "off", // Encourage using <ng-container> instead of unnecessary elements


      "prettier/prettier": [
        "warn",
        {
          // Prettier options for HTML files
          printWidth: 100, // Wrap lines longer than 100 characters
          tabWidth: 2, // Use 2 spaces for indentation
          useTabs: false, // Use spaces instead of tabs
          singleQuote: true, // Use single quotes for attributes
          bracketSameLine: false, // Place the closing bracket of a multi-line HTML element on a new line
          htmlWhitespaceSensitivity: "css", // Respect CSS display property for HTML whitespace
        },
      ],

      // Additional rules
      "@angular-eslint/template/click-events-have-key-events": "warn",
      "@angular-eslint/template/no-positive-tabindex": "warn",
    },
  },
);
