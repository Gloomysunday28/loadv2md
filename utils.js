const path = require('path')

const root = process.cwd();

module.exports = {
  resolve(...rest) {
    return path.resolve(root, ...rest)
  },
  custResolve(...rest) {
    return path.resolve(__filename, ...rest)
  }
}