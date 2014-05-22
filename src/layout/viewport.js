/**
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

