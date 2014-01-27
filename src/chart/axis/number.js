/**
 * @fileOverview  数字类型的坐标轴
 * @ignore
 */

define('bui/chart/numberaxis',['bui/chart/baseaxis','bui/common'],function (require) {
	
	var BUI = require('bui/common'),
		Axis = require('bui/chart/baseaxis'),
		NAN = NaN;

  //取小于当前值的
	function floor(values,value){
		var length = values.length,
			pre = values[0];
		if(value < values[0] || value > values[length - 1]){
			return NAN;
		}
		for (var i = 1; i < values.length; i++) {
			if(value < values[i]){
				break;
			}
			pre = values[i];
		}

		return pre;
	}

	function ceiling(values,value){
		var length = values.length,
			pre = values[0],
			rst;
		if(value < values[0] || value > values[length - 1]){
			return NAN;
		}

		for (var i = 1; i < values.length; i++) {
			if(value < values[i]){
				rst = values[i];
				break;
			}
			pre = values[i];
		}

		return rst;
	}

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

		}

	};

	BUI.augment(NumberAxis,{
		//渲染控件前
		beforeRenderUI : function(){
			var _self = this;
			NumberAxis.superclass.beforeRenderUI.call(_self);
			
			//如果未指定坐标轴上的点，则自动计算
			if(!_self.get('ticks')){
				var min = _self.get('min'),
					max = _self.get('max'),
					tickInterval = _self.get('tickInterval'),
					ticks = [],
					count = (max - min)/tickInterval;

				ticks.push(min);
				for(var i = 1 ; i <= count ;i++){
					ticks.push(tickInterval * i + min);
				}
				_self.set('ticks',ticks);
			}
		},
		/**
     * 将指定的节点转换成对应的坐标点
     * @param  {*} value 数据值或者分类 
     * @return {Number} 节点坐标点（单一坐标）x轴的坐标点或者y轴的坐标点
     */
    getOffset : function(value){
    	var _self = this,
    		offset = _self.getRelativeOffset(value);

    	return _self._appendEndOffset(offset) + _self._getStartCoord();
    },
		 /**
     * @protected
     * 获取相对位置
     * @param  {*} value 数据值或者分类 
     * @return {Number}  相对于坐标轴开始位置的偏移量
     */
    getRelativeOffset : function(value){
      var _self = this,
          length = _self._getLength(),
          ticks = _self.get('ticks'),
          count = ticks.length,
          index = BUI.Array.indexOf(value,ticks),
          tickInterval = _self.get('tickInterval'),
          floorVal,
          ceilingVal,
          avg = (length / (count - 1)),
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