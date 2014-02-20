/**
 * @fileOverview 图表控件
 * @ignore
 */

define('bui/chart/chart',['bui/common'],function (require) {
	
	var BUI = require('bui/common');

	/**
	 * @class BUI.Chart.Chart
	 * 图，里面包括坐标轴、图例等图形
	 * @extends BUI.Component.Controller
	 */
	var Chart = BUI.Component.Controller.extend({

		renderUI : function(){
			var _self = this;

			_self.paint();
		},
		/**
		 * 清除图形
		 */
		clear : function(){
			var _self = this,
				canvas = _self.get('canvas');
			canvas.destroy();
			_self.set('isPaint',false);
		},
		/**
		 * 绘制整个图
		 */
		paint : function(){
			var _self = this;
			if(!_self.get('isPaint')){
				_self._renderCanvas();
				_self._renderTitle();
				_self._renderAxis();
				_self._renderLegend();
				_self._renderSeries();
			}
		},
		//渲染画板
		_renderCanvas : function(){

		},
		//渲染背景、边框等
		_renderPlot : function(){

		},
		//渲染title
		_renderTitle : function(){

		},
		//渲染坐标轴
		_renderAxis : function(){

		},
		//标示图例颜色
		_renderLegend : function(){

		},
		//渲染数据图序列
		_renderSeries : function(){

		},
		/**
		 * 重绘整个图
		 */
		repaint : function(){
			var _self = this;

			_self.clear();
			_self.paint();
		},
		destructor : function(){
			var _self = this;

			_self.clear();
		}
	},{
		ATTRS : {

			/**
			 * 画板
			 * @type {BUI.Graphic.Canvas}
			 */
			canvas : {

			},
			/**
			 * 数据图例默认的颜色顺序
			 * @type {Array}
			 */
			colors : {

			},
			/**
			 * 显示的数据
			 * @type {Array}
			 */
			data : {

			},
			/**
			 * 标示每个图例颜色的配置项
			 * @type {Object}
			 */
			legend : {

			},
			/**
			 * 菜单的配置项
			 * @type {Object}
			 */
			menu : {

			},
			/**
			 * 绘图的配置，包括背景、边框等配置信息
			 * @type {Object}
			 */
			plotCfg : {

			},
			
			/**
			 * 数据图序列集合
			 * @type {Array}
			 */
			series : {

			},
			/**
			 * 数据图序列默认的配置项
			 * @type {Object}
			 */
			seriesCfg : {

			},
			/**
			 * 子标题
			 * @type {String}
			 */
			subTitle : {

			},
			/**
			 * 标题
			 * @type {String}
			 */
			title : {

			},
			/**
			 * 提示信息
			 * @type {Object}
			 */
			tooltip : {

			},
			/**
			 * x 轴坐标
			 * @type {Object|Array}
			 */
			xAxis : {

			},

			/**
			 * Y 轴坐标
			 * @type {Object|Array}
			 */
			yAxis : {

			}
		}
	},{
		xclass : 'chart'
	});

	return Chart;
});