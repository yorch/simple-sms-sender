module.exports = {
    env: {
        es6: true,
        node: true
    },
    extends: [
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
        'plugin:prettier/recommended'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module'
    },
    plugins: ['@typescript-eslint'],
    rules: {
        semi: ['error', 'always'],
        quotes: ['error', 'single'],
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-explicit-any': 1,
        '@typescript-eslint/no-inferrable-types': [
            'warn',
            {
                ignoreParameters: true
            }
        ],
        // '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/no-unused-vars': [
            'error',
            {
                vars: 'all',
                args: 'after-used',
                ignoreRestSiblings: false
            }
        ]
    }
};
