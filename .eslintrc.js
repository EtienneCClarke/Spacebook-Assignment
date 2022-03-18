module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        'plugin:react/recommended',
        'airbnb',
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: [
        'react',
    ],
    rules: {
        indent: ['error', 4],

        // Indent JSX with 4 spaces
        'react/jsx-indent': ['error', 4],

        // Indent props with 4 spaces
        'react/jsx-indent-props': ['error', 4],

        // switch off func names
        'func-names': 'off',

        // line-break
        'linebreak-style': [0, 'error', 'windows'],

        // alert warnings
        'no-alert': 'off',
        'no-console': 'off',

        // stop warning requires for images
        'global-require': 'off',

        'react/no-unstable-nested-components': ['off', { allowAsProps: true }],

    },
};
