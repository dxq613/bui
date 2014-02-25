/**
 * @fileOverview 坐标轴的入口文件
 * @ignore
 */

define('bui/chart/axis',['bui/common','bui/chart/baseaxis','bui/chart/categoryaxis','bui/chart/numberaxis','bui/chart/timeaxis'],function (require) {
	
	var BUI = require('bui/common'),
		Axis = require('bui/chart/baseaxis');

	Axis.Category = require('bui/chart/categoryaxis');

	Axis.Number = require('bui/chart/numberaxis');

  Axis.Time = require('bui/chart/timeaxis');

	Axis.Auto = require('bui/chart/axis/auto');

	return Axis;
});