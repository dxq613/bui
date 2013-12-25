/**
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
});