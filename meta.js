const path = require('path')
const fs = require('fs')

const {
  sortDependencies,
  installDependencies,
  runLintFix,
  printMessage,
} = require('./utils')

const pkg = require('./package.json')

const templateVersion = pkg.version

const { addTestAnswers } = require('./scenarios')

module.exports = {
  metalsmith:{

    before: addTestAnswers
  },
  "helpers": {
    "if_or": function (v1, v2, options) {
      if (v1 || v2) {
        return options.fn(this);
      }

      return options.inverse(this);
    },
    template_version() {
      return templateVersion
    },
  },

  "prompts": {
    "name": {
      "type": "input",
      "required": true,
      "message": "项目名"
    },
    "description": {
      "type": "input",
      "required": false,
      "message": "写一下该项目的描述",
      "default": "A Vue.js project"
    },
    "author": {
      "type": "input",
      "message": "作者"
    },
    "build": {
      "type": "list",
      "message": "请选择一种编译模式",
      "choices": [
        {
          "name": "运行 + 编译: 作者推荐这种模式",
          "value": "standalone",
          "short": "运行 + 编译"
        },
        {
          "name": "运行: about 6KB lighter min+gzip, but templates (or any Vue-specific HTML) are ONLY allowed in .vue files - render functions are required elsewhere",
          "value": "runtime",
          "short": "运行"
        }
      ]
    },
    "router": {
      "type": "confirm",
      "message": "安装vue-router吗?"
    },
    "axios": {
      "type": "confirm",
      "message": "安装axios吗?"
    },
    "vux": {
      "type": "confirm",
      "message": "安装vux组件库吗?"
    },
    "less": {
      "type": "confirm",
      "message": "安装less吗?"
    },
    "sass": {
      "type": "confirm",
      "message": "安装sass吗?"
    },
    "less":{
        "type":"confirm",
        "message":"你需要装less吗？"
    },
    "sass":{
        "type":"confirm",
        "message":"你需要装sass吗？"
    },
    "unit": {
      "type": "confirm",
      "message": "Setup unit tests"
    },
    "runner": {
      "when": "unit",
      "type": "list",
      "message": "Pick a test runner",
      "choices": [
        {
          "name": "Jest",
          "value": "jest",
          "short": "jest"
        },
        {
          "name": "Karma and Mocha",
          "value": "karma",
          "short": "karma"
        },
        {
          "name": "none (configure it yourself)",
          "value": "noTest",
          "short": "noTest"
        }
      ]
    },
    autoInstall: {
      when: 'isNotTest',
      type: 'list',
      message:
        '请选择是否使用npm install 自动安装项目依赖? (recommended)',
      choices: [
        {
          name: 'Yes, use NPM',
          value: 'npm',
          short: 'npm',
        },
        {
          name: 'Yes, use Yarn',
          value: 'yarn',
          short: 'yarn',
        },
        {
          name: 'No, I will handle that myself',
          value: false,
          short: 'no',
        },
      ],
    },
  },
  complete: function (data, { chalk }) {//将模板渲染为项目后，输出一些提示信息，取值为字符串
    const green = chalk.green

    sortDependencies(data, green)

    const cwd = path.join(process.cwd(), data.inPlace ? '' : data.destDirName)

    if (data.autoInstall) {
      installDependencies(cwd, data.autoInstall, green)
        .then(() => {
          return runLintFix(cwd, data, green)
        })
        .then(() => {
          printMessage(data, green)
        })
        .catch(e => {
          console.log(chalk.red('Error:'), e)
        })
    } else {
      printMessage(data, chalk)
    }
  },
  
};
