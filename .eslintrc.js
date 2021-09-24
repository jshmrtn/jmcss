module.exports = {
  root: true,

  env: {
    node: true,
  },

  rules: {
    "no-console": "off",
    "no-debugger": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
  },

  parser: "@typescript-eslint/parser",

  plugins: ["@typescript-eslint", "prettier"],

  overrides: [
    {
      files: ["**/*.ts"],
    },
  ],

  extends: ["plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"],
};
