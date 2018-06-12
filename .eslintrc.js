module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'standard',
    'plugin:vue/essential',
    'plugin:prettier/recommended'
  ],
  rules: {
    'vue/html-end-tags': 'error',
    'vue/html-indent': 'error',
    'vue/html-self-closing': 'error',
    'vue/mustache-interpolation-spacing': 'error',
    'vue/no-multi-spaces': 'error',
    'vue/v-bind-style': 'error',
    'vue/v-on-style': 'error',
    'vue/html-quotes': 'error',
    'vue/no-confusing-v-for-v-if': 'error',
    'vue/this-in-template': 'error',
    'vue/html-closing-bracket-newline': 'error',
    'vue/html-closing-bracket-spacing': 'error',
    'prettier/prettier': 'warn',
    'prefer-promise-reject-errors': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
