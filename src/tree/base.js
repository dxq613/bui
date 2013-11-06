/**
 * @fileOverview 选择框命名空间入口文件
 * @ignore
 */

define('bui/tree',['bui/common','bui/tree/treemixin','bui/tree/treelist','bui/tree/treemenu'],function (require) {
  var BUI = require('bui/common'),
    Tree = BUI.namespace('Tree');

  BUI.mix(Tree,{
    TreeList : require('bui/tree/treelist'),
    Mixin : require('bui/tree/treemixin'),
    TreeMenu : require('bui/tree/treemenu')
  });
  return Tree;
});