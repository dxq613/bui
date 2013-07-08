/**
 * @fileOverview 选择框命名空间入口文件
 * @ignore
 */

define('bui/select',['bui/common','bui/select/select','bui/select/combox','bui/select/suggest'],function (require) {
  var BUI = require('bui/common'),
    Select = BUI.namespace('Select');

  BUI.mix(Select,{
    Select : require('bui/select/select'),
    Combox : require('bui/select/combox'),
    Suggest: require('bui/select/suggest')
  });
  return Select;
});