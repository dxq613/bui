/**
 * @fileOverview form 命名空间入口
 * @ignore
 */
define('bui/form',function (require) {
  var BUI = require('bui/common'),
    Form = BUI.namespace('Form'),
    Tips = require('bui/form/tips');

  BUI.mix(Form,{
    Tips : Tips,
    TipItem : Tips.Item,
    FieldContainer : require('bui/form/fieldcontainer'),
    Form : require('bui/form/form'),
    Row : require('bui/form/row'),
    Group : require('bui/form/fieldgroup'),
    HForm : require('bui/form/horizontal'),
    Rules : require('bui/form/rules'),
    Field : require('bui/form/field'),
    FieldGroup : require('bui/form/fieldgroup')
  });
  return Form;
});