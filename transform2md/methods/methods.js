const formatDiffMD = require('./formatDiffMD.js')

let methods = {}

function formatMethods(fmt) {
  let {0: name, 1: mt} = fmt.split('v2md')
  let Comments = ''
  /*
    单行注释样板：
      @param: string # name - yourname
    JSDOC注释样板:
      @param {string} # name - yourname
  */
  if (mt.includes(':')) {
    Comments = formatJSDOC({mt, name, reg: ':'})
  } else if (mt.includes('{')) {
    Comments = formatJSDOC({mt, name})
  }

  return Comments
}

function formatJSDOC({mt, name, reg = '{'} = {}) {
  let regExp = /[\{\}\#\-]/
  if (reg === ':') {
    regExp = /[\:\#\-]/
  }
  
  formatDiffMD.param({data: mt, name, regExp}, methods)

  return methods
}

const transformMethods = function(tm) {
  let MD_TABLES = '| 方法名 | 参数 | 类型 | 说明\n' + '|:---:|'.repeat(4) + '\n'
  tm.forEach(mt => {
    methods = {}
    MD_TABLES += formatMethods(mt).params
  })

  return MD_TABLES
}

module.exports = transformMethods