
define('bui/common',['bui/ua','bui/json','bui/date','bui/array','bui/keycode','bui/observable','bui/observable','bui/base','bui/component'],function(require){

  var BUI = require('bui/util');

  BUI.mix(BUI,{
    UA : require('bui/ua'),
    JSON : require('bui/json'),
    Date : require('bui/date'),
    Array : require('bui/array'),
    KeyCode : require('bui/keycode'),
    Observable : require('bui/observable'),
    Base : require('bui/base'),
    Component : require('bui/component')
  });
  return BUI;
});