const formatDiffMD = require('./formatDiffMD.js')

let methods = {} // methods 所有的配置项

function formatMethods(fmt, cond) {
  let {0: name, 1: mt} = fmt.split('v2md')
  let Comments = ''
  /*
    单行注释样板：
      @param: string # name - yourname
    JSDOC注释样板:
      @param {string} # name - yourname
  */
  if (mt.includes(':')) {
    Comments = formatJSDOC({mt, name, reg: ':', cond})
  } else if (mt.includes('{')) {
    Comments = formatJSDOC({mt, name, cond})
  }

  return Comments
}

function formatJSDOC({mt, name, reg = '{', cond} = {}) {
  let regExp = /[\{\}\#\-]/
  if (reg === ':') {
    regExp = /[\:\#\-]/
  }
  
  formatDiffMD.param({data: mt, name, regExp, findDoc: 'param'}, methods) // 配置参数Table
  formatDiffMD.param({data: mt, name, regExp, findDoc: 'returns'}, methods) // 配置参数Table
  formatDiffMD.common({data: mt, start:  `<code>作者: `, regExp}, methods) // 配置作者
  formatDiffMD.common({data: mt, start: '> 描述\n```\n', end: '\n```\n', findDoc: 'description', regExp}, methods) // 配置描述

  return methods
}

/**
 * @param {Array} tm 
 * @returns {String} MD_TABLES
 */

function createMethods(tm, findDoc) {
  tm.forEach(mt => {
    formatMethods(mt, 'table')
  })
}

/**
 * @param {Array} # tm -> ['martinv2md@param{string}#name-yourname@param{string}#age-12@authormr.martin']
 * @author mr.martin
 */
const transformMethods = function(tm) {
  createMethods(tm, 'param') // 根据注释创建markdown

  const MARK_TITLE = Object.values(methods).reduce((prev, next) =>  next + '\n' + prev, '')
  methods = {}
  return MARK_TITLE
}

module.exports = transformMethods