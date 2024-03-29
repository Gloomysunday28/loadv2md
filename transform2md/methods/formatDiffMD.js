/**
 * @description 处理methods里各种各样的类型注释
 * @author {MR.Martin}
 */

(function() {
  function createParam({data: mt, name, regExp, findDoc} = {}, methods) {
    let MD_TABLES = `## ${findDoc === 'param' ? '参数' : '返回'} \n| 方法名 | 参数 | 类型 | 说明 |\n` + '|:---:'.repeat(4) + '|\n'
    const params = mt.split('@').filter(v => v.startsWith(findDoc))
    if (!params.length) return
    
    params.forEach(pm => {
      methods[findDoc] = (methods[findDoc] || MD_TABLES) + formatParam({data: pm, regExp}, name)
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

  function createCommon({data: mt, start, end = '</code>\n', findDoc = 'author', regExp = /[\{\}]/ig}, methods) { // 处理author
    // methods[findDoc] = ''
    // console.log(methods[findDoc]);
    const commonAry = mt.split('@').filter(v => v.startsWith(findDoc))
    if (!commonAry.length) return

    commonAry.forEach(aut => {
      const common = aut.replace(/\s/g, '').split(regExp).filter(Boolean)
      methods[findDoc] = (methods[findDoc] || '') + start + common[1] + end
    })
  }

  const formatDiffMD = {
    param: createParam,
    url: formatUrl,
    common: createCommon
  }
  
  module.exports = formatDiffMD
})()
