/**
 * @fileOverview 可折叠的布局，只能展开一个选项内容
 * @ignore
 */

define('bui/layout/accordion',['bui/common','bui/layout/abstract','bui/layout/tabitem','bui/layout/collapsable'],function (require) {
	
	var CLS_ITEM = 'x-layout-item-accordion',
		BUI = require('bui/common'),
		Abstract = require('bui/layout/abstract'),
		Item = require('bui/layout/tabitem'),
		Collapsable = require('bui/layout/collapsable');

	/**
	 * @class BUI.Layout.Accordion
	 * 可折叠的布局
	 * @extends BUI.Layout.Abstract
	 * @mixins BUI.Layout.Collapsable
	 * <pre><code>
	 * 	var layout = new Accordion(),
				control = new BUI.Component.Controller({
				width:600,
				height:500,
				render : '#J_Layout',
				elCls : 'layout-test',
				children : [{
					layout : {
						title : '标签一'
					},
					xclass : 'controller',
					content : "一"
				},{
					xclass : 'controller',
					layout : {
						title : '标签二'
					},
					content : '二'
				},{
					xclass : 'controller',
					layout : {
						title : '标签三'
					},
					content : "三"
				},{
					xclass : 'controller',
					layout : {
						title : '标签四'
					},
					content : "四"
				}],
				plugins : [layout]
			});

			control.render();
	 * </code></pre>
	 */
	var Accordion = function(config){
		Accordion.superclass.constructor.call(this,config);
	};

	Accordion.ATTRS = {

		/**
		 * 子项对应的构造函数
		 * @type {Function}
		 */
		itemConstructor : {
			value : Item
		},
		/**
		 * 放置内容的样式
		 * @type {String}
		 */
		wraperCls : {
			value : 'x-accordion-body'
		},
		/**
		 * 放置title内容的class样式
		 * @type {String}
		 */
		titleCls : {
			value : 'x-accordion-title'
		},
		/**
		 * 触发展开折叠的样式
		 * @type {String}
		 */
		triggerCls : {
			value : 'x-accordion-title'
		},
		/**
		 * 控件的的那些事件会引起重新布局
		 * @type {Array}
		 */
		layoutEvents : {
			value : ['afterAddChild','afterRemoveChild']
		},
		/**
		 * 动画的持续时间
		 * @type {Number}
		 */
		duration : {
			value : 400
		},
		/**
		 * 是否只能展开一个
		 * @type {String}
		 */
		accordion : {
			value : true
		},
		itemTpl : {
			value : '<div class="' + CLS_ITEM + '"><div class="x-accordion-title">{title}<s class="x-expand-button"></s></div><div class="x-accordion-body"></div></div>'
		}

	};

	BUI.extend(Accordion,Abstract);

	//使用可收缩的扩展
	BUI.mixin(Accordion,[Collapsable]);

	BUI.augment(Accordion,{
		/**
		 * @protected
		 * 附加事件
		 * @param  {Object} control 使用layout的控件
		 */
		appendEvent : function(control){
			this.bindCollapseEvent(); //绑定收缩事件
		},
		/**
		 * 获取展开的选项
		 * @return {BUI.Layout.Item} 选项
		 */
		getActivedItem : function(){
			return this.getExpandedItem();
		},
		/**
		 * @protected
		 * @ignore
		 */
		afterInitItems : function(){
			this._resetActiveItem();
		},
		//重置展开项的高度
		_resetActiveItem : function(){
			var _self = this,
				activeItem = _self.getActivedItem() || _self.getItems()[0];
			activeItem.expand(_self.getCollapsedRange(),0);
		},
		/**
		 * @protected
		 * 覆写重新布局方法
		 */
		resetLayout : function(){
			var _self = this;
			Accordion.superclass.resetLayout.call(_self);
			_self._resetActiveItem();
		},
		/**
		 * 获取展开选项内容区域的高度，容器高度减去 
		 * @return {Number} 容器高度	
		 */
		getCollapsedRange : function(){
			var _self = this,
				container = _self.get('container'),
				outerHeight = container.height(),
				titleEls = container.find('.' + _self.get('titleCls')),
				bodyHeight = outerHeight;
			BUI.each(titleEls,function(element){
				bodyHeight -= $(element).outerHeight();
			});
			return bodyHeight;
		}
	});

	return Accordion;

});