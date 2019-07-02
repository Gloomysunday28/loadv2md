/**
 * @description 处理methods里各种各样的类型注释
 * @author {MR.Martin}
 */

(function() {
  function createParam({data: mt, name, regExp} = {}, methods) {
    const params = mt.split('@').filter(v => v.startsWith('param'))
    if (!params.length) return
    
    params.forEach(pm => {
      methods.params = (methods.params || '') + formatParam({data: pm, regExp}, name)
    })
  }
  
  function formatParam({data: param, regExp = /[\{\}\#\-]/} = {}, name) { // 处理param
    const paramAry = param.replace(/\s/g, '').split(regExp).filter(Boolean)
    const copyAry =  paramAry.slice()

    paramAry[1] = copyAry[2] || ''
    paramAry[2] = copyAry[1] || ''

    return paramAry.slice(1).reduce((prev, next) => { // 单行注释以及多行注释
      return prev = prev + next + ' | '
    }, `| ${name} | `) + '\n';
  }

  function formatUrl(mt) { // 处理param
    console.log(mt);
  }

  function createCommon({data: mt}, methods) { // 处理param
    const authorAry = mt.split('@').filter(v => v.startsWith('author'))
    if (!authorAry.length) return

    authorAry.forEach(aut => {
      const author = aut.replace(/\s/g, '').split(/[\{\}]/ig).filter(Boolean)
      methods.author = (methods.author || '作者: ') + author[1] + '\n'
    })
  }

  const formatDiffMD = {
    param: createParam,
    url: formatUrl,
    author: createCommon
  }
  
  module.exports = formatDiffMD
})()
