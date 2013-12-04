/**
 * @fileOverview 布局插件的子项，用于封装控件，控制控件的位置
 * @ignore
 */

define('bui/layout/baseitem',function (require) {

	var BUI = require('bui/common');

	function parseValue(attrs,value){
		if(!BUI.isString(value)){ //只转换字符串
			return value;
		}
		if(value.indexOf('{') != -1){ //如果有可替换的值，进行计算
			value = BUI.substitute(value,attrs);
			value = BUI.JSON.looseParse(value); //转成对应的值
		}
		return value;
	}

	/**
	 * @class BUI.Layout.Item
	 * 布局插件的子项，用于操作位置、宽度等
	 * @extends BUI.Base
	 */
	var Item = function(config){
		Item.superclass.constructor.call(this,config);
		this.init();
	};

	Item.ATTRS = {

		/**
		 * 所属的layout
		 * @type {BUI.Layout.Abstract}
		 */
		layout : {

		},
		/**
		 * @private
		 * 封装的控件
		 * @type {Object}
		 */
		control : {

		},
		/**
		 * 容器
		 * @type {jQuery}
		 */
		container : {

		},
		/**
		 * @protected
		 * 同步的css属性
		 * @type {Array}
		 */
		cssProperties : {
			value : ['width','height']
		},
		/**
		 * @protected
		 * 同步的attributes
		 * @type {Array}
		 */
		attrProperties : {

		},

		/**
		 * 当前项的DOM
		 * @type {jQuery}
		 */
		el : {

		},
		/**
		 * 应用的样式
		 * @type {Object}
		 */
		elCls : {

		},
		/**
		 * 模板
		 * @type {String}
		 */
		tpl : {

		}
	};

	BUI.extend(Item,BUI.Base);

	BUI.augment(Item,{

		/**
		 * 初始化
		 */
		init : function(){
			var _self = this,
				el = _self._wrapControl();
			_self.set('el',el);
			_self.syncItem();
		},
		/**
		 * 获取选项的DOM节点
		 * @return {jQuery} 操作节点
		 */
		getElement : function(){
			return this.get('el');
		},
		//封装控件
		_wrapControl : function(){
			var _self = this,
				control = _self.get('control'),
				controlEl = control.get('el'),
				elCls = _self.get('elCls'),
				container = _self._getContainer(controlEl),
				tpl = _self.get('tpl'),
				node = $(tpl).appendTo(container);
			if(elCls){
				node.addClass(elCls);
			}
			controlEl.appendTo(node);
			return node;
		},
		/**
		 * 同步属性到子项,同步css和attr
		 */
		syncItem : function(attrs){
			attrs = attrs || this.getAttrVals();
			var _self = this,
				el = _self.get('el'),
				css = _self._getSyncCss(attrs),
				attr = _self._getSyncAttr(attrs);
			
			el.css(css);
			el.attr(attr);
		},
		//获取需要同步的css属性
		_getSyncCss : function(attrs){
			var _self = this,
				properties = _self.get('cssProperties'),
				dynacAttrs = _self._getDynacAttrs(),
				css = {};

			BUI.each(properties,function(p){
				css[p] = parseValue(dynacAttrs,attrs[p]);
			});
			return css;
		},
		//获取动态的值，进行计算
		_getDynacAttrs : function(){
			var _self = this,
				container = _self.get('container');
			return {
				width : container.width(),
				height : container.height()
			};
		},
		//获取需要
		_getSyncAttr : function(attrs){
			var _self = this,
				properties = _self.get('attrProperties'),
				attr = {};

			BUI.each(properties,function(p){
				attr[p] = attrs[p];
			});
			return attr;
		},
		//获取容器
		_getContainer : function(controlEl){
			var _self = this,
				container = _self.get('container');
			if(container){
				return container;
			}
			return controlEl.parent();
		},
		/**
		 * 获取封装的控件的属性
		 * @param  {String} name 控件属性
		 * @return {*} 属性值
		 */
		getInner : function(name){
			var _self = this,
				control = _self.get('control');
			return control.get(name);
		},
		/**
		 * 释放
		 */
		destroy : function(){
			var _self = this;
			_self.get('el').remove();
			_self.off();
			_self.clearAttrVals();
		}
	});

	return Item;
});