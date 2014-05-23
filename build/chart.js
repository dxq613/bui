/**
 * @fileOverview Chart 模块的入口
 * @ignore
 */

define('bui/chart',['bui/common','bui/chart/chart','bui/chart/axis','bui/chart/series','bui/chart/plotrange','bui/chart/theme'],function (require) {
  
  var BUI = require('bui/common'),
    Chart = BUI.namespace('Chart');

  BUI.mix(Chart,{
    Chart : require('bui/chart/chart'),
    Axis : require('bui/chart/axis'),
    Series : require('bui/chart/series'),
    PlotRange : require('bui/chart/plotrange'),
    Theme : require('bui/chart/theme')
  });

  return Chart;
});
/**
 * @fileOverview 图表中的激活的元素
 * @ignore
 */

define('bui/chart/actived',function (require) {
	
	var BUI = require('bui/common');

	/**
	 * @protected
	 * @class BUI.Chart.Actived
	 * 控件可以被激活（active)的扩展
	 */
	var Actived = function(){

	};

	Actived.ATTRS = {

		/**
		 * 是否激活
		 * @type {Boolean}
		 */
		actived : {
			value : false
		}

	}; 

	BUI.augment(Actived,{
		/**
		 * 是否处于激活状态
		 * @return {Boolean} 激活状态
		 */
		isActived : function(){
			return this.get('actived');
		},
		/**
		 * 设置激活
		 */
		setActived : function(){
			this.setActiveStatus(true);
			this.set('actived',true);
		},
		/**
		 * @protected
		 * 设置图形的激活状态
		 * @param {Boolean} actived 是否激活
		 */
		setActiveStatus : function(actived){
			
		},
		/**
		 * 清除激活
		 */
		clearActived : function(){
			this.setActiveStatus(false);
			this.set('actived',false);
			if(this.clearActivedItem){
				this.clearActivedItem();
			}
		}
	});

	return Actived;
});/**
 * @fileOverview 子元素可以被激活
 * @ignore
 */

define('bui/chart/activedgroup',function  (require) {
	
	/**
	 * @class BUI.Chart.ActivedGroup
	 * @protected
	 * 元素可以激活的容器扩展
	 */
	var Group = function(){

	};

	Group.ATTRS = {
		
	};

	BUI.augment(Group,{

		/**
		 * @protected
		 * 是否激活
		 * @param {BUI.Chart.Actived} item 可以被激活的元素
		 * @return {BUI.Chart.Actived[]} 可以被激活的元素集合
		 */
		isItemActived : function(item){
			return item.isActived();
		},
		/**
		 * @protected
		 * 获取可以被激活的元素
		 * @return {BUI.Chart.Actived[]} 可以被激活的元素集合
		 */
		getActiveItems : function(){
			return this.get('children');
		},
		/**
		 * @protected
		 * 设置激活状态
		 * @param {BUI.Chart.Actived} item 可以被激活的元素
		 * @param {Boolean} actived 是否激活
		 */
		setItemActived : function(item,actived){
			if(actived){
				item.setActived();
			}else{
				item.clearActived();
			}
		},
		
		/**
		 * @protected
		 * 触发激活事件
		 * @param  {Object} item 可激活的子项
		 */
		onActived : function(item){
			this.fireUpGroup('actived',item);
		},
		/**
		 * @protected
		 * 触发取消激活事件
		 * @param  {Object} item 可激活的子项
		 */
		onUnActived : function(item){
			this.fireUpGroup('unactived',item);
		},
		/**
		 * 设置激活的元素
		 * @param {BUI.Chart.Actived} item 可以被激活的元素
		 */
		setActivedItem : function(item){
			var _self = this;

			_self.clearActivedItem();
			if(item && !_self.isItemActived(item)){
				_self.setItemActived(item,true);
				_self.onActived();
			}
			
		},
		/**
		 * 获取激活的元素
		 * @return {BUI.Chart.Actived} 激活的元素
		 */
		getActived : function(){
			var _self = this,
				items = _self.getActiveItems(),
				rst = null;

			BUI.each(items,function(item){
				if(_self.isItemActived(item)){
					rst = item;
					return false;
				}
			});

			return rst;
		},
		/**
		 * 清除激活的元素
		 */
		clearActivedItem : function(item){
			var _self = this;
			item = item || _self.getActived();
			if(item){
				_self.setItemActived(item,false);
				_self.onUnActived(item);
			}
				 
		}

	});

	return Group;
});/**
 * 内部显示Labels的控件扩展
 * @ignore
 */

define('bui/chart/showlabels',['bui/chart/labels'],function (require) {
	var BUI = require('bui/common'),
		Labels = require('bui/chart/labels');

	/**
	 * @class BUI.Chart.ShowLabels
	 * 内部显示文本集合
	 */
	var ShowLabels = function(){

	};

	ShowLabels.ATTRS = {

		/**
		 * 多个文本的配置项
		 * @type {Object}
		 */
		labels : {

		}
	};

	BUI.augment(ShowLabels,{
 
		/**
		 * @protected
		 * 渲染文本
		 */
		renderLabels : function(){
			var _self = this,
          labels = _self.get('labels'),
          labelsGroup;
      if(!labels){
        return;
      }
      if(!labels.items){
      	labels.items = [];
      }

      /*labels.x = _self.get('x');
      labels.y = _self.get('y');*/

      labelsGroup = _self.addGroup(Labels,labels);
      _self.set('labelsGroup',labelsGroup);
		},
		/**
		 * 设置labels
		 * @param  {Array} items items的配置信息
		 */
		resetLabels : function(items){
			var _self = this,
				labels = _self.get('labels');
				
			if(!labels){
				return;
			}
			
			var labelsGroup = _self.get('labelsGroup'),
				children = labelsGroup.get('children'),
				count = children.length;
			items = items || labels.items;
			BUI.each(items,function(item,index){
				if(index < count){
					var label = children[index];
					labelsGroup.changeLabel(label,item);
				}else{
					_self.addLabel(item.text,item);
				}
			});

			for(var i = count - 1; i >= items.length ; i--){
				children[i].remove();
			}
		},
		/**
		 * @protected
		 * 添加文本项
		 * @param {String|Number} value  显示的文本
		 * @param {Object} offsetPoint 显示的位置
		 */
    addLabel : function(value,offsetPoint){
      var _self = this,
          labelsGroup = _self.get('labelsGroup'),
          label = {},
          rst;
      if(labelsGroup){
      	label.text = value;
	      label.x = offsetPoint.x;
	      label.y = offsetPoint.y;
        label.point = offsetPoint;
	      rst = labelsGroup.addLabel(label);
      }
      return rst;
    },
    /**
     * @protected
     * 移除文本
     */
    removeLabels : function(){
    	var _self = this,
    		labelsGroup = _self.get('labelsGroup');
    	labelsGroup && labelsGroup.remove();
    }
	})

	return ShowLabels;
});/**
 * @fileOverview 图表中的文本信息
 * @ignore
 */

define('bui/chart/labels',['bui/common','bui/chart/plotitem','bui/graphic'],function (require) {
	
	var BUI = require('bui/common'),
		Item = require('bui/chart/plotitem'),
		Util = require('bui/graphic').Util,
		CLS_LABELS = 'x-chart-labels';

	/**
	 * @class BUI.Chart.Labels
	 * 文本集合
	 * @extends BUI.Chart.PlotItem
	 */
	var Labels = function(cfg){
		Labels.superclass.constructor.call(this,cfg);
	};

	Labels.ATTRS = {

		elCls : {
			value : CLS_LABELS
		},
		zIndex : {
			value : 6
		},
		/**
		 * 文本集合
		 * @type {Array}
		 */
		items : {

		},
		/**
		 * 内部label的默认配置信息
		 * @type {Object}
		 */
		label : {

		},
		/**
		 * 格式化函数 function (text,item)
		 * @type {Function}
		 */
		renderer : {

		},
		animate : {
			value : true
		},
		duration : {
			value : 400
		}

	};

	BUI.extend(Labels,Item);

	BUI.augment(Labels,{
		
		//渲染控件
		renderUI : function(){
			var _self = this;
			Labels.superclass.renderUI.call(_self);
			_self._drawLabels();
		},
		/**
		 * 添加文本
		 * @param {Object} item 文本配置项
		 */
		addLabel : function(item){
			var _self = this,
				items = _self.get('items'),
				count = items.length;
			items.push(item);

			return _self._addLabel(item,count);

		},
		//绘制文本
		_drawLabels : function(){
			var _self = this,
				items = _self.get('items'),
				cfg;

			BUI.each(items,function(item,index){
				_self._addLabel(item,index);
			});
		},

		_addLabel : function(item,index){
			var _self = this,
				cfg = _self._getLabelCfg(item,index);

			return _self._createText(cfg);
		},
		_getLabelCfg : function(item,index){
			var _self = this,
				label = _self.get('label'),
				renderer = _self.get('renderer');

			if(!BUI.isObject(item)){
				var tmp = item;
				item = {};
				item.text = tmp;
			}

			if(renderer){
				item.text = renderer(item.text,item,index);
			}
			if(item.text == null){
				item.text = '';
			}
			
			item.text = item.text.toString();
			item.x = (item.x || 0) + (label.x || 0);
			item.y = (item.y || 0) + (label.y || 0);
			cfg = BUI.merge(label,item);

			return cfg;
		},
		changeLabel : function(label,item){
			var _self = this,
				index = BUI.Array.indexOf(label,_self.get('children')),
				cfg = _self._getLabelCfg(item,index);
			if(label){
				label.attr('text',cfg.text);
				if(label.attr('x') != cfg.x || label.attr('y') != cfg.y){
					if(Util.svg && _self.get('animate') && !cfg.rotate){
						if(cfg.rotate){
							label.attr('transform','');
						}
						
						label.animate({
							x : cfg.x,
							y : cfg.y
						},_self.get('duration'));
					}else{
						label.attr(cfg);
						if(cfg.rotate){
							label.attr('transform',BUI.substitute('r{rotate} {x} {y}',cfg));
						}
					}
				}
				
			}
		},
		/**
		 * 创建按文本
		 * @private
		 */
		_createText : function(cfg){
			return this.addShape('label',cfg);
		}

	});


	return Labels;
});/**
 * @fileOverview 图例，用于标志具体的数据序列，并跟数据序列进行交互
 * @ignore
 */

define('bui/chart/legend',['bui/common','bui/chart/plotitem','bui/chart/legenditem'],function (require) {

  var BUI = require('bui/common'),
    PlotItem = require('bui/chart/plotitem'),
    Item = require('bui/chart/legenditem'),
    LINE_HEIGHT = 15,
    PADDING = 5;

  function min(x,y){
    return x > y ? y : x;
  }
  function max(x,y){
    return x > y ? x : y;
  }

  /**
   * @class BUI.Chart.Legend
   * 图例
   * @extends BUI.Chart.PlotItem
   * @mixins BUI.Chart.ActivedGroup
   */
  var Legend = function(cfg){
    Legend.superclass.constructor.call(this,cfg);
  };

  Legend.ATTRS = {
    zIndex : {
      value : 8
    },
    elCls : {
      value : 'x-chart-legend'
    },
    /**
     * 子项的配置项
     * @type {Array}
     */
    items : {

    },
    /**
     * 布局方式： horizontal，vertical
     * @type {String}
     */
    layout : {
      value : 'horizontal'
    },
    /**
     * 对齐位置的偏移量x
     * @type {Number}
     */
    dx : {
      value : 0
    },
    /**
     * 对齐位置的偏移量y
     * @type {Number}
     */
    dy : {
      value : 0
    },
    /**
     * 对齐方式,top,left,right,bottom
     * @type {String}
     */
    align : {
      value : 'bottom'
    },
    /**
     * 边框的配置项，一般是一个正方形
     * @type {Object}
     */
    back : {
      value : {
        stroke : '#909090',
        fill : '#fff'
      }
    }

  }

  BUI.extend(Legend,PlotItem);

  BUI.augment(Legend,{

    renderUI : function(){
      var _self = this
      Legend.superclass.renderUI.call(_self);
      _self._renderItems();
      _self._renderBorder();    
    },
    bindUI : function(){
      Legend.superclass.bindUI.call(_self);
      var _self = this;
      _self.on('mousemove',function(ev){
        ev.stopPropagation();
      });
    },
    _renderItems : function(){
      var _self = this,
        items = _self.get('items'),
        itemsGroup = _self.addGroup();

      _self.set('itemsGroup',itemsGroup);

      BUI.each(items,function(item,index){
        _self._addItem(item,index);
      });
    },
    /**
     * 添加图例
     * @param {Object} item 图例项的配置信息
     */
    addItem : function(item){
      var _self = this,
        items = _self.get('items');

      _self._addItem(item,items.length);
      _self.resetBorder();
      _self.resetPosition();
    },
    //添加图例
    _addItem : function(item,index){
      var _self = this,
        itemsGroup = _self.get('itemsGroup'),
        x = _self._getNextX(),
        y = _self._getNextY(),
        cfg = BUI.mix({x : x,y : y},item);

      cfg.legend = _self;
      itemsGroup.addGroup(Item,cfg);
    },

    //生成边框
    _renderBorder : function(){
      var _self = this,
        border = _self.get('back'),
        width,
        height,
        cfg,
        shape;

      if(border){
        width = _self._getTotalWidth();
        height = _self._getTotalHeight();

        cfg = BUI.mix({
          r: 5,
          width : width,
          height : height
        },border);

        shape = _self.addShape('rect',cfg);
        shape.toBack();
        _self.set('borderShape',shape);
      }
    },
    //重置边框
    resetBorder : function(){
      var _self = this,
        borderShape = _self.get('borderShape');
      if(borderShape){
        borderShape.attr({
          width : _self._getTotalWidth(),
          height : _self._getTotalHeight()
        });
      }
    },
    //定位
    resetPosition : function(){
      var _self = this,
        align = _self.get('align'),
        plotRange = _self.get('plotRange'),
        top = plotRange.tl,
        end = plotRange.br,
        dx = _self.get('dx'),
        dy = _self.get('dy'),
        width = _self._getTotalWidth(),
        x,y;
      switch(align){
        case 'top' :
          x = top.x;
          y = top.y;
          break;
        case 'left':
          x = top.x - width;
          y = (top.y + end.y)/2;
          break;
        case 'right':
          x = end.x;
          y = (top.y + end.y)/2;
          break;
        case 'bottom':
          x = (top.x + end.x) /2 - width/2;
          y = end.y;
        default : 
          break;
      }

     _self.move(x+dx,y+dy);

    },
    //获取总的个数
    _getCount : function(){

      return this.get('itemsGroup').get('children').length;
    },
    //获取下一个图例项的x坐标
    _getNextX : function(){
      var _self = this,
        layout = _self.get('layout'),
        
        nextX = PADDING;
      if(layout == 'horizontal'){
        var children = _self.get('itemsGroup').get('children');
        BUI.each(children,function(item){
          if(item.isGroup){
            nextX += (item.getWidth() + PADDING);
          }
        });
      }
      return nextX;
    },
    //获取下一个图例项的y坐标
    _getNextY : function(){
      var _self = this,
        layout = _self.get('layout');
      if(layout == 'horizontal'){
        return PADDING;
      }else{
        return LINE_HEIGHT * _self._getCount() + PADDING ;
      }
    },
    //获取总的宽度
    _getTotalWidth : function(){
      var _self = this;
      if(_self.get('layout') == 'horizontal'){
        return this._getNextX();
      }else{
        var children = _self.get('itemsGroup').get('children'),
          max = PADDING;
        BUI.each(children,function(item){
          var width = item.getWidth();
          if(item.isGroup && width > max){
            max = width;
          }
        });
        return max + PADDING * 2;
      }
      
    },
    //获取整体的高度
    _getTotalHeight : function(){
      var _self = this,
        nextY = _self._getNextY();

      if(_self.get('layout') == 'horizontal'){
        return LINE_HEIGHT + PADDING * 2;
      }
      return nextY + PADDING;
    }
  });

  return Legend;
});
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
});/**
 * @fileOverview 显示点的标记
 * @ignore
 */

define('bui/chart/markers',['bui/chart/plotitem','bui/graphic','bui/chart/activedgroup'],function (require) {

	var BUI = require('bui/common'),
		Util = require('bui/graphic').Util,
		Group = require('bui/chart/activedgroup'),
		PlotItem = require('bui/chart/plotitem');

		
	
	/**
	 * @class BUI.Chart.Markers
	 * 显示点的标记集合
	 * @extends BUI.Chart.PlotItem
	 */
	var Markers = function(cfg){
		Markers.superclass.constructor.call(this,cfg);
	};


	BUI.extend(Markers,PlotItem);

	BUI.mixin(Markers,[Group]);

	Markers.ATTRS = {
		elCls : {
			value : 'x-chart-markers'
		},
		zIndex : {
			value : 6
		},
		/**
		 * 标记的配置项
		 * @type {Object}
		 */
		marker : {

		},
		/**
		 * 标记处于active状态时的配置项
		 * @type {Object}
		 */
		actived : {

		},
		/**
		 * 是否只有一个marker
		 * @type {Boolean}
		 */
		single : {
			value : false
		},
		/**
		 * @private
		 */
		xCache : {
			value : [],
			shared : false
		}

	};

	BUI.augment(Markers,{

		//渲染控件
		renderUI : function(){
			var _self = this;
			Markers.superclass.renderUI.call(_self);
			_self._drawMarkers();
		},
		/**
		 * @protected
		 * 是否激活
		 * @param {BUI.Chart.Actived} item 可以被激活的元素
		 * @return {BUI.Chart.Actived[]} 可以被激活的元素集合
		 */
		isItemActived : function(item){
			return item.get('actived');
		},
		/**
		 * @protected
		 * 设置激活状态
		 * @param {BUI.Chart.Actived} item 可以被激活的元素
		 * @param {Boolean} actived 是否激活
		 */
		setItemActived : function(item,actived){
			var _self = this,
				marker = _self.get('marker'),
				activedCfg = _self.get('actived'),
				single = _self.get('single');
			if(actived){
				item.attr(activedCfg);
				item.set('actived',true);
				if(single && !item.get('visible')){
					item.show();
				}
			}else{
				item.attr(marker);
				item.set('actived',false);
				if(single){
					item.hide();
				}
			}
		},
		/**
		 * 标记改变
		 * @param {Array} items 标记集合
		 */
		change : function(items){
			var _self = this,
				children = _self.get('children'),
				xCache = [];
			
			// 假如是single模式,就不change
			if (_self.get('single')) {
				return ;
			}
			_self.set('items',items);

			BUI.each(items,function(item,index){
				var marker = children[index];
				if(marker){
					if(Util.svg){
						marker.animate({
							x : item.x,
							y : item.y
						},400);
					}else{
						marker.attr(item);
					}
					xCache.push(item.x);
				}else{
					_self._addMarker(item);
				}
				
			});

			var count = _self.getCount();
			for(var i = count - 1 ; i > items.length - 1; i--){
				_self.getChildAt(i).remove();
			}

			_self.set('xCache',xCache); //清空缓存

		},
		_drawMarkers : function(){
			var _self = this,
				single = _self.get('single'),
				items = _self.get('items');

			if(single){
				items = [{x : 0 ,y : 0,visible:false}];
			}
			BUI.each(items,function(item){
				_self._addMarker(item)
			});
		},
		/**
		 * 添加marker
		 * @param {Object} item marker的配置信息
		 */
		addMarker : function(item){
			return this._addMarker(item);
		},
		//添加marker
		_addMarker : function(item){
			var _self = this,
				xCache = _self.get('xCache'),
				marker = _self.get('marker'),
				cfg = BUI.merge(marker,item);

			xCache.push(parseInt(item.x));
			return _self.addShape('marker',cfg);
				
		},
		/**
		 * 获取逼近的marker
		 * @return {BUI.Graphic.Shape} marker
		 */
		getSnapMarker : function(point,tolerance){
			var _self = this,
				xCache = _self.get('xCache'),
				single = _self.get('single'),
				rst;

			if(single){
				return _self.getChildAt(0);
			}
			if(BUI.isObject(point)){
				var children = _self.get('children');
				BUI.each(children,function(marker){
					if(marker.attr('x') == point.x && marker.attr('y') == point.y){
						rst = marker;
						return false;
					}
				});
			}else{
				var	snap = Util.snapTo(xCache,point,tolerance),
				index = BUI.Array.indexOf(snap,xCache);
				rst =  _self.getChildAt(index);
			}

			return rst;
		}
	});

	return Markers;
});
/**
 * @fileOverview 坐标系内部区域,用于显示背景
 * @ignore
 */

define('bui/chart/plotback',['bui/common','bui/chart/plotitem'],function (require) {
	
	var BUI = require('bui/common'),
		PlotItem = require('bui/chart/plotitem'),
		PlotRange = require('bui/chart/plotrange');

	/**
	 * @class BUI.Chart.PlotBack
	 * @protected
	 * 决定图表的边框、背景
	 * @extends BUI.Chart.PlotItem
	 */
	var PlotBack = function(cfg){
		PlotBack.superclass.constructor.call(this,cfg);
	};

	PlotBack.ATTRS = {

		elCls : {
			value : 'x-chart-back'
		},
		zIndex : {
			value : 0
		},
		/**
		 * 边距，来决定绘图范围,如果是一个值那么4个边框都是统一的数字，如果是一个数组，则4个边框分别对应值
		 * @type {Array|Number}
		 */
		margin : {
			value : 20
		},
		/**
		 * 绘图的范围
		 * @type {Object}
		 */
		plotRange : {

		},
		/**
		 * 背景
		 * @type {Object}
		 */
		background : {
			
		},
		/**
		 * 最外层边框的配置项
		 * @type {Object}
		 */
		border : {

		}
	};

	BUI.extend(PlotBack,PlotItem);

	BUI.augment(PlotBack,{

		beforeRenderUI : function(){
			PlotBack.superclass.beforeRenderUI.call(this);
			this._calculateRange();
		},

		renderUI : function(){
			PlotBack.superclass.renderUI.call(this);
			this._renderBorder();
			this._renderBackground();
		},
		//渲染边框
		_renderBorder : function(){
			var _self = this,
				border = _self.get('border'),
				canvas = _self.get('canvas'),
				cfg;

			if(border){
				cfg = BUI.mix({
					width : canvas.get('width'),
					height : canvas.get('height')
				},border);

				this.addShape('rect',cfg);
			}
		},
		//渲染背景
		_renderBackground : function(){
			var _self = this,
				background = _self.get('background'),
				plotRange = _self.get('plotRange'),
				width,
				height,
				tl,
				cfg;

			if(background){

				width = plotRange.getWidth();
				height = plotRange.getHeight();
				tl = plotRange.tl;
				cfg = {
					x : tl.x,
					y : tl.y,
					width : width,
					height :height
				};
				//图片
				if(background.image){

					cfg.src = background.image;

					_self.addShape('image',cfg);

				}else{//矩形
					BUI.mix(cfg,background);

					_self.addShape('rect',cfg);
				}
			}
		},
		//计算，设置绘图区域
		_calculateRange : function(){

			var _self = this,
				margin = _self.get('margin'),
				canvas = _self.get('canvas'),
				width = canvas.get('width'),
				height = canvas.get('height'),
				plotRange,
				top = 0, //上方的边距
				left = 0, //左边 边距
				right = 0,
				bottom = 0,
				start, //坐标系开始的节点，从左下，到右上
				end; //结束的节点

			if(BUI.isNumber(margin)){
				top = left = right = bottom = margin;
			}
			if(BUI.isArray(margin)){
				top = margin[0];
				right = margin[1] != null ? margin[1] : margin[0];
				bottom = margin[2] != null ? margin[2] : margin[0];
				left = margin[3] != null ? margin[3] : right;
			}

			start = canvas.getRelativePoint(left,height - bottom);
			end = canvas.getRelativePoint(width - right,top);

			plotRange = new PlotRange(start,end);
			_self.set('plotRange',plotRange);

		}
	});


	return PlotBack;
});/**
 * @fileOverview 所有图表内部元素的基类，继承自group
 * @ignore
 */

define('bui/chart/plotitem',['bui/common','bui/graphic'],function (require) {

	var BUI = require('bui/common'),
		Graphic = require('bui/graphic');

	function initClassAttrs(c){
    if(c._attrs || c == Graphic.Group){
      return;
    }

    var superCon = c.superclass.constructor;
    if(superCon && !superCon._attrs){
      initClassAttrs(superCon);
    }
    c._attrs =  {};
    
    BUI.mixAttrs(c._attrs,superCon._attrs);
    BUI.mixAttrs(c._attrs,c.ATTRS);
  }

	/**
	 * @class BUI.Chart.PlotItem
	 * 图表内部元素的基类
	 * @extends BUI.Graphic.Group
	 * 
	 */
	function Item(cfg){
		initClassAttrs(this.constructor);
		Item.superclass.constructor.call(this,cfg);
	};

  Item.ATTRS = {
    /**
     * 活动子项的名称，用于组成 itemactived,itemunactived的事件
     * @protected
     * @type {String}
     */
    itemName : {
      value : 'item'
    },
    /**
     * 所属分组的名称,用于事件中标示父元素
     * @protected
     * @type {String}
     */
    groupName : {
      value : ''
    }
  };

	BUI.extend(Item,Graphic.Group);

	BUI.augment(Item,{
		//获取默认的属性
		getDefaultCfg : function(){
			var _self = this,
				con = _self.constructor,
				attrs = con._attrs,
				rst = {};

			for (var p in attrs) {
        if(attrs.hasOwnProperty(p)){
          var attr = attrs[p],
          	value = attr.value;
          if(value != null){
          	if(attr.shared === false){
          		if(BUI.isObject(value)){
          			rst[p] = {};
          		}
          		if(BUI.isArray(value)){
          			rst[p] = [];
          		}
	            
	            BUI.mixAttr(rst[p], value); 
	          }else{
	            rst[p] = value;
	          }
          }
          
        }
      }
			return rst;
		},
    /**
     * 在顶层图表控件上触发事件
     * @param {String} name 事件名称
     * @param  {Object} ev 事件对象
     */
    fireUp : function(name,ev){
      var _self = this,
        canvas = _self.get('canvas'),
        chart = canvas.chart;
      if(chart){
        ev.target = ev.target || chart;
        chart.fire(name,ev);
      }
    },
    /**
     * @protected
     * 在分组上触发事件
     * @param  {String} name 事件名称
     * @param  {Object} item 触发事件的子项
     * @param  {Object} obj  事件对象
     */
    fireUpGroup : function(name,item,obj){
      var _self = this,
        itemName = _self.get('itemName'),
        groupName = _self.get('groupName');
      obj = obj || {};
      obj[itemName] =  item;
      if(groupName){
        obj[groupName] = _self.get('parent')
      }
      _self.fireUp(itemName.toLowerCase() + name,obj);
    }
	});

	return Item;
});/**
 * @fileOverview 坐标轴区域
 * @ignore
 */

define('bui/chart/plotrange',function (require) {
	

	function min(x,y){
		return x > y ? y : x;
	}
	function max(x,y){
		return x > y ? x : y;
	}

	/**
	 * @class BUI.Chart.PlotRange
	 * 用于计算是否在坐标轴内的帮助类
	 * @protected
	 */
	function PlotRange(start,end){
		this.start = start;
		this.end = end;
		this.init();
	};


	BUI.augment(PlotRange,{

		//初始化
		init : function(){
			var plotRange = this;

			start = plotRange.start;
    	end = plotRange.end;

    	//top-left
    	  var tl = plotRange.tl = {};
    	  tl.x = min(start.x,end.x);
    	  tl.y = min(start.y,end.y);
    	

    	//top-right
    		var tr = plotRange.tr = {};
    		tr.x = max(start.x,end.x);
    		tr.y = min(start.y,end.y);
    	//bottom-left
    		var bl = plotRange.bl = {};
    		bl.x = min(start.x,end.x);
    		bl.y = max(start.y,end.y);

    	//bottom-right
    		var br = plotRange.br = {};
    		br.x = max(start.x,end.x);
    		br.y = max(start.y,end.y);

    		var cc = plotRange.cc = {};
    		cc.x = (br.x - tl.x)/2 + tl.x;
    		cc.y = (br.y - tl.y)/2 + tl.y;
    	
		},
		/**
		 * 是否在范围内
		 * @param {Number} x x坐标
		 * @param {Number} y y坐标
		 * @return {Boolean}   是否在范围内
		 */
		isInRange : function(x,y){
			if(BUI.isObject(x)){
				y = x.y;
				x = x.x;
			}
			var  plotRange = this,
				tl = plotRange.tl,
				br = plotRange.br;

			return x >= tl.x && x <= br.x && y >= tl.y && y <= br.y;
		},
		/**
		 * 是否在垂直范围内
		 * @param  {Number}  y y坐标
		 * @return {Boolean} 在垂直范围内
		 */
		isInVertical : function(y){

			if(BUI.isObject(y)){
				y = y.y;
			}

			var  plotRange = this,
				tl = plotRange.tl,
				br = plotRange.br;

			return y >= tl.y && y <= br.y;
		},
		/**
		 * 是否在水平范围内
		 * @param  {Number}  x x坐标
		 * @return {Boolean}  是否在水平范围内
		 */
		isInHorizontal : function(x){

			if(BUI.isObject(x)){
				x = x.x;
			}

			var  plotRange = this,
				tl = plotRange.tl,
				br = plotRange.br;

			return x >= tl.x && x <= br.x;
		},
		/**
		 * 获取宽度
		 * @return {Number} 宽度
		 */
		getWidth : function(){
			var tl = this.tl,
				br = this.br;
			return br.x - tl.x;
		},
		/**
		 * 获取宽度
		 * @return {Number} 宽度
		 */
		getHeight : function(){
			var tl = this.tl,
				br = this.br;
			return br.y - tl.y;
		}

	});
	return PlotRange;
});/**
 * @fileOverview 图表的皮肤
 * @ignore
 */

define('bui/chart/theme',function (requrie) {

  var BUI = requrie('bui/common');

  /**
   * BUI.Chart.Theme
   * @param {Object} cfg  样式的配置项
   * @param {Object} base 扩展的样式
   */
  var Theme = function(base,cfg){

    return Theme.initTheme(base,cfg);
  };

  Theme.initTheme = function(base,cfg){
    return BUI.mix(true,{},base,cfg);
  };

  var lineCfg = {
    duration : 1000,
    line : {
      'stroke-width': 2,
      'stroke-linejoin': 'round',
      'stroke-linecap': 'round'
    },
    lineActived : {
      'stroke-width': 3
    },
    markers : {
      marker : {
        radius : 3
      },
      actived : {
        radius : 6,
        stroke: '#fff'
      }
    },
    animate : true
  };

  Theme.Origin = Theme({
    // colors : [ '#5e90c9','#1c2d3f','#a9d052','#a12d2d','#43bbb4','#5a2a94','#fabe3c','#2279dc','#e360e5','#48000c'],
    plotCfg : {
      margin : [50]
    },
    title : {
      'font-size' : '16px',
      'font-family' : 'SimSun,Georgia, Times, serif',
      'fill' : '#274b6d'
    },
    subTitle : {
      'font-size' : 14,
      'font-family' : 'tahoma,arial,SimSun,Georgia, Times, serif',
      'fill' : '#4d759e'
    },
    xAxis : {
      labels : {
        label : {
          y : 12
        }
      }
    },
    yAxis : {
      line : null,
      tickLine : null,
      grid : {
        line : {
          stroke : '#c0c0c0'
        }
      },
      title : {
        text : '',
        rotate : -90,
        x : -30
      },
      position:'left',
      labels : {
        label : {
          x : -12
        }
      }
    },
    legend : {
        dy : 30
    },
    seriesOptions : {
      lineCfg : lineCfg,
      areaCfg : lineCfg,
      bubbleCfg : {
        circle : {
            'stroke-width' : 1,
            'fill-opacity' : .5
        },
        activeCircle : {
            'stroke-width' : 2
        }
      },
      pieCfg : {
        colors : [ '#5e90c9','#1c2d3f','#a9d052','#a12d2d','#43bbb4','#5a2a94','#fabe3c','#2279dc','#e360e5','#48000c'],
        item : {
          stroke : '#fff'
        },
        labels : {
          distance : 30,
          label : {

          }
        }
      }

    },
    tooltip : {

    }

  });

  // 所有的基础样式.由于深度继承,所以数组类的自己覆盖
  Theme.Base = Theme.initTheme(Theme.Origin, {
    colors : [ '#5e90c9','#1c2d3f','#a9d052','#a12d2d','#43bbb4','#5a2a94','#fabe3c','#2279dc','#e360e5','#48000c'],
    symbols : ['circle','diamond','square','triangle','triangle-down'],
    plotCfg : {
      margin : [50,50,100]
    },
    seriesOptions : {
      pieCfg : {
        colors : [ '#5e90c9','#1c2d3f','#a9d052','#a12d2d','#43bbb4','#5a2a94','#fabe3c','#2279dc','#e360e5','#48000c']
      }
    }
  });





  // smooth风格的基础样式,色系分布均为6种.
  Theme.SmoothBase = Theme.initTheme(Theme.Origin, {
    title : {
      'fill' : '#444'
    },
    subTitle : {
      'fill' : '#999'
    },
    xAxis : {
      line : {
        'stroke-width' : 1,
        'stroke' : '#a7a7a7'
      },
      tickLine : {
        'stroke' : '#a7a7a7',
        'stroke-width' : 1,
        value : 5
      },
      labels : {
        label : {
          y : 12,
          fill: "#444"
        }
      }
    },
    yAxis : {
      grid : {
        line : {
          stroke : '#a7a7a7',//c9c3bb
          // "stroke-linecap" : "round",
          "stroke-dasharray" : "."
        }
      },
      title : {
        text : '',
        rotate : -90,
        x : -30,
        fill : "#444"
      },
      position:'left',
      labels : {
        label : {
          x : -12,
          fill: "#444"
        }
      }
    },
    plotCfg : {
      margin : [50,50,100]
    },
    colors : [ '#00a3d7','#6ebb46','#f6c100','#ff6a00','#e32400','#423ba8'],
    symbols : ['circle','diamond','square','triangle','triangle-down'],
    seriesOptions : {
      pieCfg : {
        colors : [ '#00a3d7','#6ebb46','#f6c100','#ff6a00','#e32400','#423ba8']
      }
    },
    tooltip: {
      offset : 10,
      title : {
        'font-size' : '10',
        'text-anchor' : 'start',
        x : 5,
        y : 15,
        fill:"#444"
      },
      value : {
        'font-size' : '12',
        'font-weight' :'normal',
        'text-anchor' : 'start',
        fill:"#444"
      },
      crossLine : {
        stroke : "#a7a7a7"
      }
    }
  });


  Theme.Smooth1 = Theme.initTheme(Theme.SmoothBase)

  Theme.Smooth2 = Theme.initTheme(Theme.SmoothBase, {
    colors : [ '#7179cb','#4dceff','#79c850','#ffb65d','#fc694b','#9a9792'],
    seriesOptions : {pieCfg : {
      colors : [ '#7179cb','#4dceff','#79c850','#ffb65d','#fc694b','#9a9792']
    }}
  })

  Theme.Smooth3 = Theme.initTheme(Theme.SmoothBase, {
    colors : [ '#40a00e','#444444','#85cc82','#5e5e64','#60b336','#89847f'],
    seriesOptions : {pieCfg : {
      colors : [ '#40a00e','#444444','#85cc82','#5e5e64','#60b336','#89847f']
    }}
  })

  Theme.Smooth4 = Theme.initTheme(Theme.SmoothBase, {
    colors : [ '#e1c673','#c49756','#8c6c42','#595348','#c86c4b','#7c4f34'],
    seriesOptions : {pieCfg : {
      colors : [ '#e1c673','#c49756','#8c6c42','#595348','#c86c4b','#7c4f34']
    }}
  })

  Theme.Smooth5 = Theme.initTheme(Theme.SmoothBase, {
    colors : [ '#89847f','#aea9a2','#606060','#232323','#d8d2c7','#444444'],
    seriesOptions : {pieCfg : {
      colors : [ '#89847f','#aea9a2','#606060','#232323','#d8d2c7','#444444']
    }}
  })

  Theme.Smooth6 = Theme.initTheme(Theme.SmoothBase, {
    colors : [ '#ff9d40','#89847f','#ff8127','#b4aea7','#ffba66','#606060'],
    seriesOptions : {pieCfg : {
      colors : [ '#ff9d40','#89847f','#ff8127','#b4aea7','#ffba66','#606060']
    }}
  })

  Theme.Smooth7 = Theme.initTheme(Theme.SmoothBase, {
    colors : [ '#25b0dd','#7fdcff','#30b2c8','#5dc5ee','#266796','#258bca'],
    seriesOptions : {pieCfg : {
      colors : [ '#25b0dd','#7fdcff','#30b2c8','#5dc5ee','#266796','#258bca']
    }}
  })



  return Theme;
});
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
/**
 * @fileOverview 抽象的坐标轴
 * @ignore
 */

define('bui/chart/abstractaxis',function (require) {
  
  var BUI = require('bui/common'),
    Item = require('bui/chart/plotitem'),
    Grid = require('bui/chart/grid'),
    Util = require('bui/graphic').Util,
    ShowLabels = require('bui/chart/showlabels'),
    CLS_AXIS = 'x-chart-axis';

  /**
   * @class BUI.Chart.Axis.Abstract
   * 抽象的坐标轴类
   * @extends BUI.Chart.PlotItem
   * @mixin BUI.Chart.ShowLabels
   */
  var Abstract = function(cfg){
    Abstract.superclass.constructor.call(this,cfg);
  };

  Abstract.ATTRS = {

    /**
     * 坐标轴上的坐标点
     * @type {Number}
     */
    ticks : {

    },
    /**
     * 显示数据的图形范围
     */
    plotRange : {

    },
    /**
     * 坐标轴线的配置信息,如果设置成null，则不显示轴线
     * @type {Object}
     */
    line : {
        
    },
    /**
     * 标注坐标线的配置
     * @type {Object}
     */
    tickLine : {
        
    },
    /**
     * 栅格配置
     * @type {Object}
     */
    grid : {

    },
    /**
     * 坐标轴上的文本
     * @type {Object}
     */
    labels : {

    },
    /**
     * 是否自动绘制
     * @type {Object}
     */
    autoPaint : {
        value : true
    },
    /**
     * 格式化坐标轴上的节点
     * @type {Function}
     */
    formatter : {

    }
  }

  BUI.extend(Abstract,Item);

  BUI.mixin(Abstract,[ShowLabels]);

  BUI.augment(Abstract,{
    beforeRenderUI : function(){
      Abstract.superclass.beforeRenderUI.call(this);
      this.set('pointCache',[]);
    },
     /**
     * @protected
     * 渲染控件
     */
    renderUI : function(){
        var _self = this;
        Abstract.superclass.renderUI.call(_self);

        _self.renderLabels();
        
        if(_self.get('title')){
            _self._renderTitle();
        }
        if(_self.get('autoPaint')){
            _self.paint();
        }
    },
    /**
     * 绘制坐标轴
     */
    paint : function(){
        var _self = this;
        _self._drawLines();
        _self._renderTicks();
        _self._renderGrid(); 
    },
    //渲染标题
    _renderTitle : function(){
        

    },
    //渲染栅格
    _renderGrid : function(){
        var _self = this,
            grid = _self.get('grid'),
            gridGroup,
            plotRange;
        if(!grid){
            return;
        }
        gridGroup = _self.get('parent').addGroup(Grid,grid);
        _self.set('gridGroup',gridGroup);
    },
    /**
     * 是否在坐标轴内
     * @return {Boolean} 是否在坐标轴内
     */
    isInAxis : function(x,y){
      var _self = this,
        plotRange = _self.get('plotRange');
    
      return plotRange && plotRange.isInRange(x,y);
    },
    /**
     * @protected
     * 获取坐标轴的path
     * @return {String|Array} path
     */
    getLinePath : function(){

    },
    //获取坐标轴上的节点位置
    getOffsetPoint : function(index){

    },
    /**
     * 根据画板上的点获取坐标轴上的值，用于将cavas上的点的坐标转换成坐标轴上的坐标
     * @param  {Number} offset 
     * @return {Number} 点在坐标轴上的值
     */
    getValue : function(offset){

    },
    /**
     * 获取逼近坐标点的值
     * @param  {Number} offset 画布上的点在坐标轴上的对应值
     * @param {Number} [tolerance] 容忍的区间
     * @return {Number} 坐标轴上的值
     */
    getSnapValue : function(offset,tolerance){
        var _self = this,
            pointCache = _self.get('pointCache');
        return Util.snapTo(pointCache,offset);
            
    },
    /**
     * 获取坐标点的个数
     * @return {Number} 坐标点的个数
     */
    getTicksCount : function(){
      return this.get('ticks').length;
    },
    /**
     * @protected
     * 获取显示坐标点的位置
     */
    getTickOffsetPoint : function(index){
        return this.getOffsetPoint(index);
    },
    /**
     * 将指定的节点转换成对应的坐标点
     * @param  {Number} index 顺序 
     * @return {Number} 节点坐标点（单一坐标）x轴的坐标点或者y轴的坐标点
     */
    getOffsetByIndex : function(index){
       
    },
    _drawLines : function(){
      var _self = this,
          lineAttrs = _self.get('line'),
          ticks = _self.get('ticks'),
          path;

      if(lineAttrs){
          path = _self.getLinePath();
          lineAttrs = BUI.mix({
            path : path
          },lineAttrs);
          var lineShape = _self.addShape({
              type :'path',
              elCls : CLS_AXIS + '-line',
              attrs :lineAttrs
          });
          _self.set('lineShape',lineShape);
      }
       _self._processTicks(ticks);
    },
    
    //处理节点
    _processTicks : function(ticks,reset){
       var _self = this,
          pointCache = _self.get('pointCache'),
          labels = _self.get('labels');

      ticks = ticks || _self.get('ticks');
      BUI.each(ticks,function(tick,index){
        var tickOffsetPoint = _self.getTickOffsetPoint(index),
              offsetPoint = _self.getOffsetPoint(index),
              offset = _self.getOffsetByIndex(index);

          pointCache.push(offset);
          if(_self.get('tickLine')){
              _self._addTickItem(tickOffsetPoint,offset);
          }
          if(_self.get('grid')){
              _self._addGridItem(tickOffsetPoint);
          }
          if(labels){
            if(!reset){
                _self.addLabel(_self.formatPoint(tick),offsetPoint,offset);
            }else{
              labels.items.push({
                  text : _self.formatPoint(tick),
                  x : offsetPoint.x,
                  y : offsetPoint.y
              });
            }
              
          }
      });
    },
    
    //渲染ticks
    _renderTicks : function(){
      var _self = this,
          tickItems = _self.get('tickItems'),
          lineAttrs = _self.get('tickLine'),
          path = '',
          cfg = BUI.mix({},lineAttrs);
      if(tickItems){
          BUI.each(tickItems,function(item){
              var subPath = BUI.substitute('M{x1} {y1}L{x2} {y2}',item);
              path += subPath;
          });
          
          delete cfg.value;
          cfg.path = path;

          var tickShape =  _self.addShape({
              type : 'path',
              elCls : CLS_AXIS + '-ticks',
              attrs : cfg
          });
          _self.set('tickShape',tickShape);
          
          
      }
    },
    //添加坐标轴上的坐标点
    _addTickItem : function(offsetPoint,offset){
        var _self = this,
            tickItems = _self.get('tickItems'),
            cfg = {
                x1 : offsetPoint.x,
                y1 : offsetPoint.y
            },
            end = _self.getTickEnd(cfg,offset);
        
        if(!tickItems){
            tickItems = [];
            _self.set('tickItems',tickItems);
        }
        BUI.mix(cfg,end);
        tickItems.push(cfg);
    },
    /**
     * @protected
     * 获取标示坐标点的线的终点
     */
    getTickEnd : function(start,offset){

    },
    /**
     * 格式化坐标轴上的节点，用于展示
     * @param  {*} value 格式化文本
     * @return {String}  格式化后的信息
     */
    formatPoint : function(value){
        var _self = this,
            formatter = _self.get('formatter');
        if(formatter){
            value = formatter.call(this,value);
        }
        return value;
    },
    //添加栅格节点
    _addGridItem : function(offsetPoint){
      var _self = this,
          grid = _self.get('grid'),
          plotRange = _self.get('plotRange'),
          item = {},
          cfg;
      if(!grid.items){
          grid.items = [];
      }
      cfg = _self.getGridItemCfg(offsetPoint);
      BUI.mix(item,cfg);
      grid.items.push(item);
    },
    /**
     * 获取栅格项的配置信息，一般是起始点信息
     * @protected
     */
    getGridItemCfg : function(offsetPoint){

    },
    //移除控件前移除对应的grid和labels
    remove : function(){
        
        var _self = this,
            gridGroup = _self.get('gridGroup'),
            labelsGroup = _self.get('labelsGroup');
        gridGroup && gridGroup.remove();
        _self.removeLabels();
        Abstract.superclass.remove.call(this);
    }
  });

  return Abstract;
});/**
 * @fileOverview 坐标轴的基类
 * @ignore
 */

define('bui/chart/baseaxis',['bui/common','bui/graphic','bui/chart/abstractaxis'],function(require) {

    var BUI = require('bui/common'),
        Abstract = require('bui/chart/abstractaxis'),
        Util = require('bui/graphic').Util,
        CLS_AXIS = 'x-chart-axis';

    //是否在2个数之间
    function isBetween(x,x1,x2){
        if(x1 > x2){
            var temp = x2;
            x2 = x1;
            x1 = temp;
        }
        return x >= x1 && x <= x2;
    }

    /**
     * @class BUI.Chart.Axis
     * 坐标轴
     * @extends BUI.Chart.Axis.Abstract
     */
    function Axis(cfg){
        Axis.superclass.constructor.call(this,cfg);
    }

    Axis.ATTRS = {
        zIndex : {
            value : 4
        },
        /**
         * 距离初始位置的x轴偏移量,仅对于左侧、右侧的纵向坐标有效
         * @type {Number}
         */
        x : {

        },
        /**
         * 距离初始位置的y轴偏移量，仅对顶部、底部的横向坐标轴有效
         * @type {Number}
         */
        y : {

        },
        /**
         * 起始点
         * @type {Object}
         */
        start : {

        },
        /**
         * 终点
         * @type {Object}
         */
        end : {

        },
        /**
         * 起点终点的偏移量
         * @type {Number}
         */
        tickOffset : {
            value : 0
        },
        /**
         * 附加的样式
         * @type {String}
         */
        elCls : {
            value : CLS_AXIS
        },
        /**
         * 位置,此属性决定是横坐标还是纵坐标
         *
         * - top : 顶部的横向坐标轴
         * - bottrom : 底部的横向坐标轴
         * - left ：左侧纵向坐标轴
         * - right : 右侧纵向坐标轴
         * @type {String}
         */
        position : {
            value : 'bottom'
        },
        /**
         * 坐标轴线的配置信息,如果设置成null，则不显示轴线
         * @type {Object}
         */
        line : {
            value : {
                'stroke-width' : 1,
                'stroke' : '#C0D0E0'
            }
        },
        /**
         * 标注坐标线的配置
         * @type {Object}
         */
        tickLine : {
            value : {
                'stroke-width' : 1,
                'stroke' : '#C0D0E0',
                value : 5
            }
        }
       

    };

    BUI.extend(Axis,Abstract);


    BUI.augment(Axis,{

        //渲染控件前
        beforeRenderUI : function(){
            var _self = this,
                plotRange;
            Axis.superclass.beforeRenderUI.call(_self);
            plotRange = _self.get('plotRange');

            if(plotRange){
                var start = plotRange.start,
                    position = _self.get('position'),
                    end = {};
                if(_self.isVertical()){
                    if(position == 'left'){
                        end.y = plotRange.end.y;
                        end.x = start.x; 
                    }else{
                        start = {};
                        end = plotRange.end;
                        start.x = plotRange.end.x;
                        start.y = plotRange.start.y;
                    }
                    
                }else{
                    
                    end.x = plotRange.end.x;
                    end.y = start.y;
                }
                _self.set('start',start);
                _self.set('end',end);
            }

            _self.set('indexCache',{});
            _self.set('pointCache',[]);

        },
         /**
         * 改变坐标轴
         */
        change : function(info){
            var _self = this;
            if(_self.isChange(info.ticks)){
                _self._clearTicksInfo();
                _self.changeInfo(info);
                _self._processTicks(null,true);
                _self._changeTicks();
                _self._changeGrid();
                _self.resetLabels();
            }
        },
        /**
         * 坐标轴是否将要发生改变
         * @param  {Array}  ticks 新的坐标点
         * @return {Boolean}  是否发生改变
         */
        isChange : function(ticks){
          var _self = this,
              preTicks = _self.get('ticks');

          return  !BUI.Array.equals(ticks,preTicks);
        },
        /**
         * @protected
         * 更改信息
         */
        changeInfo : function(info){
            var _self = this;

            _self.set('ticks',info.ticks);
        },
        _clearTicksInfo : function(){
            var _self = this,
                grid = _self.get('grid'),
                labels = _self.get('labels');

            _self.set('pointCache',[]);
            _self.set('indexCache',[]);
            _self.set('tickItems',[]);

            if(grid){
                grid.items = [];
            }

            if(labels){
                labels.items = [];
            }

        },
        
        /**
         * 绘制坐标轴
         */
        paint : function(){
            var _self = this;
            _self._drawLines();
            _self._renderTicks();
            _self._renderGrid(); 
        },
        /**
         * 是否是纵坐标
         */
        isVertical : function(){
            var _self = this,
                isVertical = _self.get('isVertical'),
                position;
            if(isVertical != null){
                return isVertical;
            }
            position = _self.get('position');
            if(position == 'bottom' || position == 'top'){
                isVertical = false;
            }else{
                isVertical = true;
            }
            
            _self.set('isVertical',isVertical);
            return isVertical;
        },
        /**
         * 将指定的节点转换成对应的坐标点
         * @param  {*} value 数据值或者分类 
         * @return {Number} 节点坐标点（单一坐标）x轴的坐标点或者y轴的坐标点
         */
        getOffset : function(value){
            var _self = this,
                ticks = _self.get('ticks'),
                index = BUI.Array.indexOf(value,ticks);

            return _self.getOffsetByIndex(index);
        },
        /**
         * 起点的坐标位置，也就是cavas上的点的位置
         * @return {Number} 坐标点的位置
         */
        getStartOffset : function(){
            return this._getStartCoord();
        },
        /**
         * 终点的坐标位置，也就是cavas上的点的位置
         * @return {Number} 坐标点的位置
         */
        getEndOffset : function(){
            return this._getEndCoord();
        },
        /**
         * 根据画板上的点获取坐标轴上的值，用于将cavas上的点的坐标转换成坐标轴上的坐标
         * @param  {Number} offset 
         * @return {Number} 点在坐标轴上的值
         */
        getValue : function(offset){
            var _self = this,
                startCoord = _self._getStartCoord(),
                endCoord = _self._getEndCoord();

            if(offset < startCoord || offset > endCoord){
                return NaN;
            }

            return _self.parseOffsetValue(offset);
        },
        /**
         * 获取坐标轴上起点代表的值
         * @return {*} 起点代表的值
         */
        getStartValue : function(){
            var _self = this,
                ticks = _self.get('ticks');
            return ticks[0];
        },
        /**
         * 获取坐标轴终点代表的值
         * @return {*} 终点代表的值
         */
        getEndValue : function(){
            var _self = this,
                ticks = _self.get('ticks');
            return ticks[ticks.length - 1];
        },

        
        getSnapIndex : function(offset){
            var _self = this,
                pointCache = _self.get('pointCache'),
                snap = Util.snapTo(pointCache,offset);;
            return BUI.Array.indexOf(snap,pointCache);
        },
        _appendEndOffset : function(offset){
            var _self = this,
                tickOffset = _self.get('tickOffset'),
                directfactor;
            
            if(typeof tickOffset !== "number"){
              tickOffset = tickOffset[0];
            }
            if(tickOffset){
                directfactor = _self._getDirectFactor();
                if(offset == 0){
                    offset = offset + tickOffset * directfactor;
                }else if(offset > 0){
                
                    offset = offset + tickOffset;
                }else{
                    offset = offset - tickOffset;
                }
            }
            return offset;
        },
        /**
         * 将指定的节点转换成对应的坐标点
         * @param  {Number} index 顺序 
         * @return {Number} 节点坐标点（单一坐标）x轴的坐标点或者y轴的坐标点
         */
        getOffsetByIndex : function(index){
            var _self = this,
                length = _self._getLength(),
                ticks = _self.get('ticks'),
                count = ticks.length,
                offset = (length / (count - 1)) * index;

            return _self._appendEndOffset(offset) + _self._getStartCoord();
        },
        //获取坐标轴上的节点位置
        getOffsetPoint : function(index,current){

            var _self = this,
                ortho = _self._getOrthoCoord(),
                indexCache = _self.get('indexCache'); //根据索引获取值的缓存，防止重复计算

            if(!current){
                if(indexCache[index] !== undefined){
                    current = indexCache[index];
                }else{
                    current = _self.getOffsetByIndex(index);
                    indexCache[index] = current;
                }
                
            }
            
            if(_self.isVertical()){
                return {
                    x : ortho,
                    y : current
                };
            }

            return {
                x : current,
                y : ortho
            };

        },
        /**
         * @protected
         * 获取显示坐标点的位置
         */
        getTickOffsetPoint : function(index){
            return this.getOffsetPoint(index);
        },
       
        //获取坐标轴开始的点
        _getStartCoord : function(){
            var _self = this,
                start = _self.get('start');
            if(_self.isVertical()){
                return start.y;
            }else{
                return start.x;
            }
        },
        //获取平行于坐标轴的点
        _getOrthoCoord : function(){
            var _self = this,
                start = _self.get('start');
            if(_self.isVertical()){
                return start.x;
            }else{
                return start.y;
            }
        },
        //获取坐标轴结束的点
        _getEndCoord : function(){
            var _self = this,
                end = _self.get('end');
            if(_self.isVertical()){
                return end.y;
            }else{
                return end.x;
            }
        },
        //获取中间点的位置
        _getMiddleCoord : function(){
            var _self = this,
                start = _self._getStartCoord(),
                length = _self._getLength();
            return start + _self._appendEndOffset(length/2);
        },
        /**
         * 获取坐标轴的长度
         * @return {Number} 坐标轴长度
         */
        getLength : function(){
            return Math.abs(this._getLength());
        },
        /**
         * 获取坐标点之间的长度
         * @return {Number} 坐标点之间的宽度
         */
        getTickAvgLength : function(){
            var _self = this,
                ticks = _self.get('ticks');
            return _self.getLength()/(ticks.length - 1);
        },
        //获取坐标轴内部的长度，不计算偏移量
        _getLength : function(){
            var _self = this,
                start = _self.get('start'),
                offset = _self.get('tickOffset'),
                end = _self.get('end'),
                length;

            if(typeof offset !== "number"){
              offset = offset[0] + offset[1];
            }else{
              offset = offset * 2;
            }

            if(_self.isVertical()){
                length = end.y - start.y;
            }else{
                length = end.x - start.x;
            }
            if(length > 0){
                length = length - offset;
            }else{
                length = length + offset;
            }
            return length;
        },
        /**
         * @protected
         * 获取坐标轴的path
         * @return {String|Array} path
         */
        getLinePath : function(){
            var _self = this,
                start = _self.get('start'),
                end = _self.get('end'),
                path = [];

            path.push(['M',start.x,start.y]);
            path.push(['L',end.x,end.y]);
            return path;
        },
        getTickEnd : function(start){
            var _self = this,
                lineAttrs = _self.get('tickLine'),
                factor = _self._getAlignFactor(),
                value = lineAttrs.value,
                rst = {};

            if(_self.isVertical()){
                rst.x2 = start.x1 + value * factor;
                rst.y2 = start.y1;
            }else {
                rst.x2 = start.x1;
                rst.y2 = start.y1 + value * factor;
            }
            return rst;
        },
        _changeTicks : function(){
            var _self = this,
                tickShape = _self.get('tickShape'),
                tickItems = _self.get('tickItems'),
                path = '';
            
            if(!tickShape){
                if(tickItems && tickItems.length){
                    _self._renderTicks();
                }
                return;
            }
            BUI.each(tickItems,function(item){
                var subPath = BUI.substitute('M{x1} {y1}L{x2} {y2}',item);
                path += subPath;
            });
            Util.animPath(tickShape,path,2);
        },

        //获取方向的系数，坐标轴方向跟浏览器的方向是否一致
        _getDirectFactor : function(){
            var _self = this,
                directfactor = _self.get('directfactor'),
                position,
                start,
                end;
            if(directfactor){
                return directfactor;
            }
            directfactor = 1;
            position = _self.get('position');
            start = _self.get('start');
            end = _self.get('end');
            //判断方向是否与坐标系方向一致
            if(position == 'bottom' || position == 'top'){
                if(start.x > end.x){
                    directfactor = -1;
                }
            }else{
                if(start.y > end.y){
                    directfactor = -1;
                }
            }

            _self.set('directfactor',directfactor);
            return directfactor;
        },
        //获取文本、坐标点线方向的因子
        _getAlignFactor : function(){
            var _self = this,
                factor = _self.get('factor'),
                position;
            if(factor){
                return factor;
            }
            position = _self.get('position');

            if(position == 'bottom' || position == 'right'){
                factor = 1;
            }else{
                factor = -1;
            }
            _self.set('factor',factor);
            return factor;
        },
        //渲染标题
        _renderTitle : function(){
            var _self = this,
                title = _self.get('title'),
                middle = _self._getMiddleCoord(),
                offsetPoint = _self.getOffsetPoint(null,middle),
                cfg = BUI.mix({},title);
            if(title.text){


                cfg.x = offsetPoint.x + (title.x || 0);
                cfg.y = offsetPoint.y + (title.y || 0);
                _self.addShape({
                    type : 'label',
                    elCls : CLS_AXIS + '-title',
                    attrs : cfg
                });
            }

        },
        /**
         * 获取栅格项的配置信息，一般是起始点信息
         * @protected
         */
        getGridItemCfg : function(offsetPoint){
            var _self = this,
                item = {},
                plotRange = _self.get('plotRange');

            item.x1 = offsetPoint.x;
            item.y1 = offsetPoint.y;
            if(_self.isVertical()){
                item.y2 = item.y1;
                item.x2 = plotRange.end.x;
            }else{
                item.x2 = item.x1;
                item.y2 = plotRange.end.y;
            }

            return item;

        },

        _changeGrid : function(){
            var _self = this,
                grid = _self.get('grid'),
                gridGroup;
            if(!grid){
                return;
            }
            gridGroup = _self.get('gridGroup');

            gridGroup && gridGroup.change(grid.items);
        },
        //移除控件前移除对应的grid和labels
        remove : function(){
            
            var _self = this,
                gridGroup = _self.get('gridGroup'),
                labelsGroup = _self.get('labelsGroup');
            gridGroup && gridGroup.remove();
            _self.removeLabels();
            Axis.superclass.remove.call(this);
        }
    });

    return Axis;
});
/**
 * @fileOverview 自动计算坐标轴的坐标点、起始点，间距等信息
 * @ignore
 */

define('bui/chart/axis/auto',['bui/graphic'],function  (require) {
  
  var BUI = require('bui/common'),
    Util = require('bui/graphic').Util,
    snapArray = [0,1,1.5,2,2.5,3,4,5,6,8,10],
    intervalArray = [0,1,2.5,5,10],
    MIN_COUNT = 5, //最小6个坐标点
    MAX_COUNT = 7; //最多8个坐标点

  //是否为null
  function isNull(v){
    return v == null;
  }

  //获取系数
  function getFactor(v){
    var factor = 1;
    if(v < 1E-6){
      return factor;
    }
    while(v > 10){
      factor = factor * 10;
      v = v / 10;
    }

    while(v < 1){
      factor = factor / 10;
      v = v * 10;
    }
    return factor;
  }

  //获取逼近的数值
  function snapTo(v,isFloor,arr){ //假设 v = -512,isFloor = true

    arr =  arr || snapArray;
    var isMiddle = arr == snapArray ? false : true;

    var factor = 1; //计算系数
    if(v < 0){
      factor = -1;
    }
    v = v * factor;   //v = 512
    var tmpFactor = getFactor(v);
    factor = factor * tmpFactor;  // factor = -100

    v = v / tmpFactor; //v = 5.12

    if(isMiddle){
      v = snapMiddle(arr,v);
    }else if(isFloor && factor > 0){
      //小于
      v = Util.snapFloor(arr,v); //v = 5
    }else{
      v = Util.snapCeiling(arr,v); //v = 6
    }

    return v * factor;
  }

  function snapMiddle(arr,v){
    var big = v,
      little = v,
      rst = v;
    for (var i = 1; i < arr.length; i++) {
      var value = arr[i];
      if(value > v){
        big = value;
        break;
      }else{
        little = value;
      }
    };
    if(Math.abs(little - v) < Math.abs(big - v)){
      rst = little;
    }else{
      rst = big;
    }
    return rst;
  }

  function snapMultiple(v,base,ceil){
    //if(v > 0){
    if(ceil){
      var div = Math.ceil(v / base,10);
    }else{
      var div = Math.floor(v / base,10);
    }

    return div * base;
    
  }

  function tryFixed(v,base){
    var str = base.toString(),
      index = str.indexOf('.');
    if(index == -1){
      return v;
    }
    var length = str.substr(index + 1).length;
    return parseFloat(v.toFixed(length));
  }

  //分析数组
  function analyze(arr){
  
    var max = arr[0],
      min = arr[0],
      avg,
      total = arr[0],
      length = arr.length,
      deviation = 0,//偏差
      avg; 

    for (var i = 1; i < length; i ++) {
      var val = arr[i];
      if(max < val){
        max = val;
      }
      if(min > val){
        min = val;
      }
      total += val;

    };

    avg = total / length;

    for (var i = 0; i < length; i ++) {
      deviation += Math.abs(arr[i] - avg);
    };

    deviation = deviation / length;

    if(min == max){
      if(min > 0){
        min = 0;
      }else{
        max = 0;
      }
    }
    return {
      max : max,
      min : min,
      avg : avg,
      deviation : deviation
    };
  }

  //分析数据
  function analyzeData(data,parser,stacked){
    var arr = [];
    if(BUI.isArray(data[0])){
      if(stacked){
        BUI.each(data[0],function(value,index){
          var temp = value;
          for(var i = 1 ; i< data.length; i++){
            temp += data[i][index];
          }
          arr.push(temp);
        });
      }else{
        BUI.each(data,function(sub){
          arr = arr.concat(sub);
        });
      }
      
    }else{
      arr = data;
    }


    
    if(parser){
      arr = $.map(arr,parser);
    }

    return analyze(arr);

  }  

  /**
   * @class BUI.Chart.Axis.Auto
   * @private
   * 计算坐标轴的工具类
   */
  var Auto = {};

  /**
   * 计算坐标轴的信息
   * ** 初始信息 **
   * - data ： 多维数组， 需要渲染的数据
   * - min ： 坐标轴的最小值（可选）
   * - max : 坐标轴的最大值（可选）
   * - interval : 间距(可选)
   * @param  {Object} info 初始信息
   * @memberOf BUI.Chart.Axis.Auto
   * @return {Object} 计算后的信息
   */
  Auto.caculate = function(info,stackType){

    var 
      min = info.min,
      max = info.max,
      data = info.data,
      interval = info.interval,
      ticks = [],
      minCount = info.minCount || MIN_COUNT,
      maxCount = info.maxCount || MAX_COUNT,
      avgCount = (minCount + maxCount)/2,
      count,
      stacked = false;

    if(stackType) {
      if(stackType != 'none'){
        stacked = true;
      }
      if(stackType == 'percent'){
        min = 0;
        max = 100;
        interval = 25;
      }
    }


    if(isNull(min) || isNull(max) || isNull(interval)){

      var rst = analyzeData(data,null,stacked);

      //计算max
      if(isNull(max)){ 
        max = rst.max + 0.05 * (rst.max - rst.min);
      }

      //计算min
      if(isNull(min)){
        min = rst.min;
      }

      //计算间距
      if(isNull(interval)){
        var temp = (max - min) / avgCount ;// ( minCount -1); //防止方差过大
        if(rst.deviation > temp){
          interval = snapTo(temp,true,intervalArray);
        }else{
          if(rst.deviation){
            interval = snapTo(rst.deviation,true,intervalArray);
          }else{
            interval = snapTo(temp,true,intervalArray);
          }
          
        }
        
        count = parseInt((max - min) / interval,10);
        if(count > maxCount){
          count = maxCount;
        }
        if(count <  minCount){
          count = minCount;
        }

        interval = snapTo((max - min) / count,true,intervalArray) ;
        max = snapMultiple(max,interval,true);
        min = snapMultiple(min,interval);

        count = (max - min) / interval;
      }

    }

    //计算ticks
    if(isNull(count)){
      count = (max - min) / interval;
    }
    min = tryFixed(min,interval);
    if(!isNull(min)){
      ticks.push(min);
    }
    for(var i = 1 ; i <= count ;i++){
      ticks.push(tryFixed(interval * i + min,interval));
    }

    return {
      min : min,
      max : tryFixed(max,interval),
      interval : interval,
      count : count,
      ticks : ticks,
      info : rst
    }
  };

  /**
   * @memberOf BUI.Chart.Axis.Auto
   * 时间计算
   * @type {Object}
   */
  Auto.Time = {};

  var MINUTE_MS = 60 * 1000,
    HOUR_MS = 3600 * 1000,
    DAY_MS = 24 * 3600 * 1000;

  //将时间转换成天
  function floorDate(date){
    date = new Date(date);
    return BUI.Date.getDate(date).getTime();
  }

  function ceilDate(date){
    date = new Date(date);
    var temp = BUI.Date.getDate(date);
    if(!BUI.Date.isDateEquals(date,temp)){ //如果不是整天，则取整，添加一天
      temp = BUI.Date.addDay(1,temp);
    }
    return temp.getTime();;
  }

  function getYear(date){
    return new Date(date).getFullYear();
  }

  function createYear(year){
    return new Date(year,0,01).getTime();
  }

  function getMonth(date){
    return new Date(date).getMonth();
  }

  function diffMonth(min,max){
    var minYear = getYear(min),
      maxYear = getYear(max),
      minMonth = getMonth(min),
      maxMonth = getMonth(max);

    return (maxYear - minYear) * 12 + (maxMonth - minMonth)%12;
  }

  function creatMonth(year,month){
    return new Date(year,month,01).getTime();
  }

  function diffDay(min,max){
    return Math.ceil((max - min) / DAY_MS);
  }

  function diffHour(min,max){
    return Math.ceil((max - min) / HOUR_MS);
  }

  function diffMinus(min,max){
    return Math.ceil((max - min) / 60 * 1000);
  }

  //时间坐标轴自动计算
  Auto.Time.caculate = function(info){
    var min = info.min,
      max = info.max,
      data = info.data,
      interval = info.interval,
      ticks = [],
      count;
      


    if(isNull(min) || isNull(max) || isNull(interval)){
      var rst = analyzeData(data,function(date){
        if(BUI.isDate(date)){
          date = date.getTime();
        }
        if(BUI.isString(date)){
          date = date.replace(/-/ig,'/');
          date = new Date(date);
        }
        return date;
      });

      if(isNull(max)){
        max = rst.max;
      }

      if(isNull(min)){
        min = rst.min;
      }

      //如果间距大于一天
      if((max - min) > DAY_MS){ 
        min = floorDate(min);
        max = ceilDate(max);
      }
      if(max == min){
        throw 'max not  equal to min';
      }

      //计算间距
      if(isNull(interval)){
        var innerTime = max - min,
          dms = DAY_MS, //天代表的秒
          yms = 365 * dms, //年代表的秒
          yfactor,
          year; //占一年的多少

        interval = parseInt(innerTime / (info.maxCount || 8));
        yfactor = interval / yms;
        var minYear = getYear(min);
        //大于半年
        if(yfactor > 0.51){
          year = Math.ceil(yfactor);
          interval = year * yms;
          var maxYear = getYear(max);
            
          for(var i = minYear; i < maxYear + year; i = i + year){
            ticks.push(createYear(i));
          }
          interval = null;
        }else if(yfactor > 0.0834){//大于一个月
          var year = getYear(min),
            month = Math.floor(yfactor/0.0834),
            mmMoth = getMonth(min),
            dMonths = diffMonth(min,max);

          for(var i = 0; i <= dMonths + month; i = i + month){
            ticks.push(creatMonth(minYear, i+mmMoth));
          }
          interval = null;

        }else if(interval > dms){ //大于一天
          var date = new Date(min),
            year = date.getFullYear(),
            month = date.getMonth(min),
            mday = date.getDate(),
            day = Math.ceil(interval / dms),
            ddays = diffDay(min,max);
          interval = day * dms;
          for(var i = 0 ; i <= ddays + day; i = i + day){
            ticks.push(new Date(year,month,mday + i).getTime());
          }

        }else if(interval > HOUR_MS){ //大于一个小时
          var date = new Date(min),
            year = date.getFullYear(),
            month = date.getMonth(min),
            day = date.getDate(),
            hour = date.getHours(),
            hours = Math.ceil(interval / HOUR_MS),
            dHours = diffHour(min,max);
          interval = hours * HOUR_MS;

          for(var i = 0 ; i <= dHours + hours; i = i + hours){
            ticks.push(new Date(year,month,day,hour + i).getTime());
          }

        }else if(interval > MINUTE_MS) { //最小单位是分钟
          var dMinus = diffMinus(min,max),
            minutes = Math.ceil(interval / MINUTE_MS);
          interval = minutes * MINUTE_MS;

          for(var i = 0 ; i<= dMinus + minutes ; i = i + minutes){
            ticks.push(min + i * MINUTE_MS);
          }
        }else {
          if(interval < 1000){
            interval == 1000;
          }
          min = Math.floor(min / 1000) * 1000;
          var 
            dSeconds = Math.ceil((max - min) / 1000),
            seconds = Math.ceil(interval / 1000);
          interval = seconds * 1000;

          for(var i = 0; i< dSeconds + seconds; i = i + seconds){
            ticks.push(min + i * 1000);
          }
        }

      }

    }

    if(!ticks.length){
      min = Math.floor(min / 1000) * 1000;
      max = Math.ceil(max/1000) * 1000;
      var count = (max - min)/interval;
      for(var i = 0 ; i <= count ;i++){
        ticks.push(tryFixed(interval * i + min,interval));
      }
    }

    return {
      max : max,
      min : min,
      interval : interval,
      ticks : ticks,
      count : ticks.length
    }
  }

  return Auto;
});/**
 * @fileOverview  数字类型的坐标轴
 * @ignore
 */

define('bui/chart/numberaxis',['bui/chart/baseaxis','bui/common','bui/graphic'],function (require) {
	
	var BUI = require('bui/common'),
		Axis = require('bui/chart/baseaxis'),
		Util = require('bui/graphic').Util,
    abbrs = ['k','m','g','t'],
		NAN = NaN;

  //取小于当前值的
	var floor = Util.snapFloor,
	  ceiling = Util.snapCeiling;

	/**
	 * @class BUI.Chart.Axis.Number
	 * 数字坐标轴
	 * @extends BUI.Chart.Axis
	 */
	function NumberAxis(cfg){
		NumberAxis.superclass.constructor.call(this,cfg);
	}

	BUI.extend(NumberAxis,Axis);

	NumberAxis.ATTRS = {

		/**
		 * 坐标开始的最小值
		 * @type {Number}
		 */
		min : {

		},
		/**
		 * 坐标结束的最大值
		 * @type {Number}
		 */
		max : {

		},
		/**
		 * 坐标轴上节点的最小距离
		 * @type {Number}
		 */
		tickInterval : {

		},
		/**
     * 类型
     * @type {String}
     */
		type : {
			value : 'number'
		},
    /**
     * 格式化坐标轴上的节点
     * @type {Function}
     */
    formatter : {
      value : function(value){
        if(value == null || isNaN(value)){
          return '';
        }
        if(value < 1e3){
          return value;
        }
        var interval = this.get('tickInterval');
        if(interval % 1e3 !== 0){
          return value;
        }

        var base = 1e3;
        
        for(var i = 1 ; i <= abbrs.length;i++){

          if(value >= base && value < base * 1e3){
            return (value/base) + abbrs[i - 1];
          }
          base = base * 1e3;
        }

        return value/1e12 + 't';
      }
    }

	};

	BUI.augment(NumberAxis,{
		//渲染控件前
		beforeRenderUI : function(){
			var _self = this;
			NumberAxis.superclass.beforeRenderUI.call(_self);
			
			//如果未指定坐标轴上的点，则自动计算
			if(!_self.get('ticks')){
				var	ticks = _self._getTicks(_self.get('max'),_self.get('min'),_self.get('tickInterval'));

				_self.set('ticks',ticks);
			}
		},
    _getTicks : function(max,min,tickInterval){
      var ticks = [],
        count = (max - min)/tickInterval,
        cur;

        ticks.push(min);
        for(var i = 1 ; i <= count ;i++){
          cur = tickInterval * i + min;
          ticks.push(cur);
        }
        // if(cur != max){
        //   ticks.push(max);
        // }
        return ticks;
    },
   
    /**
     * @protected
     * 修改信息
     */
    changeInfo : function(info){
        var _self = this;

        if(info.interval){
          info.tickInterval = info.interval;
        }

        if(info.ticks){
          _self.set('ticks',info.ticks);
        }else{
          var ticks = _self._getTicks(info.max,info.min,info.tickInterval);
          _self.set('ticks',ticks);
        }
        
        info.tickInterval && _self.set('tickInterval',info.tickInterval);
    },
		/**
     * 将指定的节点转换成对应的坐标点
     * @param  {*} value 数据值或者分类 
     * @return {Number} 节点坐标点（单一坐标）x轴的坐标点或者y轴的坐标点
     */
    getOffset : function(value){
      value = parseFloat(value);
    	var _self = this,
    		offset = _self.getRelativeOffset(value);

    	return _self._appendEndOffset(offset) + _self._getStartCoord();
    },
    /**
     * 根据画板上的点获取坐标轴上的值，用于将cavas上的点的坐标转换成坐标轴上的坐标
     * @param  {Number} offset 
     * @return {Number} 点在坐标轴上的值,如果不在坐标轴上,值为NaN
     */
    getValue : function(offset){
        var _self = this,
            startCoord = _self._getStartCoord(),
            endCoord = _self._getEndCoord(),
            pointCache,
            floorVal,
            floorIndex,
            ceilingVal,
            tickInterval,
            ticks;

        if(offset < startCoord || offset > endCoord){
            return NaN;
        }
        pointCache = _self.get('pointCache');
        floorVal = floor(pointCache,offset); 
        floorIndex = BUI.Array.indexOf(floorVal,pointCache);
        ticks = _self.get('ticks');
        tickInterval = _self.get('tickInterval');
        avg = _self._getAvgLength(ticks.length);

        if(floorVal == offset){
        	return ticks[floorIndex];
        }

        if(tickInterval){
        	return ticks[floorIndex] + ((offset - floorVal) / avg) * tickInterval;
        }
        

        ceilingVal = ceiling(pointCache,offset);
        
        return ticks[floorIndex] + ((offset - floorVal) / avg) * (ticks[floorIndex + 1] - ticks[floorIndex]);;
        
    },
    _getAvgLength : function(count){
    	var _self = this,
    		length = _self._getLength();
    	return (length / (count - 1));
    },
		 /**
     * @protected
     * 获取相对位置
     * @param  {*} value 数据值或者分类 
     * @return {Number}  相对于坐标轴开始位置的偏移量
     */
    getRelativeOffset : function(value){
      var _self = this,
          ticks = _self.get('ticks'),
          index = BUI.Array.indexOf(value,ticks),
          tickInterval = _self.get('tickInterval'),
          floorVal,
          ceilingVal,
          avg = _self._getAvgLength(ticks.length),
          offset;

      //如果在指定的坐标点中，直接返回坐标点的位置
      if(index !== -1){
      	return avg * index;
      }
      //获取小于当前值的最后一个坐标点
      floorVal = floor(ticks,value);
      if(isNaN(floorVal)){
      	return NAN;
      }
      index = BUI.Array.indexOf(floorVal,ticks);
     	offset = avg * index;
      if(tickInterval){
      	offset = offset + ((value - floorVal)/tickInterval) * avg;
      }else{
      	ceilingVal = ceiling(ticks,value);
      	offset = offset + ((value - floorVal)/(ceilingVal - floorVal)) * avg;
      }
      
      return offset;
    }
	});

	return NumberAxis;
});/**
 * @fileOverview 表格的栅格背景
 * @ignore
 */

define('bui/chart/grid',['bui/common','bui/chart/plotitem'],function (require) {
	
	var BUI = require('bui/common'),
		Item = require('bui/chart/plotitem'),
		Util = require('bui/graphic').Util,
		CLS_GRID = 'x-chart-grid';

	function ensure(attrName,self,defVal){
		var item = self.get(attrName);
		if(!item){
			item = defVal;
			self.set(attrName,item);
		}
		return item;
	}

	function lines2path(lines,attrs){
		var path = '',
			cfg = BUI.mix({},attrs);

		BUI.each(lines,function(item){
      var subPath = BUI.substitute('M{x1} {y1}L{x2} {y2}',item);
  	  path += subPath;
    });
    cfg.path = path;
    return cfg;
	}


	/**
	 * @class BUI.Chart.Grid
	 * 背景栅格
	 * @extends BUI.Chart.PlotItem
	 */
	function Grid(cfg){
		Grid.superclass.constructor.call(this,cfg);
	}

	BUI.extend(Grid,Item);

	Grid.ATTRS = {
		zIndex : {
      value : 1
    },
		elCls : {
			value : CLS_GRID
		},
		/**
		 * 如果栅格线由多个点构成，线的类型
		 *
		 *  - line 不封闭的线
		 *  - polygon 封闭的多边形
		 *  - circle 圆
		 * @type {String}
		 */
		type : {
			value : 'line'
		},
		/**
		 * 线的样式配置
		 * @type {Object}
		 */
		line : {
			
		},
		/**
		 * 次要线的配置项
		 * @type {Number}
		 */
		minorLine : {

		},
		/**
		 * 2个Grid线中间的次要线的数目
		 * @type {Number}
		 */
		minorCount : {
			value : 0
		},
		/**
		 * 渲染函数，使用此函数时，将阻止默认线的生成
		 * @type {Function}
		 */
		renderer : {

		},
    /**
     * 线集合的配置
     * @type {Array}
     */
    items : {

    },
    /**
     * 栅格内部的奇数背景配置
     * @type {Object}
     */
    odd : {

    },
    /**
     * 栅格内部的偶数背景配置
     * @type {Object}
     */
    even : {

    },
    /**
     * 发生改变时是否触发动画
     * @type {Boolean}
     */
    animate : {
    	value : true
    },
    duration : {
    	value : 1000
    }

	};

	BUI.augment(Grid,{

		renderUI : function(){
			var _self = this;
    	Grid.superclass.renderUI.call(_self);
    	_self._drawLines();
		},
		//绘制栅格线
		_drawLines : function(){
			var _self = this,
				lineCfg = _self.get('line'),
				items = _self.get('items');

			if(items){
				var preItem;
				_self._precessItems(items);
				_self._drawGridLines(items,lineCfg,CLS_GRID + '-line');
				if(_self.get('minorCount')){
					_self.drawMinorLines();
				}
			}

		},
		//渲染自定义栅格，渲染奇偶线
		_precessItems : function(items){
			var _self = this,
				minorCount = _self.get('minorCount'),
				renderer = _self.get('renderer'),
				preItem;

			BUI.each(items,function(item,index){
					if(renderer){
						renderer.call(this,item,index);
					}else if(minorCount){
						if(preItem){
							_self._addMonorItem(item,preItem);
						}
					}
					if(preItem && (_self.get('odd') || _self.get('even'))){
						_self._drawOddEven(item,preItem,index);
					}
					
					preItem = item;
			});
		},
		/**
		 * 栅格改变
		 * @param  {Array} items 栅格点的坐标
		 */
		change : function(items){
			var _self = this;
			_self.set('items',items);
			_self._clearPre();
			_self._precessItems(items);
			_self._changeGridLines(items,CLS_GRID + '-line',true);
			_self._changeMinorLinses();

		},
		_clearPre : function(){
			var _self = this,
				items;
			if(_self.get('minorCount')){
				_self.set('minorItems',[]);
			}
			//除了栅格线外，全部清除
			items = _self.findBy(function(item){
					var elCls = item.get('elCls');
					if(elCls == CLS_GRID + '-line' || elCls == CLS_GRID + '-minor'){
						return false;
					}
					return true;
			});

			BUI.each(items,function(item){
				item.remove();
			});
		},
		//是否垂直
		_isVertical : function(item){
			if(item.x1 == item.x2){
				return true;
			}
			return false;
		},
		//画栅格
		_drawGridLines : function(items,lineCfg,cls){
			var _self = this,
        cfg = _self._linesToPath(items,lineCfg),
      	gridLine =	_self.addShape({
	        type : 'path',
	        elCls : cls,
	        attrs : cfg
	    	});
    	_self.set('gridLine' + cls,gridLine);
		},
		//更改栅格
		_changeGridLines : function(items,cls,animate){
			var _self = this,

        gridLine = _self.get('gridLine' + cls);
      if(gridLine){
      	var cfg = _self._linesToPath(items,{});
      	if(animate){
      		Util.animPath(gridLine,cfg.path,2);
      	}else{
      		gridLine.attr('path',cfg.path);
      	}
      	
      }else if(items && items.length){
      	var lineCfg;
      	if(cls == CLS_GRID + '-line'){
      		lineCfg = _self.get('line');
      	}else{
      		lineCfg = _self.get('minorLine');
      	}
      	_self._drawGridLines(items,lineCfg,cls);
      }
		},
		_linesToPath : function(items,lineCfg){
			var _self = this,
				path = [],
				type = _self.get('type'),
				cfg;
			if(type == 'line'){
				if(items.length == 0){
					return '';
				}
				return lines2path(items,lineCfg);
			}
			cfg = BUI.mix({},lineCfg);
			BUI.each(items,function(item){
				path = path.concat(_self._getMultiplePath(item,type));
			});
			cfg.path = path;
			return cfg;
		},
		_getMultiplePath : function(item,type){
			var _self = this,
				points = item.points,
				path = [];
			if(type == 'polygon'){ //多边形
				BUI.each(points,function(point,index){
					
					if(index == 0){
						path.push(['M',point.x,point.y]);
					}else{
						path.push(['L',point.x,point.y]);
					}
				});
				path.push(['L',points[0].x,points[0].y]);
				path.push(['z']);
			}else{
				var x = item.center.x,
					y = item.center.y,
					rx = item.r,
					ry = item.r;
				if(rx == 0){
					path = [];
				}else{
					path = [["M", x, y], ["m", 0, -ry], ["a", rx, ry, 0, 1, 1, 0, 2 * ry], ["a", rx, ry, 0, 1, 1, 0, -2 * ry]];
				}
				
			}
			return path;
		},
		//绘制奇偶背景
		_drawOddEven : function(item,preItem,index){
			var _self = this,
				odd = _self.get('odd'),
				even = _self.get('even'),
				name,
				attrs;

			if(index % 2 == 0){
				if(even){
					attrs = _self._getBackItem(preItem,item,even);
					name = 'even';
				}
			}else if(odd){
				attrs = _self._getBackItem(preItem,item,odd);
				name = 'odd';
			}
			if(attrs){
				_self.addShape({
					type : 'path',
					elCls : CLS_GRID + '-' + name,
					attrs : attrs
				});
			}
		},
		_getBackItem: function(start,end,cfg){
			var _self = this, 
				path = BUI.substitute('M {x1} {y1} L{x2} {y2}',start);
			path = path + BUI.substitute('L{x2} {y2} L{x1} {y1}Z',end);

			cfg = BUI.merge(cfg,{
				path : path
			});
			return cfg;
		},
		//获取次要线配置
		_getMinorItem : function(start,end,index,count){
			var _self = this,
				isVertical = _self._isVertical(start,end),
				field = isVertical ? 'x' : 'y',
				ortho = isVertical ? 'y' : 'x',
				length = end[field + '1'] - start[field + '1'],
				avg = length / (count + 1),
				rst = {};

			rst[field + '1'] = rst[field + '2'] = (index + 1) * avg + start[field + '1'];
			rst[ortho + '1'] = start[ortho + '1'];
			rst[ortho + '2'] = start[ortho + '2'];
			return rst;
			
		},
		_addMonorItem : function(item,preItem){
			var _self = this,
				minorItems = ensure('minorItems',_self,[]),
				minorCount = _self.get('minorCount');
			if(minorCount){
				for(var i = 0; i < minorCount ; i++){
					var minorItem = _self._getMinorItem(preItem,item,i,minorCount);
					minorItems.push(minorItem);
				}
			}
		},
		//绘制次要线
		drawMinorLines : function(){
			var _self = this,
				lineCfg = _self.get('minorLine'),
				minorItems = _self.get('minorItems');
			_self._drawGridLines(minorItems,lineCfg,CLS_GRID + '-minor');
		},
		_changeMinorLinses : function(){
			var _self = this,
				minorItems = _self.get('minorItems');
			_self._changeGridLines(minorItems,CLS_GRID + '-minor');
		}
	});

	return Grid;
});/**
 * @fileOverview 圆形的坐标，用于雷达图或者圆形仪表盘
 * @ignore
 */

define('bui/chart/circleaxis',['bui/common','bui/graphic','bui/chart/abstractaxis'],function (require) {
  
  var BUI = require('bui/common'),
    Util = require('bui/graphic').Util,
    Abstract = require('bui/chart/abstractaxis');

  var RAD = Math.PI / 180;

  //获取圆上的点
  function getPoint(self,r,angle){
    var center = self.getCenter(),
      rst = {};
      rst.x = center.x + r * Math.sin(angle * RAD);
      rst.y = center.y - r * Math.cos(angle * RAD);
    return rst;
  }


  /**
   * @class BUI.Chart.Axis.Circle
   * 圆形的坐标
   * @extends BUI.Chart.Axis.Abstract
   */
  var Circle = function(cfg){
    Circle.superclass.constructor.call(this,cfg);
  };

  BUI.extend(Circle,Abstract);


  Circle.ATTRS = {

    type : {
      value : 'circle'
    },
    /**
     * 起始角度，0-360度
     * @type {Number}
     */
    startAngle : {
      value : 0
    },
    /**
     * 结束的角度
     * @type {Number}
     */
    endAngle : {
      value : 360
    },
    /**
     * 与绘图区域的边距
     * @type {Number}
     */
    margin : {
      value : 20
    },
    /**
     * 半径长度,一般根据绘图区域自动计算
     * @type {Number}
     */
    radius : {

    },
    /**
     * 指定角度值，将圆分成几部分，一定是能够将圆平分的角度值
     * @type {Number}
     */
    tickInterval : {

    },
    grid : {
      shared : false,
      value :{

        line : {
          'stroke-width' : 1,
          'stroke' : '#C0D0E0'
        }
      } 
    },
    formatter : {
      value : function(value){
        var _self = this,
          ticks = _self.get('ticks');
        if(BUI.isNumber(value)){
          var index = BUI.Array.indexOf(value,ticks);
          if(index == -1){
            var avg = _self.getTickAvgAngle();
            index =parseInt(value / avg,10) ;
            value = ticks[index];
          }
        }
        return value;
      }
    }
  };

  BUI.augment(Circle,{

    beforeRenderUI : function(){
      var _self = this;
      Circle.superclass.beforeRenderUI.call(_self);
      
      var tickInterval = _self.get('tickInterval'),
        ticks = _self.get('ticks'),
        startAngle = _self.get('startAngle'),
        endAngle = _self.get('endAngle'),
        count;

      if(tickInterval && !ticks){
        ticks = [];
        count = (endAngle - startAngle)/tickInterval
        for (var i = 0; i < count; i++) {
          ticks.push(startAngle + tickInterval * i);
        };
        _self.set('ticks',ticks);

      }
    },
    /**
     * 获取中心点
     * @return {Number} 中心点
     */
    getCenter : function(){
      var _self = this,
        plotRange = _self.get('plotRange');
      return plotRange.cc;
    },
    /**
     * 获取半径
     * @return {Number} 半径
     */
    getRadius : function(){
      var _self = this,
        radius = _self.get('radius'),
        plotRange = _self.get('plotRange');
      if(!radius){
        //半径等于宽高比较小的1/2，以及20像素的边框
        radius = Math.min(plotRange.getWidth(),plotRange.getHeight())/2 - _self.get('margin');
        _self.set('radius',radius);
      }
      return radius;
    },
    /**
     * 获取坐标点间的平均角度
     * @return {Number} 角度值
     */
    getTickAvgAngle : function(){
      var _self = this,
        ticks = _self.get('ticks'),
        startAngle = _self.get('startAngle'),
        endAngle = _self.get('endAngle');
      return (endAngle - startAngle) / ticks.length;
    },
    /**
     * @protected
     * 获取坐标轴的path
     * @return {String|Array} path
     */
    getLinePath : function(){
      var _self = this,
        center = _self.getCenter(),
        x = center.x,
        y = center.y,
        rx =  _self.getRadius(),
        ry = rx;

      return [["M", x, y], ["m", 0, -ry], ["a", rx, ry, 0, 1, 1, 0, 2 * ry], ["a", rx, ry, 0, 1, 1, 0, -2 * ry], ["z"]];
    },
    //获取坐标轴上的节点位置
    getOffsetPoint : function(index){
      var _self = this,
        angle = _self.getOffsetByIndex(index),
        radius = _self.getRadius();
      return _self.getCirclePoint(angle,radius);
    },
    /**
     * 根据半径和角度获取对应的点
     * @param  {Number} angle 角度
     * @param  {Number} r 半径,可以为空，默认为圆的半径
     * @return {Object} 坐标点
     */
    getCirclePoint : function(angle,r){
      if(r == null){
        r = this.getRadius();
      }
      
      return getPoint(this,r,angle);
    },
    /**
     * 获取点到圆心的距离
     * @param  {Number} x x坐标
     * @param  {Number} y y坐标
     * @return {Number} 距离
     */
    getDistance : function(x,y){
      var _self = this,
        center = _self.getCenter();
      return Math.sqrt(Math.pow(x - center.x,2) + Math.pow(y - center.y,2));
    },
    /**
     * 获取点对应的角度，0 - 360
     * @param  {Number} x x坐标
     * @param  {Number} y y坐标
     * @return {Number} 获取点的角度
     */
    getCircleAngle : function(x,y){
      var _self = this,
        center = _self.getCenter(),
        r = _self.getDistance(x,y),
        angle = (Math.asin(Math.abs(x - center.x) / r) / Math.PI) * 180;

      if(x >= center.x && y <= center.y){//第一象限
        return angle;
      }


      if(x >= center.x && y >= center.y){ //第四象限
        return 180 - angle;
      }

      if(x <= center.x && y >= center.y){//第三象限
        return angle + 180;
      } 

      return 360 - angle; //第四象限
    },
    /**
     * 圆的坐标轴来说，根据索引获取对应的角度
     * @param  {Number} index 顺序 
     * @return {Number} 节点坐标点（单一坐标）x轴的坐标点或者y轴的坐标点
     */
    getOffsetByIndex : function(index){
      var _self = this,
        ticks = _self.get('ticks'),
        length = ticks.length,
        startAngle = _self.get('startAngle'),
        endAngle = _self.get('endAngle');
      return startAngle + ((endAngle - startAngle) / length) * index;
    },
    /**
     * 圆形坐标轴上，存在坐标点的值，例如，存在 0，45，90 ... 360，那么 80将返回90
     * @param  {Number} offset 
     * @return {Number} 点在坐标轴上角度
     */
    getValue : function(offset){
      return this.getSnapValue(offset);
    },
     /**
     * 获取逼近坐标点的值
     * @param  {Number} offset 画布上的点在坐标轴上的对应值
     * @return {Number} 坐标轴上的值
     */
    getSnapValue : function(offset,tolerance){
      
      //tolerance = tolerance || this.getTickAvgAngle() / 2;
      var _self = this,
            pointCache = _self.get('pointCache');
        return Util.snapFloor(pointCache,offset);
    },
    /**
     * 获取栅格项的配置信息，一般是起始点信息
     * @protected
     */
    getGridItemCfg : function(point){
      var _self = this,
        center = _self.getCenter();
      return{
        x1 : center.x,
        y1 : center.y,
        x2 : point.x,
        y2 : point.y
      };
    },
    //重置点的位置
    addLabel : function(text,point,angle){

      var _self = this,
        margin = _self.get('margin'),
        radius = _self.getRadius();

      point = _self.getCirclePoint(angle,radius + margin);

      Circle.superclass.addLabel.call(_self,text,point);
    },
    /**
     * @protected
     * 获取标示坐标点的线的终点
     */
    getTickEnd : function(start,angle){
      var _self = this,
        radius = _self.getRadius(),
        tickLine = _self.get('tickLine'),
        length = tickLine.value,
        point = _self.getCirclePoint(angle,radius + length);
      return {
        x2 : point.x,
        y2 : point.y
      };
    }

  });

  return Circle;
});/**
 * @fileOverview 作为圆的半径的坐标轴使用
 * @ignore
 */

define('bui/chart/radiusaxis',['bui/common','bui/chart/numberaxis'],function (require) {
  
  var BUI = require('bui/common'),
    NumberAxis = require('bui/chart/numberaxis');

  /**
   * @class BUI.Chart.Axis.Radius
   * 圆的半径坐标轴
   * @extends BUI.Chart.Axis.Number
   */
  var Radius = function(cfg){
    Radius.superclass.constructor.call(this,cfg);
  };

  Radius.ATTRS = {

    /**
     * 圆形坐标轴
     * @type {BUI.Chart.Axis.Circle}
     */
    circle : {

    },
    position : {
      value : 'left'
    },
    /**
     * 类型
     * @type {String}
     */
    type : {
      value : 'radius'
    }

  };

  BUI.extend(Radius,NumberAxis);

  BUI.augment(Radius,{

    beforeRenderUI : function(){
      Radius.superclass.beforeRenderUI.call(this);
      var _self = this,
        circle = _self.get('circle');

      _self.set('start',circle.getCenter());
      _self.set('end',circle.getCirclePoint(0));
    },
    /**
     * 获取栅格项的配置信息，一般是起始点信息
     * @protected
     */
    getGridItemCfg : function(offsetPoint){
      var _self = this,
          item = {},
          points = [],
          circle = _self.get('circle'),
          center = circle.getCenter(),
          count = circle.getTicksCount(),
          r = Math.abs(offsetPoint.y - center.y);

      for(var i = 0; i < count; i++){
        var angle = circle.getOffsetByIndex(i),
          point = circle.getCirclePoint(angle,r);
        points.push(point);
      }
      
      item.points = points;
      item.r = r;
      item.center = center;
      return item;
    },
    /**
     * 根据角度获取坐标点
     * @param  {Number} angle 角度
     * @param  {Number} value 值
     * @return {Object} 坐标点 x,y
     */
    getPointByAngle : function(angle,value){
      var _self = this,
        circle = _self.get('circle'),
        center = circle.getCenter(),
        offset = _self.getOffset(value);

      return circle.getCirclePoint(angle,Math.abs(offset - center.y))
    }
  });

  return Radius;
});/**
 * @fileOverview 时间坐标轴
 * @ignore
 */

define('bui/chart/timeaxis',['bui/common','bui/chart/numberaxis'],function (require) {

  var BUI = require('bui/common'),
    NAixs = require('bui/chart/numberaxis');

  function parseTime(d){
    if(d instanceof Date){
      return d.getTime();
    }
    if(BUI.isNumber(d)){
      return d;
    }
    var date = d;
    if(BUI.isString(d)){
      date = d.replace('-','\/');
      date = new Date(date).getTime();
    }
    return date;
  }

  /**
   * @class BUI.Chart.Axis.Time
   * 时间坐标轴
   */
  var Time = function(cfg){
    Time.superclass.constructor.call(this,cfg)
  };

  Time.ATTRS = {

    /**
     * 开始日期时间
     * @type {Date}
     */
    startDate : {

    },
    dateFormat : {

    },
    /**
     * 结束日期时间
     * @type {Date}
     */
    endDate : {

    }
  };

  BUI.extend(Time,NAixs);

  BUI.augment(Time,{
    //渲染控件前
    beforeRenderUI : function(){
      var _self = this;
      
      
      var startTime = parseTime(_self.get('startDate')),
        endTime = parseTime(_self.get('endDate'));
      if(startTime && !_self.get('min')){
        _self.set('min',startTime);
      }
      if(endTime && !_self.get('max')){
        _self.set('max',endTime);
      }

      Time.superclass.beforeRenderUI.call(_self);

    }
  });

  return Time;
});/**
 * @fileOverview 分类坐标轴
 * @ignore
 */

define('bui/chart/categoryaxis',['bui/chart/baseaxis','bui/common'],function (require) {
	var BUI = require('bui/common'),
		Axis = require('bui/chart/baseaxis');

	/**
	 * @class BUI.Chart.Axis.Category
	 * 分组坐标轴
	 * @extends BUI.Chart.Axis
	 */
	function Category(cfg){
		Category.superclass.constructor.call(this,cfg);
	}

	BUI.extend(Category,Axis);

	Category.ATTRS = {

		/**
		 * 分组集合
		 * @type {Array}
		 */
		categories : {

		},
        /**
         * 类型
         * @type {String}
         */
        type : {
            value : 'category'
        }

	};

	BUI.augment(Category,{
		//渲染控件前
		beforeRenderUI : function(){
			var _self = this;
			Category.superclass.beforeRenderUI.call(_self);
			
			//如果未指定坐标轴上的点，则自动计算
			if(!_self.get('ticks')){
			  var categories = _self.get('categories'),
			  	ticks = [];
			  ticks = ticks.concat(categories);
			  ticks.push(' ');
              _self.set('ticks',ticks);
			}
		},
        //ticks 获取
        changeInfo : function(info){
            var _self = this,
                ticks = [];
            ticks = ticks.concat(info.categories);
            if(ticks.length){
               ticks.push(' '); 
            }
            
            _self.set('categories',info.categories);
            _self.set('ticks',ticks);
        },
		/**
		 * @override
		 * @ignore
		 */
		getOffsetByIndex : function(index){
        	var _self = this,
        		avg = _self._getAvgLength(),
        		offset =  avg * index;
        	if(offset >= 0){
        		offset += avg/2;
        	}else{
        		offset -= avg/2;
        	}
        	return _self._appendEndOffset(offset) + _self._getStartCoord();
        },
        /**
         * 根据画板上的点获取坐标轴上的值，对已分类坐标轴来说就是获取其中的一个分类
         * @param  {Number} offset 
         * @return {Number} 点在坐标轴上的值,如果不在坐标轴上,值为NaN
         */
        getValue : function(offset){
            var _self = this,
                index = _self.getSnapIndex(offset),
                categories = _self.get('categories');
            return categories[index];
        },
        /**
         * 改变坐标轴，对于分类坐标轴，只能更改 categories
         * <code>
         *     axis.changeAxis({
         *         categories : categories
         *     });
         * </code>
         */
        changeAxis : function(info){

        },
        _getAvgLength : function(){
        	var _self = this,
        		length = _self._getLength(),
        		ticks = _self.get('ticks'),
        		count = ticks.length,
        		avg = (length / (count - 1));
        	return avg;
        },
        /**
         * @protected
         * 获取显示坐标点的位置
         */
        getTickOffsetPoint : function(index){
          var _self = this,
        		ortho = _self._getOrthoCoord(),
        		avg = _self._getAvgLength(),
        		current = _self.getOffsetByIndex(index);
        	
        	if(current >= 0){
        		current -= avg/2;
        	}else{
        		current += avg/2;
        	}
        	if(_self.isVertical()){
        		return {
        			x : ortho,
        			y : current
        		};
        	}

        	return {
        		x : current,
        		y : ortho
        	};
        }
	});

	return Category;
});/**
 * @fileOverview 坐标轴的入口文件
 * @ignore
 */

define('bui/chart/axis',['bui/common','bui/chart/baseaxis','bui/chart/categoryaxis',
  'bui/chart/numberaxis','bui/chart/timeaxis','bui/chart/circleaxis','bui/chart/radiusaxis'],function (require) {
	
	var BUI = require('bui/common'),
		Axis = require('bui/chart/baseaxis');

	Axis.Category = require('bui/chart/categoryaxis');

	Axis.Number = require('bui/chart/numberaxis');

  Axis.Time = require('bui/chart/timeaxis');

	Axis.Auto = require('bui/chart/axis/auto');

  Axis.Circle = require('bui/chart/circleaxis');

  Axis.Radius = require('bui/chart/radiusaxis');

	return Axis;
});/**
 * @fileOverview 所有数据序列的基类
 * @ignore
 */

define('bui/chart/baseseries',['bui/chart/plotitem','bui/chart/showlabels','bui/chart/markers','bui/chart/actived'],function (require) {
  
  var BUI = require('bui/common'),
    Item = require('bui/chart/plotitem'),
    ShowLabels = require('bui/chart/showlabels'),
    Actived = require('bui/chart/actived'),
    Markers = require('bui/chart/markers');

  /**
   * @class BUI.Chart.Series
   * 数据序列的基类，是一个抽象类，不能直接实例化
   */
  var Series = function(cfg){
    Series.superclass.constructor.call(this,cfg);
  };

  BUI.extend(Series,Item);

  BUI.mixin(Series,[ShowLabels,Actived]);

  Series.ATTRS = {
    zIndex : {
      value : 5
    },
    /**
     * 标志数据序列上的点的配置
     *
     *  - type 默认类型是path,可以是任意基本图形
     * @type {Object}
     */
    markers : {

    },
    /**
     * 显示对应点的文本的配置项
     * @type {BUI.Chart.Labels}
     */
    labels : {

    },
    /**
     * 创建序列时是否触发动画
     * @type {Boolean}
     */
    animate : {
      value : false
    },
    /**
     * 生成时动画的时间间隔
     * @type {Number}
     */
    duration : {
      value : 1000
    },
    /**
     * 发生改变的动画时间
     * @type {Number}
     */
    changeDuration : {
      value : 400
    },
    /**
     * 是否显示在图例中
     * @type {Boolean}
     */
    inLegend : {
      value : true
    },
    /**
     * 显示的数据
     * @type {Array}
     */
    data : {
      value : [],
      shared : false
    },
    /**
     * 渲染时就绘制图形
     * @type {Boolean}
     */
    autoPaint : {
      value : true
    },
    /**
     * 鼠标移动到数据序列图中是否触发事件
     * @type {Boolean}
     */
    enableMouseTracking : {
      value : true
    },
    /**
     * 是否随着鼠标在画板上移动触发相应的事件
     *
     * - true ，则鼠标从序列图中移出时不会触发移出的事件，当鼠标在画板上移动时序列图会做出对应的动作
     * 
     * @type {Boolean}
     */
    stickyTracking : {
      value : true
    },
    /**
     * 用于定位数据的字段，通常是x轴上的数据，但是也可以用于饼图之类不需要x轴的数据序列
     * @type {String}
     */
    xField : {
      value : 'x'
    },
    /**
     * 标示数据的值,通常用于y轴上的数据，但是也可以用于饼图、雷达图之类
     * @type {String}
     */
    yField : {
      value : 'y'
    },
    /**
     * 活动子项的名称，用于组成 itemactived,itemunactived的事件
     * @protected
     * @type {String}
     */
    itemName : {
      value : 'seriesItem'
    },
    /**
     * 所属分组的名称,用于事件中标示父元素
     * @protected
     * @type {String}
     */
    groupName : {
      value : 'series'
    }

  };

  BUI.augment(Series,{

    renderUI : function(){
      var _self = this;
      
      Series.superclass.renderUI.call(_self);
      
      _self.processColor();
      _self.renderLabels();
      _self.renderMarkers();
      if(_self.get('autoPaint')){
        _self.paint();
      }

    },
    bindUI : function(){
      var _self = this;
      Series.superclass.bindUI.call(_self);
      if(_self.get('enableMouseTracking')){

        _self.onMouseOver();
        var parent = _self.get('parent');
        
        /**/_self.on('mouseover',function(){
          if(parent.setActivedItem){
            if(!parent.isItemActived(_self)){
              parent.setActivedItem(_self);
            }
          }
        });
      }
      if(!_self.get('stickyTracking')){
        _self.onMouseOut();
      }
    },
    /**
     * 更改数据
     * @param  {Array} data 数据
     */
    changeData : function(data,redraw){
      var _self = this,
        preData = _self.get('data'),
        parent = _self.get('parent');
      if(data != preData){
        _self.set('data',data);
      }
      if(redraw){
        if(parent){
          parent.repaint();
        }else if(_self.get('visible')){
          _self.repaint();
        }
      }
    },
    /**
     * 添加数据
     * @param {*} point  数据
     * @param {Boolean} shift  是否删除最前面的数据
     * @param {Boolean} redraw 是否重绘图表
     */
    addPoint : function(point,shift,redraw){
      var _self = this,
        data = _self.get('data');
      data.push(point);
      
      if(shift){
        data.shift();
        redraw && data.unshift(data[0]);
      }
      _self.changeData(data,redraw);

      if(shift){
        setTimeout(function(){
          data.shift();
          _self.set('points',null);
          if(redraw){
            _self.shiftPoint();
            _self.changeShapes(_self.getPoints(),false);
          }
        },800);
        
      }
    },
    /**
     * 删除第一个节点的操作
     * @protected
     */
    shiftPoint : function(){
      var _self = this,
        markersGroup = _self.get('markersGroup'),
        labelsGroup = _self.get('labelsGroup'),
        xAxis = _self.get('xAxis'),
        first;
      if(markersGroup){
        first =markersGroup.getChildAt(0);
        first && first.remove();
      }
      if(labelsGroup){
        first = labelsGroup.getChildAt(0);
        first && first.remove();
      }
      if(xAxis){
        var labels = xAxis.get('labelsGroup');
        if(labels){
          first = labels.getChildAt(0);
          first && first.remove();
        }
      }/**/
    },
    /**
     * 获取对应坐标轴上的数据
     * @return {Array} 
     */
    getData : function(type){

    },
    /**
     * @protected
     * 鼠标进入事件
     */
    onMouseOver : function(ev){
      
    },
    /**
     * @protected
     * 鼠标移出
     */
    onMouseOut : function(ev){

    },
    /**
     * 鼠标在画布上移动
     */
    onStickyTracking : function(ev){

    },
    /**
     * @protected
     * 处理颜色
     */
    processColor : function(){

    },
    /**
     * 获取鼠标移动与该series的焦点
     */
    getTrackingInfo : function(point){

    },
    /**
     * 获取点的集合用于显示Marker和label
     * @return {Array} 点的集合
     */
    getPoints : function(){
      var _self = this,
        points = _self.get('points');
      if(!points){
        points = _self._getPoints();
        _self.set('points',points);
      }
      return points;
    },
    /**
     * @private
     * 获取点
     */
    _getPoints : function(){
      var _self = this,
        data = _self.get('data'),
        xField = _self.get('xField'),
        yField = _self.get('yField'),
        points = [];
      BUI.each(data,function(item,index){
        var point;
        if(BUI.isObject(item)){
          var xValue = item[xField],
            yValue = item[yField];
          if(xValue == null){
            point = _self.getPointByIndex(yValue,index);
          }else{
            point = _self.getPointByValue(xValue,yValue);
          }
          point.obj = item;
        }else if(BUI.isArray(item)){
          point = _self.getPointByValue(item[0],item[1]);
          point.arr = item;
        }else{
          point = _self.getPointByIndex(item,index);
        }
        _self.processPoint(point,index);
        points.push(point);
      });

      return points;
    },
    /**
     * @protected
     * 处理节点，并且添加附加信息
     */
    processPoint : function(point,index){

    },
    /**
     * 根据对象获取值
     * @protected
     * @return {Object} 点的信息
     */
    getPointByObject : function(item){

    },
    /**
     * 根据索引获取值
     * @protected
     * @return {Object} 点的信息
     */
    getPointByIndex : function(item,index){

    },
    /**
     * @protected
     * 根据指定的值获取点的信息
     * @param  {Number} value 在基础轴上的值，一般是x轴
     * @return {Object} 点的信息
     */
    getPointByValue : function(xValue,value){

    },
    /**
     * 获取提示信息
     * @return {*} 返回显示在上面的文本
     */
    getTipItem : function(point){
      return point.value;
    },
    //根据x轴上的值获取y轴上的值
    findPointByValue : function(value){
      var _self = this,
        points = _self.get('points'),
        rst;

      BUI.each(points,function(point){
        if(_self.snapEqual(point.xValue,value) && point.value != null){
          rst = point;
          return false;
        }
      });

      return rst;
    },
    /**
     * @protected
     * 判断是否近似相等
     */
    snapEqual : function(value1,value2){
      return value1 == value2;
    },
    /**
     * @protected
     * 画对应的图形
     */
    draw : function(points){

    },
    /**
     * 绘制数据序列
     */
    paint : function(){
      var _self = this,
        points = _self.getPoints();

      if(_self.get('isPaint') || !_self.get('data').length){ //没有数据时不做渲染
        return;
      }
      _self.set('painting',true);//正在绘制，防止再绘制过程中触发重绘
      _self.draw(points,function(){
        _self.sort();
      });
      _self.set('isPaint',true);
      _self.set('painting',false);
    },
    /**
     * 重绘
     */
    repaint : function(){
      var _self = this,
        labels = _self.get('labels'),
        markers = _self.get('markers'),
        points;

      _self.set('points',null);
      if(!_self.get('isPaint') && !_self.get('painting')){
        _self.paint();
        return;
      }

      
      points = _self.getPoints();

      if(labels){
        labels.items = [];
      }
      if(markers){
        markers.items = [];
      }
      _self.changeShapes(points);
      BUI.each(points,function(point){
        if(labels){
          var item = {};
          item.text = point.value;
          item.x = point.x;
          item.y = point.y;
          labels.items.push(item);
        }
        if(markers){
          markers.items.push(point);
        }
      });

      _self._changeMarkers();
      _self._changeLabels();
    },
    /**
     * @protected
     * 序列变化时改变内部图形
     */
    changeShapes : function(points){

    },
    /**
     * @protected
     * 添加marker配置项
     */
    addMarker : function(offset){
      var _self = this,
          markersGroup = _self.get('markersGroup'),
          marker = {},
          rst;
      if(markersGroup){
        marker.x = offset.x;
        marker.y = offset.y;
        if(offset.obj && offset.obj.marker){
          BUI.mix(marker,offset.obj.marker);
        }

       rst = markersGroup.addMarker(marker);
       rst.set('point',offset);
      }
      return rst;
    },
    //渲染标记
    renderMarkers : function(){
      var _self = this,
        markers = _self.get('markers'),
        markersGroup;
      if(markers){
        if(!markers){
          markers.items = [];
        }
        markersGroup = _self.addGroup(Markers,markers);
        _self.set('markersGroup',markersGroup);
      }
    },
    _changeMarkers : function(){
      var _self = this,
        markers = _self.get('markers'),
        markersGroup;
      if(markers){
        markersGroup = _self.get('markersGroup');
        markersGroup.change(markers.items);
      }
    },
    _changeLabels : function(){
      this.resetLabels();
    },
    //删除标记
    removeMarkers : function(){
      var _self = this,

        markersGroup = _self.get('markersGroup');

      markersGroup && markersGroup.remove();
    },
    //获取激活的属性
    getActiveAtrrs : function(){

    },
    //获取解除激活的属性
    getUnActiveAttrs : function(){

    },
    /**
     * @protected
     * 设置图形的激活状态
     * @param {Boolean} actived 是否激活
     */
    setActiveStatus : function(actived){

    },
    remove : function(){
      var _self = this;
      _self.removeMarkers();
      _self.removeLabels();
      Series.superclass.remove.call(this);
    }
  });


  return Series;
});/**
 * @fileOverview 处理层叠的数据序列的扩展
 * @ignore
 */

define('bui/chart/series/stacked',function (require) {
  
  var BUI = require('bui/common');

  /**
   * @class BUI.Chart.Series.Stacked
   * @protected
   * 此类是一个扩展，不应该直接实例化,主要用于区域图，柱状图层叠的场景
   */
  var Stacked = function(){

  };

  Stacked.ATTRS = {
    /**
     * 数据序列层叠的类型
     *   - none : 不进行层叠
     *   - normal : 一般的层叠方式，后面的数据序列的y值在前一个数据序列基础上显示
     *   - percent : 按照百分比进行层叠展示
     * @type {String}
     */
    stackType : {
      value : 'none'
    }
  };

  BUI.augment(Stacked,{

    processStackedPoint : function(point,index){
      var _self = this,   
        pre = _self.getVisiblePrev();

      if(pre){
        var prePoint = pre.getPoints()[index],
          baseValue = _self.getBaseValue();
        if(!_self.isInCircle()){ //非雷达图中
          point.y = point.y + prePoint.y - baseValue;
        }else{ //雷达图中
          var xAxis = _self.get('xAxis'),
            r = xAxis.getDistance(point.x,point.y),
            ir = prePoint.r || xAxis.getDistance(prePoint.x,prePoint.y),
            curPoint;

          r = ir + r;
          curPoint = xAxis.getCirclePoint(point.xValue,r)
          point.x = curPoint.x;
          point.y = curPoint.y;
          point.r = r;
          point.ir = ir;
        }
        
        point.lowY = prePoint.y;
        point.lowX = prePoint.x;
      }
    },
    /**
     * @protected
     * 获取数据中的比例
     */
    getStackedPercent : function(value,index){
      var _self = this,
        data = _self.get('parent').getStackedData(_self.get('yAxis'),'yAxis'),
        total = data[index];
      if(total){
        return value/total;
      }
      return NaN;
    },  
    /**
     * @protected
     * 转换显示的值，一般用于层叠的数据序列中
     */
    parseYValue : function(value){
      var _self = this,
        stackType = _self.get('stackType'),
        data = _self.get('data'),
        index = BUI.Array.indexOf(value,data),
        percentValue;
      if(stackType == 'percent'){
        percentValue = _self.getStackedPercent(value,index);
        value = percentValue * 100;
      }
      return value;
    },
    /**
     * @protected
     * 获取显示的前一个序列
     */
    getVisiblePrev : function(){
      var _self = this,
        parent = _self.get('parent'),
        yAxis = _self.get('yAxis'),
        children = parent.get('children'),
        pre;

      BUI.each(children,function(series,i){
        if(series == _self){
          return false;
        }
        if(series.get('visible') && series.get('yAxis') == yAxis){ //获取前一个显示的数据序列
          pre = series;
        }
      });
      return pre;
    },
    /**
     * 获取提示信息
     * @return {*} 返回显示在上面的文本
     */
    getTipItem : function(point){
      var _self = this,
        stackType = _self.get('stackType');
      if(stackType == 'percent'){
        var y = point.yValue || 0;
        return [point.value,'（'+y.toFixed(2)+'%）'];
      }
      return point.value;
    },
    /**
     * 是否是层叠的数据序列
     * @return {Boolean} 
     */
    isStacked : function(){
      var _self = this,
        stackType = _self.get('stackType');
      return stackType && stackType !== 'none';
    }

  });

  return Stacked;
});/**
 * @fileOverview 包含数据序列子项的数据序列类,作为一个扩展可以用于柱状图、饼图
 * @ignore
 */

define('bui/chart/series/itemgroup',['bui/chart/baseseries'],function (require) {
  
  var BUI = require('bui/common'),
    Base = require('bui/chart/baseseries'),
    Util = require('bui/graphic').Util;

  /**
   * @class BUI.Chart.Series.ItemGroup
   * 包含数据序列子项的数据序列类,作为一个扩展可以用于柱状图、饼图
   */
  var Group = function(){

  };

  Group.ATTRS = {
    /**
     * 子项的配置信息
     * @type {Object}
     */
    item : {

    },
    /**
     * 存放子项的容器
     * @type {BUI.Graphic.Group}
     */
    group : {

    },
    /**
     * 是否允许选中
     * @type {Boolean}
     */
    allowPointSelect : {
      value : false
    },
    /**
     * 是否允许取消选中，选中状态下，继续点击则会取消选中
     * @type {Boolean}
     */
    cancelSelect : {
      value : true
    }
  }

  BUI.extend(Group,Base);

  BUI.augment(Group,{
    addItem : function(point,index){
      var _self = this,
        group = _self.get('group'),
        cfg;

      // 假如出现断点,point.value为空.则不处理
      if(point.value == null){
        return ;
      }
      if(index == null){
        index = _self.getItems().length;
      }
      if(!group){
        group = _self.addGroup();
        _self.set('group',group);
      }

      cfg = _self.getItemCfg(point,index);
      if(_self.get('animate')){
        cfg.path = _self.pointToFactorPath(point,0);
      }else{
        cfg.path = _self.pointToPath(point);
      }

      var shape = group.addShape('path',cfg);
      shape.isSeriesItem = true;
      shape.set('point',point);
      return shape;
    },
     //绑定点击事件
    bindItemClick : function(){
      var _self = this,
        cancelSelect = _self.get('cancelSelect');
      
      _self.on('click',function(ev){
        var target = ev.target,
          shape = target.shape,
          selected;
        if(shape && shape.isSeriesItem){
          if(_self.get('allowPointSelect')){
            selected = shape.get('selected');
            if(cancelSelect && selected){
              _self.clearSelected(shape)
            }else{
              _self.setSelected(shape);
            }
          }
          _self.fireUpGroup('click',shape);
        }
      });
    },
    /**
     * 设置选中
     * @param {Object} item 选项
     */
    setSelected : function(item){
      var _self = this;
      if(!_self.isSelected(item)){
        _self.clearSelected();
        _self.setItemSelected(item,true);
        _self.onSelected(item);
      }
    },
    /**
     * @protected
     * points 发生改变时
     */
    changePoints : function(points){
      var _self = this,
        items = _self.getItems(),
        animate = _self.get('animate');

      points = points || _self.getPoints();

      //修改现有的path
      BUI.each(items,function(item,index){
        var point = points[index],
          prePoint,
          path;
        if(point){
          prePoint = item.get('point');
          item.set('point',point);
          item.set('prePoint',prePoint);

          if(!animate){
            path = _self.pointToPath(point);
            item.attr('path',path);
          }else{
            _self.animateItem(item,prePoint);
          }
          
        }
      });

      var count = points.length,
        length = items.length;

      //大于现有的点
      for (var i = length; i < count; i++) {
        var shape = _self.addItem(points[i],i);

        animate && _self.animateItem(shape,items[length - 1].get('prePoint'));
      }

      //小于现有的点
      for(var i = length - 1; i >= count; i--){
        var item = items[i];
        item.remove();
      }

    },
    
    /**
     * @protected
     * 触发选中事件
     */
    onSelected : function(item){
      this.fireUpGroup('selected',item);
    },
    /**
     * @protected
     * 触发移除选中
     */
    onUnSelected : function(item){
      this.fireUpGroup('unselected',item);
    },
    /**
     * 清除选中
     * @param  {Object} item 选项
     */
    clearSelected : function(item){
      var _self = this;
      item = item || _self.getSelected();
      if(item){
        _self.setItemSelected(item,false);
        _self.onUnSelected(item);
      }
    },
    /**
     * @protected
     * 设置选中
     * @param {Object} item  
     * @param {Boolean} selected 选中状态
     */
    setItemSelected : function(item,selected){

    },
    /**
     * 是否选中
     * @param  {Object}  item 是否选中
     * @return {Boolean}  是否选中
     */
    isSelected : function(item){
      return item && item.get('selected');
    },
    /**
     * 获取选中的项
     * @return {Object} 选中的项
     */
    getSelected : function(){
      var _self = this,
        items = _self.getItems(),
        rst;
      BUI.each(items,function(item){
        if(_self.isSelected(item)){
          rst = item;
          return false;
        }
      });
      return rst;
    },
    /**
     * @protected
     * 获取子项的配置信息
     * @param  {Object} item 信息
     */
    getItemCfg : function(point,index){
      var _self = this,
        item = _self.get('item'),
        cfg = point.obj,
        rst = {};

      BUI.mix(rst,item);
      if(cfg && cfg.attrs){
        BUI.mix(rst,cfg.attrs);
      }
      return rst;
    },
    /**
     * 数据序列的子项
     * @return {Array} 子项集合
     */
    getItems : function(){
      var group = this.get('group');

      return group ? group.get('children') : [];
    },
    /**
     * 生成动画
     * @protected
     */
    animateItems : function(callback){
      var _self = this,
        items = _self.getItems();

      Util.animStep(_self.get('duration'),function(factor){

        BUI.each(items,function(item){
          var point = item.get('point'),
            path = _self.pointToFactorPath(point,factor);
          item.attr('path',path);
        });
      },callback);
    },
    /**
     * 执行单个点的动画
     * @protected
     */
    animateItem : function(item,prePoint){
      var _self = this,
        point = item.get('point'),
        path = _self.pointToPath(point);

      item.animate({
        path : path
      },_self.get('changeDuration'));
    },
    /**
     * 删除子项
     * @param  {Object} item 子项
     */
    removeItem : function(item){
      var _self = this;
      _self.removeLabel(item);
      item.remove();
    },
    /**
     * @protected
     * 移除对应的label
     */
    removeLabel : function(item){
      var label = item.get('label');
      label && label.remove();
    },
    /**
     * @protected
     * 动画过程中根据比例获取path
     * @param  {Object} point  子项的节点信息
     * @param  {Number} factor 比例
     * @return {Array}  path
     */
    pointToFactorPath : function(point,factor){

    },
    /**
     * @protected
     * 获取path
     * @param  {Object} point  子项的节点信息
     * @return {Array}  path
     */
    pointToPath : function(point){
      return this.pointToFactorPath(point,1);
    }
  });


  return Group;
});
/**
 * @fileOverview 在x,y坐标轴中渲染的数据序列
 * @ignore
 */

define('bui/chart/cartesianseries',['bui/chart/baseseries','bui/graphic'],function (require) {

  var BUI = require('bui/common'),
    BaseSeries = require('bui/chart/baseseries'),
    Util = require('bui/graphic').Util;

   function date2number(value){
    if(BUI.isNumber(value)){
      return value;
    }
    if(BUI.isString(value)){
      value = value.replace(/'-'/ig,'/');
      value = new Date(value).getTime();
    }else if(BUI.isDate(value)){
      value = value.getTime();
    }
    return value;
  }

  /**
   * @class BUI.Chart.Series.Cartesian
   * 使用坐标轴的数据序列，此类是一个抽象类，不要直接初始化
   * @extends BUI.Chart.Series
   */
  function Cartesian(cfg){
    Cartesian.superclass.constructor.call(this,cfg);
  }

  Cartesian.ATTRS = {
     /**
     * 如果横坐标是数字类型，则通过点的间距来决定点
     * @type {Number}
     */
    pointInterval : {

    },
    /**
     * 如果横坐标是数字类型,点的起始值
     * @type {Number}
     */
    pointStart : {
      value : 0
    },
    /**
     * x坐标轴
     * @type {BUI.Chart.Axis}
     */
    xAxis : {

    },
    /**
     * y坐标轴
     * @type {BUI.Chart.Axis}
     */
    yAxis : {

    },
    pointsCache : {
      shared : false,
      value : {}
    }

  };

  BUI.extend(Cartesian,BaseSeries);

  BUI.augment(Cartesian,{

    /**
     * 获取坐标点
     * @param  {*} x x坐标系上的值
     * @param  {*} y y坐标系上的值
     * @return {Object}  坐标点
     */
    getPoint : function(x,y){
      var _self = this,
        xAxis = _self.get('xAxis'),
        yAxis = _self.get('yAxis'),
        yValue = _self.parseYValue(y),
        point = {};

      if(xAxis.get('type') == 'time'){
        x = date2number(x);
      }
      //圆形坐标轴，一般用于雷达图
      if(_self.isInCircle()){
        
        point = yAxis.getPointByAngle(x,yValue);
      }else{
        point.x = xAxis.getOffset(x);
        point.y = yAxis.getOffset(yValue);
      }

      BUI.mix(point,{
        yValue : yValue,
        xValue : x,
        value : y
      });

      return point;
    },
    //覆写父类方法，改变数据
    changeData : function(data,redraw){
      this.set('pointsCache',{});
      Cartesian.superclass.changeData.call(this,data,redraw);
    },
    /**
     * 
     * @protected
     * @return {Object} 点的集合
     */
    getPointByObject : function(item,index){
      var _self = this,
        xField = _self.get('xField'),
        yField = _self.get('yField'),
        point = _self.getPoint(item[xField],item[yField]);

      point.value = item[yField];
      point.xValue = item[xField];
      point.yValue = _self.parseYValue(item[yField]);
      point.obj = item; //如果是记录
      
      return point;
    },
    /**
     * @protected
     * 根据指定的值获取点的信息
     * @param  {Number} value 在x轴上的值
     * @return {Object} 点的信息
     */
    getPointByValue : function(xValue,value){

      return this.getPoint(xValue,value);
    },
    /**
     * @protected
     * 转换显示的值，一般用于层叠的数据序列中
     */
    parseYValue : function(value){
      return value;
    },
    /**
     * @protected
     * 判断是否近似相等
     */
    snapEqual : function(value1,value2){
      var _self = this;
      
      if(BUI.isString(value1)){
        return value1 == value2;
      }
      var pointInterval = _self.get('pointInterval');
      if(pointInterval){
        return Math.abs(value1 - value2) < pointInterval / 2;
      }

      return value1 == value2;
      
    },
    /**
     * 是否使用圆形坐标轴作为x轴
     * @return {Boolean} 
     */
    isInCircle : function(){
      return this.get('xAxis').get('type') == 'circle';
    },
    /**
     * @protected
     * 如果使用圆形坐标轴，则返回中心节点
     */
    getCircleCenter : function(){
      var _self = this,
        xAxis = _self.get('xAxis'),
        rst = null;
      if(xAxis.get('type') == 'circle'){
        rst = xAxis.getCenter();
      }
      return rst;
    },
    getCircle : function(){
      return this.isInCircle() ? this.get('xAxis') : null;
    },
    /**
     * 获取对应坐标轴上的数据，一般用于计算坐标轴
     * @return {Array} 
     */
    getData : function(type){
      var _self = this,
        data = _self.get('data'),
        pointsCache = _self.get('pointsCache'),
        xAxis = _self.get('xAxis'),
        first = data[0],
        rst = [],
        pointStart = _self.get('pointStart');

      type = type || 'yAxis';
      if(pointsCache[type]){
        return pointsCache[type];
      }
      //如果是x轴，并且指定了开始节点
      if(type == 'xAxis' && (pointStart != null &&!(xAxis.get('type') == 'time' && pointStart == 0)) && _self.get('pointInterval') /*&& !(xAxis.get('type') == 'time') && pointStart == 0*/){
        var 
          pointInterval = _self.get('pointInterval');
          rst.push(pointStart);
          rst.push(pointStart + (data.length - 1) * pointInterval);
      }else{ 
        var xField = _self.get('xField'),
          yField = _self.get('yField');
        //遍历所有节点
        BUI.each(data,function(item){
          //数字和字符串直接填入
          if(BUI.isNumber(item) || BUI.isString(item)){
            rst.push(item);
          }else if(BUI.isArray(item)){ //数组，0标示x,1标示y
            var value = type == 'yAxis' ? item[1] : item[0];
            rst.push(value);
          }else if(item){ //根据xField,yField取值
            var value = type == 'yAxis' ? item[yField] : item[xField];
            rst.push(value);
          }
        });
      }

      pointsCache[type] = rst;
      return rst;
      
    },
    /**
     * 根据索引获取值
     * @protected
     * @return {Object} 点的集合
     */
    getPointByIndex : function(value,index){
      var _self = this,
        xAxis = _self.get('xAxis'),
        yAxis = _self.get('yAxis'),
        x,
        yValue = _self.parseYValue(value),
        y = yAxis.getOffset(yValue),
        originValue,
        xValue;

      if(xAxis.get('type') == 'number' || xAxis.get('type') == 'time'){

        var pointStart = _self.get('pointStart'),
          pointInterval = _self.get('pointInterval');
        x = xAxis.getOffset(pointStart + pointInterval * index);
      }else{
        x = xAxis.getOffsetByIndex(index);
      }

      if(_self.isInCircle()){
        return _self.getPoint(x,value);
      }

      originValue = xAxis.getValue(x);
      if(pointInterval){
        originValue = Util.tryFixed(originValue,pointInterval);
      }
      return {
        x : x,
        y : y,
        xValue : originValue,
        yValue : yValue,
        value : value
      };
    },
    /**
     * 获取鼠标移动与该series的焦点
     */
    getTrackingInfo : function(point){
      var _self = this,
        xAxis = _self.get('xAxis'),
        xValue;

      if(_self.isInCircle()){
        var angle = xAxis.getCircleAngle(point.x,point.y);

        xValue = xAxis.getValue(angle);
      }else{
        xValue = xAxis.getValue(point.x);
      }
      return _self.findPointByValue(xValue);
    },
    /**
     * 获取最底层的点的值
     * @return {Number} 最底层点的值
     */
    getBaseValue : function(){
      var _self = this,
        yAxis = _self.get('yAxis'),
        value0 = yAxis.getOffset(0) || yAxis.getStartOffset();
      return value0;
    }

  });

  return Cartesian;

});/**
 * @fileOverview 线形式的数据图序列
 * @ignore
 */

define('bui/chart/lineseries',['bui/chart/cartesianseries','bui/graphic'],function (require) {
  
  var BUI = require('bui/common'),
    Cartesian = require('bui/chart/cartesianseries'),
    Util = require('bui/graphic').Util;

  function trySet(obj,name,value){
    if(obj && !obj[name]){
      obj[name] = value;
    }
  }

 

  /**
   * @class BUI.Chart.Series.Line
   * 使用线连接数据的数据图序列
   * @extends BUI.Chart.Series.Cartesian
   */
  function Line(cfg){
    Line.superclass.constructor.call(this,cfg);
  }

  BUI.extend(Line,Cartesian);

  

  Line.ATTRS = {

    type : {
      value : 'line'
    },
    elCls : {
      value : 'x-chart-line-series'
    },
    /**
     * 是否忽略null的值，连接null2边的值
     * @type {Boolean}
     */
    connectNulls : {
      value : false
    },  
    /**
     * 线的配置
     * @type {Object}
     */
    line : {

    },
    /**
     * 处于触发状态的线的配置项
     * @type {Object}
     */
    lineActived : {

    },
   
    /**
     * 增大线的触发范围
     * @type {Number}
     */
    tolerance : {
      value : 20
    },
    /**
     * 是否平滑的线
     * @type {Boolean}
     */
    smooth : {
      value : false
    }
  };

  BUI.augment(Line,{

    /**
     * @protected
     * 处理颜色
     */
    processColor : function(){
      var _self = this,
        color = _self.get('color');
      if(color){
        var line = _self.get('line'),
          markers = _self.get('markers');
        trySet(line,'stroke',color);
        if(markers && !/http/.test(markers.marker.symbol)){
          trySet(markers.marker,'stroke',color);
          trySet(markers.marker,'fill',color);
        }
      }
    },
   
    /**
     * @protected
     * 鼠标在画布上移动
     */
    onStickyTracking : function(ev){
      var _self = this,
        point = ev.point,
        markersGroup = _self.get('markersGroup'),
        marker = _self.getSnapMarker(point);
      markersGroup && markersGroup.setActivedItem(marker);
    },
    /**
     * @protected
     * 内部图形发生改变
     */
    changeShapes : function(points,animate){

      points = points || this.getPoints();

      var _self = this,
        //points = _self.getPoints(),
        lineShape = _self.get('lineShape'),
        path = _self.points2path(points);

      if(animate == null){
        animate = _self.get('animate');
      }
      if(lineShape){
        if(animate){
          if(Util.svg && _self.get('smooth')){ //曲线图，先获取到达的path
            var prePath = lineShape.getPath();
            lineShape.attr('path',path);
            path = lineShape.attr('path');
            lineShape.attr('path',prePath);
          }

          Util.animPath(lineShape,path);
        }else{
          lineShape.attr('path',path);
        }
        
      }
    },
    /**
     * @protected
     * @ignore
     */
    draw : function(points,callback){

      var _self = this,
        animate = _self.get('animate'),
        duration = _self.get('duration'),
        lineShape,
        path = '';

      if(!animate){
        path = _self.points2path(points);
        lineShape = _self._createLine(path);
        BUI.each(points,function(point){
          _self._drawPoint(point);
        });

        _self.drawInner(points);
        after();
      }else{
        lineShape = _self._createLine(path);
        if(_self.isInCircle()){
          _self.circleAnimate(points,lineShape);
        }else{
          var cur = 0,
            sub = [],
            count = points.length;

          //动画生成线和对应的点
          Util.animStep(duration,function(factor){
            var pre = cur;
            cur = parseInt((factor) * count,10);
            if(cur > count - 1){
              cur = count - 1;
            }
            
            if(cur != pre){
              sub = points.slice(0,cur + 1);
              path = _self.points2path(sub);
              lineShape.attr('path',path);
              _self.drawInner(sub);
              for(var i = pre; i< cur; i++){
                _self._drawPoint(points[i]);
              }
              
            }
            if(factor == 1){
              _self._drawPoint(points[cur]);
            }
          },after);
        }
        
      }
      //_self.set('lineShape',lineShape);
      /**
       * @private
       */
      function after(){
        
        _self.drawTracker(points);
        callback && callback();
      }
      
    },
    /**
     * 在圆中时的动画
     */
    circleAnimate : function(points,lineShape){
      var _self = this,
        circle = _self.getCircle(),
        center = circle.getCenter(),
        initPoints = [],
        baseValue = _self.getBaseValue(),
        path;
      BUI.each(points,function(point){
        var item = BUI.mix({
          value : baseValue
        },center);
        initPoints.push(item);
        _self._drawPoint(item);
      });
      path = _self.points2path(initPoints);
      lineShape.attr('path',path);
      _self.drawInner(initPoints);

      _self.repaint();

    },
    /**
     * @protected
     * 绘制内部内容
     */
    drawInner : function(points){

    },
    //绘制节点相关的label,marker
    _drawPoint : function(point){
      var _self = this;
      if(_self.get('markers') && !_self.get('markersGroup').get('single')){ //如果只有一个marker暂时不生成
        _self.addMarker(point);
      }
      if(_self.get('labels')){
        _self.addLabel(point.value,point);
      }
    },
    //创建折线
    _createLine : function(path){
      var _self = this,
        lineAttrs = _self.get('line'),
        cfg = BUI.mix({},lineAttrs);
      cfg.path = path;
      lineShape = _self.addShape('path',cfg);
      _self.set('lineShape',lineShape);
      return lineShape;
    },
    //绘制触发事件的path
    drawTracker : function(points){
      var _self = this,
        lineAttrs = _self.get('line'),
        tolerance = _self.get('tolerance'),
        path = _self.points2tracker(points),
        cfg = BUI.mix({},lineAttrs),
        preWidth = Number(lineAttrs['stroke-width']),
        shape;

      cfg['stroke-width'] = preWidth + tolerance;
      cfg['stroke-opacity'] = 0.001;
      cfg.path = path;
      shape = _self.addShape('path',cfg);
      _self.set('trackerShape',shape);
    },
    //将点转换成Path
    points2path : function(points){
      if(!points.length){
        return '';
      }
      var _self = this,
        smooth = _self.get('smooth'),
        connectNulls = _self.get('connectNulls'),
        path = '',
        preItem,
        str;
      if(points.length <= 2){ //少于3个点不能使用smooth
        smooth = false;
      }

      BUI.each(points,function(item,index){
        if(item.value == null){
          if(connectNulls){
            return;
          }
          str = '';
        }else{
          str = (preItem == null || preItem.value == null) ? (smooth ? 'M{x} {y} R' : 'M{x} {y}') : (smooth ? ' {x} {y}' : 'L{x} {y}');
          
        }
        
        path += BUI.substitute(str,item);
        
        preItem = item;
        
      });
      if(_self.isInCircle()){
        path += 'z';
      }
      return path;
    },
    //获取tracker的路径，增加触发事件的范围
    points2tracker : function(points){
      if(!points.length){
        return '';
      }
      var _self = this,
        tolerance = _self.get('tolerance'),
        first = points[0],
        path = 'M' + (points[0].x - tolerance) + ' ' + (points[0].y || 0);
      BUI.each(points,function(item,index){
        if (item.value != null) {
          var str = 'L{x} {y}';
          path += BUI.substitute(str,item);
        }
      });
      if(_self.isInCircle()){
        path += 'z';
      }
      return path;
    },
    /**
     * @protected
     * 设置图形的激活状态
     * @param {Boolean} actived 是否激活
     */
    setActiveStatus : function(actived){
      var _self = this,
        line = _self.get('line'),
        lineShape = _self.get('lineShape'),
        lineActived = _self.get('lineActived');
      if(actived){
        lineActived && lineShape.attr(lineActived);
        //_self.toFront();
      }else{
        line && lineShape.attr(line);
        var markersGroup = _self.get('markersGroup');
        markersGroup && markersGroup.clearActivedItem();
      }
    },
    
    /**
     * 获取逼近的marker
     * @return {BUI.Graphic.Shape} 逼近的marker
     */
    getSnapMarker : function(point){
      var _self = this,
        markersGroup = _self.get('markersGroup'),
        rst = null;
      if(markersGroup){
        if(_self.isInCircle()){
          var info = _self.getTrackingInfo(point);
          rst = markersGroup.getSnapMarker(info);
        }else{
          rst = markersGroup.getSnapMarker(point.x);
        }
      }
      return rst;
    }
  });

  return Line;
});
/**
 * @fileOverview 区域图序列
 * @ignore
 */

define('bui/chart/areaseries',['bui/common','bui/chart/lineseries','bui/graphic','bui/chart/series/stacked'],function (require) {
  
  var BUI = require('bui/common'),
    Line = require('bui/chart/lineseries'),
    Util = require('bui/graphic').Util,
    Stacked = require('bui/chart/series/stacked'),
    REGEX_MOVE = /^M.*(M).*$/;

  function trySet(obj,name,value){
    if(obj && !obj[name]){
      obj[name] = value;
    }
  }
  /**
   * @class BUI.Chart.Series.Area
   * 区域图的数据序列
   * @extends BUI.Chart.Series.Line
   */
  var Area = function(cfg){
    Area.superclass.constructor.call(this,cfg);
  };

  Area.ATTRS = {

    /**
     * 区域的配置信息
     * @type {Object}
     */
    area : {
      shared : false,
      value : {
        stroke : '',
        'fill-opacity' : '0.70'
      }
    }

  };

  BUI.extend(Area,Line);
  BUI.mixin(Area,[Stacked]);

  BUI.augment(Area,{
    processColor : function(){
      Area.superclass.processColor.call(this);
      var _self = this,
        color = _self.get('color'),
        area = _self.get('area');

      trySet(area,'fill',color);
    },
    renderUI : function(){
      Area.superclass.renderUI.call(this);
      var _self = this,
        canvas = _self.get('canvas'),
        markersGroup = _self.get('markersGroup');
      if(markersGroup && _self.isStacked()){
        $(markersGroup.get('node')).appendTo(canvas.get('node'));
      }
    },
    //覆盖隐藏方法，同时隐藏markers
    hide : function(){
      Area.superclass.hide.call(this);
      var _self = this,
        markersGroup = _self.get('markersGroup');
      markersGroup && markersGroup.hide();
    },
    //同时显示markers
    show : function(){
      Area.superclass.show.call(this);
      var _self = this,
        markersGroup = _self.get('markersGroup');
      markersGroup && markersGroup.show();
    },
    /**
     * @protected
     * 绘制内部内容
     */
    drawInner : function(points){
      var _self = this,
        areaShape = _self.get('areaShape');
      if(!areaShape){
        _self.drawArea(points);
      }else{
        var path = _self._getAreaPath(points);
        areaShape.attr('path',path);
      }

    },
    _getAreaPath : function(points){
      var _self = this,
        stackType = _self.get('stackType'),
        path;
      if(stackType && stackType != 'none'){
        path = _self.points2StackArea(points);
      }else{
        path = _self.points2area(points);
      }
      return path;
    },
    //坐标轴变化引起的area变化
    changeShapes : function(){
      Area.superclass.changeShapes.call(this);
      var _self = this,
        areaShape = _self.get('areaShape'),
        points = _self.getPoints(),
        path = _self._getAreaPath(points);
      Util.animPath(areaShape,path);

    },
    
    //绘制区域
    drawArea : function(points){
      var _self = this,
        area = _self.get('area'),
        path = _self.isStacked() ? _self.points2StackArea(points) : _self.points2area(points),
        cfg = BUI.mix({path :path},area),
        areaShape;


      areaShape = _self.addShape('path',cfg);

      _self.set('areaShape',areaShape);
    },
    /**
     * @protected
     * 处理节点，并且添加附加信息
     */
    processPoint : function(point,index){
      var _self = this,
        stackType = _self.get('stackType');
      if(stackType && stackType != 'none'){
        _self.processStackedPoint(point,index);
      }
    },
    //获取层叠的区域图，忽略null值
    points2StackArea : function(points){
      var _self = this,
        length = points.length,
        value0 = _self.getBaseValue(),
        first = points[0],
        last = points[length - 1],
        linePath,
        isInCircle = _self.isInCircle(),
        path = '',
        pre;

      if(length){
        pre = _self.getVisiblePrev();
        linePath = _self.points2path(points);
        path = linePath;
        if(pre){
          var prePoints = pre.getPoints().slice(0,points.length),
            preFirst = prePoints[0],
            prePath = _self.points2path(prePoints.reverse());
          //if(!isInCircle){
            prePath = prePath.replace('M','L');
          //}
          if(isInCircle){
            path = linePath + 'L' + preFirst.x + ' '+ preFirst.y + prePath;
          }else{
            path = linePath + prePath;
          }
        }else{
          if(!isInCircle){
            path = 'M ' + first.x + ' '+ value0 + linePath.replace('M','L');
            path = path + 'L '+ last.x + ' '+value0+'';
          }

        }
        if(path && !isInCircle){
          path = path + 'z';
        }
      }
      return path;
    },
    //点转换成区域的path
    points2area : function(points){
      var _self = this,
        length = points.length,
        value0 = _self.getBaseValue(),
        first = points[0],
        last = points[length - 1],
        isInCircle = _self.isInCircle(),
        linePath,
        path = '';
     
      if(length){ 
        linePath = _self.points2path(points);
        if(isInCircle){//在雷达图中显示时不考虑缺少点
          var center = _self.getCircleCenter();
          
          path = linePath;

        }else{
          path = 'M ' + first.x + ' '+ value0;
          path = path + linePath.replace('M','L');
          if(REGEX_MOVE.test(path)){
            path = Util.parsePathString(path);
            var temp = [],
              preBreak = first;;
            BUI.each(path,function(item,index){
              if(index !== 0 && item[0] == 'M'){ //如果遇到中断的点，附加2个点
                var n1 = [],
                  n0 = [], //vml下 中间的'z'存在bug
                  n2 = [],

                  preItem = path[index - 1];
                n1[0] = 'L';
                n1[1] = preItem[1];
                n1[2] = value0;

                n0[0] = 'L';
                n0[1] = preBreak.x;
                n0[2] = value0;

                n2[0] = 'M';
                n2[1] = item[1];
                n2[2] = value0;

                if(preItem[0] == 'R'){ //防止2个
                  preItem[0] = 'L';
                  item[0] = 'R';
                }else{
                  item[0] = 'L';
                }
                temp.push(n1);
                temp.push(n0);
                temp.push(n2);
                preBreak = item;
              }
              temp.push(item);
              
            });
            path = temp;
            path.push(['L',last.x,value0]);
            if(Util.svg){
              path.push(['Z'])
            }

          }else{
            path = path + 'L '+ last.x + ' '+value0+'z';
          }
          
        }
        
      }
      
      return path;
    }
  });
  return Area;
});/**
 * @fileOverview 散列图,用于标示点的分步
 * @ignore
 */

define('bui/chart/scatterseries',['bui/chart/cartesianseries','bui/chart/activedgroup'],function (require) {
  
  var BUI = require('bui/common'),
    Cartesian = require('bui/chart/cartesianseries'),
    ActiveGroup = require('bui/chart/activedgroup');

  function trySet(obj,name,value){
    if(obj && !obj[name]){
      obj[name] = value;
    }
  }
  /**
   * @class BUI.Chart.Series.Scatter
   * 散点图序列
   * @extends BUI.Chart.Series.Cartesian
   */
  var Scatter = function(cfg){
    Scatter.superclass.constructor.call(this,cfg);

  };

  Scatter.ATTRS = {
    elCls : {
      value : 'x-chart-scatter'
    },
    stickyTracking : {
      value : false
    },
    /**
     * 生成时不执行动画
     * @type {Object}
     */
    animate : {
      value : false
    }
  };

  BUI.extend(Scatter,Cartesian);

  BUI.augment(Scatter,{

    /**
     * @protected
     * 处理颜色
     */
    processColor : function(){
      var _self = this,
        color = _self.get('color');
      if(color){
        var  markers = _self.get('markers');
        if(markers){
          trySet(markers.marker,'stroke',color);
          trySet(markers.marker,'fill',color);
        }
      }
    },
    //绘制点
    draw : function(points){
      var _self = this

      BUI.each(points,function(point){
        _self.addMarker(point);
      });
    },
    //鼠标hover
    onMouseOver : function(){
      var _self = this,
        markersGroup = _self.get('markersGroup');

      if(markersGroup){
        markersGroup.on('mouseover',function(ev){
          var target = ev.target,
            shape = target.shape;
          if(shape){
            markersGroup.setActivedItem(shape);
          }
        });
      }
    },
    //获取当前定位的点
    getTrackingInfo : function(){
      var _self = this,
        markersGroup = _self.get('markersGroup'),
        activeMarker,
        rst,
        point;
      if(markersGroup){
        activeMarker = markersGroup.getActived();
        if(activeMarker){
          rst = activeMarker.get('point');
        }
      }
      return rst;
    },
    //鼠标移出
    onMouseOut : function(){
      var _self = this,
        markersGroup = _self.get('markersGroup');

      if(markersGroup){
        markersGroup.on('mouseout',function(ev){
          var target = ev.target,
            shape = target.shape;
          if(shape){
            markersGroup.clearActivedItem(shape);
          }
        });
      }
    }

  });

  return Scatter;
});/**
 * @fileOverview 气泡图
 * @ignore
 */

define('bui/chart/bubbleseries',['bui/common','bui/chart/cartesianseries','bui/graphic','bui/chart/activedgroup'],function (require) {
  
  var BUI = require('bui/common'),
    Cartesian = require('bui/chart/cartesianseries'),
    ActiveGroup = require('bui/chart/activedgroup'),
    Util = require('bui/graphic').Util;

  /**
   * @class BUI.Chart.Series.Bubble
   * 冒泡图
   */
  var Bubble = function(cfg){
    Bubble.superclass.constructor.call(this,cfg);
  };

  Bubble.ATTRS = {
    elCls : {
      value : 'x-chart-bubble'
    },
    type : {
      value : 'buble'
    },
    /**
     * 气泡的配置信息
     * @type {Object}
     */
    circle : {
      shared : false,
      value : {
        
      }
    },
    /**
     * 激活气泡的状态
     * @type {Object}
     */
    activeCircle : {
      value : {
      }
    },
    animate : {
      value : true
    },
    stickyTracking : {
      value : false
    }
  };

  BUI.extend(Bubble,Cartesian);

  BUI.mixin(Bubble,[ActiveGroup]);

  BUI.augment(Bubble,{

    /**
     * @protected
     * 处理颜色
     */
    processColor : function(){
      var _self = this,
        color = _self.get('color');
      if(color){
        var  circle = _self.get('circle');
        if(circle){
          Util.trySet(circle,'stroke',color);
          Util.trySet(circle,'fill',color);
        }
      }
    },
    renderUI : function(){
      Bubble.superclass.renderUI.call(this);
      this._renderGroup();
    },
    //渲染圆
    draw : function(points){
      var _self = this;
      
      BUI.each(points,function(point){
        _self.addBubble(point);
      });
    },
    /**
     * @protected
     * 内部图形发生改变
     */
    changeShapes : function(){
      var _self = this,
        points = _self.getPoints(),
        items = _self.getItems();

      BUI.each(items,function(item,index){
        var point = points[index];
        item.animate({
          cx : point.x,
          cy : point.y
        },_self.get('changeDuration'));
        item.set('point',point);
      });

    },
    /**
     * 获取内部的圆
     * @return {Array} 图形圆的集合
     */
    getItems : function(){
      return this.get('group').get('children');
    },
    /**
     * @protected
     * 获取可以被激活的元素
     * @return {BUI.Chart.Actived[]} 可以被激活的元素集合
     */
    getActiveItems : function(){
      return this.getItems();
    },
    _renderGroup : function(){
      var _self = this,
        group = _self.addGroup();
      _self.set('group',group);
    },
    //设置激活状态
    setItemActived : function(item,actived){
      var _self = this,
        circle = _self.get('circle'),
        activedCfg = _self.get('activeCircle');
      if(actived){
        item.attr(activedCfg);
        item.set('actived',true);
      }else{
        item.attr(circle);
        item.set('actived',false);
      }
    },
    //获取当前定位的点
    getTrackingInfo : function(){
      var _self = this,
        activedCircle = _self.getActived();
      return activedCircle && activedCircle.get('point');
    },
    /**
     * @protected
     * 是否激活
     * @param {BUI.Chart.Actived} item 可以被激活的元素
     * @return {BUI.Chart.Actived[]} 可以被激活的元素集合
     */
    isItemActived : function(item){
      return item.get('actived');
    },
    //添加冒泡
    addBubble : function(point){
      var _self = this,
        circle = _self.get('circle'),
        r = 5, //默认5
        radius,
        cfg = BUI.mix({},circle),
        shape;
      if(point.obj){
        r = point.obj['r'];
      }
      if(point.arr){
        r = point.arr[2];
      }
      radius = _self._getRadius(r);
      
      cfg.cx = point.x;
      cfg.cy = point.y;
      if(_self.get('animate') && Util.svg){
        cfg.r = 0;
        shape = _self.get('group').addShape('circle',cfg);
        shape.animate({
          r : radius
        },_self.get('duration'));
      }else{
        cfg.r = radius;
        shape = _self.get('group').addShape('circle',cfg);
      }

      shape.set('point',point);
      
    },
    _getRadius : function(r){
      return Math.pow(r,.75);
    },
     //鼠标hover
    onMouseOver : function(){
      var _self = this
      
      _self.get('group').on('mouseover',function(ev){
        var target = ev.target,
          shape = target.shape;
        _self.setItemActived(shape,true);
      });
    }, 
    //鼠标hover
    onMouseOut : function(){
      var _self = this
      
      _self.get('group').on('mouseout',function(ev){
        var target = ev.target,
          shape = target.shape;
        _self.setItemActived(shape,false);
      });
    }
  });

  return Bubble;
});/**
 * @fileOverview 柱状图
 * @ignore
 */

define('bui/chart/columnseries',['bui/common','bui/graphic','bui/chart/activedgroup','bui/chart/series/stacked'],function (require) {
  
  var BUI = require('bui/common'),
    Util = require('bui/graphic').Util,
    Cartesian = require('bui/chart/cartesianseries'),
    ActiveGroup = require('bui/chart/activedgroup'),
    Stacked = require('bui/chart/series/stacked'),
    Group = require('bui/chart/series/itemgroup');

  function highlight(c,percent){
    var color = Raphael.color(c),
      l = color.l * (1 + percent);
    return Raphael.hsl2rgb(color.h,color.s,l).hex;
  }
  
  function getPiePath (startAngle, endAngle,r,ir,circle) {
      var center = circle.getCenter(),
        path,
        cx = center.x,
        cy = center.y,
        start = circle.getCirclePoint(startAngle,r),
        end = circle.getCirclePoint(endAngle,r);

      //不存在内部圆
      if(!ir){
        path =  ["M", cx, cy, "L", start.x, start.y, "A", r, r, 0, +(endAngle - startAngle > 180), 1, end.x, end.y, "z"];
      }else{
        var iStart = circle.getCirclePoint(startAngle,ir),
          iEnd = circle.getCirclePoint(endAngle,ir);

        path = [];

        path.push(['M',iStart.x,iStart.y]);
        path.push(['L',start.x, start.y]);
        path.push(["A", r, r, 0, +(endAngle - startAngle > 180), 1, end.x, end.y]);
        path.push(['L',iEnd.x,iEnd.y]);
        path.push(['A',ir,ir,0,+(endAngle - startAngle > 180),0,iStart.x,iStart.y]);
        path.push(['z']);
      }
      return path;
    }

  /**
   * @class BUI.Chart.Series.Column
   * 柱状图
   * @extends BUI.Chart.Series.Cartesian
   * @mixins BUI.Chart.Series.ItemGroup
   */
  var Column = function(cfg){
    Column.superclass.constructor.call(this,cfg);
  };


  Column.ATTRS = {
    type : {
      value : 'column'
    },
    elCls : {
      value : 'x-chart-column'
    },
    /**
     * 每一个子项的宽度,自动计算得出
     * @type {Number}
     */
    columnWidth : {
      //value : 25
    },
    /**
     * 自动计算得出
     * @type {Object}
     */
    columnOffset : {
      value : 0
    },
    /**
     * 是否允许取消选中，选中状态下，继续点击则会取消选中
     * @type {Boolean}
     */
    cancelSelect : {
      value : false
    },
    /**
     * 发生层叠时，层叠之间的间距
     * @type {Object}
     */
    stackPadding : {
      value : 1
    },
    animate : {
      value : true
    },
    duration : {
      value : 1000
    },
    item : {
      shared : false,
      value : {
        'stroke': 'none',
        'stroke-width': 1,
        'fill-opacity':.75
      }
    }

  };

  BUI.extend(Column,Cartesian);


  BUI.mixin(Column,[Group,ActiveGroup,Stacked]);


  BUI.augment(Column,{
    /**
     * @protected
     * 处理颜色
     */
    processColor : function(){
      var _self = this,
        color = _self.get('color');
      if(color){
        var item = _self.get('item');
        if(!item.fill){
          item.fill = color;
        }
      }
    },
    bindUI : function(){
      Column.superclass.bindUI.call(this);
      this.bindItemClick();
    },
    //渲染
    draw : function(points){
      var _self = this;
      _self.resetWidth();

      BUI.each(points,function(point,index){
        _self._drawPoint(point,index);
      });
      if(_self.get('animate')){
        _self.animateItems();
      }
      _self.sort();
    },
    _drawPoint : function(point,index){
      var _self = this,
        shape = _self.addItem(point,index);

      if(_self.get('labels')){
        var label = _self.addLabel(point.value,point);
        shape.set('label',label);
      }
    },
    //覆写添加节点的方法
    addPoint : function(point,shift,redraw){
      var _self = this,
        data = _self.get('data');
      data.push(point);
      
      if(shift){
        data.shift();
        redraw &&  _self.shiftPoint();
      }
      _self.changeData(data,redraw);
    },
    shiftPoint : function(){
      var _self = this,
        firstItem = _self.getItems()[0];
      firstItem && firstItem.remove();
      Column.superclass.shiftPoint.call(this);
    },
    //重置宽度
    resetWidth : function(){
      if(this.isInCircle()){
        this.resetCircleWidth();
        return ;
      }
      var _self = this,
        curIndex,
        xAxis = _self.get('xAxis'),
        tickLength = xAxis.getTickAvgLength(),
        count,
        margin = 10,
        width,
        offset,
        info = _self._getIndexInfo();

      count = info.count;
      curIndex = info.curIndex;

      width = (tickLength/2)/count;
      margin = 1/2 * width;
      offset = 1/2 * (tickLength - (count) * width - (count - 1) * margin) + ((curIndex + 1) * width + curIndex * margin) - 1/2 * width - 1/2 * tickLength ;
      _self.set('columnWidth',width);
      _self.set('columnOffset',offset)

    },
    //获取index相关信息
    _getIndexInfo : function(){
      var _self = this,
        parent = _self.get('parent'),
        series = parent.getSeries(),
        curIndex,
        count,
        columns = [];
      if(!_self.isStacked()){
        BUI.each(series,function(item){
          if(item.get('visible') && item.get('type') == 'column'){
            columns.push(item);
          }
        });

        count = columns.length;
        curIndex = BUI.Array.indexOf(_self,columns);
      }else{
        count = 1;
        curIndex = 0;
      }
      
      return {
        curIndex : curIndex,
        count : count
      };
    },
    //重置圆中的宽度
    resetCircleWidth : function(){
      var _self = this,
        curIndex,
        xAxis = _self.get('xAxis'),
        avgAngle = xAxis.getTickAvgAngle(),
        count,
        width,
        offset;
      info = _self._getIndexInfo();

      count = info.count;
      curIndex = info.curIndex;
      width = avgAngle / count;
      offset = curIndex * width;
      _self.set('columnWidth',width);
      _self.set('columnOffset',offset)
    },
    changeShapes : function(points){
      var _self = this;

      _self.resetWidth();
      _self.changePoints(points);
    },
    getActiveItems : function(){
      return this.getItems();
    },
    /**
     * @protected
     * @ignore
     */
    isItemActived : function(item){
      return item.get('actived');
    },
    /**
     * @protected
     * 设置激活状态
     * @param {BUI.Chart.Actived} item 可以被激活的元素
     * @param {Boolean} actived 是否激活
     */
    setItemActived : function(item,actived){
      var _self = this,
        color = item.getCfgAttr('attrs').fill;

      if(actived){
        item.attr('fill',highlight(color,0.2));
        item.set('actived',true);
      }else{
        item.attr('fill',color);
        item.set('actived',false);
      }
    },
    /**
     * @protected
     * 设置选中
     * @param {Object} item  
     * @param {Boolean} selected 选中状态
     */
    setItemSelected : function(item,selected){
      var _self = this,
        attrs = item.getCfgAttr('attrs'),
        color = attrs.fill,
        stroke = attrs.stroke,
        strokeWidth = attrs['stroke-width'];
      if(selected){
        item.attr({'stroke': Util.dark(color,.30),'stroke-width' : 2});
        item.set('selected',true);
      }else{
        item.attr({'stroke': stroke,'stroke-width' : strokeWidth});
        item.set('selected',false);
      }
    },
    /**
     * @protected
     * 鼠标在画布上移动
     */
    onStickyTracking : function(ev){
      var _self = this,
        point = _self.getTrackingInfo(ev.point),
        items = _self.getItems();
      if(point){
        BUI.each(items,function(item){
          if(item.get('point').x == point.x && item.get('point').y == point.y){
            _self.setActivedItem(item);
          }
        });
      }
    },
    /**
     * @protected
     * 动画过程中根据比例获取path
     * @param  {Object} point  子项的节点信息
     * @param  {Number} factor 比例
     * @return {Array}  path
     */
    pointToFactorPath : function(point,factor){
      var _self = this,
        item = _self.get('item'),
        width = _self.get('columnWidth'), //宽度,雷达图中表示角度
        offset = _self.get('columnOffset'),
        height,
        value0,
        stackPadding = 0,
        baseValue =  _self.getBaseValue(),
        isInCircle = _self.isInCircle(),
        path = []; //

      if(isInCircle){ //雷达图中显示
        var xAxis = _self.get('xAxis'),
          angle = point.xValue,//此时xValue指角度
          startAngle = offset + angle, //起始坐标
          endAngle = offset + angle + width,//结束角度
          r = point.r || xAxis.getDistance(point.x,point.y),
          ir = point.ir || 0; 

        r = r * factor;
        ir = ir * factor;
        path = getPiePath(startAngle,endAngle,r,ir,xAxis);

      }else{
        if(_self.isStacked() && point.lowY){
            value0 = point.lowY ;
            stackPadding = _self.get('stackPadding');
        }else{
          value0 = baseValue;
        }
        value0 = value0 - stackPadding;

        height = point.y - value0;
        path.push(['M',point.x + offset - width/2,baseValue + (value0 - baseValue) * factor]);
        path.push(['v',height * factor]);
        path.push(['h',width]);
        path.push(['v',-1 * height * factor]);
        path.push(['z']);
      }
      

      return path;
    },
    /**
     * @protected
     * 处理节点，并且添加附加信息
     */
    processPoint : function(point,index){
      var _self = this,
        stackType = _self.get('stackType');
      if(stackType && stackType != 'none'){
        _self.processStackedPoint(point,index);
      }
    }

  });

  return Column;
  

});/**
 * @fileOverview 饼图
 * @ignore
 */

define('bui/chart/pieseries',['bui/common','bui/graphic','bui/chart/baseseries','bui/chart/series/itemgroup'],function (require) {

  var BUI = require('bui/common'),
    ItemGroup = require('bui/chart/series/itemgroup'),
    ActiveGroup = require('bui/chart/activedgroup'),
    Util = require('bui/graphic').Util,
    Base = require('bui/chart/baseseries');

  //决定x坐标
  function ensureX(self,x){
    if(BUI.isNumber(x)){
      return x;
    }

    var plotRange = getPlotRange(self),
      xPercent = parsePercent(x),
      width = plotRange.getWidth();
    return plotRange.tl.x + width * xPercent;
  }

  //决定y坐标
  function ensureY(self,y){
    if(BUI.isNumber(y)){
      return y;
    }

    var plotRange = getPlotRange(self),
      yPercent = parsePercent(y),
      height = plotRange.getHeight();
    return plotRange.tl.y + height * yPercent;
  }
  //处理百分比
  function parsePercent(v){
    return parseFloat(v) * 0.01;
  }
  //获取range
  function getPlotRange(self){
    return self.get('parent').get('plotRange');
  }

  function resetItem(item,h,endAngle,r,center){
      var angle = endAngle - (Math.acos((r-h)/r)/Math.PI * 180);

        item.orignAngle = item.angle;
        item.angle =  angle;
        item.orignX = item.x;
        item.orignY = item.y;

        //增加5像素，用于连接线
        item.x = center.x + (r + 5) * Math.cos(item.angle * RAD);
        item.y = center.y + (r + 5) * Math.sin(item.angle * RAD);
  }

  function alignLables(center,r,arr,endAngle,factor){
    var count = parseInt(r * 2 / LINE_HEIGHT,10),//理论上，最大显示的条数
      maxY = center.y + r,
      minY = center.y - r;
    if(count < arr.length){ //忽略掉不能显示的条数
      //arr = arr.slice(0,count - 1);
      arr.splice(count,arr.length - count);
    }

    var conflictIndex = 0, //从该点开始存在冲突，需要调整位置
      length = arr.length,
      leftAvg,
      leftCount;
    //查找第一个容放不下后面节点的位置
    for (var i = 0; i < length; i++) {
      var label = arr[i],
        angle = label.angle,
        y = label.y;

      leftCount = length - i;
      leftAvg = factor > 0 ? (maxY - y) / leftCount : (y - minY) / leftCount;
      conflictIndex = i;
      
      if(leftAvg < LINE_HEIGHT){
        conflictIndex = i + 1;
        break;
      }
    }

    

    if(conflictIndex && conflictIndex < length - 1){ //说明存在冲突，因为已经调整过，所以conflictIndex > 0
      var start = conflictIndex - 1,
        startLabel = arr[start],
        y =  startLabel.y, //start == 0 ? (factor > 0 ? minY : maxY) :
        endY = factor > 0 ? maxY : minY;

      leftCount = length - start - 1;
      leftAvg = Math.abs(endY - y) / leftCount;
      if(leftAvg < LINE_HEIGHT){
        leftAvg = LINE_HEIGHT;
      }
      //调整后面的文本
      for (var i = length - 1; i >= start; i--) {
        var h = (length - 1 - i) * leftAvg;
        resetItem(arr[i],h,endAngle,r,center);
       
      };

      var startY = factor > 0 ? minY : maxY,
        adjust = false;
      //调整前面的文本
      for(var i = start -1; i > 0 ;i--){
        var item = arr[i];
        if(!adjust && Math.abs(startY - item.y) / (i + 1) < LINE_HEIGHT){
          adjust = true;
        }
        if(adjust){
          var h = Math.abs(arr[i + 1].y - endY) + LINE_HEIGHT;
          resetItem(arr[i],h,endAngle,r,center);
        }
      }
      
    }

  }


  var RAD = Math.PI / 180,
    MARGIN = 5,
    LINE_HEIGHT = 16; //最小行高

  /**
   * @class BUI.Chart.Series.Pie
   * 饼图数据序列
   * @extends BUI.Chart.Series
   * @mixins BUI.Chart.Series.ItemGroup
   */
  var Pie = function(cfg){
    Pie.superclass.constructor.call(this,cfg);
  };

  Pie.ATTRS = {

    /**
     * 大小所占的比例，用于计算半径
     * @type {String}
     */
    size : {
      value : '80%'
    },
    /**
     * 内部的大小，用于计算开始的位置
     * @type {String}
     */
    innerSize : {

    },
    /**
     * 圆心的位置，如果数组中是数字则是相对于cavas的位置，如果是字符串，则按照百分比进行
     * @type {Array}
     */
    center : {
      value : ['50%','50%']
    },
    /**
     * 颜色集合
     * @type {Array}
     */
    colors : {

    },
    /**
     * 将指定的颜色进行调节亮度
     * @type {Number}
     */
    colorHighlight : {
      value : 0
    },
    /**
     * 如果设置了size，通过计算得出
     * @type {Number}
     */
    radius : {

    },
    /**
     * 开始的角度，-180-180
     * @type {Number}
     */
    startAngle : {
      value : -90
    },
    /**
     * 结束的角度，默认 360，但是，endAngle - startAngle <= 360
     * @type {Number}
     */
    endAngle : {
      value : 270
    },
    
    xField : {
      value : 'name'
    },
    stickyTracking : {
      value : false
    },
    animate : {
      value : true
    },
    duration : {
      value : 1000
    }
  };

  BUI.extend(Pie,Base);

  BUI.mixin(Pie,[ItemGroup,ActiveGroup]);

  BUI.augment(Pie,{

    draw : function(points){

      var _self = this,
        selectedPoint;
      BUI.each(points,function(point,index){
        _self.formatPoint(point,index);
        var item = _self.addItem(point,index);
        if(point.obj && point.obj.selected){
          selectedPoint = item;
        }
      });
      if(_self.get('animate')){
        _self.animateItems(after);
      }else{
        after();
      }
      if(_self.get('labelsGroup')){
        _self.processLabels(points);
        _self.get('labelsGroup').toFront();
      }

      function after(){
        if(selectedPoint){
          _self.setSelected(selectedPoint);
        }
      }
    },
    /**
     * @protected
     * 内部图形发生改变
     */
    changeShapes : function(points,animate){
      var _self = this;

      BUI.each(points,function(point,index){
        _self.formatPoint(point,index);
      });

      _self.changePoints(points);

    },
    //处理labels
    processLabels : function(points){
      var _self = this,
        labelsGroup = _self.get('labelsGroup'),
        distance = labelsGroup.get('distance'),
        leftArray = [],
        center = _self.getCenter(),
        r = _self.getRadius(),
        rAppend = r + distance,
        startAngle = _self.get('startAngle'),
        endAngle = _self.get('endAngle'),
        rightArray = [];

      BUI.each(points,function(point){
        var cfg = _self._getLabelCfg(point,distance,rAppend);
        if(distance < 0){
          labelsGroup.addLabel(cfg);
        }else{
          if(cfg.factor > 0){
            rightArray.push(cfg);
          }else{
            leftArray.push(cfg);
          }
        }
      });
      if(leftArray.length){
        var end;
        if(startAngle >= -90){
          end = 270;
        }else{
          end = -90;
        }
        alignLables(center,rAppend,leftArray,end,-1);
        BUI.each(leftArray,function(label){
          labelsGroup.addLabel(label);
          _self.lineToLabel(label,r,distance);
        });
      }
      if(rightArray.length){

        alignLables(center,rAppend,rightArray,90,1);
        BUI.each(rightArray,function(label){
          labelsGroup.addLabel(label);
          _self.lineToLabel(label,r,distance);
        });
      }
      
    },
    /**
     * 设置labels
     * @param  {Array} items items的配置信息
     */
    resetLabels : function(){
      var _self = this,
        labelsGroup = _self.get('labelsGroup'),
        lineGroup = _self.get('lineGroup');
      if(labelsGroup){
        labelsGroup.clear();
        lineGroup && lineGroup.clear();
        _self.processLabels(_self.getPoints());
      }
    },
    lineToLabel : function(label,r,distance){
      var _self = this,
        angle = label.orignAngle || label.angle,
        center = _self.getCenter(),
        start = _self._getOffset(angle,r + MARGIN /2 ),
        inner,
        lineGroup = _self.get('lineGroup'),
        path = [];

      path.push(['M',center.x + start.x,center.y + start.y]);
      if(label.orignX != null){
        inner = _self._getOffset(angle,r + distance/2);
        path.push(['R',center.x  + inner.x,center.y + inner.y,label.x,label.y]);
      }else{
        path.push(['L',label.x,label.y]);
      }

      if(!lineGroup){
        lineGroup = _self.addGroup();
        _self.set('lineGroup',lineGroup);
      }
      lineGroup.addShape('path',{
        path : path,
        fill : null,
        stroke : label.color
      });


    },
    bindUI : function(){
      Pie.superclass.bindUI.call(this);
      this.bindItemClick();
    },
   
    //鼠标移动
    onMouseOver : function(){
      var _self = this;

      _self.on('mouseover',function(ev){
        var target = ev.target,
          shape = target.shape;
        shape && _self.setActivedItem(shape);
      });
    },
    _getLabelCfg : function(point,distance,rAppend){
      var _self = this,
        middleAngle = point.startAngle + (point.endAngle - point.startAngle)/2,
        center = _self.getCenter(),
        x = center.x + (rAppend + MARGIN) * Math.cos(middleAngle * RAD),
        y = center.y + (rAppend + MARGIN) * Math.sin(middleAngle * RAD),
        rst = {},
        factor = 1;

      rst.x = x;
      rst.y = y;

      if(distance < 0){ //圆内显示文本
        if(middleAngle > -90 && middleAngle <= 90){
          rst['text-anchor'] = 'end';
          rst.rotate = middleAngle;
        }else{
          rst['text-anchor'] = 'start';
          rst.rotate = middleAngle - 180;
        }

      }else{
        if(middleAngle > -90 && middleAngle <= 90){
          rst['text-anchor'] = 'start';
          factor = 1;
        }else{
          factor = -1;
          rst['text-anchor'] = 'end';
        }
      }
      rst.factor = factor;
      rst.angle = middleAngle;
      rst.color = point.color;
      rst.point = point;
      rst.text = point.xValue;
      return rst;
    },
    getActiveItems : function(){
      return this.getItems();
    },
    //设置激活状态
    setItemActived : function(item,actived){
      var _self = this,
        color = item.getCfgAttr('attrs').fill;
      if(actived){
        item.attr({fill : Util.highlight(color,.1)});
        item.set('actived',true);
      }else{
        item.attr({fill : color});
        item.set('actived',false);
      }
    },
    //获取当前定位的点
    getTrackingInfo : function(){
      var _self = this,
        item = _self.getActived();
      return item && item.get('point');
    },
    /**
     * @protected
     * 是否激活
     * @param {BUI.Chart.Actived} item 可以被激活的元素
     * @return {BUI.Chart.Actived[]} 可以被激活的元素集合
     */
    isItemActived : function(item){
      return item.get('actived');
    },
    /**
     * 获取半径
     * @return {Number} 半径
     */
    getRadius : function(){
      var _self = this,
        radius = _self.get('radius');
      if(!radius){
        radius = _self.calculateRadius(_self.get('size'));
        _self.set('radius',radius);
      }
      return radius;
    },
    /**
     * 获取内部的半径，空白部分
     * @return {Number} 内部的半径
     */
    getInnerRadius : function(){
      var _self = this,
        innerRadius = _self.get('innerRadius'),
        innerSize = _self.get('innerSize');
      if(!innerRadius && innerSize){
        innerRadius = _self.calculateRadius(innerSize);
        _self.set('innerRadius',innerRadius);
      }
      return innerRadius;
    },
    //计算半径
    calculateRadius : function(size){
      var _self = this,
        plotRange = _self.get('parent').get('plotRange'),
        percent = parsePercent(size);
      return Math.min(plotRange.getWidth(),plotRange.getHeight())/2 * percent;
    },
    //获取中心点
    getCenter : function(){
      var _self = this,
        centerPoint = _self.get('centerPoint'),
        center;
      if(!centerPoint){
        centerPoint = {};
        center = _self.get('center');
        
        centerPoint.x = ensureX(_self,center[0]);
        centerPoint.y = ensureY(_self,center[1]);
        _self.set('centerPoint',centerPoint);
      }
      return centerPoint;
    },
    /**
     * @protected
     * 获取子项的配置信息
     * @param  {Object} item 信息
     */
    getItemCfg : function(point,index){
      var _self = this,
        item = _self.get('item'),
        cfg = point.obj,
        rst = {};

      BUI.mix(rst,item);
      if(cfg && cfg.attrs){
        BUI.mix(rst,cfg.attrs);
      }
      //if(!rst.fill){
        rst.fill = point.color;
      //}
      if(_self.get('allowPointSelect')){
        rst.cursor = 'pointer';
      }
      return rst;
    },
    //获取颜色
    _getColor : function(index){
      var _self = this,
        colors = _self.get('colors'),
        colorHighlight = _self.get('colorHighlight'),
        color;
      index = index % colors.length;
      color = colors[index];
      if(colorHighlight){
        color = Util.highlight(colorHighlight);
      }
      return color;
    },
    //格式化节点
    formatPoint : function(point,index){
      var _self = this,
        points = _self.getVisiblePoints(),
        percent = _self._getPiePercent(point,points),
        startAngle = _self.get('startAngle'),
        endAngle = _self.get('endAngle'),
        totalAngle = endAngle - startAngle,
        rst = {};
      point.percent = percent.percent;
      if(point.obj && point.obj.attrs){
        point.color = point.obj.attrs.fill;
      }
      point.color =  point.color || _self._getColor(index);
      point.prePercent = percent.prePercent;
      point.startAngle = startAngle + totalAngle * percent.prePercent;
      point.endAngle = startAngle + totalAngle * (point.prePercent + point.percent);

    },
    getPointByValue : function(xValue,value){
      return {
        xValue : xValue,
        value : value
      };
    },
    //获取当前节点占用的比例和开始点的比例
    _getPiePercent : function(point,points){
      var _self = this,
        total = 0,
        pre = 0,
        curIndex = BUI.Array.indexOf(point,points),
        rst = {};
      BUI.each(points,function(point,index){
        if(index < curIndex){
          pre += point.value;
        }
        total += point.value;
      });

      rst.percent = point.value / total;
      rst.prePercent = pre / total;
      return rst;
    },
    getVisiblePoints : function(){
      var _self = this,
        visiblePoints;

      return _self.getPoints();
      //未渲染，则调用初始化时的点信息
      /*if(!_self.get('isPaint')){
        
      }

      visiblePoints = _self.get('visiblePoints');
      if(visiblePoints){
        return visiblePoints;
      }
      var points = [],
        items = _self.getItems();
      BUI.each(items,function(item){
        if(item.get('visible')){
          points.push(item.get('point'));
        }
      });
      _self.set('visiblePoints',points);
      return points;
      */
    },
    /**
     * 执行单个点的动画
     * @protected
     */
    animateItem : function(item,prePoint){
      var _self = this,
        curPoint = item.get('point'),
        startAngle = curPoint.startAngle,
        endAngle = curPoint.endAngle,
        isPre = prePoint == item.get('prePoint'),
        preStart = isPre ? prePoint.startAngle : prePoint.endAngle,
        preEnd = isPre ? prePoint.endAngle : prePoint.endAngle;
      var animHadler = item.get('animHadler');
      if(animHadler){
        Util.stopStep(animHadler);
      }
      animHadler = Util.animStep(_self.get('changeDuration'),function(factor){
        var path,
          curStart,
          curEnd;
        if(isPre){
          curStart = preStart + (startAngle - preStart) * factor;
          curEnd = preEnd + (endAngle - preEnd) * factor
          
        }else{
          curStart = preStart - (preStart - startAngle) * factor;
          curEnd = preEnd - (preEnd - endAngle) * factor;
        }
        path = _self._getPiePath(curStart,curEnd);
       
        item.attr('path',path);
        if(_self.isSelected(item)){
          var offset = _self._getOffset(curStart,curEnd,10);
          item.attr('transform' ,'t'+ offset.x +' '+offset.y);
        }
      });
      item.set('animHadler',animHadler);
    },
    /**
     * @protected
     * 动画过程中根据比例获取path
     * @param  {Object} point  子项的节点信息
     * @param  {Number} factor 比例
     * @return {Array}  path
     */
    pointToFactorPath : function(point,factor){
      var _self = this,
        startAngle = _self.get('startAngle'),
        pStart, //当前点的起始
        pEnd; //当前点的结束

      pStart = point.startAngle;
      pEnd = point.endAngle;

      return _self._getPiePath(startAngle + (pStart - startAngle) * factor,startAngle + (pEnd - startAngle) * factor);
    },
    //获取路径
    _getPiePath : function(startAngle, endAngle) {
      var _self = this,
        center = _self.getCenter(),
        
        path,
        cx = center.x,
        cy = center.y,
        r = _self.getRadius(),
        ir = _self.getInnerRadius(), //内部圆的半径
        x1 = cx + r * Math.cos(startAngle * RAD),
        x2 = cx + r * Math.cos(endAngle * RAD),
        y1 = cy + r * Math.sin(startAngle * RAD),
        y2 = cy + r * Math.sin(endAngle * RAD);

      //不存在内部圆
      if (!ir) {
        if (endAngle - startAngle == 360) {
          // 如果只有一个图形100%.
          path = [['M', cx, cy - r], ['a', r, r, 0, 1, 1, 0, 2 * r], ['a', r, r, 0, 1, 1, 0, -2 * r], ['z']];
        } else {
          path =  ["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 1, x2, y2, "z"];
        }
      } else {
        // 圆环
        var ix1 = cx + ir * Math.cos(startAngle * RAD),
          ix2 = cx + ir * Math.cos(endAngle * RAD),
          iy1 = cy + ir * Math.sin(startAngle * RAD),
          iy2 = cy + ir * Math.sin(endAngle * RAD);

        path = [];

        if (endAngle - startAngle == 360) {
          // 如果只有一个图形100%.
          // path = [['M', cx, cy - r], ['a', r, r, 0, 1, 1, 0, 2 * r], ['a', r, r, 0, 1, 1, 0, -2 * r], ['z']];
          path.push(['M', cx, cy - r]);
          path.push(["a", r, r, 0, 1, 1, 0, 2 * r]);
          path.push(["a", r, r, 0, 1, 1, 0, -2 * r]);
          // 这里如果用L就会有一根白线.
          path.push(['M', cx, cy - ir]);
          path.push(["a", ir, ir, 0, 1, 0, 0, 2 * ir]);
          path.push(["a", ir, ir, 0, 1, 0, 0, -2 * ir]);
          path.push(['z']);
        } else {
          path.push(['M',ix1,iy1]);
          path.push(['L',x1, y1]);
          path.push(["A", r, r, 0, +(endAngle - startAngle > 180), 1, x2, y2]);
          path.push(['L',ix2,iy2]);
          path.push(['A',ir,ir,0,+(endAngle - startAngle > 180),0,ix1,iy1]);
          path.push(['z']);
        }

        



      }
      return path;
    },
    _getOffset : function(startAngle,endAngle,distance){

      var _self = this,
        middleAngle,
        rst = {};
      if(distance == null){ //只有2个参数时
        middleAngle = startAngle;
        distance = endAngle;
      }else{
        middleAngle = startAngle + (endAngle - startAngle)/2;
      }
     
      rst.x = distance * Math.cos(middleAngle * RAD);
      rst.y = distance * Math.sin(middleAngle * RAD);
      return rst;
    },
    /**
     * @protected
     * 覆写方法
     * @ignore
     */
    setItemSelected : function(item,selected){

      var _self = this,
        point = item.get('point'),
        duration = _self.get('changeDuration'),
        //selectedItem,
        offset;
      if(selected){
        /*selectedItem = _self.getSelected();
        if(selectedItem && selectedItem != item){
          _self.setItemSelected(selectedItem,false);
        }*/
        offset = _self._getOffset(point.startAngle,point.endAngle,10);
        item.animate({
          transform : 't'+ offset.x +' '+offset.y
        },duration);
      }else{
        item.animate({
          transform : 't0 0'
        },duration);
      }
      item.set('selected',selected);
    }
  });

  return Pie;
});
/**
 * @fileOverview 数据序列的入口文件
 * @ignore
 */

define('bui/chart/series',['bui/chart/baseseries','bui/chart/lineseries','bui/chart/areaseries','bui/chart/columnseries',
  'bui/chart/scatterseries','bui/chart/bubbleseries','bui/chart/pieseries'],function (require) {

	var Series = require('bui/chart/baseseries');

	Series.Line = require('bui/chart/lineseries');
  Series.Area = require('bui/chart/areaseries');
  Series.Column = require('bui/chart/columnseries');
	Series.Scatter = require('bui/chart/scatterseries');
  Series.Bubble = require('bui/chart/bubbleseries');
  Series.Pie = require('bui/chart/pieseries');

	return Series;
});/**
 * @fileOverview 所有数据图形序列的容器,管理这些序列的增删，active状态，事件处理等等
 * @ignore
 */

define('bui/chart/seriesgroup',['bui/common','bui/chart/plotitem','bui/chart/legend'
  ,'bui/chart/activedgroup','bui/chart/series','bui/chart/tooltip','bui/chart/axis'],function (require) {

  var BUI = require('bui/common'),
    ActivedGroup = require('bui/chart/activedgroup'),
    PlotItem = require('bui/chart/plotitem'),
    Legend = require('bui/chart/legend'),
    Tooltip = require('bui/chart/tooltip'),
    Axis = require('bui/chart/axis'),
    Series = require('bui/chart/series'),
    maxPixel = 120, //坐标轴上的最大间距
    minPixel = 80; //坐标轴上最小间距

  function min(x,y){
    return x > y ? y : x;
  }
  function max(x,y){
    return x > y ? x : y;
  }

  /**
   * @class BUI.Chart.SeriesGroup
   * 数据序列的容器
   * @protected
   */
  function Group(cfg){
    Group.superclass.constructor.call(this,cfg);
  }

  Group.ATTRS = {
    elCls : {
      value : 'x-chart-series-group'
    },
    zIndex : {
      value : 5
    },
    plotRange : {

    },
    /**
     * 存在多个序列时，线的颜色，marker的颜色
     * @type {Object}
     */
    colors : {
      value : ['#2f7ed8','#0d233a','#8bbc21','#910000','#1aadce','#492970','#f28f43','#77a1e5','#c42525','#a6c96a']
    },
    /**
     * 如果使用marker，那么不同图形序列的形状
     * @type {Array}
     */
    symbols : {
      value : ['circle','diamond','square','triangle','triangle-down']
    },
    /**
     * 序列图的统一配置项，不同的序列图有不同的配置项例如：
     *
     *  - lineCfg : 折线图的配置项
     *  - columnCfg : 柱状图的配置项
     * @type {Object}
     */
    seriesOptions : {
      value : {}
    },
    /**
     * 数据图形序列的配置项
     * @type {Array}
     */
    series : {

    },
    /**
     * 图例
     * @type {Object}
     */
    legend : {

    },
    /**
     * x 坐标轴
     * @type {BUI.Chart.Axis}
     */
    xAxis : {

    },
    /**
     * y 坐标轴
     * @type {Array|BUI.Chart.Axis}
     */
    yAxis : {

    },
    /**
     * 提示信息的配置项
     * @type {Object}
     */
    tooltip : {

    },
    /**
     * @private
     * 缓存的层叠数据
     * @type {Array}
     */
    stackedData : {

    },
    /**
     * 可以设置数据序列共同的数据源
     * @type {Array}
     */
    data : {

    },
    /**
     * 活动子项的名称，用于组成 itemactived,itemunactived的事件
     * @protected
     * @type {String}
     */
    itemName : {
      value : 'series'
    }

  };

  BUI.extend(Group,PlotItem);

  BUI.mixin(Group,[ActivedGroup]);

  BUI.augment(Group,{


    //渲染控件
    renderUI : function(){
      var _self = this;
      Group.superclass.renderUI.call(_self);
      //_self._renderTracer();
      _self._renderLegend();

      _self._renderSeries();
      _self._renderAxis();
      _self._addSeriesAxis();

      _self._paintAxis(_self.get('xAxis'),'xAxis');
      _self._paintAxis(_self.get('yAxis'),'yAxis');
      _self._paintSeries();

      _self._renderTooltip();
    },
    //绑定事件
    bindUI : function(){
      var _self = this;
      Group.superclass.bindUI.call(_self);
      _self.bindCanvasEvent();
    },
    //绑定鼠标在画板上移动事件
    bindCanvasEvent : function(){
      var _self = this,
        triggerEvent = _self.get('tipGroup').get('triggerEvent'),
        canvas = _self.get('canvas');

      if (triggerEvent == 'click') {
        function __documentClick(ev){
          if(!$.contains(canvas.get('node'), ev.target)&&canvas.get('node') != ev.target){
            _self.onTriggerOut(ev);
            $(document).off('click', __documentClick);
          }
        }
        canvas.on('click',function(ev){
          _self.onCanvasMove(ev);
          setTimeout(function(){
            $(document).off('click', __documentClick).on('click', __documentClick);
          })
        });

      } else {
        canvas.on('mousemove',BUI.wrapBehavior(_self,'onCanvasMove'));
        canvas.on('mouseout',BUI.wrapBehavior(_self,'onMouseOut'));
      }
    },
    //处理鼠标在画板上移动
    onCanvasMove : function(ev){
      var _self = this,
        canvas = _self.get('canvas'),
        tipGroup = _self.get('tipGroup'),
        point,
        tipInfo;

      if(!tipGroup){
        return;
      }

      point = canvas.getPoint(ev.pageX,ev.pageY);
      if(_self._isInAxis(point)){
        _self._processTracking(point,tipGroup);
      }else{
        _self.onMouseOut();
      }
    },
    // 处理隐藏tip事件
    onTriggerOut : function(ev){
      var _self = this,
        tipGroup = _self.get('tipGroup');
      _self.clearActivedItem();
      //标志从显示到隐藏
      if(tipGroup.get('visible')){
        if(tipGroup.get('shared')){
          BUI.each(_self.getVisibleSeries(),function(series){
            var markers = series.get('markersGroup');
            markers && markers.clearActivedItem();
          });
        }
        _self._hideTip();
      }
    },

    onMouseOut : function(ev){
      var _self = this;
      if(ev && ev.target != _self.get('canvas').get('none')){
        return;
      }
      _self.onTriggerOut(ev);

    },
    /**
     * 获取所有的数据序列
     * @return {Array} [description]
     */
    getSeries : function(){
      return this.get('children');
    },
    //处理鼠标跟随事件
    _processTracking : function(point,tipGroup){
      var _self = this,
        sArray = [],
        //prePoint = _self.get('prePoint'),
        tipInfo;


      if(!tipGroup.get('shared')){
        var activedItem = _self.getActived();
        activedItem && sArray.push(activedItem);
      }else{
        sArray = _self.getSeries();
      }

      BUI.each(sArray,function(series){
        if(series && series.get('stickyTracking') && series.get('visible')){
          series.onStickyTracking({point : point});
        }
      });
      if(sArray.length){
        tipInfo = _self._getTipInfo(sArray,point);
        if(tipInfo.items.length){
          _self._showTooltip(tipInfo.title,tipInfo.point,tipInfo.items);
        }

      }
    },
    //获取显示tooltip的内容
    _getTipInfo : function(sArray,point){
      var rst = {
        items : [],
        point : {}
      };
      var count = 0,
        renderer = this.get('tipGroup').get('pointRenderer');
      BUI.each(sArray,function(series,index){
        var info = series.getTrackingInfo(point),
            item = {},
            title;

        if(info){
          if(series.get('visible')){
            count = count + 1;
            item.name = series.get('name');
            item.value = renderer ? renderer(info,series) : series.getTipItem(info);
            item.color = info.color || series.get('color');
            rst.items.push(item);
            var markersGroup = series.get('markersGroup');
            if(markersGroup && markersGroup.get('single')){
              var marker = markersGroup.getChildAt(0);
              marker && marker.attr({
                x :info.x,
                y : info.y
              });
            }
          }
          if(series.get('xAxis')){
            title = series.get('xAxis').formatPoint(info.xValue);
          }else{
            title = info.xValue;
          }
          if(count == 1){
            rst.title =  title;
            if(info.x){
              rst.point.x = info.x;
              if(sArray.length == 1){
                rst.point.y = info.y;
              }else{
                rst.point.y = point.y;
              }
            }else{
              rst.point.x = point.x;
              rst.point.y = point.y;
            }

          }
        }
      });

      return rst;
    },
    //显示tooltip
    _showTooltip : function(title,point,items){
      var _self = this,
        tooltip = _self.get('tipGroup'),
        prePoint = _self.get('prePoint');
      if(!prePoint || prePoint.x != point.x || prePoint.y != point.y){
        tooltip.setPosition(point.x,point.y);
        _self.set('prePoint',point);
        if(!tooltip.get('visible')){
          tooltip.show();
        }
        tooltip.setTitle(title);
        tooltip.setItems(items);
      }
    },
    //隐藏tip
    _hideTip : function(){
      var _self = this,
        tipGroup = _self.get('tipGroup');
      if(tipGroup && tipGroup.get('visible')){
        tipGroup.hide();
        _self.set('prePoint',null);
      }
    },
    //是否在坐标系内
    _isInAxis : function(point){
      var _self = this,
        plotRange = _self.get('plotRange');

      return plotRange.isInRange(point);
    },
    //渲染所有的序列
    _renderSeries : function(){
      var _self = this,
        series = _self.get('series');

      BUI.each(series,function(item,index){
        _self.addSeries(item,index);
      });
    },
    //渲染legend
    _renderLegend : function(){
      var _self = this,
        legend = _self.get('legend'),
        legendGroup;

      if(legend){
        legend.items = legend.items || [];
        legend.plotRange = _self.get('plotRange');
        legendGroup = _self.get('parent').addGroup(Legend,legend);
        _self.set('legendGroup',legendGroup);
      }
    },
    //渲染tooltip
    _renderTooltip : function(){
      var _self = this,
        tooltip = _self.get('tooltip'),
        tipGroup;
      if(tooltip){
        tooltip.plotRange = _self.get('plotRange');
        tipGroup = _self.get('parent').addGroup(Tooltip,tooltip);
        _self.set('tipGroup',tipGroup);
      }
    },
    _renderAxis : function(){
      var _self = this,
        xAxis = _self.get('xAxis'),
        yAxis = _self.get('yAxis');
      if(xAxis && !xAxis.isGroup){
        xAxis = _self._createAxis(xAxis);
        _self.set('xAxis',xAxis);
      }

      if(BUI.isArray(yAxis) && !yAxis[0].isGroup){ //如果y轴是一个数组
        var temp = [];
        BUI.each(yAxis,function(item){
          temp.push(_self._createAxis(item));
          _self.set('yAxis',temp);
        });
      }else if(yAxis && !yAxis.isGroup){
        if(xAxis && xAxis.get('type') == 'circle'){
          yAxis.type = 'radius';
          yAxis.circle = xAxis;
        }
        yAxis = _self._createAxis(yAxis);
        _self.set('yAxis',yAxis);
      }


    },
    //创建坐标轴
    _createAxis : function(axis){
      var _self = this,
        type = axis.type,
        C,
        name;
      if(axis.categories){
        type = 'category';
      }else if(!axis.ticks && type != 'circle'){
        axis.autoTicks = true; //标记是自动计算的坐标轴
      }
      if(type == 'category' && !axis.categories){
        axis.autoTicks = true; //标记是自动计算的坐标轴
      }
      axis.plotRange = _self.get('plotRange');
      axis.autoPaint = false;  //暂时不绘制坐标轴，需要自动生成坐标轴

      type = type || 'number';
      name = BUI.ucfirst(type);
      C = Axis[name];
      if(C){
        return  _self.get('parent').addGroup(C,axis);
      }
      return null;
    },
    //获取y轴的坐标点
    _caculateAxisInfo : function(axis,name){
      if(axis.get('type') == 'category'){
        return this._caculateCategories(axis,name);
      }
      var _self = this,
        data = [],
        type = axis.get('type'),
        length = axis.getLength(),
        minCount = Math.floor(length / maxPixel),
        maxCount = Math.ceil(length / minPixel),
        stackType,
        series,
        min,
        max,
        interval,
        autoUtil,
        rst;
        if(type == 'number' || type == 'radius') {
          min = axis.getCfgAttr('min');
          max = axis.getCfgAttr('max');
          autoUtil = Axis.Auto;
        }else if(type == 'time'){
          var startDate = axis.get('startDate'),
            endDate = axis.get('endDate');
          if(startDate){
            min = startDate.getTime();
          }
          if(endDate){
            max = endDate.getTime();
          }
          autoUtil = Axis.Auto.Time;
        }

        interval = axis.getCfgAttr('tickInterval');

      series = _self.getSeries();

      var cfg = {
        min : min,
        max : max,

        interval: interval
      };
      if(name == 'yAxis'){
        cfg.maxCount = maxCount;
        cfg.minCount = minCount;
        stackType = series[0].get('stackType');
      }
      if(stackType && stackType != 'none'){
        data = _self.getStackedData(axis,name);
      }else{
        data = _self.getSeriesData(axis,name);
      }
      if(data.length){
        cfg.data = data;

        rst =  autoUtil.caculate(cfg,stackType);
      }else{
        rst = {
          ticks : []
        };
      }


      return rst;

    },
    _caculateCategories : function(axis,name){
      var _self = this,
        data = _self.getSeriesData(axis,name),
        categories = [];
        if(data.length){
          categories = categories.concat(data[0]);
        }
      if(data.length > 1 && !_self.get('data')){ //不共享data时
        for (var i = 1; i < data.length; i++) {
          var arr = data[i];
          BUI.each(arr,function(value){
            if(!BUI.indexOf(value)){
              categories.push(value);
            }
          });
        };
      }
      return {
        categories : categories
      };
    },
    /**
     * 获取数据序列的数据
     * @protected
     * @param  {BUI.Chart.Axis} axis 坐标轴
     * @param  {String} name 坐标轴名称
     * @return {Array} 数据集合
     */
    getSeriesData : function(axis,name){
      var _self = this,
        data = [],
        series = _self.getVisibleSeries();
      axis = axis || _self.get('yAxis');
      name = name || 'yAxis';

      BUI.each(series,function(item){
        if(item.get(name) == axis){
          var arr = item.getData(name);
          if(arr.length){
            data.push(arr);
          }

        }
      });

      return data;
    },
    //转换数据,将json转换成数组
    _parseData : function(obj,fields){
      var rst = [];
      BUI.each(fields,function(key){
        rst.push(obj[key]);
      });
      return rst;
    },
    /**
     * @protected
     * 获取层叠数据
     * @param  {String} stackType 层叠类型
     * @param  {BUI.Chart.Axis} axis 坐标轴
     * @param  {String} name 坐标轴名称
     * @return {Array} 数据集合
     */
    getStackedData : function(axis,name){
      var _self = this,
        data,
        first
        stackedData = _self.get('stackedData'),
        arr = [];
      if(stackedData){
        arr = stackedData;
      }else{
        data = _self.getSeriesData(axis,name);
        first = data[0],
        min = null;

        BUI.each(first,function(value,index){
          var temp = value;
          for(var i = 1 ; i< data.length; i++){
            var val = data[i][index];
            temp += val;
            if(min == null || val < min){
              min = val;
            }
          }
          arr.push(temp);
        });
        arr.push(min);
        _self.set('stackedData',arr);
      }

      return arr;
    },
    //name 标示是xAxis ,yAxis and so on
    _paintAxis : function(axis,name){
      var _self = this,
        arr;

      if(BUI.isArray(axis)){
        arr = axis;
      }else{
        arr = [axis];
      }

      BUI.each(arr,function(item,index){
        if(_self._hasRelativeSeries(item,name)){
          if(item.get('autoTicks')){
            var info = _self._caculateAxisInfo(item,name);
            item.changeInfo(info);

          }

          item.paint();
        }

      });

    },
    //是否存在关联的数据序列
    _hasRelativeSeries : function(axis,name){
      var _self = this,
        series = _self.getVisibleSeries(),
        rst = false;

      BUI.each(series,function(item){
        if(item.get(name) == axis){
          rst = true;
          return false;
        }
      });
      return rst;

    },
    //数据变化或者序列显示隐藏引起的坐标轴变化
    _resetAxis : function(axis,type){

      if(!axis.get('autoTicks')){
        return;
      }
      type = type || 'yAxis';

      this.set('stackedData',null);

      var _self = this,
        info = _self._caculateAxisInfo(axis,type),
        series = _self.getSeries();

      //如果是非自动计算坐标轴，不进行重新计算

      axis.change(info);
    },
    _resetSeries : function(){
      var _self = this,
        series = _self.getSeries();
      BUI.each(series,function(item){
        if(item.get('visible')){
          item.repaint();
        }
      });
    },
    /**
     * 重新绘制数据序列
     */
    repaint : function(){
      var _self = this,
        xAxis = _self.get('xAxis'),
        yAxis = _self.get('yAxis');
      xAxis && _self._resetAxis(xAxis,'xAxis');
      if(yAxis){
        if(BUI.isArray(yAxis)){
          BUI.each(yAxis,function(axis){
            _self._resetAxis(axis,'yAxis');
          });
        }else{
          _self._resetAxis(yAxis,'yAxis');
        }
      }
      _self._resetSeries();
    },
    /**
     * 改变数据
     * @param  {Array} data 数据
     */
    changeData : function(data){
      var _self = this,
        series = _self.getSeries(),
        fields = _self.get('fields');

      _self.set('data',data);

      BUI.each(series,function(item,index){
        if(fields){
          var arr = _self._getSeriesData(item.get('name'),index);
          item.changeData(arr);
        }else{
          item.changeData(data);
        }
      });
      _self.repaint();
    },
    //根据series获取data
    _getSeriesData : function(name,index){
      var _self = this,
        data = _self.get('data'),
        fields = _self.get('fields'),
        obj = data[index];
      if(name){
        BUI.each(data,function(item){
          if(item.name == name){
            obj = item;
            return false;
          }
        });
      }
      return _self._parseData(obj,fields);
    },
    //获取默认的类型
    _getDefaultType : function(){
      var _self = this,
        seriesCfg = _self.get('seriesOptions'),
        rst = 'line'; //默认类型是线
      BUI.each(seriesCfg,function(v,k){
        rst = k.replace('Cfg','');
        return false;
      });
      return rst;
    },
    /**
     * 获取显示的数据序列
     * @return {BUI.Chart.Series[]} 数据序列集合
     */
    getVisibleSeries : function(){
      var _self = this,
        series = _self.getSeries();
      return BUI.Array.filter(series,function(item){
        return item.get('visible');
      });
    },
    /**
     * 添加数据序列
     * @param {BUI.Chart.Series} item 数据序列对象
     */
    addSeries : function(item,index){
      var _self = this,
        type = item.type || _self._getDefaultType(),
        cons = _self._getSeriesClass(type),
        cfg = _self._getSeriesCfg(type,item,index),
        series ;
      cfg.autoPaint = cfg.autoPaint || false;

      series  = _self.addGroup(cons,cfg);
      _self._addLegendItem(series);
      return series;
    },
    //绘制数据线
    _paintSeries : function(){
      var _self = this,
        series = _self.getSeries();

      BUI.each(series,function(item){
        item.paint();
      });
    },
    _addSeriesAxis : function(){
      var _self = this,
        series = _self.getSeries();

      BUI.each(series,function(item){
        if(item.get('type') == 'pie'){
          return true;
        }
        //x轴
        if(!item.get('xAxis')){
          item.set('xAxis', _self.get('xAxis'));
        }
        //y轴
        var yAxis = _self.get('yAxis');

        if(item.get('yAxis') == null){
          if(BUI.isArray(yAxis)){
            item.set('yAxis',yAxis[0]);
          }else{
            item.set('yAxis',yAxis);
          }
        }
        //多个y轴时
        if(BUI.isNumber(item.get('yAxis'))){
          item.set('yAxis',yAxis[item.get('yAxis')]);
        }
      });

    },
    /**
     * 显示series
     * @param  {BUI.Chart.Series} series 数据序列对象
     */
    showSeries : function(series){
      var _self = this,
        yAxis = _self.get('yAxis');
      if(!series.get('visible')){
        series.show();
        if(yAxis){
          _self._resetAxis(yAxis);
          _self._resetSeries();
        }
      }
    },
    /**
     * 隐藏series
     * @param  {BUI.Chart.Series} series 数据序列对象
     */
    hideSeries : function(series){
      var _self = this,
        yAxis = _self.get('yAxis');
      if(series.get('visible')){
        series.hide();
        if(yAxis){
          _self._resetAxis(yAxis);
          _self._resetSeries();
        }
      }
    },
    _addLegendItem : function(series){
      var _self = this,
        legendGroup = _self.get('legendGroup');
      legendGroup && legendGroup.addItem({
        series : series
      });
    },
    //获取序列的配置信息
    _getSeriesCfg : function(type,item,index){
      var _self = this,
        seriesCfg = _self.get('seriesOptions'),
        colors = _self.get('colors'),
        data = _self.get('data'),
        fields = _self.get('fields'),
        symbols = _self.get('symbols');

      item = BUI.mix(true,{},seriesCfg[type + 'Cfg'],item);

      //颜色
      if(!item.color && colors.length){
        item.color = colors[index % (colors.length)];
      }
      //marker的形状
      if(item.markers && item.markers.marker && !item.markers.marker.symbol){
        item.markers.marker.symbol = symbols[index % symbols.length];
      }
      if(data && !item.data){
        if(fields){
          item.data = _self._getSeriesData(item.name,index);
        }else{
          item.data = data;
        }

      }

      return item;
    },
    //根据类型获取构造函数
    _getSeriesClass : function(type){
      var name = BUI.ucfirst(type),
        c = Series[name] || Series;
      return c;
    },
    remove : function(){
      var _self = this,
        canvas = _self.get('canvas');
      canvas.off('mousemove',BUI.getWrapBehavior(_self,'onCanvasMove'));
      canvas.off('mouseout',BUI.getWrapBehavior(_self,'onMouseOut'));

      Group.superclass.remove.call(_self);
    }

  });

  return Group;
});
/**
 * @fileOverview 图表控件
 * @ignore
 */
define('bui/chart/chart',['bui/common','bui/graphic','bui/chart/plotback','bui/chart/theme','bui/chart/seriesgroup'],function (require) {
  
  var BUI = require('bui/common'),
    PlotBack = require('bui/chart/plotback'),
    Graphic = require('bui/graphic'),
    SeriesGroup = require('bui/chart/seriesgroup'),
    Theme = require('bui/chart/theme');

  function mixIf(obj1,obj2){
    var rst = {},
      isMerge = false;
    BUI.each(obj1,function(v,k){
      rst[k] = obj2[k];
      if(BUI.isObject(rst[k])){
        BUI.mix(true,rst[k],obj1[k]);
      }else{
        rst[k] = obj1[k];
      }
      
    });
    if(!isMerge){
      rst['lineCfg'] = obj2['lineCfg'];
    }
    return rst;

  }

  /**
   * @class BUI.Chart.Chart
   * 图，里面包括坐标轴、图例等图形
   * @extends BUI.Component.Controller
   * @mixins BUI.Component.UIBase.Bindable
   */
  var Chart = BUI.Component.Controller.extend([BUI.Component.UIBase.Bindable],{

    renderUI : function(){
      var _self = this;

      _self.paint();
    },
    /**
     * 清除图形
     */
    clear : function(){
      var _self = this,
        canvas = _self.get('canvas');
      canvas.destroy();
      _self.set('isPaint',false);
    },
    /**
     * 绘制整个图
     */
    paint : function(){
      var _self = this;
      if(!_self.get('isPaint')){
        _self._renderCanvas();
        _self._renderPlot();
        _self._renderTitle();
        _self._renderSeries();
        _self.get('canvas').sort();
      }
    },
    //渲染画板
    _renderCanvas : function(){
      var _self = this,
        el = _self.get('el'),
        width = _self.get('width') || el.width(),
        height = _self.get('height') || el.height(),
        canvas = new Graphic.Canvas({
          width : width,
          height :height,
          render : el
        });
      canvas.chart = _self;
      _self.set('canvas',canvas);
    },
    //渲染背景、边框等
    _renderPlot : function(){
      var _self = this,
        plotCfg = _self.get('plotCfg'),
        canvas = _self.get('canvas'),
        theme = _self.get('theme'),
        plotBack,
        plotRange;

      plotCfg = BUI.mix({},theme.plotCfg,plotCfg);
      plotBack = canvas.addGroup(PlotBack,plotCfg),
      plotRange = plotBack.get('plotRange');

      _self.set('plotRange',plotRange);

    },
    //渲染title
    _renderTitle : function(){
      var _self = this,
        title = _self.get('title'),
        subTitle = _self.get('subTitle'),
        theme = _self.get('theme'),
        canvas = _self.get('canvas');
      if(title){
        if(title.x == null){
          title.x = canvas.get('width')/2;
          title.y = title.y || 15;
        }
        title = BUI.mix({},theme.title,title);
        canvas.addShape('label',title);
      }
      if(subTitle){
        if(subTitle.x == null){
          subTitle.x = canvas.get('width')/2;
          subTitle.y = subTitle.y || 35;
        }
        subTitle = BUI.mix({},theme.subTitle,subTitle);
        canvas.addShape('label',subTitle);
      }
    },
    _getDefaultType : function(){
      var _self = this,
        seriesOptions = _self.get('seriesOptions'),
        rst = 'line'; //默认类型是线
      BUI.each(seriesOptions,function(v,k){
        rst = k.replace('Cfg','');
        return false;
      });
      return rst;
    },
    //渲染数据图序列
    _renderSeries : function(){
      var _self = this,
        theme = _self.get('theme'),
        cfg = {},
        attrs = _self.getAttrVals(),
        defaultType = _self._getDefaultType(),
        seriesGroup;

      BUI.each(attrs.series,function(item){
        if(!item.type){
          item.type = defaultType;
        }
      });
      BUI.mix(true,cfg,theme,{
        colors :  attrs.colors,
        data : attrs.data,
        fields : attrs.fields,
        plotRange : attrs.plotRange,
        series : attrs.series,
        seriesOptions : attrs.seriesOptions,
        tooltip : attrs.tooltip,
        legend : attrs.legend,
        xAxis : attrs.xAxis
      });

      if(BUI.isObject(attrs.yAxis)){
        BUI.mix(true,cfg,{
          yAxis : attrs.yAxis
        });
      }else if(BUI.isArray(attrs.yAxis)){
        attrs.yAxis[0] = BUI.merge(true,theme.yAxis,attrs.yAxis[0]);
        cfg.yAxis = attrs.yAxis;
      }


      seriesGroup = _self.get('canvas').addGroup(SeriesGroup,cfg);
      _self.set('seriesGroup',seriesGroup);

    },
    /**
     * 重绘整个图
     */
    repaint : function(){
      var _self = this;
      _self.get('seriesGroup').repaint();
    },
    /**
     * 获取所有的数据序列
     * @return {Array} 所有的数据序列数组
     */
    getSeries : function(){
      return this.get('seriesGroup').getSeries();
    },
     /**
     * 改变数据
     * @param  {Array} data 数据
     */
    changeData : function(data){
      var _self = this,
        group = _self.get('seriesGroup');
      if(data !== _self.get('data')){
        _self.set('data',data);
      }
      group.changeData(data);
    },
    //加载完成数据
    onLoad : function(){
      var _self = this,
        store = _self.get('store'),
        data = store.getResult();
      _self.changeData(data);
    },
    //添加数据
    onAdd : function(e){
      this.onLoad();
    },
    //移除数据
    onRemove : function(e){
      this.onLoad();
    },
    onUpdate : function(e){
      this.onLoad();
    },
    onLocalSort : function(e){
      this.onLoad();
    },
    destructor : function(){
      var _self = this;

      _self.clear();
    }
  },{
    ATTRS : {

      /**
       * 画板
       * <code>
       *  var canvas =  chart.get('canvas');
       * </code>
       * @type {BUI.Graphic.Canvas}
       */
      canvas : {

      },
      /**
       * 数据图例默认的颜色顺序
       * @type {Array}
       */
      colors : {

      },
      /**
       * 显示的数据
       * @type {Array}
       */
      data : {

      },
      /**
       * 标示每个图例颜色的配置项
       * @type {Object}
       */
      legend : {

      },
      /**
       * 菜单的配置项
       * @type {Object}
       */
      menu : {

      },
      /**
       * 绘图的配置，包括背景、边框等配置信息
       * @type {Object}
       */
      plotCfg : {

      },
      /**
       * @protected
       * 绘制图形的区域
       * @type {Object}
       */
      plotRange : {

      },
      /**
       * 数据图序列集合
       * @type {Array}
       */
      series : {

      },
      /**
       * 数据图序列默认的配置项
       * @type {Object}
       */
      seriesOptions : {

      },
      /**
       * 子标题
       * @type {String}
       */
      subTitle : {

      },
      /**
       * 标题
       * @type {String}
       */
      title : {

      },
      /**
       * 提示信息
       * @type {Object}
       */
      tooltip : {

      },
      /**
       * x 轴坐标
       * @type {Object|Array}
       */
      xAxis : {

      },

      /**
       * Y 轴坐标
       * @type {Object|Array}
       */
      yAxis : {

      },
      /**
       * 数据中使用的字段，用于转换数据使用例如： 
       *  - fields : ['intelli','force','political','commander']
       *  - 数据：
       * <pre><code>
       * [
       *  {"name" : "张三","intelli":52,"force":90,"political":35,"commander" : 85},
       *   {"name" : "李四","intelli":95,"force":79,"political":88,"commander": 72},
       *  {"name" : "王五","intelli":80,"force":42,"political":92,"commander": 50}
       * ]
       * </code></pre>
       *  - 转换成
       *  <pre><code>
       * [
       *   [52,90,35,85],
       *   [95,79,88,72],
       *   [80,42,92,50]
       * ]
       * </code></pre>
       * @type {Array}
       */
      fields : {
        
      },
      /**
       * 应用的样式
       * @type {Object}
       */
      theme : {
        value : Theme.Base
      }
      /**
       * @event seriesactived
       * 数据序列激活
       * @param {Object} ev 事件对象
       * @param {BUI.Chart.Series} ev.series 数据序列对象
       */
      
      /**
       * @event seriesunactived
       * 数据序列取消激活
       * @param {Object} ev 事件对象
       * @param {BUI.Chart.Series} ev.series 数据序列对象
       */
      
      /**
       * @event seriesitemactived
       * 数据序列的子项激活，一般用于饼图和柱状图
       * @param {Object} ev 事件对象
       * @param {BUI.Chart.Series} ev.seriesItem 数据序列子项
       * @param {BUI.Chart.Series} ev.series 数据序列对象
       */
      
      /**
       * @event seriesitemunactived
       * 数据序列的子项取消激活，一般用于饼图和柱状图
       * @param {Object} ev 事件对象
       * @param {BUI.Chart.Series} ev.seriesItem 数据序列子项
       * @param {BUI.Chart.Series} ev.series 数据序列对象
       */
      
      /**
       * @event seriesitemclick
       * 数据序列的子项的点击，一般用于饼图和柱状图
       * @param {Object} ev 事件对象
       * @param {BUI.Chart.Series} ev.seriesItem 数据序列子项
       * @param {BUI.Chart.Series} ev.series 数据序列对象
       */
      
      /**
       * @event seriesitemselected
       * 数据序列的子项选中，一般用于饼图和柱状图
       * @param {Object} ev 事件对象
       * @param {BUI.Chart.Series} ev.seriesItem 数据序列子项
       * @param {BUI.Chart.Series} ev.series 数据序列对象
       */
      
      /**
       * @event seriesitemunselected
       * 数据序列的子项取消选中，一般用于饼图和柱状图
       * @param {Object} ev 事件对象
       * @param {BUI.Chart.Series} ev.seriesItem 数据序列子项
       * @param {BUI.Chart.Series} ev.series 数据序列对象
       */
      
    }
  },{
    xclass : 'chart'
  });

  return Chart;
});