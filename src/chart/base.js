/**
 * @fileOverview Chart 模块的入口
 * @ignore
 */

define('bui/chart',['bui/common','bui/chart/chart','bui/chart/axis','bui/chart/series'],function (require) {
  
  var BUI = require('bui/common'),
    Chart = BUI.namespace('Chart');

  BUI.mix(Chart,{
    Chart : require('bui/chart/chart'),
    Axis : require('bui/chart/axis'),
    Series : require('bui/chart/series')
  });

  return Chart;
});
