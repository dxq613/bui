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
   * \u6811\u578b\u7ed3\u6784\u7684\u8868\u683c\uff0c\u6ce8\u610f\u6b64\u79cd\u8868\u683c\u4e0d\u8981\u8ddf\u5206\u9875\u63a7\u4ef6\u4e00\u8d77\u4f7f\u7528
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