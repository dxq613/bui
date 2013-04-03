/**
 * @fileOverview  图片热区
 * @author dengbin
 * @ignore
 */

define('bui/imgmaps/imgmaps',function (require){
	/**
    * @class BUI.ImgMaps.ImgMaps
    * 简单热区视图类
    * @extends BUI.Component.View
    */
	var BUI = require('bui/common'),
		UIBase = BUI.Component.UIBase;

	var imgMaps = BUI.Component.Controller.extend([UIBase.ChildList],
	/**
    * @lends BUI.ImgMaps.ImgMaps.prototype
    * @ignore
    */
	{
		/**
     	* @protected
     	* @ignore
     	*/
     	bindUI : function(){
     		var _self = this;
     		_self.on('mousedown',function(ev){
                if(ev.target === _self){
                   var  item = _self.addItem({width:28,height:28,x:ev.domEvent.pageX,y:ev.domEvent.pageY});
                   item.startResize();
                }
     			
     		});
            
     	}
	},{
		ATTRS : {
			defaultChildClass : {
				value : 'map-item'
			}
		}
	},{
		xclass : 'img-maps',
		prority : 0
	});
	return imgMaps;
});