/**
 * @fileOverview 表格命名空间入口
 * @ignore
 */

define('bui/grid',['bui/common','bui/grid/simplegrid','bui/grid/grid','bui/grid/column','bui/grid/header','bui/grid/format','bui/grid/plugins'],function (require) {

  var BUI = require('bui/common'),
    Grid = BUI.namespace('Grid');

  BUI.mix(Grid,{
    SimpleGrid : require('bui/grid/simplegrid'),
    Grid : require('bui/grid/grid'),
    Column : require('bui/grid/column'),
    Header : require('bui/grid/header'),
    Format : require('bui/grid/format'),
    Plugins : require('bui/grid/plugins')
  });

  return Grid;

});