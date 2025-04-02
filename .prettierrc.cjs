module.exports = {
  arrowParens: 'always',
  bracketSpacing: true,
  semi: true,
  singleQuote: true,
  trailingComma: 'none',
  tabWidth: 2,
  overrides: [
    {
      files: '*.json',
      options: {
        tabWidth: 2
      }
    },
    {
      files: '*.yml',
      options: {
        tabWidth: 2
      }
    }
  ],
  editorconfig: true
};
