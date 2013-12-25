/**
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
				_self.set('collapsed',false);
				el.removeClass(CLS_COLLAPSED);
			});
		},
		/**
		 * 折叠
		 */
		collapse : function(duration){
			var _self = this,
				el = _self.get('el'),
				bodyEl = _self.get('bodyEl');
			bodyEl.animate({height : 0},duration,function(){
				_self.set('collapsed',true);
				el.addClass(CLS_COLLAPSED);
			});
		}
	});

	return Tab;
});