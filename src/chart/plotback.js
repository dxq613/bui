/**
 * @fileOverview 坐标系内部区域,用于显示背景
 * @ignore
 */

define('bui/chart/plotback',['bui/common','bui/chart/plotitem'],function (require) {
	
	var BUI = require('bui/common'),
		PlotItem = require('bui/chart/plotitem'),
		PlotRange = require('bui/chart/plotrange');

	/**
	 * @class BUI.Chart.PlotBack
	 * @protected
	 * 决定图表的边框、背景
	 * @extends BUI.Chart.PlotItem
	 */
	var PlotBack = function(cfg){
		PlotBack.superclass.constructor.call(this,cfg);
	};

	PlotBack.ATTRS = {

		elCls : {
			value : 'x-chart-back'
		},
		zIndex : {
			value : 0
		},
		/**
		 * 边距，来决定绘图范围,如果是一个值那么4个边框都是统一的数字，如果是一个数组，则4个边框分别对应值
		 * @type {Array|Number}
		 */
		margin : {
			value : 20
		},
		/**
		 * 绘图的范围
		 * @type {Object}
		 */
		plotRange : {

		},
		/**
		 * 背景
		 * @type {Object}
		 */
		background : {
			
		},
		/**
		 * 最外层边框的配置项
		 * @type {Object}
		 */
		border : {

		}
	};

	BUI.extend(PlotBack,PlotItem);

	BUI.augment(PlotBack,{

		beforeRenderUI : function(){
			PlotBack.superclass.beforeRenderUI.call(this);
			this._calculateRange();
		},

		renderUI : function(){
			PlotBack.superclass.renderUI.call(this);
			this._renderBorder();
			this._renderBackground();
		},
		//渲染边框
		_renderBorder : function(){
			var _self = this,
				border = _self.get('border'),
				canvas = _self.get('canvas'),
				cfg;

			if(border){
				cfg = BUI.mix({
					width : canvas.get('width'),
					height : canvas.get('height')
				},border);

				this.addShape('rect',cfg);
			}
		},
		//渲染背景
		_renderBackground : function(){
			var _self = this,
				background = _self.get('background'),
				plotRange = _self.get('plotRange'),
				width,
				height,
				tl,
				cfg;

			if(background){

				width = plotRange.getWidth();
				height = plotRange.getHeight();
				tl = plotRange.tl;
				cfg = {
					x : tl.x,
					y : tl.y,
					width : width,
					height :height
				};
				//图片
				if(background.image){

					cfg.src = background.image;

					_self.addShape('image',cfg);

				}else{//矩形
					BUI.mix(cfg,background);

					_self.addShape('rect',cfg);
				}
			}
		},
		//计算，设置绘图区域
		_calculateRange : function(){

			var _self = this,
				margin = _self.get('margin'),
				canvas = _self.get('canvas'),
				width = canvas.get('width'),
				height = canvas.get('height'),
				plotRange,
				top = 0, //上方的边距
				left = 0, //左边 边距
				right = 0,
				bottom = 0,
				start, //坐标系开始的节点，从左下，到右上
				end; //结束的节点

			if(BUI.isNumber(margin)){
				top = left = right = bottom = margin;
			}
			if(BUI.isArray(margin)){
				top = margin[0];
				right = margin[1] != null ? margin[1] : margin[0];
				bottom = margin[2] != null ? margin[2] : margin[0];
				left = margin[3] != null ? margin[3] : right;
			}

			start = canvas.getRelativePoint(left,height - bottom);
			end = canvas.getRelativePoint(width - right,top);

			plotRange = new PlotRange(start,end);
			_self.set('plotRange',plotRange);

		}
	});


	return PlotBack;
});