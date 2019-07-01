const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const fs = require('fs')
const VueCompiler = require('vue-template-compiler')

// 装载markdown配置项
const md = {}
// 策略模式
const fnMap = {
  'name': getName,
  'methods': getMethods
}

fs.readFile('./index.vue', 'utf-8', (err, data) => {
  const template = VueCompiler.parseComponent(data)
  // console.log(VueCompiler.compile(template.template.content))
  const ast = parser.parse(template.script.content, {sourceType: 'module'})
  traverse(ast, {
    ExportDefaultDeclaration(path) {
      if (!path.node.declaration.properties) return
      for (let o of path.node.declaration.properties) {
        fnMap[o.key.name](o.value)
      }
    }
  })
})

/**
 * @description 条件装载markdown配置项, 若有值, 则push, 否则初始化
 * @param {c}  
 * @returns {Array<string>}
 */
function conditionalLoadin(c, ...rest) {
  if (Array.isArray(c)) c.push(...rest)
  else c = [...rest]
  
  return c
}

function getName(name) {
  md.name = conditionalLoadin(md.name, name.value)
}

/**
 * @description 获取Vue组件里的methods方法
 * @param {c}  
 * @returns {Array<string>}
 */
function getMethods(med) {
  for (let o of med.properties) {
    for (let l of o.leadingComments) {
      let value = l.value
      if (l.type === 'CommentBlock') {
        value = value.replace(/[\*\r\n\s]/g, '')
      }

      md.methods = conditionalLoadin(md.methods, value)
    }
  }
}

module.exports = md
