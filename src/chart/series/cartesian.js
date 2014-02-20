/**
 * @fileOverview 在x,y坐标轴中渲染的数据序列
 * @ignore
 */

define('bui/chart/cartesianseries',['bui/chart/baseseries'],function (require) {

	var BUI = require('bui/common'),
		BaseSeries = require('bui/chart/baseseries');

	/**
	 * @class BUI.Chart.Series.Cartesian
	 * 使用坐标轴的数据序列，此类是一个抽象类，不要直接初始化
	 * @extends BUI.Chart.Series
	 */
	function Cartesian(cfg){
		Cartesian.superclass.constructor.call(this,cfg);
	}

	Cartesian.ATTRS = {

		/**
		 * x坐标轴
		 * @type {BUI.Chart.Axis}
		 */
		xAxis : {

		},
		/**
		 * y坐标轴
		 * @type {BUI.Chart.Axis}
		 */
		yAxis : {

		},
		/**
		 * 如果传入的数据是Object，则根据对应的字段取x的值
		 * @type {String}
		 */
		xField : {

		},
		/**
		 * 如果传入的数据是Object，则根据对应的字段取y的值
		 * @type {String}
		 */
		yField : {
			value : 'y'
		}

	};

	BUI.extend(Cartesian,BaseSeries);

	BUI.augment(Cartesian,{

		/**
		 * 获取坐标点
		 * @param  {*} x x坐标系上的值
		 * @param  {*} y y坐标系上的值
		 * @return {Object}  坐标点
		 */
		getPoint : function(x,y){
			var _self = this,
				xAxis = _self.get('xAxis'),
				yAxis = _self.get('yAxis');

			return {
				x : xAxis.getOffset(x),
				y : yAxis.getOffset(y)
			};
		}

	});

	return Cartesian;

});