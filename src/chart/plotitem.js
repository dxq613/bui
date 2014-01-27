/**
 * @fileOverview 所有图表内部元素的基类，继承自group
 * @ignore
 */

define('bui/chart/plotitem',['bui/common','bui/graphic'],function (require) {

	var BUI = require('bui/common'),
		Graphic = require('bui/graphic');

	function initClassAttrs(c){
    if(c._attrs || c == Item){
      return;
    }

    var superCon = c.superclass.constructor;
    if(superCon && !superCon._attrs){
      initClassAttrs(superCon);
    }
    c._attrs =  {};
    
    BUI.mixAttrs(c._attrs,superCon._attrs);
    BUI.mixAttrs(c._attrs,c.ATTRS);
  }

	/**
	 * @class BUI.Chart.PlotItem
	 * 图表内部元素的基类
	 * @extends BUI.Graphic.Group
	 * 
	 */
	function Item(cfg){
		initClassAttrs(this.constructor);
		Item.superclass.constructor.call(this,cfg);
	};

	BUI.extend(Item,Graphic.Group);

	BUI.augment(Item,{
		//获取默认的属性
		getDefaultCfg : function(){
			var _self = this,
				con = _self.constructor,
				attrs = con._attrs,
				rst = {};

			for (var p in attrs) {
        if(attrs.hasOwnProperty(p)){
          var attr = attrs[p],
          	value = attr.value;
          if(value != null){
          	if(attr.shared === false){
	            rst[p] = {};
	            BUI.mixAttr(rst[p], value); 
	          }else{
	            rst[p] = value;
	          }
          }
          
        }
      }
			return rst;
		}
	});

	return Item;
});