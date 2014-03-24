/**
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
});