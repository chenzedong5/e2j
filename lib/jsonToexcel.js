var xlsx = require("node-xlsx").default;
const path = require("path");
const os = require("os")
const {
  wrJson,
  checkPath
} = require("./common")

function jsonToexcel(source, result) {
  const json = require(source)
  let map = []
  let arr = []
  if (Array.isArray(json)) {
    json.forEach(item => {
      if (typeof item === 'object') {
        let _arr = []
        for (let i in item) {
          if (map.indexOf(i) === -1) {
            map.push(i)
          }
          _arr[map.indexOf(i)] = item[i]
        }
        arr.push(_arr)
      } else {
        arr.push([item])
      }
    })
    if (!map.length) {
      map = ['sheet1']
    }
  } else {
    let _arr = []
    for (let i in json) {
      if (map.indexOf(i) === -1) {
        map.push(i)
      }
      _arr[map.indexOf(i)] = json[i]
    }
    arr.push(_arr)
  }
  const names = path.parse(source)

  var buffer = xlsx.build([{
    name: names.name,
    data: [map].concat(arr)
  }]);
  
  //默认输出路径
  if (!result) {
    result = os.userInfo().homedir + "/Downloads"
  }

  checkPath(path.resolve(result, names.name + ".xlsx"), (p) => {
    if (p) {
      wrJson(p, buffer)
      return
    }
    const finalName = `${names.name}-${parseInt(Math.random()*100000)}.xlsx`
    return path.resolve(result, finalName)
  })

}

module.exports = {
  jsonToexcel
}