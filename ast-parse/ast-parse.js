const transform = require('../transform2md')
const traverse = require('@babel/traverse').default

function astParser(ast, component/* 是否展示组件 */) {
  let transformMarkdown = '' // 转换成markdown的内容
  let componentName = '' // 组件名称

  // 装载markdown配置项
  const md = {}
  // 策略模式
  const fnMap = {
    'name': createName,
    'methods': createMethods
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

  function createName(name) {
    md.name = conditionalLoadin(md.name, name.value)
  }

  /**
   * @description 获取Vue组件里的methods方法
   * @param {c}  
   * @returns {Array<string>}
   */
  function createMethods(med) {
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

   /**
   * @description 根据命令行配置是否需要展示组件
   * @param {string} # name - 组件名称
   * @returns {string}
   */
  function createComponent(name) {
    name = name.replace(/[A-Z]/g, (c, _d, _e, _f) => {
      return (_d ? '-' : '') + c.toLocaleLowerCase()
    })

    return `## 组件展示\n<${name}></${name}>`
  }

  traverse(ast, {
    ExportDefaultDeclaration(path) {
      if (!path.node.declaration.properties) return
      for (let o of path.node.declaration.properties) {
        if (o.key.name === 'name' && component) componentName = createComponent(o.value.value) // 拼装组件
        fnMap[o.key.name] && fnMap[o.key.name](o.value)
      }

      Object.keys(md).forEach(m => {
        transformMarkdown = transformMarkdown + transform[m](md[m]) + '\n'
      })
    }
  })
  return transformMarkdown + componentName
}


module.exports = astParser