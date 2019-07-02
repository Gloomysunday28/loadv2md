const transform = require('../transform2md')
const traverse = require('@babel/traverse').default

function astParser(ast) {
  let transformMarkdown = '' // 转换成markdown的内容
  // 装载markdown配置项
  const md = {}
  // 策略模式
  const fnMap = {
    'name': getName,
    'methods': getMethods
  }

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
      if (o.leadingComments) {
        for (let l of o.leadingComments) {
          let value = o.key.name + 'v2md' + l.value.trim()
          if (l.type === 'CommentBlock') {
            value = value.replace(/[\*\r\n\s]/g, '')
          }
  
          md.methods = conditionalLoadin(md.methods, value)
        }
      }
    }
  }

  traverse(ast, {
    ExportDefaultDeclaration(path) {
      if (!path.node.declaration.properties) return
      for (let o of path.node.declaration.properties) {
        fnMap[o.key.name](o.value)
      }

      Object.keys(md).forEach(m => {
        transformMarkdown = transformMarkdown + transform[m](md[m]) + '\n'
      })
    }
  })

  return transformMarkdown
}


module.exports = astParser