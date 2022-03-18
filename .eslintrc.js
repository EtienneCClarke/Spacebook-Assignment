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

        // Disabled as returns and error throws are needed after fetch
        'no-else-return': 'off',

        // Turn off as needed for email regex
        'no-control-regex': 'off',
        'no-useless-escape': 'off',

        // Disabled as i need to check if number equates to string
        eqeqeq: 'off',

        // stop warning requires for images
        'global-require': 'off',

        // Disable templates needed for appending strings
        'prefer-template': 'off',

        // Allows for if statements in setState
        'no-unneeded-ternary': 'off',

        // Increase max length
        'max-len': ['error', { code: 120 }],

        // off
        'react/jsx-props-no-spreading': 'off',
        'prefer-object-spread': 'off',

        // Preference
        'react/no-unstable-nested-components': ['off', { allowAsProps: true }],
        'react/destructuring-assignment': [2, 'never'],
    },
};
