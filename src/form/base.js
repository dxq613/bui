/**
 * @fileOverview form 命名空间入口
 * @ignore
 */
;(function(){
var BASE = 'bui/form/';
define('bui/form',['bui/common',BASE + 'fieldcontainer',BASE + 'form',BASE + 'row',BASE + 'fieldgroup',BASE + 'horizontal',BASE + 'rules',BASE + 'field',BASE + 'fieldgroup'],function (r) {
  var BUI = r('bui/common'),
    Form = BUI.namespace('Form'),
    Tips = r(BASE + 'tips');

  BUI.mix(Form,{
    Tips : Tips,
    TipItem : Tips.Item,
    FieldContainer : r(BASE + 'fieldcontainer'),
    Form : r(BASE + 'form'),
    Row : r(BASE + 'row'),
    Group : r(BASE + 'fieldgroup'),
    HForm : r(BASE + 'horizontal'),
    Rules : r(BASE + 'rules'),
    Field : r(BASE + 'field'),
    FieldGroup : r(BASE + 'fieldgroup')
  });
  return Form;
});
})();
