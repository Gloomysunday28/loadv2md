const path = require('path')

module.exports = {
  resolve(...rest) {
    const root = process.cwd();
    return path.resolve(root, ...rest)
  }
}