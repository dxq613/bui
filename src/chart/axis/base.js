/**
 * @fileOverview 坐标轴的基类
 * @ignore
 */

define('bui/chart/baseaxis',['bui/common','bui/chart/plotitem','bui/chart/grid','bui/chart/labels'],function(require) {

	var BUI = require('bui/common'),
		Item = require('bui/chart/plotitem'),
        Grid = require('bui/chart/grid'),
        Labels = require('bui/chart/labels'),
		CLS_AXIS = 'x-chart-axis';

	/**
	 * @class BUI.Chart.Axis
	 * 坐标轴
	 * @extends BUI.Chart.PlotItem
	 */
	function Axis(cfg){
		Axis.superclass.constructor.call(this,cfg);
	}

	Axis.ATTRS = {
        zIndex : {
            value : 4
        },
        /**
         * 显示数据的图形范围
         */
		plotRange : {

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
		},
		/**
		 * 标注的节点
		 * @type {Array}
		 */
		ticks : {

		},
		/**
		 * 标题
		 * @type {String|Object}
		 */
		title : {

		},
		/**
		 * 栅格配置
		 * @type {Object}
		 */
		grid : {

		},
		/**
		 * 
		 * @type {Object}
		 */
		labels : {

		}

	};

	BUI.extend(Axis,Item);

	BUI.augment(Axis,{
        //渲染控件前
        beforeRenderUI : function(){
            var _self = this,
                plotRange;
            Axis.superclass.beforeRenderUI.call(_self);
            plotRange = _self.get('plotRange');

            if(plotRange){
                var start = plotRange.start,
                    end = {};
                if(_self.isVertical()){
                    end.y = plotRange.end.y;
                    end.x = start.x; 
                }else{
                    
                    end.x = plotRange.end.x;
                    end.y = start.y;
                }
                _self.set('start',start);
                _self.set('end',end);
            }

        },
    	/**
         * @protected
         * 渲染控件
         */
        renderUI : function(){
        	var _self = this;
        	Axis.superclass.renderUI.call(_self);
        	_self._drawLines();
            _self._renderTicks();
        	if(_self.get('title')){
        		_self._renderTitle();
        	}

            _self._renderGrid();
            _self._renderLabels();
        	
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
        _appendEndOffset : function(offset){
        	var _self = this,
        		tickOffset = _self.get('tickOffset'),
                directfactor;
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
        		ortho = _self._getOrthoCoord();
        	if(!current){
        		current = _self.getOffsetByIndex(index);
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
        //获取中间点的位置
        _getMiddleCoord : function(){
        	var _self = this,
        		start = _self._getStartCoord(),
        		length = _self._getLength();
        	return start + _self._appendEndOffset(length/2);
        },
        //获取坐标轴内部的长度，不计算偏移量
        _getLength : function(){
        	var _self = this,
        		start = _self.get('start'),
        		offset = _self.get('tickOffset'),
        		end = _self.get('end'),
        		length;
        	if(_self.isVertical()){
        		length = end.y - start.y;
        	}else{
        		length = end.x - start.x;
        	}
        	if(length > 0){
        		length = length - offset * 2;
        	}else{
        		length = length + offset * 2;
        	}
        	return length;
        },
        //画轴线
        _drawLines : function(){
        	var _self = this,
        		start = _self.get('start'),
        		end = _self.get('end'),
        		lineAttrs = _self.get('line'),
        		ticks = _self.get('ticks');

        	if(lineAttrs){
        		lineAttrs = BUI.mix({
    	    		x1 : start.x,
    	    		y1 : start.y,
    	    		x2 : end.x,
    	    		y2 : end.y
    	    	},lineAttrs);
    	    	_self.addShape({
    	    		type :'line',
    	    		elCls : CLS_AXIS + '-line',
    	    		attrs :lineAttrs
    	    	});
        	}

        	BUI.each(ticks,function(point,index){
        		var tickOffsetPoint = _self.getTickOffsetPoint(index),
                    offsetPoint = _self.getOffsetPoint(index);
        		//_self._drawTickLine(offsetPoint);
                if(_self.get('tickLine')){
                    _self._addTickItem(tickOffsetPoint);
                }
                if(_self.get('grid')){
                    _self._addGridItem(tickOffsetPoint);
                }
                if(_self.get('labels')){
                    _self._addAxisLabel(point,offsetPoint);
                }
        	});
        	
        },
        //添加坐标轴文本的配置信息
        _addAxisLabel : function(value,offsetPoint){
            var _self = this,
                labels = _self.get('labels'),
                label = {};
            if(!labels.items){
                labels.items = [];
            }
            label.text = value;
            label.x = offsetPoint.x;
            label.y = offsetPoint.y;

            labels.items.push(label);

        },
        _addTickItem : function(offsetPoint){

            var _self = this,
                lineAttrs = _self.get('tickLine'),
                value = lineAttrs.value,
                tickItems = _self.get('tickItems'),
                factor = _self._getAlignFactor(),
                cfg = {
                    x1 : offsetPoint.x,
                    y1 : offsetPoint.y
                };

            if(!tickItems){
                tickItems = [];
                _self.set('tickItems',tickItems);
            }

            if(_self.isVertical()){
                cfg.x2 = cfg.x1 + value * factor;
                cfg.y2 = cfg.y1;
            }else {
                cfg.x2 = cfg.x1;
                cfg.y2 = cfg.y1 + value * factor;
            }
            //BUI.mix(cfg,lineAttrs);
            //delete cfg.value;
            tickItems.push(cfg);
        },

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
                _self.addShape({
                    type : 'path',
                    elCls : CLS_AXIS + '-ticks',
                    attrs : cfg
                });
            }
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

        	cfg.x = offsetPoint.x + (title.x || 0);
        	cfg.y = offsetPoint.y + (title.y || 0);
        	_self.addShape({
        		type : 'label',
        		elCls : CLS_AXIS + '-title',
        		attrs : cfg
        	});

        },
        //添加grid的项
        _addGridItem : function(offsetPoint){
            var _self = this,
                grid = _self.get('grid'),
                plotRange = _self.get('plotRange'),
                item = {};
            if(!grid.items){
                grid.items = [];
            }

            item.x1 = offsetPoint.x;
            item.y1 = offsetPoint.y;
            if(_self.isVertical()){
                item.y2 = item.y1;
                item.x2 = plotRange.end.x;
            }else{
                item.x2 = item.x1;
                item.y2 = plotRange.end.y;
            }
            grid.items.push(item);

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
        //渲染坐标的提示
        _renderLabels : function(){
            var _self = this,
                labels = _self.get('labels'),
                labelsGroup;
            if(!labels){
                return;
            }

            labels.x = _self.get('x');
            labels.y = _self.get('y');

            labelsGroup = _self.get('parent').addGroup(Labels,labels);
            _self.set('labelsGroup',labelsGroup);

        },
        //移除控件前移除对应的grid和labels
        remove : function(){
            
            var _self = this,
                gridGroup = _self.get('gridGroup'),
                labelsGroup = _self.get('labelsGroup');
            gridGroup && gridGroup.remove();
            labelsGroup && labelsGroup.remove();
            Axis.superclass.remove.call(this);
        }
    });

	return Axis;
});