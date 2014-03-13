/**
 * @fileOverview 画布内部的元素扩展
 * @ignore
 */
define('bui/graphic/canvasitem',function(require) {
	
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
		index : function(){
			var _self = this,
				parent = _self.get('parent');
			return BUI.Array.indexOf(_self,parent.get('children'));
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
		}
	});

	return Item;
});