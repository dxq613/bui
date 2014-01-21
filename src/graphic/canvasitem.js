/**
 * @fileOverview 画布内部的元素扩展
 * @ignore
 */
define('bui/graphic/canvasitem',['bui/graphic/util'],function(require) {
	var Util = require('bui/graphic/util');
	/**
	 * @class BUI.Graphic.CanvasItem
	 * 画布内部元素的一些公用方法的扩展，仅作为接口使用
	 */
	var Item = function(){

	};

	BUI.augment(Item,{
		/**
		 * 到达最高层次 z-index
		 */
		toFront : function(){
			this.get('el').toFront();
		},
		toBack : function(){
			this.get('el').toBack();
		},
		/**
		 * 移动
		 * @param  {Number} dx 沿x轴平移的距离
		 * @param  {Number} dy 沿y轴平移的距离
		 */
		translate : function(dx,dy){
			var _self = this,
  			el = _self.get('el');
  		el.translate(dx,dy);
		},
		/**
		 * 旋转
		 * @param  {Number} a 旋转的角度
		 * @param  {Number} x 旋转的中心点 x
		 * @param  {Number} y 旋转的中心点 y
		 */
		rotate : function(a, x, y){
			var _self = this;
			if(_self.isGroup){
  			if(x == null && y == null){
  				var tpoint = _self._getTranslatePoint();
  				x = tpoint.x;
  				y = tpoint.y;
  			}
  		}
			this.get('el').rotate(a,x,y);
		},
		/**
		 * 
		 * @param  {Number} sx x轴方向的倍数 
		 * @param  {Number} sy y轴方向的倍数
		 * @param  {Number} cx x轴方向扩展的中心
		 * @param  {Number} cy y轴方向扩展的中心
		 */
		scale : function(sx, sy, cx,cy){
			var _self = this,
  			el = _self.get('el');
  		
  		el.scale(sx, sy, cx,cy);
		},
		/**
		 * 直接使用transform方法 <br>
		 *  "t100,100r30,100,100s2,2,100,100r45s1.5"
		 *   - 
		 * @param  {String} tstr 几何转换的字符串
		 */
		transform : function(tstr){
			var _self = this,
  			el = _self.get('el');
  		el.transform(tstr);
		},
		/**
		 * 执行动画
		 * @param  {Object}   params   动画的参数
		 * @param  {Number}   ms       毫秒数
		 * @param  {String}   easing   路径函数
		 * @param  {Function} callback 回调函数
		 */
		animate : function(params,ms,easing,callback){
			this.get('el').animate(params,ms,easing,callback);
		},
		/**
		 * 停止当前动画
		 */
		stopAnimate : function(){
			this.get('el').stop();
		},
  	/**
  	 * 获取路径
  	 * @return {Array} 路径的数组
  	 */
  	getPath : function(){
  		var _self = this,
  			el = _self.get('el'),
  			path = el.getPath();
  		if(BUI.isString(path)){
  			path = Util.parsePathString(path);
  		}
  		return path;
  	},
  	/**
  	 * 获取路径字符串
  	 * @return {String} 路径的字符串
  	 */
  	getPathString : function(){
  		var _self = this,
  			path = _self.getPath();
  		return Util.parsePathArray(path);
  	},
  	/**
  	 * 获取使用平移后的path
  	 * @return {Array} 路径的数组
  	 */
  	getTransformPath : function(){
  		var _self = this,
  			path = _self.getPath(),
  			matrix = _self.get('el').matrix;
  		return Util.transformPath(path,matrix.toTransformString());
  	},
  	//获取到移动的位置
  	_getTranslatePoint : function(){
  		var _self = this,
  			tPath = _self.getTransformPath(),
  			rst = {x : 0,y : 0};
  		BUI.each(tPath,function(item){
  			if(item[0] == 'M'){
  				rst.x = item[1];
  				rst.y = item[2];
  			}
  		});
  		return rst;
  	}
	});

	return Item;
});