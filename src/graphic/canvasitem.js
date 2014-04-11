/**
 * @fileOverview 画布内部的元素扩展
 * @ignore
 */
define('bui/graphic/canvasitem',['bui/common'],function(require) {
	
	var BUI = require('bui/common');
	
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
			return this;
		},
		toBack : function(){
			this.get('el').toBack();
			return this;
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
			return this;
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
			return this;
		},
		/**
		 * 停止当前动画
		 */
		stopAnimate : function(){
			this.get('el').stop();
			return this;
		},
		/**
		 * 拖动方法
		 */
		drag : function(onmove, onstart, onend, mcontext, scontext, econtext){
			this.get('el').drag(onmove, onstart, onend, mcontext, scontext, econtext)
			return this;
		}
	});

	return Item;
});