/**
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
});