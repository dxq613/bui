/**
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
});