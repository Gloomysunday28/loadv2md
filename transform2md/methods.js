function formatMethods(mt) {
  if (mt.includes(':')) {
    return mt.split(/\:\s*/)[0] // 单行注释以及多行注释
  } else if (mt.includes('@')) {
    return mt.match(/\@(.*)\{/)[1] // jsDoc
  }
}

const transformMethods = function(tm) {
  let MD_METHODSKEYS = tm.reduce((prev, next) => {
    prev.push(formatMethods(next))
    return prev
  }, [])

  console.log(MD_METHODSKEYS)

  let MD_TABLES = '| 方法名 | 参数 | 类型 | 说明\n' + '|:---:|'.repeat(4)

  return MD_METHODSKEYS
}

module.exports = transformMethods