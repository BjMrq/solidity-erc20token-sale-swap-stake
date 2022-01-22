module.exports = {
  ignorePatterns: ["**/gatsby-*.js", "**/.eslintrc.js"],
  parserOptions: {
    ecmaVersion: 10,
    parser: "@typescript-eslint/parser",
    project: "./tsconfig.json",
  },
  extends: [
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "airbnb-typescript",
    "plugin:import/recommended",
  ],
  plugins: ["@typescript-eslint", "react-hooks", "react"],
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx", ".js", ".jsx"],
    },
    "import/extensions": [".jsx", ".js", ".ts", ".tsx"],
    "import/resolver": {
      node: {
        extensions: [".js", ".ts", ".jsx", ".tsx"],
        moduleDirectory: ["node_modules", "./src", "../contracts/build"],
      },
    },
  },
  rules: {
    // Import
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
    "import/exports-last": "off",
    "import/group-exports": "off",
    "import/no-namespace": "off",
    "import/no-extraneous-dependencies": "off",
    "import/max-dependencies": "off",
    "import/no-cycle": "off",
    "import/no-unused-modules": "off",
    "import/prefer-default-export": "off",
    // Typescript
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: ["variable"],
        format: ["camelCase", "PascalCase", "UPPER_CASE"],
        leadingUnderscore: "allow",
      },
    ],
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-floating-promises": "off",
    "@typescript-eslint/no-confusing-void-expression": "off",
    "@typescript-eslint/no-shadow": "off",
    "@typescript-eslint/comma-dangle": "off",
    "@typescript-eslint/quotes": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
    // React
    "react/prop-types": "off",
    "react/jsx-props-no-spreading": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    // Others
    "no-inline-comments": ["error", { ignorePattern: "GraphQL" }],
    "max-len": ["error", { ignoreComments: true }],
    "max-statements": "off",
    "lines-around-comment": "off",
    "sonarjs/cognitive-complexity": "off",
    "no-shadow": "off",
    "no-use-before-define": "off",
    indent: [
      "off",
      2,
      {
        ignoredNodes: ["TemplateLiteral"],
      },
    ],
    "func-style": "off",
    "no-return-await": "off",
  },
  env: {
    node: true,
    browser: true,
    jest: true,
  },
};
