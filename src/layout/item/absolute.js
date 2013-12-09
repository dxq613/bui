/**
 * @fileOverview 绝对布局的布局项
 * @ignore
 */

define('bui/layout/absoluteitem',['bui/layout/baseitem'],function (require) {
	
	var BUI = require('bui/common'),
		Base = require('bui/layout/baseitem');

	var AbsoluteItem = function(config){
		AbsoluteItem.superclass.constructor.call(this,config);
	};

	BUI.extend(AbsoluteItem,Base);

	AbsoluteItem.ATTRS = {

		/**s
		 * @protected
		 * 同步的css属性
		 * @type {Array}
		 */
		cssProperties : {
			value : ['top','left','bottom','right']
		}
		
		/**
		 * top
		 * @cfg {Number} top
		 */
		
		/**
		 * left
		 * @cfg {Number} left
		 */
		
		/**
		 * bottom
		 * @cfg {Number} bottom
		 */
		
		/**
		 * right
		 * @cfg {Number} right
		 */
		
	};

	BUI.augment(AbsoluteItem,{

		
	});

	return AbsoluteItem;
});