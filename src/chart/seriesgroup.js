/**
 * @fileOverview 所有数据图形序列的容器,管理这些序列的增删，active状态，事件处理等等
 * @ignore
 */

define('bui/chart/seriesgroup',['bui/common','bui/chart/plotitem','bui/chart/activedgroup'],function (require) {

	var BUI = require('bui/common'),
		ActivedGroup = require('bui/chart/activedgroup'),
		PlotItem = require('bui/chart/plotitem');

	/**
	 * @class BUI.Chart.SeriesGroup
	 * 数据序列的容器
	 * @protected
	 */
	function Group(cfg){
		Group.superclass.constructor.call(this,cfg);
	}

	Group.ATTRS = {

		/**
		 * 数据图形序列的配置项
		 * @type {Array}
		 */
		series : {

		},
		/**
		 * @private
		 * 存放渲染的图形序列的数组
		 * @type {Array}
		 */
		items : {
			shared : false,
			value : []
		}

	};

	BUI.mixin(Group,ActivedGroup);

	BUI.augment(Group,{
		//获取可以激活的元素
		getActiveItems : function(){
			return this.get('items');
		},
		_renderSeries : function(){

		}

	});

	return Group;
});