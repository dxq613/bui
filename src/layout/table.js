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
		defaultCfg : {
			value : {fit : 'both'}
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
		},
		//获取单元格附加的高度
		_getItemAppend : function(){
			var _self = this,
				append = _self.get('appendHeight');
			if(append == null){
				var item = _self.getItemAt(0),
					el;
				if(item){
					append = {};
					el = item.get('el');
					append.width = el.outerHeight() - el.height();
					append.height = el.outerWidth() - el.width();
					_self.set('append',append);
				}
			}
			return append || {width :0,height : 0};
		},
		_getCellAvg : function(){
			var _self = this,
				control = _self.get('control'),
				count = _self.get('rows'),
				height = control.get('height'),
				width = control.get('width'),
				append = _self._getItemAppend(),
				avgHeight = (height - append.height * count) / count,
				avgWidth = (width - append.width * count) / count;

			return {
				append : append,
				avgHeight : avgHeight,
				avgWidth : avgWidth
			};
		},
		//获取单元格的高度,高度
		_getItemDime : function(rowspan,colspan){
			var _self = this,
				avg = _self._getCellAvg();

			rowspan = rowspan || 1;
			colspan = colspan || 1;

			return {
			  height :	avg.avgHeight * rowspan + (rowspan - 1) * avg.append.height,
			  width : avg.avgWidth * colspan + (colspan -1) * avg.append.width
			};
		},
		/**
		 * @protected
		 * 重置布局，子类覆盖此类
		 */
		resetLayout : function(){
			var _self = this,
			 	items = _self.getItems();

			BUI.each(items,function(item){
				var diem = _self._getItemDime(item.get('rowspan'),item.get('colspan'));
				item.set(diem);
			});

			Table.superclass.resetLayout.call(this);
		},
		/**
		 * 布局选项初始化完毕
		 * @protected
		 */
		afterInitItems : function(){
			this.resetLayout();
		}
	});

	return Table;

});