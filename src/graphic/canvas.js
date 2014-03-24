define('bui/graphic/canvas',['bui/common','bui/graphic/group','bui/graphic/container','bui/graphic/raphael'],function(require) {

	var BUI = require('bui/common'),
		Group = require('bui/graphic/group'),
		Raphael = require('bui/graphic/raphael'),
		Container = require('bui/graphic/container');

	/**
	 * @class BUI.Graphic.Canvas
	 * 图形的画板，支持SVG和VML
	 * @extends BUI.Graphic.Container
	 */
	var Canvas = function(cfg){
		Canvas.superclass.constructor.call(this,cfg);
	};

	Canvas.ATTRS = {
		/**
		 * 宽度
		 * @cfg {Number} width
		 */
		width : {},
		/**
		 * 高度
		 * @cfg {Number} height
		 */
		height : {},
		/**
		 * 渲染到的节点
		 * @cfg {String} render
		 */
		render : {} ,
		/**
		 * @private
		 * @type {Object}
		 */
		viewbox : {

		}
	};

	BUI.extend(Canvas,Container);

	BUI.augment(Canvas,{
		/**
		 * @protected
		 * @ignore
		 */
		getGroupClass : function(){
			return Group;
		},
		renderUI : function(){
			var _self = this,
				render = _self.get('render'),
				containerEl = $(render),
				id = containerEl.attr('id'),
				width = _self.get('width'),
				height = _self.get('height'),
				el;
			if(!id){
				id = BUI.guid('canvas');
				containerEl.attr('id',id);
			}
			el = Raphael(id,width,height);

		  _self.set('canvas',_self);
			_self.set('el',el);
			_self.set('node',el.canvas);
		},
		/**
		 * 设置宽高
		 * @param {Number} width 宽
		 * @param {Number} height 高
		 */
		setSize : function(width,height){
			this.set('width',width);
			this.set('height',height);
			this.get('el').setSize(width,height);
		},
		/**
		 * 设置viewbox,用于放大，缩小视图
		 * @param {Number} x x轴起点
		 * @param {Number} y y轴起点
		 * @param {Number} width 宽
		 * @param {Number} height 高
		 * @param {Boolean} fit 自适应宽高
		 */
		setViewBox : function(x, y, w, h, fit){
			this.get('el').setViewBox(x, y, w, h, fit);
			this.set('viewbox',{
				x : x,
				y : y,
				width : w,
				height : h
			});
		},
		/**
		 * 将页面上的坐标转换成画布上的坐标
		 * @param  {Number} pageX 页面上的x坐标
		 * @param  {Number} pageY 页面上的y坐标
		 * @return {Object} 坐标对象包含x,y
		 */
		getPoint : function(pageX,pageY){
			var _self = this,
				node = _self.get('node'),
				viewbox = _self.get('viewbox'),
				offset = $(node).offset(),
				point = {};

			if(!viewbox){ //如果不存在viewbox
				point.x = pageX - offset.left;
				point.y = pageY - offset.top;
			}else{
				var xfactor = viewbox.width / _self.get('width'), //计算 宽度比例
					yfactor = viewbox.height / _self.get('height'); //高度比例
				point.x = (pageX - offset.left)	* xfactor + viewbox.x;
				point.y = (pageY - offset.top) * yfactor + viewbox.y;
			}

			return point;
		},
		/**
		 * 将相对地址转换成为画布上的坐标
		 * @param  {Number} dx 相对于起始点的x偏移
		 * @param  {Number} dy 相对于起始点的y偏移
		 * @return {Object} 坐标对象
		 */
		getRelativePoint : function(dx,dy){
			var _self = this,
				viewbox = _self.get('viewbox'),
				point = {};
			if(!viewbox){
				point.x = dx;
				point.y = dy;
			}else{
				var xfactor = viewbox.width / _self.get('width'), //计算 宽度比例
					yfactor = viewbox.height / _self.get('height'); //高度比例
				point.x = dx * xfactor + viewbox.x;
				point.y = dy * xfactor + viewbox.y;
			}

			return point;
		}

	});

	return Canvas;
});