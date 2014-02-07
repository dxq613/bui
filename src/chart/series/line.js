/**
 * @fileOverview 线形式的数据图序列
 * @ignore
 */

define('bui/chart/lineseries',['bui/chart/cartesianseries','bui/chart/actived'],function (require) {
	
	var BUI = require('bui/common'),
		Cartesian = require('bui/chart/cartesianseries'),
		Actived = require('bui/chart/actived');

	/**
	 * @class BUI.Chart.Series.Line
	 * 使用线连接数据的数据图序列
	 * @extends BUI.Chart.Series.Cartesian
	 */
	function Line(cfg){
		Line.superclass.constructor.call(this,cfg);
	}

	BUI.extend(Line,Cartesian);

	BUI.mixin(Line,[Actived]);

	Line.ATTRS = {

		elCls : {
			value : 'x-chart-line-series'
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
		 * 如果横坐标是
		 * @type {Number}
		 */
		pointInterval : {

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

		draw : function(){
			var _self = this,
				lineAttrs = _self.get('line'),
				points = _self._getPoints(),
				path = _self.points2path(points),
				cfg = BUI.mix({},lineAttrs);
			cfg.path = path;
			var lineShape = _self.addShape('path',cfg);
			_self.set('lineShape',lineShape);
			_self.drawTracker();
		},
		drawTracker : function(){
			var _self = this,
				lineAttrs = _self.get('line'),
				tolerance = _self.get('tolerance'),
				points = _self._getPoints(),
				path = _self.points2tracker(points),
				cfg = BUI.mix({},lineAttrs),
				preWidth = Number(lineAttrs['stroke-width']);

			cfg['stroke-width'] = preWidth + tolerance;
			cfg['stroke-opacity'] = 0.001;
			cfg.path = path;
			_self.addShape('path',cfg);
		},
		points2path : function(points){
			var _self = this,
				smooth = _self.get('smooth'),
				path = '';
				
			BUI.each(points,function(item,index){
	      var str = index == 0 ? (smooth ? 'M{x} {y} R' : 'M{x} {y}') : (smooth ? ' {x} {y}' : 'L{x} {y}');
	      path += BUI.substitute(str,item);
	    });
	    return path;
		},
		//获取tracker的路径，增加触发事件的范围
		points2tracker : function(points){
			var _self = this,
				tolerance = _self.get('tolerance'),
				first = points[0],
				path = 'M' + (points[0].x - tolerance) + ' ' + points[0].y;
			BUI.each(points,function(item,index){
	      var str = 'L{x} {y}';
	      path += BUI.substitute(str,item);
	    });
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
			}else{
				line && lineShape.attr(line);
			}
		},
		/**
		 * 根据对象获取值
		 * @protected
		 * @return {Object} 点的集合
		 */
		getPointByObject : function(item){
			var _self = this,
				xField = _self.get('xField'),
				yField = _self.get('yField'),
				point = _self.getPoint(item[xField],item[yField]);

			point.value = item[yField];
			
			return point;
		},
		/**
		 * 获取逼近的marker
		 * @return {BUI.Graphic.Shape} 逼近的marker
		 */
		getSnapMarker : function(offsetX){
			var _self = this,
				markerGroup = _self.get('markerGroup'),
				rst = null;
			if(markerGroup){
				rst = markerGroup.getSnapMarker(offsetX);
			}
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
				y = yAxis.getOffset(value);

			if(xAxis.get('type') == 'number'){
				var min = xAxis.get('min'),
					pointInterval = _self.get('pointInterval');

				x = xAxis.getOffset(min + pointInterval * index);
			}else{
				x = xAxis.getOffsetByIndex(index);
			}

			return {
				x : x,
				y : y,
				value : value
			};
		}
	});

	return Line;
});