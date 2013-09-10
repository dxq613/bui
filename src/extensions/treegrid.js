/**
 * @fileOverview Tree Grid
 * @ignore
 */

define('bui/extensions/treegrid',['bui/common','bui/grid','bui/tree'],function (require) {
  'use strict';
  var Tree = require('bui/tree'),
    Grid = require('bui/grid');
    

  /**
   * @class BUI.Extensions.TreeGrid
   * 树型结构的表格，注意此种表格不要跟分页控件一起使用
   * @extends BUI.Grid.Grid
   */
  var TreeGrid = Grid.Grid.extend([Tree.Mixin],{
    
  },{
    ATTRS : {
      iconContainer : {
        value : '.bui-grid-cell-inner'
      }
    }
  },{
    xclass : 'tree-grid'
  });

  return TreeGrid;
});