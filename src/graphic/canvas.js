define('bui/graphic/canvas',['bui/common','bui/graphic/group','bui/graphic/raphael'],function(require) {

	var BUI = require('bui/common'),
		Group = require('bui/graphic/group'),
		Raphael = require('bui/graphic/raphael'),
		Container = require('bui/graphic/container');

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
		render : {} 
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
		}

	});

	return Canvas;
});