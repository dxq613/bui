/**
 * @fileOverview 布局模块的入口文件
 * @ignore
 */
(function(){
	var BASE = 'bui/layout/';
	define('bui/layout',['bui/common',BASE + 'abstract',BASE + 'absolute',BASE + 'anchor', BASE + 'flow',BASE + 'columns',BASE + 'table',
		BASE + 'border', BASE + 'accordion',BASE + 'viewport'],function (r) {

		var BUI = r('bui/common');

		var Layout = BUI.namespace('Layout');

		BUI.mix(Layout,{
			Abstract : r(BASE + 'abstract'),
			Anchor : r(BASE + 'anchor'),
			Flow : r(BASE + 'flow'),
			Columns : r(BASE + 'columns'),
			Table : r(BASE + 'table'),
			Border :r(BASE + 'border'), 
			Accordion : r(BASE + 'accordion'),
			Viewport : r(BASE + 'viewport')
		});

		return Layout;
	});

})();/**
 * @fileOverview 布局控件的基类
 * @ignore
 */

define('bui/layout/abstract',['bui/layout/baseitem'],function(require){

	var BUI = require('bui/common'),
		Item = require('bui/layout/baseitem');

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
		 * @type {Function}
		 */
		itemConstructor : {
			value : Item
		},
		/**
		 * 使用此插件的控件
		 * @type {BUI.Component.Controller}
		 */
		control : {

		},
		/**
		 * 控件的的那些事件会引起重新布局
		 * @type {Array}
		 */
		layoutEvents : {
			value : ['afterWidthChange','afterHeightChange']
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
		 * 放置控件的容器css
		 * @type {string}
		 */
		wraperCls : {

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
				control = _self.get('control'),
				layoutEvents = _self.get('layoutEvents').join(' ');

			control.on('afterAddChild',function(ev){
				var child = ev.child;
				_self.addItem(child);
				
			});

			control.on('afterRemoveChild',function(ev){
				_self.removeItem(ev.child);
			});
			
			control.on(layoutEvents,function(){
				_self.resetLayout();
			});

			
			_self.appendEvent(control);
		},
		/**
		 * @protected
		 * 附加事件
		 * @param  {Object} control 使用layout的控件
		 */
		appendEvent : function(control){

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
	  	_self.afterWraper();
		},
		/**
		 * @protected
		 * 容器初始化完毕开始渲染布局子项
		 */
		afterWraper : function(){

		},
		/**
		 * 通过DOM查找子项
		 * @param  {jQuery} element DOM元素
		 * @return {BUI.Layout.Item} 布局选项
		 */
		getItemByElement : function(element){
			return this.getItemBy(function(item){
				return $.contains(item.get('el')[0],element[0]);
			});
		},
		/**
		 * @protected
		 * 获取布局选项的容器
		 */
		getItemContainer : function(itemAttrs){
			return this.get('container');
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

			_self.set('items',items);

			for (var i = 0; i < controlChildren.length; i++) {
				_self.addItem(controlChildren[i]);
			};
			_self.afterInitItems();
			
		},
		/**
		 * 布局选项初始化完毕
		 * @protected
		 */
		afterInitItems : function(){

		},
		/**
		 * 获取下一项选项,如果当前项是最后一条记录，则返回第一条记录
		 * @param  {BUI.Layout.Item} item 选项
		 * @return {BUI.Layout.Item}  下一个选项
		 */
		getNextItem : function(item){
			var _self = this,
				index = _self.getItemIndex(item),
				count = _self.getCount(),
				next = (index + 1) % count;
			return _self.getItemAt(next);
		},
		/**
		 * @protected
		 * 返回子项的配置信息
		 * @param {Object}  controlChild 包装的控件
		 * @return {Object} 配置信息
		 */
		getItemCfg : function(controlChild){
			var _self = this,
				cfg = BUI.mix({},controlChild.get('layout'));
			cfg.control = controlChild;
			cfg.tpl = _self.get('itemTpl');
			cfg.layout = _self;
			cfg.wraperCls = _self.get('wraperCls');
			cfg.container = _self.getItemContainer(cfg);

			return cfg;
		},
		/**
		 * @protected 
		 * 初始化子项
		 */
		initItem : function(controlChild){
			var _self = this,
				c = _self.get('itemConstructor'),
				cfg = _self.getItemCfg(controlChild);

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
		 * 通过匹配函数获取布局选项
		 * @param  {Function} fn 匹配函数
		 * @return {BUI.Layout.Item} 布局选项
		 */
		getItemBy : function(fn){
			var _self = this,
				items = _self.getItems(),
				rst = null;

			BUI.each(items,function(item){
				if(fn(item)){
					rst = item;
					return false;
				}
			});
			return rst;
		},
		/**
		 * 通过匹配函数获取布局选项集合
		 * @param  {Function} fn 匹配函数
		 * @return {Array} 布局选项集合
		 */
		getItemsBy : function(fn){
			var _self = this,
				items = _self.getItems(),
				rst = [];

			BUI.each(items,function(item){
				if(fn(item)){
					rst.push(item);
				}
			});
			return rst;
		},
		/**
		 * 获取布局选项
		 * @param {Object} controlChild 子控件
		 * @return {BUI.Layout.Item} 布局选项
		 */
		getItem : function(control){
			return this.getItemBy(function(item){
				return item.get('control') == control;
			});
		},
		/**
		 * 返回子项的数目
		 * @return {Number} 数目
		 */
		getCount : function(){
			return this.getItems().length;
		},
		/**
		 * 根据索引返回选项
		 * @return {BUI.Layout.Item}} 返回选项
		 */
		getItemAt : function(index){
			return this.getItems()[index];
		},
		/**
		 * 获取索引
		 * @param  {BUI.Layout.Item} item 选项
		 * @return {Number} 索引
		 */
		getItemIndex : function(item){
			var items = this.getItems();
			return BUI.Array.indexOf(item,items);
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
/**
 * @fileOverview 布局内部存在可折叠的项
 * @ignore
 */

define('bui/layout/collapsable',function (require) {

	/**
	 * @class BUI.Layout.Collapsable
	 * 可以展开、折叠的布局的扩展类
	 */
	var Collapsable = function(){

	};

	Collapsable.ATTRS = {

		/**
		 * 触发展开折叠的样式
		 * @type {String}
		 */
		triggerCls : {
			
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
			value : false
		}

	};

	BUI.augment(Collapsable,{
		//绑定展开折叠事件
		bindCollapseEvent : function(){
			var _self = this,
				triggerCls = _self.get('triggerCls'),
				el = _self.get('container');
			el.delegate('.' + triggerCls,'click',function(ev){
				var sender = $(ev.currentTarget),
					item = _self.getItemByElement(sender);
				_self.toggleCollapse(item);
			});
		},
		/**
		 * 获取展开的选项
		 * @return {BUI.Layout.Item} 选项
		 */
		getExpandedItem : function(){
			return this.getItemBy(function(item){
				return !item.get('collapsed')
			});
		},
		/**
		 * 展开
		 * @param  {BUI.Layout.Item} item 选项
		 */
		expandItem : function(item){
			var _self = this,
				duration = _self.get('duration'),
				range = _self.getCollapsedRange(item),
				activeItem;
			if(item.get('collapsed')){
				if(_self.get('accordion')){ //如果是互斥的收缩，将展开的收缩掉
					activeItem = _self.getExpandedItem();
					if(activeItem){
						_self.beforeCollapsed(activeItem,range);
						activeItem.collapse(duration,function(){
							_self.afterCollapsed(activeItem);
						});
					}
				}
				_self.beforeExpanded(item,range);
				item.expand(range,duration,function(){
					_self.afterExpanded(item);
				});
			}
		},
		/**
		 * 展开选项后
		 */
		afterExpanded : function(item){

		},
		/**
		 * 展开选项前
		 */
		beforeExpanded : function(item,range){

		},
		/**
		 * 收缩
		 * @param  {BUI.Layout.Item} item 选项
		 */
		collapseItem : function(item){
			var _self = this,
				duration = _self.get('duration'),
				range = _self.getCollapsedRange(item),
				nextItem;
			if(!item.get('collapsed')){
				if(_self.get('accordion')){ //如果是互斥的收缩，展开下一项
					nextItem = _self.getNextItem(item);
					_self.beforeExpanded(nextItem,range);
					nextItem.expand(range,duration,function(){
						_self.afterExpanded(nextItem);
					});
				}
				_self.beforeCollapsed(item,range);
				item.collapse(duration,function(){
					_self.afterCollapsed(item);
				});
			}
		},
		/**
		 * 折叠选项前
		 */
		beforeCollapsed : function(item,range){

		},
		/**
		 * 折叠选项后
		 */
		afterCollapsed : function(item){

		},
		/**
		 * @protected
		 * 获取折叠的数值范围
		 * @return {Number} 获取折叠的数值范围
		 */
		getCollapsedRange : function(item){

		},
		/**
		 * 展开折叠选项
		 * @param  {BUI.Layout.Item} item 选项
		 */
		toggleCollapse : function(item){
			var _self = this;
			if(item.get('collapsed')){
				_self.expandItem(item);
			}else{
				_self.collapseItem(item);
			}
		}
	});

	return Collapsable;
});/**
 * @fileOverview 绝对位置布局
 * @ignore
 */

define('bui/layout/absolute',['bui/layout/abstract','bui/layout/absoluteitem'],function (require) {

	var CLS_RELATIVE = 'x-layout-relative',
		BUI = require('bui/common'),
		Abstract = require('bui/layout/abstract'),
		AbsoluteItem = require('bui/layout/absoluteitem');

	/**
	 * @class BUI.Layout.Absolute
	 * 绝对位置布局控件
	 * @extends BUI.Layout.Abstract
	 */
	var Absolute = function(config){
		Absolute.superclass.constructor.call(this,config);
	};

	Absolute.ATTRS = {
		itemConstructor : {
			value : AbsoluteItem
		},
		/**
		 * 标示布局的控件
		 * @type {String}
		 */
		elCls : {
			value : CLS_RELATIVE
		},
		/**
		 * 布局相关的模板,将所有的子控件放置其中
		 * @type {String}
		 */
		tpl : {

		},
		itemTpl : {
			value : '<div class="x-layout-item-absolute"></div>'
		}
	};

	BUI.extend(Absolute,Abstract);

	return Absolute;
});/**
 * @fileOverview 锚定布局，根据容器的边缘自动计算宽高
 * @ignore
 */

define('bui/layout/anchor',['bui/layout/abstract','bui/layout/anchoritem'],function (require) {
	var BUI = require('bui/common'),
		Abstract = require('bui/layout/abstract'),
		Item = require('bui/layout/anchoritem');
	
	/**
	 * @class BUI.Layout.Anchor
	 * 锚定布局控件
	 * @extends BUI.Layout.Abstract
	 */
	var Anchor = function(config){
		Anchor.superclass.constructor.call(this,config)
	};

	Anchor.ATTRS = {
		itemConstructor : {
			value : Item
		},
		itemTpl : {
			value : '<div class="x-layout-item"></div>'
		}
	};

	BUI.extend(Anchor,Abstract);

	return Anchor;
});/**
 * @fileOverview 列模式布局
 * @ignore
 */

define('bui/layout/columns',['bui/layout/abstract'],function (require) {
	
	var BUI = require('bui/common'),
		Abstract = require('bui/layout/abstract');

	function formatPercent(num){
		return (num * 100) + '%';
	}

	/**
	 * @class BUI.Layout.Columns
	 * 列模式布局
	 * @extends BUI.Layout.Abstract
	 */
	var Columns = function(config){
		Columns.superclass.constructor.call(this,config);
	};

	Columns.ATTRS = {
		/**
		 * 列的数目,每列的宽度平均计算
		 * @type {Number}
		 */
		columns : {
			value : 1
		},
		/**
		 * 列的模板
		 * @type {String}
		 */
		columnTpl : {
			value : '<div class="x-layout-column"></div>'
		},
		tpl : {
			value : '<div class="x-layout-columns"></div>'
		},
		itemTpl : {
			value : '<div class="x-layout-item-column"></div>'
		}
	};

	BUI.extend(Columns,Abstract);

	BUI.augment(Columns,{

		/**
		 * @protected
		 * 覆写重新布局方法
		 */
		resetLayout : function(){
			var _self = this;
			_self._setColumnsWidth();
			Columns.superclass.resetLayout.call(_self);
		},
		/**
		 * 移动选项到位置
		 * @param  {Number} to 位置,位置从0开始
		 */
		moveItem : function(item,to){
			var _self = this,
				itemContainer;
			if(to >= _self.get('columns') || to < 0){
				return;
			}

			item.set('col',to);
			itemContainer = _self.getItemContainer({col : to});
			item.set('container',itemContainer);
			item.get('el').appendTo(itemContainer);
		},
		/**
		 * @protected
		 * 容器初始化完毕开始渲染布局子项
		 */
		afterWraper : function(){
			var _self = this,
				columns = _self.get('columns'),
				container = _self.get('container'),
				arr = [];
			for (var i = 0; i < columns; i++) {
				arr.push(_self.get('columnTpl'));
			};
			container.html(arr.join(''));

			_self._setColumnsWidth();
		},
		//获取平均宽度
		_setColumnsWidth : function(){
			var _self = this,
				container = _self.get('container'),
				children = container.children(),
				containerWidth = container.width(),
				avgWidth = parseInt(containerWidth / children.length,10),
				left = 0;

			BUI.each(children,function(item){
				var node = $(item),
					appendWidth = node.outerWidth() - node.width();
				node.width(avgWidth - appendWidth);
			});
		},
		/**
		 * @protected
		 * 获取布局选项的容器
		 */
		getItemContainer : function(itemAttrs){
			var _self = this,
				items = _self.get('items'),
				columns = _self.get('columns'),
				container = this.get('container');
			if(itemAttrs.col === undefined){
				itemAttrs.col = items.length % columns;
			}
			return $(container.find('.x-layout-column')[itemAttrs.col]);
		}
	});

	return Columns;
});/**
 * @fileOverview 浮动布局，所有的元素float:left
 * @ignore
 */

define('bui/layout/flow',['bui/layout/abstract','bui/layout/baseitem'],function (require) {
	var BUI = require('bui/common'),
		Abstract = require('bui/layout/abstract'),
		Item = require('bui/layout/baseitem');
	
	/**
	 * @class BUI.Layout.Flow
	 * 流布局控件
	 * @extends BUI.Layout.Abstract
	 */
	var Flow = function(config){
		Flow.superclass.constructor.call(this,config)
	};

	Flow.ATTRS = {
		itemConstructor : {
			value : Item
		},
		itemTpl : {
			value : '<div class="x-layout-item-flow pull-left"></div>'
		}
	};

	BUI.extend(Flow,Abstract);

	return Flow;
});/**
 * @fileOverview 表格布局
 * @ignore
 */

define('bui/layout/table',['bui/layout/abstract','bui/layout/cellitem'],function (require) {

	var BUI = require('bui/common'),
		Abstract = require('bui/layout/abstract'),
		Item = require('bui/layout/cellitem');

	/**
	 * @class BUI.Layout.Table
	 * 表格布局
	 * @extends BUI.Layout.Abstract
	 */
	var Table = function(config){
		Table.superclass.constructor.call(this,config);
	};

	Table.ATTRS = {
		itemConstructor : {
			value : Item
		},
		/**
		 * @private
		 * @ignore
		 * lastRow 当前最后一行的值
		 */
		lastRow : {
			value : 0
		},
		/**
		 * 布局的模板
		 * @type {String}
		 */
		tpl : {
			value : '<table class="x-layout-table"><tbody></tbody></table>'
		},
		/**
		 * 列的数目
		 * @type {Number}
		 */
		columns : {

		},
		/**
		 * Number
		 * @type {Object}
		 */
		rows : {

		},
		/**
		 * 单元格的模板
		 * @type {String}
		 */
		itemTpl : {
			value : '<td class="x-layout-item-cell"></td>'
		}
	};

	BUI.extend(Table,Abstract);

	BUI.augment(Table,{
		
		/**
		 * @protected
		 * 容器初始化完毕开始渲染布局子项
		 */
		afterWraper : function(){
			var _self = this,
				rows = _self.get('rows'),
				container = _self.get('container'),
				arr = [];
			for (var i = 0; i < rows; i++) {
				arr.push('<tr></tr>');
			};
			container.find('tbody').html(arr.join(''));
		},
		/**
		 * @protected
		 * 获取布局选项的容器
		 */
		getItemContainer : function(itemAttrs){
			var _self = this,
				container = this.get('container');
			return $(container.find('tr')[itemAttrs.row]);
		}
	});

	return Table;

});/**
 * @fileOverview 经典的边框布局
 * @ignore
 */
define('bui/layout/border',['bui/layout/abstract','bui/layout/borderitem','bui/layout/collapsable'],function(require) {

	var BUI = require('bui/common'),
		Abstract = require('bui/layout/abstract'),
		Item = require('bui/layout/borderitem'),
		Collapsable = require('bui/layout/collapsable'),
		CLS_TOP = 'x-border-top',
		CLS_MIDDLE = 'x-border-middle',
		CLS_BOTTOM = 'x-border-bottom',
		REGINS = Item.REGINS;

	/**
	 * @class BUI.Layout.Border
	 * 边框布局
	 * @extends BUI.Layout.Abstract
	 */
	var Border = function(config){
		Border.superclass.constructor.call(this,config);
	};

	Border.ATTRS = {
		/**
		 * 控件的的那些事件会引起重新布局
		 * @type {Array}
		 */
		layoutEvents : {
			value : ['afterAddChild','afterRemoveChild']
		},
		itemConstructor : {
			value : Item
		},
		wraperCls : {
			value : 'x-border-body'
		},
		duration : {
			value : 200
		},
		/**
		 * 触发展开折叠的样式
		 * @type {String}
		 */
		triggerCls : {
			value : 'x-collapsed-btn'
		},
		tpl : {
			value : '<div class="x-layout-border">\
					<div class="' + CLS_TOP + '"></div>\
					<div class="' + CLS_MIDDLE + '"></div>\
					<div class="' + CLS_BOTTOM + '"></div>\
				</div>'
		},
		itemTpl : {
			value : '<div class="x-border-{region} x-layout-item-border"><div class="x-border-body"></div></div>'
		}
	};

	BUI.extend(Border,Abstract);

	BUI.mixin(Border,[Collapsable]);

	BUI.augment(Border,{

		/**
		 * @protected
		 * 附加事件
		 * @param  {Object} control 使用layout的控件
		 */
		appendEvent : function(){
			this.bindCollapseEvent(); //绑定收缩事件
		},
		/**
		 * @protected
		 * 容器初始化完毕开始渲染布局子项
		 */
		afterWraper : function(){
			var _self = this,
				container = _self.get('container'),
				topEl = container.find('.' + CLS_TOP),
				middleEl = container.find('.' + CLS_MIDDLE),
				bottomEl = container.find('.' + CLS_BOTTOM);

			_self.set('topEl',topEl);
			_self.set('middleEl',middleEl);
			_self.set('bottomEl',bottomEl);
		},
		/**
		 * 布局选项初始化完毕
		 * @protected
		 */
		afterInitItems : function(){
			this._setMiddleDimension();
		},
		//设置中间部分的高度和margin,
		_setMiddleDimension : function(){
			var _self = this,
				middleEl = _self.get('middleEl'),
				middleHeight = _self._getMiddleHeight(),
				left = _self._getMiddleLeft(),
				right = _self._getMiddleRight(),
				items = _self.get('items'),
				center = _self.getItemsByRegion('center')[0];
			middleEl.height(middleHeight);
			if(center){
				var el = center.get('el');
				el.css({'marginLeft':left,'marginRight' : right});
			}
			_self._fitMiddleControl();
		},
		//自适应中间部分的控件，高度、宽度
		_fitMiddleControl : function(){
			var _self = this,
				items = _self.getItems();
			BUI.each(items,function(item){
				var region = item.get('region');
				if(region == REGINS.EAST || region == REGINS.WEST || region == REGINS.CENTER){
					item.syncFit();
				}
			});
		},
		//获取中间位置的高度
		_getMiddleHeight : function(){
			var _self = this,
				container = _self.get('container'),
				totalHeight = container.height(),
				middleEl = _self.get('middleEl'),
				topEl = _self.get('topEl'),
				appendHeight,
				middleHeight;
			if(topEl.children().length){
				middleHeight = totalHeight - topEl.outerHeight() - _self.get('bottomEl').outerHeight();
			}else{
				middleHeight = totalHeight - _self.get('bottomEl').outerHeight();
			}
			 
			appendHeight = middleEl.outerHeight() - middleEl.height();

			return middleHeight - appendHeight;
		},
		/**
		 * 获取选项，根据位置类型
		 * @param  {String} region 类型
		 * @return {Array}  选项集合
		 */
		getItemsByRegion : function(region){
			return  this.getItemsBy(function(item){
					return item.get('region') === region;
			});
		},
		//获取中间部分左边的宽度
		_getMiddleLeft : function(){
			var _self = this,
				westItems = _self.getItemsByRegion('west'),
				leftWidth = 0;
				BUI.each(westItems,function(item){
					leftWidth += item.get('el').outerWidth();
				});
			return leftWidth;
		},
		//获取中间部分右边的宽度
		_getMiddleRight : function(){
			var _self = this,
				eastItems = _self.getItemsByRegion('east'),
				rightWidth = 0;
				BUI.each(eastItems,function(item){
					rightWidth += item.get('el').outerWidth();
				});
			return rightWidth;
		},
		/**
		 * @protected
		 * 获取布局选项的容器
		 */
		getItemContainer : function(itemAttrs){
			var _self = this,
				rst;
			switch(itemAttrs.region){
				case REGINS.NORTH : 
					rst = _self.get('topEl');
					break;
				case REGINS.SOUTH : 
					rst = _self.get('bottomEl');
				  break;
				default : 
					rst = _self.get('middleEl');
					break;
			}
			return rst;
		},
		/**
		 * 展开选项前
		 */
		beforeExpanded : function(item,range){
			this.beforeCollapsedChange(item,range,false);
		},
		//收缩展开前
		beforeCollapsedChange : function(item,range,collapsed){
			var _self = this,
				property = item.getCollapseProperty(),
				factor = collapsed ? 1 : -1,
				duration = _self.get('duration');
			if(property == 'height'){
				_self._setMiddleHeight(range * factor,duration);
			}else{
				_self._setCenterWidth(item.get('region'),range * factor * -1,duration);
			}

		},
		//设置中间的高度
		_setMiddleHeight : function(range,duration){
			var _self = this,
				middleEl = _self.get('middleEl'),
				preHeight = middleEl.height(),
				height = preHeight + range;

			middleEl.animate({height : height},duration);
			
		},
		//设置中间的宽度
		_setCenterWidth : function(region,range,duration){
			var _self = this,
				center = _self.getItemsByRegion('center')[0],
				property = region == REGINS.EAST ? 'marginRight' : 'marginLeft',
				centerEl,
				prev,
				css = {};
			if(center){
				centerEl = center.get('el');
			}
			prev = parseFloat(centerEl.css(property));
			css[property] = range + prev;
			centerEl.animate(css,duration);
		},
		/**
		 * @protected
		 * @ignore
		 * 获取折叠的长度或者宽度
		 */
		getCollapsedRange : function(item){
			return item.getCollapsedRange();
		},
		/**
		 * 折叠选项后
		 */
		beforeCollapsed : function(item,range){
			this.beforeCollapsedChange(item,range,true);
		},
		/**/
		afterExpanded : function(){
			if(BUI.UA.ie == 6){
				return;
			}
			this._fitMiddleControl();
		},
		afterCollapsed : function(){
			if(BUI.UA.ie == 6){
				return;
			}
			this._fitMiddleControl();
		},
		/**
		 * @protected
		 * 覆写重新布局方法
		 */
		resetLayout : function(){
			var _self = this;
			
			Border.superclass.resetLayout.call(_self);
			_self._setMiddleDimension();
		}

	});

	return Border;
});
/**
 * @fileOverview 可折叠的布局，只能展开一个选项内容
 * @ignore
 */

define('bui/layout/accordion',['bui/layout/abstract','bui/layout/tabitem','bui/layout/collapsable'],function (require) {
	
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

});/**
 * @fileOverview 全屏容器，一般情况下用于布局
 * @ignore
 */

define('bui/layout/viewport',function (require) {

	var BUI = require('bui/common'),
		CLS_VIEW_CONTAINER = 'x-viewport-container',
		UA = BUI.UA,
		win = window;

	/**
	 * @class BUI.Layout.Viewport
	 * 窗口试图控件，通常使用布局插件
	 * @extends BUI.Component.Controller
	 */
	var Viewport = BUI.Component.Controller.extend({
		renderUI : function(){
			this.reset();
			var _self = this,
				render = _self.get('render');
			$(render).addClass(CLS_VIEW_CONTAINER);
		},
		bindUI : function(){
			var _self = this;
			$(win).on('resize',BUI.wrapBehavior(_self,'onResize'));
		},
		onResize : function(){
			this.reset();
		},
		/**
		 * 重新适应窗口大小
		 */
		reset : function(){
			var _self = this,
				el = _self.get('el'),
				viewportHeight = BUI.viewportHeight(), //ie6,7下问题
				viewportWidth = BUI.viewportWidth(),
				appendWidth = _self.getAppendWidth(),
				appendHeight = _self.getAppendHeight();
			_self.set('width',viewportWidth - appendWidth);
			_self.set('height',viewportHeight - appendHeight);

		},
		destructor : function(){
			$(win).off('resize',BUI.getWrapBehavior(this,'onResize'));
		}
	},{
		ATTRS : {
			render : {
				value : 'body'
			}
		}
	},{
		xclass : 'view-port'
	});

	return Viewport;

});

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
		 * 自适应内部控件,自适应的类型：
		 *   - none : 内部控件不自适应（默认）
		 *   - width : 内部控件自适应宽度，当layout重新布局时宽度自适应
		 *   - height : 内部控件自适应高度，当layout重新布局时高度自适应
		 *   - both : 内部控件自适应宽高，当layout重新布局时宽度、高度自适应
		 * @type {String}
		 */
		fit : {
			value : 'none'
		},
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
		 * 封装控件的容器的样式，默认为空
		 * @type {string}
		 */
		wraperCls : {

		},
		/**
		 * 容器
		 * @type {jQuery}
		 */
		container : {

		},
		/**
		 * 如果srcNode指定，那么不会使用container属性，也不会生成DOM
		 * @type {jQuery}
		 */
		srcNode : {

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
		 * 状态相关的字段
		 * @type {Array}
		 */
		statusProperties : {

		},
		/**
		 * 附加模板
		 * @type {Object}
		 */
		tplProperties : {

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
				tpl = BUI.substitute(_self.get('tpl'),_self.getLayoutAttrs()) ,
				node = $(tpl).appendTo(container),
				bodyEl;
			if(elCls){
				node.addClass(elCls);
			}
			bodyEl = _self.getControlContainer(node);
			controlEl.appendTo(bodyEl);
			_self.set('bodyEl',bodyEl);

			return node;
		},
		/**
		 * 获取内部控件的容器
		 * @return {jQuery} 容器
		 */
		getControlContainer : function(el){
			var _self = this,
				wraperCls = _self.get('wraperCls');
			if(wraperCls){
				return el.find('.' + wraperCls);
			}
			return el;
		},
		/**
		 * 同步属性到子项,同步css和attr
		 */
		syncItem : function(attrs){
			attrs = attrs || this.getLayoutAttrs();
			var _self = this,
				el = _self.get('el'),
				css = _self._getSyncCss(attrs),
				attr = _self._getSyncAttr(attrs);
			
			el.css(css);
			el.attr(attr);
			_self.syncStatus(el,attrs); //同步状态
			_self.syncElements(el,attrs); //同步DOM元素
			_self.syncFit(); //同步内部控件的宽高
		},
		/**
		 * 根据属性附加一些元素
		 * @protected
		 */
		syncElements : function(el,attrs){
			var _self = this,
				tplProperties = _self.get('tplProperties');

			if(tplProperties){
				BUI.each(tplProperties,function(item){
					_self.synTpl(el,item,attrs);
				});
			}
		},
		/**
		 * @protected
		 * 同步选项
		 */
		synTpl : function(el,item,attrs){
			var _self = this,
				name = item.name,
				elName = '_'+name + 'El', //title 使用_titleEl作为临时变量存储对应的DOM 
				tpl,
				m, //使用的附加方法
				tplEl = _self.get(elName);
			if(attrs[name]){
				if(!tplEl){
					tpl = _self.get(item.value);
					tpl = BUI.substitute(tpl,attrs);
					m = item.prev ? 'prependTo' : 'appendTo';
					tplEl = $(tpl)[m](el);
					_self.set(elName,tplEl);
				}
			}else if(tplEl){
				tplEl.remove();
			}
		},
		/**
		 * @protected
		 * 同步状态
		 */
    syncStatus : function(el,attrs){
    	el = el || this.get('el');
    	attrs = attrs || this.getLayoutAttrs();
    	var _self = this,
    		statusProperties = _self.get('statusProperties');
    	if(statusProperties){
    		BUI.each(statusProperties,function(status){
    			var value = _self.get(status);
    			if(value != null){
    				var m = value ? 'addClass' : 'removeClass',
    					cls = 'x-' + status;
    				el[m](cls);
    			}
    		});
    	}
		},
		/**
		 * 同步自适应
		 */
		syncFit : function(){
			var _self = this,
				control = _self.get('control'),
				fit = _self.get('fit');
			if(fit === 'none'){
				return;
			}
			if(fit === 'width'){
				_self._syncControlWidth(control);
				return;
			}
			if(fit === 'height'){
				_self._syncControlHeight(control);
				return;
			}
			if(fit === 'both'){
				_self._syncControlWidth(control);
				_self._syncControlHeight(control);
			}
		},
		//同步控件的宽度
		_syncControlWidth : function(control){
			var _self = this,
				width = _self.get('el').width(),
				appendWidth = control.getAppendWidth();
			control.set('width',width - appendWidth);

		},
		//同步控件的高度
		_syncControlHeight : function(control){
			var _self = this,
				height = _self._getFitHeight(),
				appendHeight = control.getAppendHeight();
			control.set('height',height - appendHeight);
		},
		_getFitHeight : function(){
			var _self = this,
				el = _self.get('el'),
				bodyEl = _self.get('bodyEl'),
				siblings,
				outerHeight = el.height(),
				height = outerHeight;
			if(bodyEl[0] == el[0]){ //如果控件的容器等于外层容器
				return outerHeight;
			}
			siblings = bodyEl.siblings(); //获取外层容器减去兄弟元素的高度
			BUI.each(siblings,function(elem){
				var node = $(elem);
				if(node.css('position') !== 'absolute'){
					height -= node.outerHeight();
				}
			});
			return height;
		},
		/**
		 * @protected
		 * 获取布局相关的属性
		 * @return {Object} 获取布局相关的属性
		 */
		getLayoutAttrs : function(){
			return this.getAttrVals();
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
});/**
 * @fileOverview 绝对布局的布局项
 * @ignore
 */

define('bui/layout/absoluteitem',['bui/layout/baseitem'],function (require) {
	
	var BUI = require('bui/common'),
		Base = require('bui/layout/baseitem');

	/**
	* @class BUI.Layout.Item.Absolute
	* 绝对布局的布局项
	* @extends BUI.Layout.Item
	*/
	var AbsoluteItem = function(config){
		AbsoluteItem.superclass.constructor.call(this,config);
	};

	BUI.extend(AbsoluteItem,Base);

	AbsoluteItem.ATTRS = {

		/**
		 * @protected
		 * 同步的css属性
		 * @type {Array}
		 */
		cssProperties : {
			value : ['top','left','bottom','right']
		}
		
		/**
		 * top 位置
		 * @cfg {Number} top
		 */
		
		/**
		 * left 位置
		 * @cfg {Number} left
		 */
		
		/**
		 * bottom 位置
		 * @cfg {Number} bottom
		 */
		
		/**
		 * right 位置
		 * @cfg {Number} right
		 */
		
	};

	BUI.augment(AbsoluteItem,{

		
	});

	return AbsoluteItem;
});/**
 * @fileOverview 锚定容器的布局项
 * @ignore
 */

define('bui/layout/anchoritem',['bui/layout/baseitem'],function (require) {

	var BUI = require('bui/common'),
		Base = require('bui/layout/baseitem');

	//转换anchor的值
	function parseValue(value,type){
		if(BUI.isNumber(value)){
			if(value > 0){ //大于0的正数，返回
				return value;
			}else{
				return '{' + type + '}' + value;
			}
		}
		if(BUI.isString(value) && value.indexOf('-') == 0){
			return '{' + type + '}' + value;
		}
		return value;
	}
	/**
	 * @class BUI.Layout.Item.Anchor
	 * 锚定布局项
	 */
	var Anchor = function(config){
		Anchor.superclass.constructor.call(this,config);
	};

	Anchor.ATTRS = {
		/**
		 * 锚定容器的方式，有以下几种方式：
		 *
		 *  - 默认方式： ['100%'] 宽度100%,高度auto
		 *  - 指定宽高： ['100%','50%'] 宽100%, 高 100%
		 *  - 指定数值:  [100,100] 宽高都是100
		 *  - 指定负数:  [-100,-50] 容器宽度减去100,宽度高度减去 50
		 * @type {Array}
		 */
		anchor : {
			value : ['100%']
		}
	};

	BUI.extend(Anchor,Base);

	BUI.augment(Anchor,{

		/**
		 * @protected
		 * @override
		 * @ignore
		 * 覆盖返回的布局相关的属性
		 */
		getLayoutAttrs : function(){
			var _self = this,
				anchor = _self.get('anchor'),
				attrs = BUI.mix({},_self.getAttrVals()),
				width = anchor[0],
				height = anchor[1];

			attrs.width = parseValue(width,'width');
			attrs.height = parseValue(height,'height');

			return attrs;
		}
	});

	return Anchor;
});/**
 * @fileOverview 边框布局选项
 * @ignore
 */

define('bui/layout/borderitem',function (require) {
	var BUI = require('bui/common'),
		Base = require('bui/layout/baseitem'),
		CLS_COLLAPSED = 'x-collapsed',
		REGINS = {
			NORTH : 'north',
			EAST : 'east',
			SOUTH : 'south',
			WEST : 'west',
			CENTER : 'center'
		};
		

	/**
	 * 边框布局选项
	 * @class BUI.Layout.Item.Border
	 * @extends BUI.Layout.Item
	 */
	var Border = function(config){
		Border.superclass.constructor.call(this,config);
	};

	Border.ATTRS = {

		/**
		 * 位置
		 * @type {String}
		 */
		region : {

		},
		/**
		 * 标题的模板
		 * @type {Object}
		 */
		titleTpl : {
			value : '<div class="x-border-title x-border-title-{region}">{title}</div>'
		},
		/**
		 * 附加元素
		 * @type {Object}
		 */
		collapseTpl : {
			value : '<s class="x-collapsed-btn x-collapsed-{region}"></s>'
		},
		/**
		 * 是否可以折叠
		 * @type {String}
		 */
		collapsable : {
			value : false
		},
		/**
		 * 是否折叠
		 * @type {String}
		 */
		collapsed : {
			value : false
		},
		/**
		 * 收缩后剩余的宽度或者高度，如果存在title，则以title的高度为准
		 * @type {Object}
		 */
		leftRange : {
			value : 28
		},
		/**
		 * 附加模板
		 * @type {Object}
		 */
		tplProperties : {
			value : [
				{name : 'title',value : 'titleTpl',prev : true},
				{name : 'collapsable',value : 'collapseTpl',prev : true}
			]
		},
		statusProperties : {
			value : ['collapsed']
		}
	};

	Border.REGINS = REGINS;

	BUI.extend(Border,Base);

	BUI.augment(Border,{
		/**
		 * 根据属性附加一些元素
		 * @protected
		 */
		syncElements : function(el,attrs){
			Border.superclass.syncElements.call(this,el,attrs);
			var _self = this,
				el = _self.get('el'),
				property = _self.getCollapseProperty();
			if(_self.get('collapsed') && _self.get(property) == el[property]()){
				_self.collapse(0);
			}
		},
		/**
		 * 展开
		 */
		expand : function(range,duration,callback){
			var _self = this,
				property = _self.getCollapseProperty(),
				el = _self.get('el'),
				toRange = _self.get(property),
				css = {};
			css[property] = toRange;

			el.animate(css,duration,function(){
				_self.set('collapsed',false);
				el.removeClass(CLS_COLLAPSED);
				callback && callback();
			});
		},
		//获取折叠的属性，width,length
		getCollapseProperty : function(){
			var _self = this,
				region = _self.get('region');
			if(region == REGINS.SOUTH || region == REGINS.NORTH){
				return 'height';
			}
			return 'width';
		},
		//获取剩余的宽度或者高度
		_getLeftRange : function(){
			var _self = this,
				el = _self.get('el'),
				left = _self.get('leftRange'),
				titleEl = _self.get('_titleEl');
			return left;
		},
		/**
		 * @protected
		 * @ignore
		 */
		getCollapsedRange : function(){
			var _self = this,
				property = _self.getCollapseProperty(),
				el = _self.get('el');
			return _self.get(property) - _self._getLeftRange(property);
		},
		/**
		 * 折叠
		 */
		collapse : function(duration,callback){
			var _self = this,
				property = _self.getCollapseProperty(),
				el = _self.get('el'),
				left = _self._getLeftRange(property),
				css = {};
			css[property] = left;
			el.animate(css,duration,function(){
				_self.set('collapsed',true);
				el.addClass(CLS_COLLAPSED);
			  if(callback){
			  	callback();
			  }
			});
		}
	});



	return Border;
});/**
 * @fileOverview 表格布局的项，是一个个的单元格
 * @ignore
 */

define('bui/layout/cellitem',['bui/layout/baseitem'],function (require) {

	var BUI = require('bui/common'),
		Base = require('bui/layout/baseitem');

	/**
	 * @class BUI.Layout.Item.Cell
	 * 表格布局的子项
	 * @extends BUI.Layout.Item
	 */
	var Cell = function(config){
		Cell.superclass.constructor.call(this,config);
	};

	Cell.ATTRS = {

		/**
		 * 所属的行,需要指定行，便于计算，列根据顺序决定
		 * @cfg {Number} row
		 */
		row : {

		},
		/**
		 * 占据的行
		 * @type {Number}
		 */
		rowspan : {
			value : 1
		},
		/**
		 * 列
		 * @type {Number}
		 */
		colspan : {
			value : 1
		},
		/**
		 * 使用的属性字段
		 * @type {Array}
		 */
		attrProperties : {
			value : ['rowspan','colspan']
		},
		/**
		 * 占用的单元格个数
		 * @type {Number}
		 */
		cells : {
			getter : function(){
				return this.get('rowspan') * this.get('colspan');
			}
		}
	};

	BUI.extend(Cell,Base);

	BUI.augment(Cell,{

	});

	return Cell;
});/**
 * @fileOverview 可以收缩的选项
 * @ignore
 */

define('bui/layout/tabitem',['bui/layout/baseitem'],function(require) {

	var BUI = require('bui/common'),
		CLS_COLLAPSED = 'x-collapsed',
		Base = require('bui/layout/baseitem');

	/**
	 * @class BUI.Layout.Item.Tab
	 * 可收缩的选项
	 * @extends BUI.Layout.Item
	 */
	var Tab = function(config){
		Tab.superclass.constructor.call(this,config);
	};

	Tab.ATTRS = {
		/**
		 * 收缩状态
		 * @type {Object}
		 */
		collapsed : {
			value : true
		},
		statusProperties : {
			value : ['collapsed']
		}
	};

	BUI.extend(Tab,Base);

	BUI.augment(Tab,{

		/**
		 * 展开
		 */
		expand : function(bodyHeight,duration){
			var _self = this,
				el = _self.get('el'),
				bodyEl = _self.get('bodyEl');
			bodyEl.animate({height : bodyHeight},duration,function(){
				_self.set('collapsed',false);
				el.removeClass(CLS_COLLAPSED);
			});
		},
		/**
		 * 折叠
		 */
		collapse : function(duration){
			var _self = this,
				el = _self.get('el'),
				bodyEl = _self.get('bodyEl');
			bodyEl.animate({height : 0},duration,function(){
				_self.set('collapsed',true);
				el.addClass(CLS_COLLAPSED);
			});
		}
	});

	return Tab;
});