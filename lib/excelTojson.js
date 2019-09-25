const path = require("path");
const os = require("os");
const XLSX = require("xlsx");
const {
  wrJson,
  checkPath
} = require("fs");

function excelTojson(source, result) {
  let data = []
  var workbook = XLSX.readFile(source);
  for (let i of workbook.SheetNames) {
    var first_sheet_name = i;
    var worksheet = workbook.Sheets[first_sheet_name];
    var stream = XLSX.utils.sheet_to_json(worksheet, {
      raw: true
    });
    data.push({
      [first_sheet_name]: stream
    })
  }
  const names = path.parse(source)

  //默认输出路径
  if (!result) {
    result = os.userInfo().homedir + "/Downloads"
  }

  checkPath(path.resolve(result, names.name + ".xlsx"), (p) => {
    if (p) {
      wrJson(p, JSON.stringify(data), 'utf8')
      return
    }
    const finalName = `${names.name}-${parseInt(Math.random()*100000)}.json`
    return path.resolve(result, finalName)
  })

}

module.exports = {
  excelTojson
}