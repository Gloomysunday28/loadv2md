const parser = require('@babel/parser')
const VueCompiler = require('vue-template-compiler')

/**
 * @param {file} # vue文件
 */
module.exports = function vueTemplateCompiler(file) {
  const compiler = VueCompiler.parseComponent(file)
  const content = compiler.script ? compiler.script.content : ''
  const ast = parser.parse(content, {sourceType: 'module'})
  
  return ast
}