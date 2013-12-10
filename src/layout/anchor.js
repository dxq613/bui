/**
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
});