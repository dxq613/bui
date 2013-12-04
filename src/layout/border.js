/**
 * @fileOverview 经典的边框布局
 * @ignoreig
 */
define('bui/layout/border',['bui/layout/abstract'],function(require) {
	var BUI = require('bui/common'),
		Abstract = require('bui/layout/abstract');

	var Border = Abstract.extend({
		/**
		 * @protected
		 * 初始化所有的子项
		 */
		initItems : function(){
			
		}
	},{
		ATTRS : {
			
		}
	});

	return Border;
});
