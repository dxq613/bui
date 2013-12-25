/**
 * @fileOverview 列模式布局
 * @ignore
 */

define('bui/layout/columns',['bui/common','bui/layout/abstract'],function (require) {
	
	var BUI = require('bui/common'),
		Abstract = require('bui/layout/abstract');

	function formatPercent(num){
		return (num * 100) + '%';
	}

	/**
	 * @class BUI.Layout.Columns
	 * 列模式布局
	 * @extends BUI.Layout.Abstract
	 * <pre><code>
	 * 	var layout = new Columns({
				columns : 4
			}),
				control = new BUI.Component.Controller({
				width:800,
				height:500,
				render : '#J_Layout',
				elCls : 'layout-test',
				defaultChildClass : 'controller',
				children : [
					{
						
						content : '1'
					},{
						id : '2',
						content : '2'
					},{
						
						content : '3'
					},{
						
						content : '4'
					},

					{
						content : '5'
					},{
						
						content : '6'
					},

					{
						id:'7',
						
						content : '7'
					},{
						layout : {
							col : 2 //从0开始
						},
						id : '8',
						content : '8 列 3'
					},
					{
						content : '9'
					}

				],
				plugins : [layout]
			});

			control.render();
	 * </code></pre>
	 */
	var Columns = function(config){
		Columns.superclass.constructor.call(this,config);
	};

	Columns.ATTRS = {
		/**
		 * 列的数目,每列的宽度平均计算
		 * @type {Number}
		 */
		columns : {
			value : 1
		},
		/**
		 * 列的模板
		 * @type {String}
		 */
		columnTpl : {
			value : '<div class="x-layout-column"></div>'
		},
		tpl : {
			value : '<div class="x-layout-columns"></div>'
		},
		itemTpl : {
			value : '<div class="x-layout-item-column"></div>'
		}
	};

	BUI.extend(Columns,Abstract);

	BUI.augment(Columns,{

		/**
		 * @protected
		 * 覆写重新布局方法
		 */
		resetLayout : function(){
			var _self = this;
			_self._setColumnsWidth();
			Columns.superclass.resetLayout.call(_self);
		},
		/**
		 * 移动选项到位置
		 * @param  {Number} to 位置,位置从0开始
		 */
		moveItem : function(item,to){
			var _self = this,
				itemContainer;
			if(to >= _self.get('columns') || to < 0){
				return;
			}

			item.set('col',to);
			itemContainer = _self.getItemContainer({col : to});
			item.set('container',itemContainer);
			item.get('el').appendTo(itemContainer);
		},
		/**
		 * @protected
		 * 容器初始化完毕开始渲染布局子项
		 */
		afterWraper : function(){
			var _self = this,
				columns = _self.get('columns'),
				container = _self.get('container'),
				arr = [];
			for (var i = 0; i < columns; i++) {
				arr.push(_self.get('columnTpl'));
			};
			container.html(arr.join(''));

			_self._setColumnsWidth();
		},
		//获取平均宽度
		_setColumnsWidth : function(){
			var _self = this,
				container = _self.get('container'),
				children = container.children(),
				containerWidth = container.width(),
				avgWidth = parseInt(containerWidth / children.length,10),
				left = 0;

			BUI.each(children,function(item){
				var node = $(item),
					appendWidth = node.outerWidth() - node.width();
				node.width(avgWidth - appendWidth);
			});
		},
		/**
		 * @protected
		 * 获取布局选项的容器
		 */
		getItemContainer : function(itemAttrs){
			var _self = this,
				items = _self.get('items'),
				columns = _self.get('columns'),
				container = this.get('container');
			if(itemAttrs.col === undefined){
				itemAttrs.col = items.length % columns;
			}
			return $(container.find('.x-layout-column')[itemAttrs.col]);
		}
	});

	return Columns;
});