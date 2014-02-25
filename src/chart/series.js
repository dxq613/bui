/**
 * @fileOverview 数据序列的入口文件
 * @ignore
 */

define('bui/chart/series',['bui/chart/baseseries','bui/chart/lineseries'],function (require) {

	var Series = require('bui/chart/baseseries');

	Series.Line = require('bui/chart/lineseries');
	

	return Series;
});