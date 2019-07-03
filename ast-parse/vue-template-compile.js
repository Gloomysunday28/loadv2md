const parser = require('@babel/parser')
const VueCompiler = require('vue-template-compiler')

/**
 * @param {file} # vue文件
 */
module.exports = function vueTemplateCompiler(file) {
  const compiler = VueCompiler.parseComponent(file)
  const content = compiler.script ? compiler.script.content : ''
  const astTemplate = compiler.template ? compiler.template.content : '' // 模板内容
  const astStyle = compiler.styles && compiler.styles.length ? compiler.styles : [] // 样式内容
  const astScript = parser.parse(content, {sourceType: 'module'}) // script标签AST树
  
  return {
    astScript,
    astTemplate,
    astStyle
  }
}