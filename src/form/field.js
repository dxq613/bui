/**
 * @fileOverview 表单域的入口文件
 * @ignore
 */

define('bui/form/field',function (require) {
  var BUI = require('bui/common'),
    Field = require('bui/form/basefield');

  BUI.mix(Field,{
    Text : require('bui/form/textfield'),
    Date : require('bui/form/datefield'),
    Select : require('bui/form/selectfield'),
    Hidden : require('bui/form/hiddenfield'),
    Number : require('bui/form/numberfield'),
    Check : require('bui/form/checkfield'),
    Radio : require('bui/form/radiofield'),
    Checkbox : require('bui/form/checkboxfield'),
    Plain : require('bui/form/plainfield')
  });

  return Field;
});