#! /usr/bin/env node

const program = require('commander');
const pkg = require('./package.json')
const fs = require("fs")
const path = require('path')
const ora = require("ora")
const debug = require("debug")("e2j")
const {
  jsonToexcel
} = require('./lib/jsonToexcel');
const {
  excelTojson
} = require('./lib/excelTojson');

program
  .version(pkg.version || "0.1.0")
  .option("-s --source <source>", "源文件地址")
  .option("-p --path <path>", "输出文件路径")
  .description('json转excel，excel转json')
  .action(function (env) {
    let spinner = ora("开始执行").start()
    if (!env.source) {
      spinner.fail("请输入源文件地址，参数-s --source <source>")
      return
    }
    let source, result, type;
    if (env.path) {
      result = path.resolve(__dirname, env.path)
      let bool = fs.existsSync(result)
      if (!bool) spinner.fail(`当前系统输出文件路径${result}不存在`)
    }
    source = path.resolve(__dirname, env.source)
    if (!fs.existsSync(source)) spinner.fail(`当前系统源文件地址${source}不存在`)
    type = path.extname(source)
    try {
      switch (type) {
        case ".json":
          jsonToexcel(source, result)
          break;
        case ".xlsx":
          excelTojson(source, result)
          break;
        default:
          return
      }
      spinner.succeed("转译成功")
    } catch (error) {
      debug(error)
      spinner.fail("转译失败")
    }
  })

program.parse(process.argv)