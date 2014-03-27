/**
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
