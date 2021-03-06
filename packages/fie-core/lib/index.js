/**
 * fie 对外接口
 */

'use strict';

const co = require('co');
const home = require('fie-home');
const log = require('fie-log')('fie-core');
const fieError = require('fie-error');
const compatible = require('./compatible');
const initEnv = require('./init-env');
const core = require('./core')();

/**
 * @param command fie所需的命令
 * @param args 数组 fie命令所需的参数
 */
function run(command, args) {
  co(function* () {
    // fie 家目录存在性检查
    home.initHomeDir();

    // 检测环境是否已初始化
    yield initEnv();

    // fie版本更新提示
    yield compatible.updateTip();

    if (core.indexOf(command) === -1) {
      // node环境判断, 小于4.x 就退出
      compatible.checkNode();

      log.debug('进入套件,插件分支');
      const runner = require('../commands/all');

      yield runner.apply(this, [command, args]);
    } else {
      log.debug('进入核心命令分支');
      // init, install, install, uninstall, update ,version 等命令
      // 对 fie.config.js 没有依赖, 也不考虑兼容旧版, 也不执行自定义命令流
      yield require(`../commands/${command}`).apply(null, [args]);
    }


    // 捕获异常
    process.on('uncaughtException', (err) => {
      log.debug(`进入未知错误${JSON.stringify(err)}`);
      fieError.handle(err);
    });
  }).catch((err) => {
    // console.log(err);
    fieError.handle(err);
  });
}

module.exports = {
  run
};
