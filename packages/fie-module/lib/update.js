'use strict';

const localList = require('./local-list');
const installOne = require('./install-one');
const log = require('fie-log')('fie-module');

/**
 * 更新模块
 * @param name
 */
function* update(name) {
  const options = {
    type: 'update'
  };
  if (name) {
    yield installOne(name, options);
    return;
  }
  const list = yield localList();
  for (let i = 0; i < list.length; i += 1) {
    // todo 先全部重新安装 ,后面再做版本判断
    yield installOne(name, options);
  }
  if (list.length === 0) {
    log.success('本地暂无可更新的模块');
  }
}

module.exports = update;
