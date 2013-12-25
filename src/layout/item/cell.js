/**
 * @fileOverview 表格布局的项，是一个个的单元格
 * @ignore
 */

define('bui/layout/cellitem',['bui/common','bui/layout/baseitem'],function (require) {

	var BUI = require('bui/common'),
		Base = require('bui/layout/baseitem');

	/**
	 * @class BUI.Layout.Item.Cell
	 * 表格布局的子项
	 * @extends BUI.Layout.Item
	 */
	var Cell = function(config){
		Cell.superclass.constructor.call(this,config);
	};

	Cell.ATTRS = {

		/**
		 * 所属的行,需要指定行，便于计算，列根据顺序决定
		 * @cfg {Number} row
		 */
		row : {

		},
		/**
		 * 占据的行
		 * @type {Number}
		 */
		rowspan : {
			value : 1
		},
		/**
		 * 列
		 * @type {Number}
		 */
		colspan : {
			value : 1
		},
		/**
		 * 使用的属性字段
		 * @type {Array}
		 */
		attrProperties : {
			value : ['rowspan','colspan']
		},
		/**
		 * 占用的单元格个数
		 * @type {Number}
		 */
		cells : {
			getter : function(){
				return this.get('rowspan') * this.get('colspan');
			}
		}
	};

	BUI.extend(Cell,Base);

	BUI.augment(Cell,{

	});

	return Cell;
});