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
			Absolute : r(BASE + 'absolute'),
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

define('bui/layout/abstract',['bui/common','bui/layout/baseitem'],function(require){

	var BUI = require('bui/common'),
		Item = require('bui/layout/baseitem');

	/**
	 * @class BUI.Layout.Abstract
	 * 控件布局插件的抽象类，此插件不要直接使用
	 * @extends BUI.Base
	 */
	var Abstract = function(config){
		Abstract.superclass.constructor.call(this,config);
	};

	BUI.extend(Abstract,BUI.Base);

	Abstract.ATTRS = {

		/**
		 * 子项对应的构造函数
		 * @protected
		 * @type {Function}
		 */
		itemConstructor : {
			value : Item
		},
		/**
		 * 使用此插件的控件,只读属性
		 * <pre>
		 * <code>
		 *  var control =	layout.get('control');
		 * </code>
		 * </pre>
		 * @readOnly
		 * @type {BUI.Component.Controller}
		 */
		control : {

		},
		/**
		 * 控件的的哪些事件会引起重新布局，一般场景下控件的宽高改变都会引起重新布局
		 * @type {Array}
		 */
		layoutEvents : {
			value : ['afterWidthChange','afterHeightChange']
		},
		/**
		 * 内部选项，获取布局插件的布局项
		 * <pre>
		 * <code>
		 *  var items =	layout.get('items');
		 * </code>
		 * </pre>
		 * @type {String}
		 */
		items : {

		},
		/**
		 * 布局容器上添加的样式,布局插件在放置子项的节点上设置的样式
		 * @cfg {String} elCls
		 */
		elCls : {

		},
		/**
		 * 布局子项的默认得配置项
		 * <pre>
		 * <code>
		 *  var layout = new BUI.Layout.Anchor({
		 *  	defaultCfg : {
		 *  		fit : 'width'
		 *  	}
		 *  });
		 *
		 *  new Controller({
		 *    ...
		 * 		plugins : [layout]
		 *  });
		 * </code>
		 * </pre>
		 * @cfg {Object} defaultCfg
		 */
		defaultCfg : {
			value : {}
		},
		/**
		 * 放置控件的容器css,当设置itemTpl时指定布局项放置的位置
		 * <pre>
		 * <code>
		 *  var layout = new BUI.Layout.Anchor({
		 *  	defaultCfg : {
		 *  		fit : 'width'
		 *  	},
		 *  	itempl : '&lt;div class="a">&lt;div class="b">&lt;/div>&lt;/div>',
		 *  	wraperCls : 'b'
		 *  });
		 *
		 *  new Controller({
		 *    ...
		 * 		plugins : [layout]
		 *  });
		 * </code>
		 * </pre>
		 * @cfg {string} wraperCls
		 */
		wraperCls : {

		},
		/**
		 * 放置布局的容器
		 * @readOnly
		 * @type {jQuery}
		 */
		container : {

		},
		/**
		 * 布局的模板,将所有的子控件放置其中,默认为空
		 * <pre>
		 * <code>
		 *  var layout = new BUI.Layout.Anchor({
		 *  	defaultCfg : {
		 *  		fit : 'width'
		 *  	},
		 *  	tpl : '&lt;div class="custom-a">&lt;/div>'
		 *  });
		 *
		 *  new Controller({
		 *    ...
		 * 		plugins : [layout]
		 *  });
		 * </code>
		 * </pre>
		 * @type {String}
		 */
		tpl : {

		},
		/**
		 * 每一个布局子项的模板，会将使用此插件的子控件放入其中
		 * <pre>
		 * <code>
		 *  var layout = new BUI.Layout.Anchor({
		 *  	defaultCfg : {
		 *  		fit : 'width'
		 *  	},
		 *  	itemTpl : '&lt;div class="a">&lt;div class="b">&lt;/div>&lt;/div>',
		 *  	wraperCls : 'b'
		 *  });
		 *
		 *  new Controller({
		 *    ...
		 * 		plugins : [layout]
		 *  });
		 * </code>
		 * </pre>
		 * @cfg {String} itemTpl
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
		 * <pre>
		 * <code>
		 *  var node = $('#id');//一般可以通过点击事件等获取
		 *  var item = layout.getItemByElement(node);
		 * </code>
		 * </pre>
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
		 * <pre>
		 * <code>
		 *  var preItem = ...;//通过各种方式获得
		 *  var next = layout.getNextItem(preItem); //下一个
		 * </code>
		 * </pre>
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
				defaultCfg = _self.get('defaultCfg'),
				cfg = BUI.mix({},defaultCfg,{
					control : controlChild,
					tpl : _self.get('itemTpl'),
					layout : _self,
					wraperCls : _self.get('wraperCls')
				},controlChild.get('layout'));
				
				cfg.container = _self.getItemContainer(cfg)
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
		 * <pre>
		 * <code>
		 *  var item = layout.getItemBy(function(item){
		 *    return item.get('control').get('id') == 'tree';//查找内部控件的id='grid'的布局项
		 *  });
		 * </code>
		 * </pre>
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
		 * <pre>
		 * <code>
		 *  var items = layout.getItemsBy(function(item){
		 *    return item.get('region') == 'north';//查找
		 *  });
		 * </code>
		 * </pre>
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
		 * <pre>
		 * <code>
		 *  var grid = BUI.getControl('grid');//根据id获取grid
		 *  var next = layout.getItem(grid); //下一个
		 * </code>
		 * </pre>
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
		 * <pre>
		 * <code>
		 *  var count = layout.getCount();
		 * </code>
		 * </pre>
		 * @return {Number} 数目
		 */
		getCount : function(){
			return this.getItems().length;
		},
		/**
		 * 根据索引返回选项,索引从0开始
		 * <pre>
		 * <code>
		 *  var item = layout.getItemAt(2);
		 * </code>
		 * </pre>
		 * @return {BUI.Layout.Item}} 返回选项
		 */
		getItemAt : function(index){
			return this.getItems()[index];
		},
		/**
		 * 获取索引
		 * <pre>
		 * <code>
		 *  var index = layout.getItemIndex(item);
		 * </code>
		 * </pre>
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
		 * <pre>
		 * <code>
		 *  layout.reset();
		 * </code>
		 * </pre>
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

define('bui/layout/collapsable',['bui/common'],function (require) {

	var BUI = require('bui/common');
	
	/**
	 * @class BUI.Layout.Collapsable
	 * 可以展开、折叠的布局的扩展类
	 */
	var Collapsable = function(){

	};

	Collapsable.ATTRS = {

		/**
		 * 触发展开折叠的样式
		 * @cfg {String} triggerCls
		 */
		triggerCls : {
			
		},
		/**
		 * 动画的持续时间
		 * @cfg {Number} duration
		 */
		duration : {
			value : 400
		},
		/**
		 * 是否只能展开一个
		 * @cfg {Boolean} accordion
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
		 * <pre>
		 * <code>
		 * var item = layout.getExpandedItem();
		 * item && layout.collapseItem(item);
		 * </code></pre>
		 * @return {BUI.Layout.Item} 选项
		 */
		getExpandedItem : function(){
			return this.getItemBy(function(item){
				return !item.get('collapsed')
			});
		},
		/**
		 * 展开
		 * <pre>
		 * <code>
		 * var item = layout.getItemsByRegion('west')[0];
		 * item && layout.collapseItem(item);
		 * </code></pre>
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
		 * @protected
		 */
		afterExpanded : function(item){

		},
		/**
		 * 展开选项前
		 * @protected
		 */
		beforeExpanded : function(item,range){

		},
		/**
		 * 收缩
		 * <pre>
		 * <code>
		 * var item = layout.getExpandedItem();
		 * item && layout.collapseItem(item);
		 * </code></pre>
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
		 * @protected
		 */
		beforeCollapsed : function(item,range){

		},
		/**
		 * 折叠选项后
		 * @protected
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

define('bui/layout/absolute',['bui/common','bui/layout/abstract','bui/layout/absoluteitem'],function (require) {

	var CLS_RELATIVE = 'x-layout-relative',
		BUI = require('bui/common'),
		Abstract = require('bui/layout/abstract'),
		AbsoluteItem = require('bui/layout/absoluteitem');

	/**
	 * @class BUI.Layout.Absolute
	 * 绝对位置布局控件
	 * @extends BUI.Layout.Abstract
	 * <pre><code>
	 * 	var layout = new Absolute(),
				control = new BUI.Component.Controller({
				width:800,
				height:500,
				elCls : 'layout-test',
				children : [{
					layout : {
						top : 0,
						left : 0,
						width:'100%',
						elCls : 'north',
						height: 50
					},
					xclass : 'controller',
					content : '一'
				},{
					xclass : 'controller',
					layout : {
						width:'20%',
						height : '{height} - 100',
						top:50,
						elCls : 'east',
						left : 0
					},
					content : '二'
				},{
					xclass : 'controller',
					layout : {
						width:'80%',
						height : '{height} - 100',
						left : '20%',
						top:50,
						elCls : 'center'
					},
					content : '中间内容区'
				},{
					xclass : 'controller',
					layout : {
						bottom : 0,
						left : 0,
						width: '100%',
						height:48,
						elCls : 'south'
					},
					width:'100%',
					content : '三'
				}],
				plugins : [layout]
			});

			control.render();
	 * </code></pre>
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

define('bui/layout/anchor',['bui/common','bui/layout/abstract','bui/layout/anchoritem'],function (require) {
	var BUI = require('bui/common'),
		Abstract = require('bui/layout/abstract'),
		Item = require('bui/layout/anchoritem');
	
	/**
	 * @class BUI.Layout.Anchor
	 * 锚定布局控件
	 * @extends BUI.Layout.Abstract
	 * <pre><code>
	 * var layout = new Anchor(),
			control = new BUI.Component.Controller({
				width:800,
				height:500,
				render : '#J_Layout',
				elCls : 'layout-test',
				children : [{
					layout : {
						anchor : ['100%',50]
					},
					xclass : 'controller',
					content : "一 ['100%',50]"
				},{
					xclass : 'controller',
					layout : {
						anchor : [-100,50]
					},
					content : '二 [-100,50]'
				},{
					xclass : 'controller',
					layout : {
						anchor : ['60%','20%']
					},
					content : "三 ['60%','20%']"
				},{
					xclass : 'controller',
					layout : {
						anchor : ['50%',-300]
					},
					content : "四 ['50%',-300]"
				}],
				plugins : [layout]
			});

		control.render();
	 * </code></pre>
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

define('bui/layout/columns',['bui/common','bui/layout/abstract'],function (require) {
	
	var BUI = require('bui/common'),
		Abstract = require('bui/layout/abstract');

	function formatPercent(num){
		return (num * 100) + '%';
	}

	/**
	 * @class BUI.Layout.Columns
	 * 列模式布局
	 * @extends BUI.Layout.Abstract
	 * <pre><code>
	 * 	var layout = new Columns({
				columns : 4
			}),
				control = new BUI.Component.Controller({
				width:800,
				height:500,
				render : '#J_Layout',
				elCls : 'layout-test',
				defaultChildClass : 'controller',
				children : [
					{
						
						content : '1'
					},{
						id : '2',
						content : '2'
					},{
						
						content : '3'
					},{
						
						content : '4'
					},

					{
						content : '5'
					},{
						
						content : '6'
					},

					{
						id:'7',
						
						content : '7'
					},{
						layout : {
							col : 2 //从0开始
						},
						id : '8',
						content : '8 列 3'
					},
					{
						content : '9'
					}

				],
				plugins : [layout]
			});

			control.render();
	 * </code></pre>
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

define('bui/layout/flow',['bui/common','bui/layout/abstract','bui/layout/baseitem'],function (require) {
	var BUI = require('bui/common'),
		Abstract = require('bui/layout/abstract'),
		Item = require('bui/layout/baseitem');
	
	/**
	 * @class BUI.Layout.Flow
	 * 流布局控件
	 * @extends BUI.Layout.Abstract
	 * <pre>
	 * 	<code>
	 * 		var layout = new Flow(),
					control = new BUI.Component.Controller({
					width:600,
					height:500,
					render : '#J_Layout',
					elCls : 'layout-test',
					children : [{
						layout : {
							width : 100,
							height:100
						},
						xclass : 'controller',
						content : "一"
					},{
						xclass : 'controller',
						layout : {
							width:200,
							height:50
						},
						content : '二'
					},{
						xclass : 'controller',
						layout : {
							width:50,
							height:100
						},
						content : "三"
					},{
						xclass : 'controller',
						layout : {
							width:200,
							height : 200
						},
						content : "四"
					}],
					plugins : [layout]
				});

				control.render();
	 * 	</code>
	 * </pre>
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

define('bui/layout/table',['bui/common','bui/layout/abstract','bui/layout/cellitem'],function (require) {

	var BUI = require('bui/common'),
		Abstract = require('bui/layout/abstract'),
		Item = require('bui/layout/cellitem');

	/**
	 * @class BUI.Layout.Table
	 * 表格布局
	 * @extends BUI.Layout.Abstract
	 * <pre>
	 * 	<code>
	 * 	var layout = new Table({
				rows : 4,
				columns : 4
			}),
				control = new BUI.Component.Controller({
				width:600,
				height:500,
				render : '#J_Layout',
				elCls : 'layout-test',
				defaultChildClass : 'controller',
				children : [
					{
						layout : {
							row : 0,
							height : 50
						},
						content : '1'
					},{
						layout : {
							row : 0
						},
						content : '2'
					},{
						layout : {
							row : 0
						},
						content : '3'
					},{
						layout : {
							row : 0,
							rowspan : 4
						},
						content : '4'
					},

					{
						layout : {
							row : 1,
							colspan : 2,
							height : 100
						},
						content : '5'
					},{
						layout : {
							row : 1
						},
						content : '6'
					},

					{
						id:'7',
						layout : {
							row : 2
						},
						content : '7'
					},{
						layout : {
							row : 2,
							colspan : 2,
							rowspan:2
						},
						id : '8',
						content : '8'
					},

					{
						id:'9',
						layout : {
							row : 3
						},
						content : '9'
					}

				],
				plugins : [layout]
			});

			control.render();
	 * 	</code>
	 * </pre>
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
		defaultCfg : {
			value : {fit : 'both'}
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
		},
		//获取单元格附加的高度
		_getItemAppend : function(){
			var _self = this,
				append = _self.get('appendHeight');
			if(append == null){
				var item = _self.getItemAt(0),
					el;
				if(item){
					append = {};
					el = item.get('el');
					append.width = el.outerHeight() - el.height();
					append.height = el.outerWidth() - el.width();
					_self.set('append',append);
				}
			}
			return append || {width :0,height : 0};
		},
		_getCellAvg : function(){
			var _self = this,
				control = _self.get('control'),
				count = _self.get('rows'),
				height = control.get('height'),
				width = control.get('width'),
				append = _self._getItemAppend(),
				avgHeight = (height - append.height * count) / count,
				avgWidth = (width - append.width * count) / count;

			return {
				append : append,
				avgHeight : avgHeight,
				avgWidth : avgWidth
			};
		},
		//获取单元格的高度,高度
		_getItemDime : function(rowspan,colspan){
			var _self = this,
				avg = _self._getCellAvg();

			rowspan = rowspan || 1;
			colspan = colspan || 1;

			return {
			  height :	avg.avgHeight * rowspan + (rowspan - 1) * avg.append.height,
			  width : avg.avgWidth * colspan + (colspan -1) * avg.append.width
			};
		},
		/**
		 * @protected
		 * 重置布局，子类覆盖此类
		 */
		resetLayout : function(){
			var _self = this,
			 	items = _self.getItems();

			BUI.each(items,function(item){
				var diem = _self._getItemDime(item.get('rowspan'),item.get('colspan'));
				item.set(diem);
			});

			Table.superclass.resetLayout.call(this);
		},
		/**
		 * 布局选项初始化完毕
		 * @protected
		 */
		afterInitItems : function(){
			this.resetLayout();
		}
	});

	return Table;

});/**
 * @fileOverview 经典的边框布局
 * @ignore
 */
define('bui/layout/border',['bui/common','bui/layout/abstract','bui/layout/borderitem','bui/layout/collapsable'],function(require) {

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
	 * <pre>
	 * 	<code>
	 * 	var layout = new Border(),
				control = new BUI.Component.Controller({
				width:600,
				height:500,
				render : '#J_Layout',
				elCls : 'ext-border-layout',
				children : [{
					layout : {
						title : 'north',
						region : 'north',
						height : 50
					},
					width : 100,
					height :15,
					elCls : 'red',
					xclass : 'controller',
					content : "一 无自适应"
				},{
					xclass : 'controller',
					elCls : 'red',
					layout : {
						region : 'south',
						title : 'south',
						fit : 'height',
						
						height : 50
					},
					width : 250,
					content : '二 自适应高，但是不自适应宽'
				},{
					xclass : 'controller',
					layout : {
						region : 'east',
						fit : 'both',
						title : 'east',
						width : 150
					},
					elCls : 'red',
					content : "三 自适应宽高"
				},{
					xclass : 'controller',
					layout : {
						region : 'west',
						fit : 'width',
						width : 100
					},
					elCls : 'red',
					content : "四 自适应宽"
				},{
					xclass : 'controller',
					layout : {
						region : 'center',
						fit : 'both'
					},
					
					elCls : 'blue',
					content : '居中 自适应宽高'
				}],
				plugins : [layout]
			});

			control.render();
	 * 	</code>
	 * </pre>
	 * @mixins BUI.Layout.Collapsable
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
		 * <pre>
		 * <code>
		 * var item = layout.getItemsByRegion('west')[0];
		 * item && layout.collapseItem(item);
		 * </code></pre>
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
		 * @protected
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
		 * @protected
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

});/**
 * @fileOverview 全屏容器，一般情况下用于布局
 * @ignore
 */

define('bui/layout/viewport',['bui/common'],function (require) {

	var BUI = require('bui/common'),
		CLS_VIEW_CONTAINER = 'x-viewport-container',
		UA = BUI.UA,
		win = window;

	/**
	 * @class BUI.Layout.Viewport
	 * 窗口视图控件，窗口发生改变时，自适应宽高，通常使用布局插件
	 * @extends BUI.Component.Controller
	 * ** 此控件通常跟布局控件一起使用： **
	 * <pre><code>
	 * 	var port = new Viewport({
				elCls : 'ext-border-layout',
				children : [{
					layout : {
						title : '顶部',
						collapsable : true,
						region : 'north',
						height : 100
					},
					xclass : 'controller',
					content : "一"
				},{
					xclass : 'controller',
					layout : {
						region : 'south',
						title : '下部',
						collapsable : true,
						height : 100
					},
					content : '二'
				},{
					xclass : 'controller',
					layout : {
						region : 'east',
						title : '右侧',
						collapsable : true,
						width : 150
					},
					content : "三"
				},{
					xclass : 'controller',
					layout : {
						region : 'west',
						title : '左侧',
						collapsable : true,
						width : 300
					},
					content : "四"
				},{
					xclass : 'controller',
					layout : {
						title : '居中',
						region : 'center'
					},
					content : '居中'
				}],
				plugins : [Border]
			});
		port.render();
	 * </code></pre>
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
		//窗口发生改变时
		onResize : function(){
			this.reset();
		},
		/**
		 * 重新适应窗口大小,一般场景下此控件会随着窗口的变化而变化，但是特殊场景下需要手工调用
		 * <pre><code>
		 * viewport.reset();
		 * </code></pre>
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
			_self.fire('resize');

		},
		destructor : function(){
			$(win).off('resize',BUI.getWrapBehavior(this,'onResize'));
		}
	},{
		ATTRS : {
			render : {
				value : 'body'
			}

			/**
			 * @event resize
			 * ViewPort 重新布局
			 */
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

define('bui/layout/baseitem',['bui/common'],function (require) {

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
		 * 自适应内部控件,自适应的类型,注意设置了适应类型后，不应该再设置控件的对应的宽度或者高度
		 * 
		 *   - none : 内部控件不自适应（默认）
		 *   - width : 内部控件自适应宽度，当layout重新布局时宽度自适应
		 *   - height : 内部控件自适应高度，当layout重新布局时高度自适应
		 *   - both : 内部控件自适应宽高，当layout重新布局时宽度、高度自适应
		 * 	<pre>
		 * <code>
		 *
		 *  new Controller({
		 *    ...
		 *    children : [
		 *    	{
		 *    		xclass : 'grid',
		 *    		layout : {
		 *    			fit : 'width'
		 *    		}
		 *    		//width : '100px',不要再设置宽度
		 *    	}
		 *    ],
		 * 		plugins : [BUI.Layout.Anchor]
		 *  });
		 * </code>
		 * </pre>
		 * 
		 * @cfg {String} fit
		 */
		fit : {
			value : 'none'
		},
		/**
		 * 所属的layout
		 * @readOnly
		 * @type {BUI.Layout.Abstract}
		 */
		layout : {

		},
		/**
		 * 封装的控件
		 * <pre>
		 * <code>
		 *  var control =	item.get('control');
		 * </code>
		 * </pre>
		 * @type {Object}
		 */
		control : {

		},
		/**
		 * 封装控件的容器的样式，默认为空,也可以设置在layout上传递进来
		 * <pre>
		 * <code>
		 *  var layout = new BUI.Layout.Anchor({
		 *  	defaultCfg : {
		 *  		fit : 'width',
		 *  		wraperCls : 'b'
		 *  	},
		 *  	itemTpl : '&lt;div class="a">&lt;div class="b">&lt;/div>&lt;/div>'
		 *  });
		 *
		 *  new Controller({
		 *    ...
		 * 		plugins : [layout]
		 *  });
		 * </code>
		 * </pre>
		 * @cfg {string} wraperCls
		 */
		wraperCls : {

		},
		/**
		 * 容器
		 * @readOnly
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
		 * @protected
		 * 状态相关的字段
		 * @type {Array}
		 */
		statusProperties : {

		},
		/**
		 * @protected
		 * 附加模板
		 * @type {Object}
		 */
		tplProperties : {

		},
		/**
		 * 当前项的DOM
		 * <pre>
		 * <code>
		 *  var el =	item.get('el');
		 * </code>
		 * </pre>
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
		 * 模板，也可以直接在layout上设置itemTpl
		 * <pre>
		 * <code>
		 *  var layout = new BUI.Layout.Anchor({
		 *  	defaultCfg : {
		 *  		fit : 'width'
		 *  	},
		 *  	itemTpl : '&lt;div class="a">&lt;div class="b">&lt;/div>&lt;/div>',
		 *  	wraperCls : 'b'
		 *  });
		 *
		 *  new Controller({
		 *    ...
		 * 		plugins : [layout]
		 *  });
		 * </code>
		 * </pre>
		 * @cfg {String} tpl
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
		 * <pre>
		 * <code>
		 *  var el =	item.getElement();
		 * </code>
		 * </pre>
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
		 * 同步属性到子项,同步css和attr，一般先设置宽高等信息后,再调用此方法
		 * @protected
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
		 * <pre>
		 * <code>
		 *  var item = layout.getItem(control);
		 *
		 *  item.set('width',width);
		 *
		 *  //也可以设置多个属性
		 *  item.set({
		 *  	height : 100,
		 *  	width : 100
		 *  });
		 *  item.syncFit();
		 * </code>
		 * </pre>
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
				width = _self.get('width') || _self.get('el').width(),
				appendWidth = control.getAppendWidth();
			control.set('width',width - appendWidth);

		},
		//同步控件的高度
		_syncControlHeight : function(control){
			var _self = this,
				height = _self.getFitHeight(),
				appendHeight = control.getAppendHeight();
			control.set('height',height - appendHeight);
		},
		/**
		 * @protected
		 * 获取内部控件自适应的高度
		 * @return {Number} 自适应的高度
		 */
		getFitHeight : function(){
			var _self = this,
				el = _self.get('el'),
				bodyEl = _self.get('bodyEl'),
				siblings,
				outerHeight = _self.get('height') || el.height(),
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

define('bui/layout/absoluteitem',['bui/common','bui/layout/baseitem'],function (require) {
	
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

define('bui/layout/anchoritem',['bui/common','bui/layout/baseitem'],function (require) {

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

define('bui/layout/borderitem',['bui/common','bui/layout/baseitem'],function (require) {
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
		 *<ol>
     * <li>fit: 'none', 内部控件不跟随布局项的宽高自适应</li>
     * <li>fit: 'width',内部控件跟随布局项的宽度进行自适应</li>
     * <li>fit: 'height',内部控件跟随布局项的高度进行自适应</li>
     * <li>fit: 'both',内部控件跟随布局项的宽度、高度都进行自适应</li>
     *</ol>
		 * @cfg {String} region
		 */
		region : {

		},
		/**
		 * 标题的模板
		 * <pre><code>
		 * 	children : [{
					layout : {
						title : 'north',
						region : 'north',
						height : 50,
						titleTpl : '&lt;div class="x-border-title x-border-title-{region}">{title}&lt;/div>'
					},
					width : 100,
					height :15,
					elCls : 'red',
					xclass : 'grid',
					content : "无自适应"
				}]
		 * </code></pre>
		 * @cfg {Object} titleTpl
		 */
		titleTpl : {
			value : '<div class="x-border-title x-border-title-{region}">{title}</div>'
		},
		/**
		 * 收缩展开的dom的模板
		 * <pre><code>
		 * 	children : [{
					layout : {
						title : 'north',
						region : 'north',
						height : 50,
						collapsable : true,//只有callapsable:true，collapseTpl才会生效
						collapseTpl : '&lt;s class="x-collapsed-btn x-collapsed-{region}">&lt;/s>'
					},
					width : 100,
					height :15,
					elCls : 'red',
					xclass : 'grid',
					content : "无自适应"
				}]
		 * </code></pre>
		 * @cfg {Object} collapseTpl
		 */
		collapseTpl : {
			value : '<s class="x-collapsed-btn x-collapsed-{region}"></s>'
		},
		/**
		 * 是否可以折叠
		 *  <pre><code>
		 * 	children : [{
					layout : {
						title : 'north',
						region : 'north',
						height : 50,
						collapsable : true
					},
					width : 100,
					height :15,
					elCls : 'red',
					xclass : 'grid',
					content : "无自适应"
				}]
		 * </code></pre>
		 * @cfg {Boolean} collapsable
		 */
		collapsable : {
			value : false
		},
		/**
		 * 是否默认折叠
		 * @cfg {Boolean} collapsed
		 */
		/**
		 * 是否折叠
		 * @type {Boolean}
		 */
		collapsed : {
			value : false
		},
		/**
		 * 收缩后剩余的宽度或者高度，如果存在title，则以title的高度为准
		 * @cfg {Number} leftRange
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
		 * <pre>
		 * <code>
		 * var item = layout.getItemsByRegion('west')[0];
		 * item && item.expand()
		 * </code>
		 * </pre>
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
				left = _self.get('leftRange');
			return left;
		},
		/**
		 * @protected
		 * @ignore
		 */
		getCollapsedRange : function(){
			var _self = this,
				property = _self.getCollapseProperty(),
				el = _self.get('el'),
				val = _self.get(property);
			if(BUI.isString(val)){
				var dynacAttrs = _self._getDynacAttrs();
				if(val.indexOf('{') != -1){
					val = BUI.substitute(val,dynacAttrs);
					val = BUI.JSON.looseParse(val);
				}
				else if(val.indexOf('%') != -1){
					val = parseInt(val,10) * 0.01 * dynacAttrs[property];
				}else{
					val = parseInt(val,10);
				}
			}
			return val - _self._getLeftRange(property);
		},
		/**
		 * 折叠
		 * <pre>
		 * <code>
		 * var item = layout.getItemsByRegion('west')[0];
		 * item && layout.collapseItem(item);
		 * </code></pre>
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

define('bui/layout/cellitem',['bui/common','bui/layout/baseitem'],function (require) {

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

define('bui/layout/tabitem',['bui/common','bui/layout/baseitem'],function(require) {

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
				
				el.removeClass(CLS_COLLAPSED);
				_self.syncFit();
			});
			_self.set('collapsed',false);
		},
		/**
		 * 折叠
		 */
		collapse : function(duration){
			var _self = this,
				el = _self.get('el'),
				bodyEl = _self.get('bodyEl');
			bodyEl.animate({height : 0},duration,function(){
				el.addClass(CLS_COLLAPSED);
			});
			_self.set('collapsed',true);

		}
	});

	return Tab;
});