/**
 * @fileOverview 图形的入口文件
 * @ignore
 */

define('bui/graphic',['bui/common','bui/graphic/canvas','bui/graphic/shape','bui/graphic/group','bui/graphic/util'],function (require) {
	var BUI = require('bui/common'),
		Graphic = BUI.namespace('Graphic');

	BUI.mix(Graphic,{
		Canvas : require('bui/graphic/canvas'),
		Group : require('bui/graphic/group'),
		Shape : require('bui/graphic/shape'),
		Util : require('bui/graphic/util')
	});

	return Graphic;
});