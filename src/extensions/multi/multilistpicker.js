/**
 * @fileOverview 选择器
 * @ignore
 */

define('bui/extensions/mulit/multilistpicker', ['bui/overlay', 'bui/picker/mixin', 'bui/extensions/mulit/multilist'], function (require) {
  
  var Dialog = require('bui/overlay').Dialog,
    Mixin = require('bui/picker/mixin'),
    Mulitlist = require('bui/extensions/mulit/multilist');

  var MultilistPicker = Dialog.extend([Mixin], {
  },{
    ATTRS : {
    }
  },{
    xclass:'multilist-picker'
  });

  return MultilistPicker;
});