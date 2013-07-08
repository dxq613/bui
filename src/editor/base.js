/**
 * @fileOverview 编辑器命名空间入口
 * @ignore
 */

define('bui/editor',['bui/common','bui/form','bui/editor/editor','bui/editor/record','bui/editor/dialog'],function (require) {
  var BUI = require('bui/common'),
    Form = require('bui/form'),
    Editor = BUI.namespace('Editor');

  BUI.mix(Editor,{
    Editor : require('bui/editor/editor'),
    RecordEditor : require('bui/editor/record'),
    DialogEditor : require('bui/editor/dialog')
  });
  return Editor;
});