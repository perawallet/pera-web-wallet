const path = require("path");

module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["react", "react-hooks", "@typescript-eslint", "jsx-a11y"],
  env: {
    browser: true,
    jest: true,
    es6: true
  },
  extends: [
    "@hipo/eslint-config-base",
    "@hipo/eslint-config-react",
    "@hipo/eslint-config-typescript",
    "plugin:jsx-a11y/recommended",
    "prettier"
  ],
  parserOptions: {
    project: path.resolve(__dirname, "./tsconfig.json"),
    tsconfigRootDir: __dirname,
    ecmaVersion: 2018,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    },
    createDefaultProgram: true
  },
  settings: {
    react: {
      version: "detect"
    },
    "import/resolver": {
      typescript: {}
    }
  },
  globals: {},
  rules: {
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off"
  },
  overrides: [
    {
      files: [".eslintrc.js"],
      rules: {
        "@typescript-eslint/no-var-requires": "off"
      }
    },
    {
      files: ["*.d.ts"],
      rules: {
        "newline-after-var": "off"
      }
    }
  ]
};
