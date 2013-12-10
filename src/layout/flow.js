/**
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
});