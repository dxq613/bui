/**
 * @fileOverview 提示信息
 * @ignore
 */

define('bui/chart/tooltip',['bui/common','bui/graphic','bui/chart/plotitem'],function (require) {

	var BUI = require('bui/common'),
		PlotItem = require('bui/chart/plotitem'),
		Util = require('bui/graphic').Util;

	function min(x,y){
		return x > y ? y : x;
	}
	function max(x,y){
		return x > y ? x : y;
	}


	/**
	 * @class BUI.Chart.Tooltip
	 * 提示信息
	 * @extends BUI.Chart.PlotItem
	 */
	var Tooltip = function(cfg){
		Tooltip.superclass.constructor.call(this,cfg);
	};

	Tooltip.ATTRS = {
		zIndex : {
			value : 10
		},
		elCls : {
			value : 'x-chart-tootip'
		},
		/**
		 * 是否贯穿整个坐标轴
		 * @type {Boolean}
		 */
		crosshairs : {
			value : false
		},
		/**
		 * 视图范围
		 * @type {Object}
		 */
		plotRange : {

		},
		/**
		 * 多个数据序列是否共同用一个tooltip
		 * @type {Boolean}
		 */
		shared : {
			value : false
		},
		/**
		 * x轴上，移动到位置的偏移量
		 * @type {Number}
		 */
		offset : {
			value : 0
		},
		shadow : {

		},
		/**
		 * 标题的配置信息
		 * @type {Object}
		 */
		title : {
			value : {
				'font-size' : '10',
				'text-anchor' : 'start',
				x : 5,
				y : 15
			}
		},
		/**
		 * 数据序列名称的配置信息
		 * @type {Object}
		 */
		name : {
			value : {
				'font-size' : '12',
				'text-anchor' : 'start'
			}
		},
		/**
		 * 当前值的文本配置信息
		 * @type {String}
		 */
		value : {
			value : {
				'font-size' : '12',
				'font-weight' :'bold',
				'text-anchor' : 'start'
			}
		},
		border : {
			value : {
				x : 0,
				y : 0,
				r : 3,
				fill : '#fff',
				'fill-opacity' : .85
			}
		},
		animate : {
			value : true
		},
		/**
		 * 移动的动画时间
		 * @type {Number}
		 */
		duration : {
			value : 100
		},
		/**
		 * 用于格式化数据序列时使用
		 * @type {Function}
		 */
		pointRenderer : {

		},
		/**
		 * 跟在value后面的后缀
		 * @type {String}
		 */
		valueSuffix : {
			value : ''
		},
		visible : {
			value : false
		},
		items : [

		],
		crossLine:{
			value: {
				stroke: "#C0C0C0"
			}
		}
	};

	BUI.extend(Tooltip,PlotItem);


	BUI.augment(Tooltip,{

		renderUI : function(){
			var _self = this;

			Tooltip.superclass.renderUI.call(_self);
			_self._renderBorer();
			_self._renderText();
			_self._renderItemGroup();
			_self._renderCrossLine();

		},
		//渲染边框
		_renderBorer : function(){
			var _self = this,
				bbox = _self.getBBox(),
				rect = _self.addShape('rect',_self.get('border'));
			_self.set('borderShape',rect);
		},
		//渲染文本
		_renderText : function(){
			var _self = this,
				title = _self.get('title');

			_self.setTitle(title.text);

		},
		//渲染文本集合
		_renderItemGroup : function(){
			var _self = this,
				items = _self.get('items'),
				group = _self.addGroup({
					x : 8,
					y : 30
				});
			_self.set('textGroup',group);
			if(items){
				_self.setItems(items);
			}
		},
		//渲染贯穿纵坐标的线
		_renderCrossLine : function(){
			var _self = this,
				crosshairs = _self.get('crosshairs'),
				shape,
				plotRange = _self.get('plotRange');

			if(crosshairs){

				shape = _self.get('parent').addShape({
					type : 'line',
					visible : false,
					zIndex : 3,
					attrs : {
						stroke : _self.get('crossLine').stroke,
						x1 : 0,
						y1 : plotRange.bl.y,
						x2 : 0,
						y2 : plotRange.tl.y
					}
				});

				_self.set('crossShape',shape);
			}
		},
		/**
		 * 设置title
		 * @param {String} title 标题
		 */
		setTitle : function(text){
			var _self = this,
				titleShape = _self.get('titleShape'),
				title = _self.get('title'),
				cfg;
			if(!titleShape){
				title.text = text || '';
				titleShape = _self.addShape('text',title);
				_self.set('titleShape',titleShape);
			}
			titleShape.attr('text',text);
		},

		getInnerBox : function(){
			var _self = this,
				textGroup = _self.get('textGroup'),
				titleShape = _self.get('titleShape'),
				bbx = textGroup.getBBox(),
				rst = {},
				width = bbx.width;
			if(titleShape){
				var tbox = titleShape.getBBox();
				width = Math.max(width,tbox.width);
			}
			rst.width = bbx.x + width + 8;
			rst.height = bbx.height + bbx.y + 10;

			return rst;
		},
		/**
		 * 设置颜色
		 * @param {String} color 颜色
		 */
		setColor : function(color){
			var _self = this,
				borderShape = _self.get('borderShape');
			borderShape.attr('stroke',color);
		},
		/**
		 * 显示
		 */
		show : function(){
			var _self = this,
				crossShape = _self.get('crossShape'),
				hideHandler = _self.get('hideHandler');
			if(hideHandler){
				clearTimeout(hideHandler);
			}
			Tooltip.superclass.show.call(_self);
			crossShape && crossShape.show();
		},
		/**
		 * 隐藏
		 */
		hide : function(){
			var _self = this,
				crossShape = _self.get('crossShape');

			var hideHandler = setTimeout(function(){
				Tooltip.superclass.hide.call(_self);
				_self.set('hideHandler',null);
			},_self.get('duration'));
			_self.set('hideHandler',hideHandler);
			crossShape && crossShape.hide();
		},

		/**
		 * 将tooltip的右下角移动到指定的位置，假设这个点已经在坐标轴内
		 *
		 *  - 默认移动到右下角
		 *  - 如果左边到了坐标轴外，则将tooltip向右移动，按照右下角对齐
		 *  - 如果右边到了坐标轴外，则左移,将右下边放到坐标轴边界上
		 *  - 下面，上面出了坐标轴，做类似处理
		 * @param {Number} x x坐标
		 * @param {Number} y y坐标
		 */
		setPosition : function(x,y){
			var _self = this,
				plotRange = _self.get('plotRange'),
				offset = _self.get('offset'),
				crossShape = _self.get('crossShape'),
				bbox = _self.getBBox(),
				after = true,
				animate = _self.get('animate'); //移动点落到tooltip的后面

			var endx = x,
				endy = y;

			x = x - bbox.width - offset;
			y = y - bbox.height;

			if(plotRange){

				if(!plotRange.isInRange(x,y)){
					//如果顶部在外面
					if(!plotRange.isInVertical(y)){
						y = plotRange.tl.y;
					}

					if(!plotRange.isInHorizontal(x)){
						x = max(plotRange.tl.x,endx) + offset;
						after = false;
					}
				}
			}

			if(_self.get('x') != x || _self.get('y') != y){
				if(animate && Util.svg && _self.get('visible')){
					_self.animate({
						x : x,
						y : y
					},_self.get('duration'));
				}

				_self.move(x,y);/**/

				if(crossShape){
					if(after){
						crossShape.attr('transform','t' + endx + ' 0');
					}else{
						crossShape.attr('transform','t' + (x - offset) + ' 0');
					}
				}
			}


		},
		//重置边框大小
		resetBorder : function(){
			var _self = this,
				bbox = _self.getInnerBox(),
				borderShape = _self.get('borderShape');


			borderShape.attr({
				width : bbox.width,
				height : bbox.height
			});
		},
		/**
		 * @private
		 * 添加一条信息
		 */
		addItem : function(item,index){
			var _self = this,
				textGroup = _self.get('textGroup'),
				group = textGroup.addGroup(),
				name = _self.get('name'),
				value = _self.get('value'),
				y = index * 16,
				cfg;

			cfg = BUI.merge(name,{
				x : 0,
				y : y,
				text : item.name + ':',
				'fill' : item.color
			});

		  var nameShape =	group.addShape('text',cfg),
		  	width = nameShape.getBBox().width + 10,
		  	valueSuffix = _self.get('valueSuffix'),
		  	itemValue;
		  if(BUI.isArray(item.value)){
		  	BUI.each(item.value,function(sub){
		  		var subItem
		  		if(BUI.isObject(sub)){
		  			subItem = addValue(sub.text,sub);
		  		}else{
		  			subItem = addValue(sub);
		  		}
		  		width = width + subItem.getBBox().width;
		  	});
		  }else{
		  	itemValue = valueSuffix ? item.value + ' ' + valueSuffix : item.value;
		  	addValue(itemValue);
		  }

		  function addValue (text,params){
		  	var cfg = BUI.merge(value,{
					x : width,
					y : y,
					text : text
				},params);
			  return group.addShape('text',cfg);
		  }


		},
		/**
		 * 设置显示的信息项
		 *
		 * - name : 序列的标题
		 * - value : 序列的值
		 * - color : 序列的颜色
		 *
		 * @param {Array} items 信息列表
		 */
		setItems : function(items){
			var _self = this;

			_self.clearItems();
			BUI.each(items,function(item,index){
				_self.addItem(item,index);
			});

			if(items[0]){
				_self.setColor(items[0].color);
			}
			_self.resetBorder();
			//_self.set('items',items);
		},
		/**
		 * 清除所有的信息
		 */
		clearItems : function(){
			var _self = this,
				group = _self.get('textGroup');
			group.clear();
		},
		remove : function(){

			var _self = this,
				crossShape = _self.get('crossShape');
			crossShape && crossShape.remove();
			Tooltip.superclass.remove(this);
		}

	});

	return Tooltip;

});
