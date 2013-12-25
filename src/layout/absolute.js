/**
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
});