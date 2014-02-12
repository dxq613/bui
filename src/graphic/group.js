define('bui/graphic/group',['bui/common','bui/graphic/container','bui/graphic/shape','bui/graphic/canvasitem','bui/graphic/raphael/group'],function(require) {

	var Container = require('bui/graphic/container'),
		Item = require('bui/graphic/canvasitem'),
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
  		_self.set('node',node);
  		_self._initTranslate();
  	},
  	//初始化平移
  	_initTranslate: function(){
  		var _self = this,
  			x = _self.get('x'),
  			y = _self.get('y');
  		if(x || y){
  			_self.translate((x || 0),(y || 0));
  		}
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