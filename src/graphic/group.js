define('bui/graphic/group',['bui/common','bui/graphic/util','bui/graphic/container','bui/graphic/shape','bui/graphic/canvasitem','bui/graphic/raphael/group'],function(require) {

	var Container = require('bui/graphic/container'),
		Item = require('bui/graphic/canvasitem'),
		Util = require('bui/graphic/util'),
		Shape = require('bui/graphic/shape');
	require('bui/graphic/raphael/group');

	/**
	 * @class BUI.Graphic.Group
	 * 图形分组
	 */
	var Group = function(cfg){
		Group.superclass.constructor.call(this,cfg);
	};

	Group.ATTRS = {
		/**
		 * 沿x轴的偏移量
		 * @type {Number}
		 */
		x : {

		},
		/**
		 * 沿y轴的偏移量
		 * @type {Number}
		 */
		y : {

		}
	};

	BUI.extend(Group,Container);
	//获取画布内元素的一些共性方法
	BUI.mixin(Group,[Item]);

	BUI.augment(Group,{
		/**
		 * 是否Group
		 * @type {Boolean}
		 */
		isGroup : true,

		renderUI : function(){
  		var _self = this,
  			el = _self.get('el'),
  			attrs = _self.get('attrs'),
  			node;
  		if(!el){
  			el = _self.createElement(attrs);
  			_self.set('el',el);
  		}

  		node = el.node;
  		node.group = _self;
  		_self.set('node',node);
  		_self._initTranslate();
  	},
  	//初始化平移
  	_initTranslate: function(){
  		var _self = this,
  			x = _self.get('x'),
  			y = _self.get('y');
  		if(x || y){
  			_self._translate((x || 0),(y || 0));
  		}else{
  			_self.set('x',x || 0);
  			_self.set('y',y || 0);
  		}
  	},
  	/**
		 * 移动
		 * @param  {Number} dx 沿x轴平移的距离
		 * @param  {Number} dy 沿y轴平移的距离
		 */
		translate : function(dx,dy){
			var _self = this,
				x = _self.get('x') || 0,
				y = _self.get('y') || 0;
			_self.set('x',x + dx);
			_self.set('y',y + dy);
			_self._translate(dx,dy);
		},

		getBBox : function(){
			var _self = this,
				children = _self.get('children'),
				w = 0,
				h = 0,
				rst = {};

			BUI.each(children,function(item){
				var bbox = item.getBBox(),
					w1 = bbox.width + bbox.x,
					h1 = bbox.height + bbox.y;
				if(w < w1){
					w = w1;
				}
				if(h < h1){
					h = h1;
				}
			});

			rst.x = _self.get('x');
			rst.y = _self.get('y');
			rst.width = w;
			rst.height = h;

			return rst;

		},
		_translate : function(dx,dy){
			var _self = this,
  			el = _self.get('el');
  		el.translate(dx,dy);
		},
  	/**
  	 * 是否包含指定的DOM
  	 * @param  {HTMLElement} element dom元素
  	 * @return {Boolean}   是否包含
  	 */
  	containsElement : function(element){
  		var _self = this,
  			node = _self.get('node');
  		return node == element || $.contains(node,element);
  	},
  	/**
		 * 执行动画,对于分组来说，animate仅支持平移动画
		 *
		 * <code>
		 * 	group.animate({
		 * 		x : 100,
		 * 		y : 100
		 * 	},400);
		 * </code>
		 * 
		 * @param  {Object}   params   动画的参数
		 * @param  {Number}   ms       毫秒数
		 * @param  {String}   easing   路径函数
		 * @param  {Function} callback 回调函数
		 */
		animate : function(params,ms,easing,callback){
			var _self = this,
				el = _self.get('el');
			if(Util.svg){
				el.animate({
					transform : 't '+ params.x + ' ' + params.y
				},ms,easing,callback);
			}else{
				el.animate(params,ms,easing,callback);
			}
			_self.set('x',params.x);
			_self.set('y',params.y);
			//_self._vmlAnimate(params,ms,callback);
		},
		
		/**
		 * 移动的到位置
		 * @param  {Number} x 移动到x
		 * @param  {Number} y 移动到y
		 */
		move : function(x,y){
			var _self = this,
				cx = _self.get('x') || 0, //当前的x
				cy = _self.get('y') || 0; //当前的y
			if(Util.svg){
				_self._translate(x - cx,y -cy);
			}else{
				_self.get('el').move(x,y);
			}
			
			_self.set('x',x);
			_self.set('y',y);
		},
  	/**
  	 * @private
  	 * @ignore
  	 */
  	createElement : function(){
  		var _self = this,
				el = _self.get('parent').get('el');
			return el.group();
  	},
		/**
		 * @protected
		 * @ignore
		 */
		getGroupClass : function(){
			return Group;
		}
		

	});

	return Group;
});