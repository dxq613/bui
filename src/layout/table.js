/**
 * @fileOverview 表格布局
 * @ignore
 */

define('bui/layout/table',['bui/common','bui/layout/abstract','bui/layout/cellitem'],function (require) {

	var BUI = require('bui/common'),
		Abstract = require('bui/layout/abstract'),
		Item = require('bui/layout/cellitem');

	/**
	 * @class BUI.Layout.Table
	 * 表格布局
	 * @extends BUI.Layout.Abstract
	 * <pre>
	 * 	<code>
	 * 	var layout = new Table({
				rows : 4,
				columns : 4
			}),
				control = new BUI.Component.Controller({
				width:600,
				height:500,
				render : '#J_Layout',
				elCls : 'layout-test',
				defaultChildClass : 'controller',
				children : [
					{
						layout : {
							row : 0,
							height : 50
						},
						content : '1'
					},{
						layout : {
							row : 0
						},
						content : '2'
					},{
						layout : {
							row : 0
						},
						content : '3'
					},{
						layout : {
							row : 0,
							rowspan : 4
						},
						content : '4'
					},

					{
						layout : {
							row : 1,
							colspan : 2,
							height : 100
						},
						content : '5'
					},{
						layout : {
							row : 1
						},
						content : '6'
					},

					{
						id:'7',
						layout : {
							row : 2
						},
						content : '7'
					},{
						layout : {
							row : 2,
							colspan : 2,
							rowspan:2
						},
						id : '8',
						content : '8'
					},

					{
						id:'9',
						layout : {
							row : 3
						},
						content : '9'
					}

				],
				plugins : [layout]
			});

			control.render();
	 * 	</code>
	 * </pre>
	 */
	var Table = function(config){
		Table.superclass.constructor.call(this,config);
	};

	Table.ATTRS = {
		itemConstructor : {
			value : Item
		},
		/**
		 * @private
		 * @ignore
		 * lastRow 当前最后一行的值
		 */
		lastRow : {
			value : 0
		},
		/**
		 * 布局的模板
		 * @type {String}
		 */
		tpl : {
			value : '<table class="x-layout-table"><tbody></tbody></table>'
		},
		/**
		 * 列的数目
		 * @type {Number}
		 */
		columns : {

		},
		/**
		 * Number
		 * @type {Object}
		 */
		rows : {

		},
		/**
		 * 单元格的模板
		 * @type {String}
		 */
		itemTpl : {
			value : '<td class="x-layout-item-cell"></td>'
		}
	};

	BUI.extend(Table,Abstract);

	BUI.augment(Table,{
		
		/**
		 * @protected
		 * 容器初始化完毕开始渲染布局子项
		 */
		afterWraper : function(){
			var _self = this,
				rows = _self.get('rows'),
				container = _self.get('container'),
				arr = [];
			for (var i = 0; i < rows; i++) {
				arr.push('<tr></tr>');
			};
			container.find('tbody').html(arr.join(''));
		},
		/**
		 * @protected
		 * 获取布局选项的容器
		 */
		getItemContainer : function(itemAttrs){
			var _self = this,
				container = this.get('container');
			return $(container.find('tr')[itemAttrs.row]);
		}
	});

	return Table;

});