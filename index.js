#!/usr/bin/env node

const VueCompiler = require('./ast-parse/vue-template-compile')
const fs = require('fs')
const {
  resolve,
} = require('./utils')
const program = require('commander')
const colors = require('colors')
const astParse = require('./ast-parse/ast-parse')
const { compressImg } = require('./template/compress')

program
  .version('0.0.1')
  .option('-c, --config [n]', 'v2md.config.js')
  .option('-com, --component [b]', 'false')
  .option('-ig, --ignore [n]', '')
  .option('-cmp, --compress [n]', '')
  .parse(process.argv)

const {
  config = 'v2md.config.js',
  component: paramComponent = false, // 命令行参数列表
  ignore: paramIgnore,
  compress: paramCompress = false 
} = program

const v2mdConfig = resolve(config) // 获取文件路径

if (!fs.existsSync(v2mdConfig)) {
  console.log(colors.red.underline(`${config} is not exist, please wait a little`));
} else {
  let {
    entry = 'src',
    component = paramComponent, // 默认为命令行参数
    ignore = paramIgnore,
    compress = paramCompress
  } = require(v2mdConfig)

  ignore = transformIgnore(ignore)

  function traverseFile(directory = entry) {
    const dir = fs.readdirSync(resolve(`${directory}`), 'utf-8')
    dir.forEach(file => {
      fs.stat(resolve(directory, file), (err, stat) => {
        if (err) return console.log(colors.red(err))
        if (stat.isFile()) { // 如果是文件
          fs.readFile(resolve(directory, file), 'utf-8', (err, data) => {
            if (file.split('.').slice(-1)[0] === 'vue') { // 判断是否是Vue文件
              const {
                astScript, // vue script部分的AST树
                astTemplate, // vue template部分的AST数
                astStyle, // vue styles部分的AST数
              } = VueCompiler(data) // 获取.vue转化出来的ast树

              if (compress) {
                compressImg(astTemplate, astStyle) // 压缩template里的图片
              }

              astParse(directory, astScript, component)
            }
          })
        } else if (stat.isDirectory() && !ignore.includes(file)) { // 如果是目录, 则递归遍历
          traverseFile(resolve(directory, file))
        }
      })
    })
  }

  traverseFile()
}

/**
 * @description {转换ingore格式, 方便后面处理}
 * @param {String | Array} ignore 
 * @returns {Array<string>}
 */
function transformIgnore(ignore) {
  if (Array.isArray(ignore)) return ignore
  
  return [ignore]
}