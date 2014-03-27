/**
 * list左右选择
 * @fileOverview
 * @ignore
 */
define('multilist', function(require){
  var BUI = require('bui/common'),
    Component = BUI.Component,
    SimpleList = require('bui/list').SimpleList;

  var PREFIX = BUI.prefix,
    CLS_SOURCE = PREFIX + 'multilist-source',
    CLS_TARGET = PREFIX + 'multilist-target',
    CLS_BUTTON_RIGHT = PREFIX + 'multilist-btn-right',
    CLS_BUTTON_LEFT = PREFIX + 'multilist-btn-left';

  var MultiList = SimpleList.extend({
    
  }, {
    ATTRS: {
    }
  }, {
    xclass: 'multilist'
  });

  return MultiList;
});