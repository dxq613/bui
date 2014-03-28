/**
 * @fileOverview 图例项
 * @ignore
 */

define('bui/chart/legenditem',['bui/common','bui/chart/plotitem'],function (require) {

	var BUI = require('bui/common'),
		PlotItem = require('bui/chart/plotitem'),
		MARKER_WIDTH = 20;

	/**
	 * @class BUI.Chart.LegendItem
	 * 图例的子项，用于标示其中一个数据序列
	 * @extends BUI.Chart.PlotItem
	 * @mixins BUI.Chart.ActivedGroup
	 */
	var LegendItem = function(cfg){
		LegendItem.superclass.constructor.call(this,cfg);
	};

	LegendItem.ATTRS = {

		elCls : {
			value : 'x-chart-legend-item'
		},
		/**
		 * 文本的配置信息，不包括文本内容，文本内容由series决定
		 * @type {Object}
		 */
		label : {

		},
		/**
		 * 所属的图例
		 * @type {Object}
		 */
		legend : {

		},
		/**
		 * 标示的数据序列
		 * @type {BUI.Chart.Series}
		 */
		series : {

		},
		/**
		 * x轴的位置
		 * @type {Number}
		 */
		x : {

		},
		/**
		 * y轴的位置
		 * @type {Number}
		 */
		y : {

		},
		
		hideColor : {
			value : '#CCC'
		}
		
	}

	BUI.extend(LegendItem,PlotItem);

	BUI.augment(LegendItem,{

		renderUI : function(){
			var _self = this
			LegendItem.superclass.renderUI.call(_self);
			_self._createShape();
			_self._createMarker();
			_self._createLabel();      
    },
    
    bindUI : function(){
    	var _self = this;
    		
    	LegendItem.superclass.bindUI.call(_self);
    	_self.bindMouseEvent();
    	_self.bindClick();
    },
    //鼠标事件
    bindMouseEvent : function(){
    	var _self = this,
    		series = _self.get('series');

    	_self.on('mouseover',function(ev){
    		series.setActived && series.setActived();
    	}).on('mouseout',function(ev){
    		series.clearActived && series.clearActived();
    	});
    },
    //点击事件
    bindClick : function(){
    	var _self = this,
    		series = _self.get('series');

    	_self.on('click',function(){
    		var visible = series.get('visible');
    		if(visible){ //防止最后一个隐藏
    			var seriesParent = series.get('parent'),
    				count = seriesParent.getVisibleSeries().length;
    			if(count == 1){
    				return;
    			}
    		}
    		_self._setVisible(!visible);
    	});
    },
    //设置是否可见
		_setVisible : function(visible){
			var _self = this,
				series = _self.get('series'),
				shape = _self.get('shape'),
				marker = _self.get('marker'),
				color = visible ? series.get('color') : _self.get('hideColor') ;
			if(visible){
				series.get('parent').showSeries(series);
			}else{
				series.get('parent').hideSeries(series);
			}
			shape && shape.attr({
				stroke : color,
				fill : color
			});
			marker && marker.attr({
				stroke : color,
				fill : color
			});
		},
		//通过数据序列获取属性信息
		_getBySeries : function(name){
			var _self = this,
				series = _self.get('series');
			return series.get(name);
		},
		/**
		 * 获取legend item的宽度
		 * @return {Number} 宽度
		 */
		getWidth : function(){
			var _self = this,
				label = _self.get('label');
			return label.getBBox().width + MARKER_WIDTH;
		},
		_createLabel : function(){
			var _self = this,
				text = _self._getBySeries('name'),
				labelShape = _self.addShape('label',{
					x : MARKER_WIDTH,
					'text-anchor': 'start',
					y : 7,
					cursor : 'pointer',
					text : text
				});

			_self.set('label',labelShape);
		},
		//创建跟序列相关的图形
		_createShape : function(){
			var _self = this,
				type = _self._getBySeries('type'),
				color = _self._getBySeries('color'),
				shape;
			switch(type){
				case 'line' : 
					shape =	_self.addShape('line',{
							x1 : 3,
							y1 : 7,
							x2 : 17,
							y2 : 7,
							stroke : color,
							"stroke-width" : 2
						});
					break;
				case  'scatter':
					shape = null;
					break;
				case 'bubble' : 
					shape = _self.addShape('circle',{
						cx : 10,
						cy : 7,
						r : 5,
						fill : color,
						stroke : color,
						'fill-opacity' : .5
					});
					break;
				default : 
					shape = _self.addShape('rect',{
						x : 2,
						y : 2,
						width : 15,
						height : 10,
						fill : color,
						stroke : color
					});
					break;
			}
			shape && shape.attr('cursor','pointer');
			_self.set('shape',shape);
		},
		_createMarker : function(){
			var _self = this,
				markers = _self._getBySeries('markers'),
				marker;

			if(markers){
				marker = BUI.mix({},markers.marker);
				marker.radius = 3;
				marker.x = 10;
				marker.y = 7;
				marker = _self.addShape('marker',marker);
			}
			_self.set('marker',marker);
		}
	});

	return LegendItem;
});