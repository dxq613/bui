/**
 * @fileOverview 布局控件的基类
 * @ignore
 */

define('bui/layout/abstract',function(require){

	var BUI = require('bui/common');

	/**
	 * @class BUI.Layout.Abstract
	 * 控件布局插件的抽象类
	 * @extends BUI.Base
	 */
	var Abstract = function(config){
		Abstract.superclass.constructor.call(this,config);
	};

	BUI.extend(Abstract,BUI.Base);

	Abstract.ATTRS = {

		/**
		 * 子项对应的构造函数
		 * @type {Class}
		 */
		itemConstructor : {

		},
		/**
		 * 使用此插件的控件
		 * @type {BUI.Component.Controller}
		 */
		control : {

		},
		/**
		 * 内部选项
		 * @type {String}
		 */
		items : {

		},
		/**
		 * 布局容器上添加的样式
		 * @type {String}
		 */
		elCls : {

		},
		/**
		 * 放置布局的容器
		 * @type {jQuery}
		 */
		container : {

		},
		/**
		 * 布局相关的模板,将所有的子控件放置其中
		 * @type {String}
		 */
		tpl : {

		},
		/**
		 * 每一个布局子项
		 * @type {String}
		 */
		itemTpl : {
			value : '<div></div>'
		}
	}

	BUI.augment(Abstract,{

		initializer : function(control){
			var _self = this;
			_self.set('control',control);
		},
		renderUI : function(){
			this._initWraper();
			this.initItems();
		},
		//绑定宽度，高度发生改变的情形
		bindUI : function(){
			var _self = this,
				control = _self.get('control');

			control.on('afterWidthChange afterHeightChange',function(){
				_self.resetLayout();
			});

			control.on('afterAddChild',function(ev){
				var child = ev.child;
				_self.addItem(child);
				
			});

			control.on('afterRemoveChild',function(ev){
				_self.removeItem(ev.child);
			});
		},
		//初始化容器
	  _initWraper : function(){
	  	var _self = this,
	  		control = _self.get('control'),
	  		controlEl = control.get('view').get('contentEl'),
	  		node,
	  		elCls = _self.get('elCls'),
	  		tpl = _self.get('tpl');
	  	if(tpl){
	  		node = $(tpl).appendTo(controlEl);
	  	}else{
	  		node = controlEl;
	  	}
	  	if(elCls){
	  		node.addClass(elCls);
	  	}
	  	_self.set('container',node);
		},
		/**
		 * @private
		 * 初始化子项
		 */
		initItems : function(){
			var _self = this,
				control = _self.get('control'),
				items = [],
				controlChildren = control.get('children');
			for (var i = 0; i < controlChildren.length; i++) {
				items[i] = _self.initItem(controlChildren[i]);
			};
			_self.set('items',items);
		},
		/**
		 * @protected 
		 * 初始化子项
		 */
		initItem : function(controlChild){
			var _self = this,
				c = _self.get('itemConstructor'),
				cfg = BUI.mix({},controlChild.get('layout'));
			cfg.control = controlChild;
			cfg.tpl = _self.get('itemTpl');
			cfg.layout = _self;
			cfg.container = _self.get('container');
			return new c(cfg);
		},
		/**
		 * 添加布局项
		 * @protected
		 * @param {Object} controlChild 控件
		 */
		addItem : function(control){
			var _self = this,
				items = _self.getItems(),
				item = _self.initItem(control);
			items.push(item);
			return item;
		},
		/**
		 * 移除布局项
		 * @protected
		 * @param  {Object} controlChild 使用布局的控件的子控件
		 */
		removeItem : function(control){
			var _self = this,
			  items = _self.getItems(),
				item = _self.getItem(control);
			if(item){
				item.destroy();
				BUI.Array.remove(items,item);
			}
		},
		/**
		 * 获取布局选项
		 * @return {BUI.Layout.Item} 布局选项
		 */
		getItem : function(control){
			var _self = this,
				items = _self.getItems(),
				rst;
			BUI.each(items,function(item){
				if(item.get('control') == control){
					rst = item;
					return false;
				}
			});
			return rst;
		},
		/**
		 * 获取内部子项，不等同于children，因为可能有
		 * @return {Array} 返回布局的子项
		 */
		getItems : function(){
			return this.get('items');
		},
		/**
		 * @protected
		 * 重置布局，子类覆盖此类
		 */
		resetLayout : function(){
			var _self = this,
			 	items = _self.getItems();

			BUI.each(items,function(item){
				item.syncItem();
			});
		},
		/**
		 * 清除所有的布局
		 * @protected
		 */
		clearLayout : function(){
			var _self = this,
				items = _self.getItems();
			BUI.each(items,function(item){
				item.destroy();
			});
		},
		/**
		 * 重新布局
		 */
		reset: function(){
			this.resetLayout();
		},
		/**
		 * 析构函数
		 */
		destroy : function(){
			var _self = this;
			_self.clearLayout();
			_self.off();
			_self.clearAttrVals();
		}
	});

	return Abstract;
});