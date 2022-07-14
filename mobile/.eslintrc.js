module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true
  },
  plugins: ['vue'],
  rules: {
    'vue/no-v-html': 'off',
    'vue/no-mutating-props': 'off',
    // 要求使用 let 或 const 而不是 var。
    'no-var': 'error',

    // 禁用行尾空格。
    'no-trailing-spaces': 'error',

    // 禁用eval()。
    'no-eval': 'error',

    // 禁止在循环语句中出现包含不安全引用的函数声明。
    'no-loop-func': 'error',

    // 禁用 Object 的构造函数。
    'no-new-object': 'error',

    // 禁止对 function 的参数进行重新赋值。
    'no-param-reassign': 'error',

    // 禁止类成员中出现重复的名称。
    'no-dupe-class-members': 'error',

    // 禁止重复模块导入。
    'no-duplicate-imports': 'error',

    // 要求或禁止对象字面量中方法和属性使用简写语法。
    'object-shorthand': 'error',

    // 要求使用 const 声明那些声明后不再被修改的变量。
    'prefer-const': 'error',

    // 要求使用模板字面量而非字符串连接。
    'prefer-template': 'error',

    // 要求回调函数使用箭头函数。
    'prefer-arrow-callback': 'error',

    // 要求或禁止模板字符串中的嵌入表达式周围空格的使用。
    'template-curly-spacing': 'error',

    // 强制在块之前使用一致的空格。
    'space-before-blocks': 'error',

    // 强制一致地使用 function 声明或表达式。
    'func-style': 'error',

    // 强制箭头函数的箭头前后使用一致的空格。
    'arrow-spacing': 'error',

    // 要求使用 === 和 !==。
    eqeqeq: 'error',

    // 强制使用一致的反勾号、双引号或单引号。
    quotes: ['off', 'single'],

    // 要求或禁止使用分号代替 ASI。
    semi: ['error', 'always'],

    // 换行符风格。
    'linebreak-style': ['error', 'unix'],

    // 箭头函数的圆括号省略与否。
    'arrow-parens': 'off',

    // 要求或禁止文件末尾保留一行空行。
    'eol-last': ['error', 'always'],
    'vue/html-indent': 'off',
    'vue/html-self-closing': 'off',

    // 强制每行设置最大数量的属性。
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: 5,
        multiline: {
          max: 1,
          allowFirstLine: false
        }
      }
    ],
    'vue/singleline-html-element-content-newline': [
      'off',
      {
        ignoreWhenNoAttributes: true,
        ignoreWhenEmpty: true
      }
    ]
  },
  extends: [
    'plugin:vue/recommended',
    'eslint:recommended'
    // 'prettier',
  ],
  overrides: [
    {
      files: [
        '**/tests/*.js?(x)',
        '**/tests/**/*.spec.js?(x)',
        '**/tests/*.spec.js?(x)'
      ],
      env: {
        mocha: true
      }
    }
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    uni: true,
    plus: true,
    wx: true,
    getCurrentPages: true
  }
};
