const transformName = function(tn) {
  const MD_NAME = tn.reduce((prev, next) => {
    return prev + next + '\n'
  }, '#')

  return MD_NAME
}

module.exports = transformName