const path = require('path')

module.exports = {
  resolve(...rest) {
    return path.resolve(__dirname, ...rest)
  }
}