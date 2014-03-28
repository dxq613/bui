/**
 * @fileOverview 所有图表内部元素的基类，继承自group
 * @ignore
 */

define('bui/chart/plotitem',['bui/common','bui/graphic'],function (require) {

	var BUI = require('bui/common'),
		Graphic = require('bui/graphic');

	function initClassAttrs(c){
    if(c._attrs || c == Graphic.Group){
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

  Item.ATTRS = {
    /**
     * 活动子项的名称，用于组成 itemactived,itemunactived的事件
     * @protected
     * @type {String}
     */
    itemName : {
      value : 'item'
    },
    /**
     * 所属分组的名称,用于事件中标示父元素
     * @protected
     * @type {String}
     */
    groupName : {
      value : ''
    }
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
          		if(BUI.isObject(value)){
          			rst[p] = {};
          		}
          		if(BUI.isArray(value)){
          			rst[p] = [];
          		}
	            
	            BUI.mixAttr(rst[p], value); 
	          }else{
	            rst[p] = value;
	          }
          }
          
        }
      }
			return rst;
		},
    /**
     * 在顶层图表控件上触发事件
     * @param {String} name 事件名称
     * @param  {Object} ev 事件对象
     */
    fireUp : function(name,ev){
      var _self = this,
        canvas = _self.get('canvas'),
        chart = canvas.chart;
      if(chart){
        ev.target = ev.target || chart;
        chart.fire(name,ev);
      }
    },
    /**
     * @protected
     * 在分组上触发事件
     * @param  {String} name 事件名称
     * @param  {Object} item 触发事件的子项
     * @param  {Object} obj  事件对象
     */
    fireUpGroup : function(name,item,obj){
      var _self = this,
        itemName = _self.get('itemName'),
        groupName = _self.get('groupName');
      obj = obj || {};
      obj[itemName] =  item;
      if(groupName){
        obj[groupName] = _self.get('parent')
      }
      _self.fireUp(itemName.toLowerCase() + name,obj);
    }
	});

	return Item;
});