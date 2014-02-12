define('bui/graphic/util',['bui/graphic/raphael'],function (require) {

	var BUI = require('bui/common'),
		Raphael = require('bui/graphic/raphael'),
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

	var Util = {};

	BUI.mix(Util,{
		/**
		 * 是否是vml
		 * @type {Boolean}
		 */
		vml : Raphael.vml,
		/**
		 * 是否是svg
		 * @type {Boolean}
		 */
		svg : Raphael.svg,

		angle : function(x1, y1, x2, y2){
			return Raphael.angle(x1, y1, x2, y2);
		},
		/**
		 * 获取path上的点
		 * @param  {String} path 路径
		 * @param  {Number} length 长度
		 * @return {Object}  {x: x-axis ,y: y-axis}
		 */
		getPointAtLength : function(path, length){
			return Raphael.getPointAtLength(path,length);
		},
		/**
		 * 节点是否在指定的Path中
		 * @param  {String} path 路径
		 * @param {Number} x x坐标
		 * @param {Number} y y坐标
		 * @return {Boolean} 是否在path中
		 */
		isPointInsidePath : function(path, x, y){
			return Raphael.isPointInsidePath(path,x,y);
		},
		/**
		 * 获取子path
		 * @param  {String} path 路径字符串
		 * @param  {Number} from 开始的节点
		 * @param  {Number} to   结束的节点
		 * @return {String} 子路径
		 */
		getSubpath : function(path, from, to){
			return Raphael.getSubpath(path,from,to);
		},
		/**
		 * 将path字符串转换成数组
		 * @param  {String} str 字符串
		 * @return {Array}  数组
		 */
		parsePathString : function(str){
			return Raphael.parsePathString(str);
		},
		/**
		 * 将path数组转换成字符串
		 * @param  {Array} array 数组
		 * @return {String}  字符串
		 */
		parsePathArray : function(array){
			if(BUI.isArray(array)){
				var path = $.map(array,function(item){
					var str = item.join(' ');
					return str.replace(/([a-z,A-Z])\s+/,'$1');
				});
				return path.join(' ');
			}
			return array;
		},
		/**
		 * 平移path
		 * @param  {String} path 路径
		 * @param  {Array|String|Object} transform 平移路径
		 * @return {Array} path数组
		 */
		transformPath : function(path,transform){
			return Raphael.transformPath(path,transform);
		},
		/**
		 * 获取逼近的值，用于对齐数据
		 * @param  {Array} values   数据集合
		 * @param  {Number} value   数值
		 * @param  {Number} [tolerance=10] 逼近范围
		 * @return {Number} 逼近的值
		 */
		snapTo : function(values, value, tolerance){
			if(tolerance){
				return Raphael.snapTo(values, value, tolerance);
			}
			var floorVal = floor(values,value),
				ceilingVal = ceiling(values,value);
			if(value - floorVal < ceilingVal - value){
				return floorVal;
			}
			return ceilingVal;
		},
		/**
		 * 获取逼近的最小值，用于对齐数据
		 * @param  {Array} values   数据集合
		 * @param  {Number} value   数值
		 * @return {Number} 逼近的最小值
		 */
		snapFloor : function(values,value){
			return floor(values,value);
		},
		/**
		 * 获取逼近的最大值，用于对齐数据
		 * @param  {Array} values   数据集合
		 * @param  {Number} value   数值
		 * @return {Number} 逼近的最大值
		 */
		snapCeiling : function(values,value){
			return ceiling(values,value);
		}
	});
	return Util;
});