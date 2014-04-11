/**
 * @fileOverview Picker的入口
 * @author dxq613@gmail.com
 * @ignore
 */

define('bui/picker',['bui/common','bui/picker/mixin','bui/picker/picker','bui/picker/listpicker'],function (require) {
  var BUI = require('bui/common'),
    Picker = BUI.namespace('Picker');

  BUI.mix(Picker,{
    Mixin : require('bui/picker/mixin'),
    Picker : require('bui/picker/picker'),
    ListPicker : require('bui/picker/listpicker')
  });

  return Picker;
});