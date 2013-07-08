/**
 * @fileOverview 树形列表
 * @ignore
 */

define('bui/tree/treelist',['bui/common','bui/list','bui/tree/treemixin'],function (require) {
  var BUI = require('bui/common'),
    List = require('bui/list'),
    Mixin = require('bui/tree/treemixin');

  var TreeList = List.SimpleList.extend([Mixin],{
    
  },{
    ATTRS : {
      itemCls : {
        value : BUI.prefix + 'tree-item'
      },
      itemTpl : {
        value : '<li>{text}</li>'
      },
      idField : {
        value : 'id'
      }
    }
  },{
    xclass : 'tree-list'
  });

  return TreeList;
});

