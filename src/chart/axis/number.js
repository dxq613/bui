/**
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
});