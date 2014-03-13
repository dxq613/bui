define('bui/graphic/util',['bui/graphic/raphael'],function (require) {

	var BUI = require('bui/common'),
		Raphael = require('bui/graphic/raphael'),
		STEP_MS = 16,//16毫秒一个step
		HANDLERS = {

		},
		TIMES = {},//动画的事件校验
		NAN = NaN,
		PRE_HAND = 'h';

	//取小于当前值的
	function floor(values,value){
		var length = values.length,
			pre = values[0];
		if(value < values[0]){
			return NAN;
		}
		if(value > values[length - 1]){
			return values[length - 1];
		}
		for (var i = 1; i < values.length; i++) {
			if(value < values[i]){
				break;
			}
			pre = values[i];
		}

		return pre;
	}
	//大于当前值的第一个
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

	//将数值逼近到指定的数
	function tryFixed(v,base){
		var str = base.toString(),
			index = str.indexOf('.');
		if(index == -1){
			return parseInt(v);
		}
		var length = str.substr(index + 1).length;
		return parseFloat(v.toFixed(length));
	}
	//分步动画
	function animTime(duration,fn,callback){
      var baseTime = new Date().getTime(),
        baseInterval = 16,
        uid = BUI.guid(PRE_HAND);

      next(0,fn,duration,callback);
      function next(num,fn,duration,callback){
        var nowTime = new Date().getTime();
        var durTime = nowTime - baseTime;
        if(durTime >= duration){
          fn(1,num);
          callback && callback();
          return ;
        }

        var factor = Math.pow(durTime/duration, .48);
        fn(factor,num);

 
        // window.requestAnimationFrame
        if(window.requestAnimationFrame){
          HANDLERS[uid] =  window.requestAnimationFrame(function(){
            next(num+1,fn,duration,callback);
          });
        }else{
          HANDLERS[uid] = setTimeout(function(){
            next(num+1,fn,duration,callback);
          },baseInterval)
        }
      }
    } 

	function stopStep(uid){
		if(HANDLERS[uid]){
			if(window.requestAnimationFrame){
				window.cancelAnimationFrame(HANDLERS[uid]);
			}else{
				clearTimeout(HANDLERS[uid]);
			}
			
			delete HANDLERS[uid];
			//delete TIMES[uid];
		}
	}
	/**
	 * @class BUI.Graphic.Util
	 * @singleton
	 * 绘图的工具类
	 */
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
		 * 分步执行动画
		 * @param  {Number}   duration 执行时间
		 * @param  {Function} fn  每一步执行的回调函数，function(step,total){}
		 * @param  {Function} callback 回调函数
		 * @return {String} 动画的handler用于终止动画
		 */
		animStep : function(duration,fn,callback){
		  return	animTime(duration,fn,callback);
		},
		/**
		 * 终止分步执行的动画
		 * @param  {String} handler 句柄
		 */
		stopStep : function(handler){
			stopStep(handler);
		},
		animPath : function(pathShape,toPath,reserve,duration,easing,callback){
			//vml阻止动画执行
			/**/
			if(Util.vml){
				after();
				return;
			}
			reserve = reserve || 0;
			duration = duration || 400;

			var curPath = pathShape.getPath(),
				endPath = Util.parsePathString(toPath),
				tempPath,
				last = curPath.slice(reserve * -1);

			if(curPath.length > endPath.length){
				tempPath = curPath.slice(0,endPath.length);
				
			}else{
				tempPath = curPath.concat([]);
				if(reserve){
					for(var i = tempPath.length; i < endPath.length;i ++){
						tempPath = tempPath.concat(last);
					}
				}
			}
			pathShape.attr('path',tempPath);

			pathShape.animate({path : endPath},duration,easing,after);

			function after(){
				pathShape.attr('path',toPath);
				callback && callback();
			}
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
			if(isNaN(floorVal) || isNaN(ceilingVal)){
				if(values[0] >= value){
					return values[0];
				}
				var last = values[values.length -1];
				if(last <= value){
					return last;
				}
			}
			

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
		},
		/**
		 * 将数字保留对应数字的小数位
		 * @param  {Number} value 值
		 * @param  {Number} base  基准值
		 * @return {Number}  fixed后的数字
		 */
		tryFixed : function(value,base){
			return tryFixed(value,base);
		},
		/**
		 * 设置值，仅当对象上没有此属性时
		 * @param  {Object} obj 对象
		 * @param  {String} name  字段名
		 * @param  {*} value 值
		 */
		trySet : function(obj,name,value){
			if(obj && !obj[name]){
	      obj[name] = value;
	    }
		},
		/**
		 * 将颜色变亮
		 * @param  {String} c  颜色
		 * @param  {Number} percent 变亮的比例 0 - 1
		 * @return {String} 变亮的颜色
		 */
		highlight : function(c,percent){
	    var color = Raphael.color(c),
	      l = color.l * (1 + percent);
	    return Raphael.hsl2rgb(color.h,color.s,l).hex;
	  },
	  /**
		 * 将颜色变暗
		 * @param  {String} c  颜色
		 * @param  {Number} percent 变暗的比例 0 - 1
		 * @return {String} 变暗的颜色
		 */
	  dark : function(c,percent){
	  	var color = Raphael.color(c),
	      l = color.l * (1 - percent);
	    return Raphael.hsl2rgb(color.h,color.s,l).hex;
	  }
	});
	return Util;
});