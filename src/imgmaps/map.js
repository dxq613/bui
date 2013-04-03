/**
 * @fileOverview 热区,直接使用DOM作为热区项
 * @ignore
 */

define('bui/imgmaps/map', function (require) {

	var BUI = require('bui/common'),
		UIBase = BUI.Component.UIBase,
		Resize = require('bui/imgmaps/resize'),
		CLS_ITEM = BUI.prefix + 'maps-item';

	/**
    * @class BUI.ImgMaps.Map
    * 简单热区视图类
    * @extends BUI.Component.View
    */
    var mapView = BUI.Component.View.extend([
      	UIBase.PositionView,
    	UIBase.CloseView
    ]);
    /**
    * 图片热区，用于画热区操作
    * xclass:'img-maps'
    * @class BUI.imgMaps.map
    * @extends BUI.Component.Controller
    * @mixins BUI.Component.UIBase.ListItem
    * @mixins BUI.Component.UIBase.Close
    * @mixins BUI.Component.UIBase.Drag
    */
	var map = BUI.Component.Controller.extend([UIBase.ListItem,UIBase.Close,UIBase.Position,UIBase.Drag,Resize],{
		bindUI : function (){
			var _self = this;
			
		}
	},{
		ATTRS : {
			closable : {
				value:true
			},
			closeTpl : {
				view : true,
				value : '<span class="'+CLS_ITEM+'-close x-icon x-icon-normal x-icon-mini">×</span>'
			},
			dragNode : {
		        /**
		         * @private
		         */
		        valueFn : function(){
		          return this.get('el');
		        }
		    },
            resizeNode :{
                valueFn : function(){
                    return this.get('el').find('.resize');
                }
            },

			tpl : {
				value : '<div class="resize" style="width:14px;height:14px;background-color:#000;display:block;"></div>'
			},
		    xview : {
		        value : mapView
		    },
		    constraint : {
		    	getter : function(){
		    		return this.get('parent').get('el');
		    	}
		    }
		}
	},{
		xclass : 'map-item'
	});
	map.View = mapView;
	return map;
});