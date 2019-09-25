const fs = require("fs")
const chalk = require('chalk')

function wrJson(paths, data, code = 'binary') {
  fs.writeFileSync(paths, data, code)
  process.nextTick(() => console.log("输出路径：" + chalk.green(paths)))
}

function checkPath(result, cb) {
  if (fs.existsSync(result)) {
    result = cb()
    checkPath(result, cb)
  } else {
    cb(result)
  }
}


module.exports = {
  wrJson,
  checkPath
}