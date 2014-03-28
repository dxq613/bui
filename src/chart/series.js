/**
 * @fileOverview 数据序列的入口文件
 * @ignore
 */

define('bui/chart/series',['bui/chart/baseseries','bui/chart/lineseries','bui/chart/areaseries','bui/chart/columnseries',
  'bui/chart/scatterseries','bui/chart/bubbleseries','bui/chart/pieseries'],function (require) {

	var Series = require('bui/chart/baseseries');

	Series.Line = require('bui/chart/lineseries');
  Series.Area = require('bui/chart/areaseries');
  Series.Column = require('bui/chart/columnseries');
	Series.Scatter = require('bui/chart/scatterseries');
  Series.Bubble = require('bui/chart/bubbleseries');
  Series.Pie = require('bui/chart/pieseries');

	return Series;
});