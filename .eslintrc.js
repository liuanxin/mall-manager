module.exports = {
  extends: [
    "plugin:prettier-vue/recommended",
    "plugin:vue/essential",
  ],
  rules: {
    // 见 https://prettier.io/docs/en/options.html
    "prettier-vue/prettier": ["warn", {
      "printWidth": 120, // 每行代码长度(默认 80)
      "singleQuote": true, // 使用单引号(默认 false)
      "semi": false, // 声明结尾使用分号(默认 true)
      "arrowParens": "always" // 只有一个参数的箭头函数的参数是否带圆括号(默认 avoid)
    }],

    // 见 https://eslint.vuejs.org/rules/
    "vue/html-closing-bracket-newline": ["warn", {
      "singleline": "never",
      "multiline": "never"
    }],
    "vue/max-attributes-per-line": ["warn", {
      "singleline": 6,
      "multiline": {
        "max": 1,
        "allowFirstLine": false
      }
    }]
  },
  parserOptions: {
    "parser": "babel-eslint",  // 让 eslint 兼容 babel, 路由那里会用到 import('xxx') 这种方式
    "sourceType": "module",
    "allowImportExportEverywhere": false,
    "codeFrame": false
  }
}
