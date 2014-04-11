/**
 * @fileOverview 选择框命名空间入口文件
 * @ignore
 */

define('bui/extensions/multiselect', ['bui/common', 'bui/extensions/multiselect/multilist', 'bui/extensions/multiselect/multilistpicker','bui/extensions/multiselect/multiselect', 'bui/extensions/search'], function (require) {

  var BUI = require('bui/common'),
    multiselect = require('bui/extensions/multiselect/multiselect');
  return multiselect;
});