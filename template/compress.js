
(function() {
  const { custResolve, resolve } = require('../utils')
  const fs = require('fs')
  var tinify = require("tinify");

  tinify.key = "_53YkYKYVHhKZihlAckkBWciYpRtit1P";
  
  /**
   * @description {压缩template里使用到的图片}
   * @param {string} template
   * @param {string} styles
   * @returns {Function}
   */
  const compressImg = (function() {
    const imgStack = [] // 图片缓存区, 如果已经压缩过的, 那么不再压缩

    return function(temp, styl) {
      var imgArray = getTemplateImg(temp).concat(flatArray(getStyleImg(styl)))
      
      for (let img of imgArray) {
        const imgName = img.split('/').slice(-2).join('/')
        if (fs.existsSync(resolve('src/assets', imgName))) {
          const path = resolve('src/assets', imgName)
          if (imgStack.includes(img)) continue

          imgStack.push(img)
          const source = tinify.fromFile(path)
          source.toFile(path)
        }
      }
    }
  })()

   /**
   * @description {获取template里使用到的图片}
   * @param {string} template
   * @returns {Array}
   */
  function getTemplateImg(temp) {
    const FIND_ALL_IMG_REG = /<img(.*)src=[\'\"](.*)[\'\"] (alt|\s|title)*\>*/g
    const SECOND_FIND_SRC = /src=[\'\"](.*)[\'\"]/

    return (temp.match(FIND_ALL_IMG_REG) || []).map(t => t.match(SECOND_FIND_SRC)[1])
  }

   /**
   * @description {获取template里使用到的图片}
   * @param {string} styles
   * @returns {Array}
   */
  function getStyleImg(styles = []) {
    const FIND_ALL_IMG_REG = /url\((.*?)\)/g
    const SECOND_IMG_SRC = /url\((.*?)\)/

    const style = styles.map(v => {
      return v.content.replace(/(\')*/g, '').match(FIND_ALL_IMG_REG)
    })

    return (flatArray(style) || []).filter(Boolean).map(s => {
      return s.match(SECOND_IMG_SRC)[1]
    })
  }

  // 扁平化数组
  function flatArray(array = []) {
    return array.reduce((v, n) => {
      return v.concat(Array.isArray(n) ? flatArray(n) : [n])
    }, [])
  }

  module.exports = {
    compressImg
  }
})()