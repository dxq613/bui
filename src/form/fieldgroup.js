/**
 * @fileOverview 表单文本域组，可以包含一个至多个字段
 * @author dxq613@gmail.com
 * @ignore
 */

define('bui/form/fieldgroup',['bui/common','bui/form/group/base','bui/form/group/range','bui/form/group/check','bui/form/group/select'],function (require) {
  var BUI = require('bui/common'),
    Group = require('bui/form/group/base');

  BUI.mix(Group,{
    Range : require('bui/form/group/range'),
    Check : require('bui/form/group/check'),
    Select : require('bui/form/group/select')
  });
  return Group;
});