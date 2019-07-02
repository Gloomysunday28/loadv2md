const VueCompiler = require('./ast-parse/vue-template-compile')
const fs = require('fs')
const {
  resolve
} = require('./utils')
const program = require('commander')
const colors = require('colors')
const astParse = require('./ast-parse/ast-parse')

program
  .version('0.0.1')
  .option('-c, --config <n>', 'v2md.config.js')
  .parse(process.argv)

const {
  config
} = program

const v2mdConfig = resolve(config)

if (!fs.existsSync(v2mdConfig)) {
  console.log(colors.red.underline(`${config} is not exist, please wait a little`));
} else {
  const {
    entry = 'src'
  } = require(v2mdConfig)

  function traverseFile(directory = entry) {
    const dir = fs.readdirSync(resolve(`${directory}`), 'utf-8')

    dir.forEach(file => {
      fs.stat(resolve(directory, file), (err, stat) => {
        if (err) return console.log(colors.red(err))
        if (stat.isFile()) { // 如果是文件
          fs.readFile(resolve(directory, file), 'utf-8', (err, data) => {
            if (file.split('.').slice(-1)[0] === 'vue') { // 判断是否是Vue文件
              const ast = VueCompiler(data) // 获取.vue转化出来的ast树
              fs.writeFile(resolve(directory, 'output.md'), astParse(ast), 'utf-8' , (err, data) => { // 将vue文件转换成markdown
                if (err) console.log(colors.red(err))
              })
            }
          })
        } else if (stat.isDirectory()) { // 如果是目录, 则递归遍历
          traverseFile(resolve(directory, file))
        }
      })
    })
  }

  traverseFile()
}