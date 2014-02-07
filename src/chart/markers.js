/**
 * @fileOverview 显示点的标记
 * @ignore
 */

define('bui/chart/markers',['bui/chart/plotitem','bui/graphic','bui/chart/activedgroup'],function (require) {

	var BUI = require('bui/common'),
		Util = require('bui/graphic').Util,
		Group = require('bui/chart/activedgroup'),
		PlotItem = require('bui/chart/plotitem');

		
	
	/**
	 * @class BUI.Chart.Markers
	 * 显示点的标记集合
	 * @extends BUI.Chart.PlotItem
	 */
	var Markers = function(cfg){
		Markers.superclass.constructor.call(this,cfg);
	};


	BUI.extend(Markers,PlotItem);

	BUI.mixin(Markers,[Group]);

	Markers.ATTRS = {
		elCls : {
			value : 'x-chart-markers'
		},
		/**
		 * 标记的配置项
		 * @type {Object}
		 */
		marker : {

		},
		/**
		 * 标记处于active状态时的配置项
		 * @type {Object}
		 */
		actived : {

		},
		/**
		 * @private
		 */
		xCache : {
			value : [],
			shared : false
		}

	};

	BUI.augment(Markers,{

		//渲染控件
		renderUI : function(){
			var _self = this;
			Markers.superclass.renderUI.call(_self);
			_self._drawMarkers();
		},
		/**
		 * @protected
		 * 是否激活
		 * @param {BUI.Chart.Actived} item 可以被激活的元素
		 * @return {BUI.Chart.Actived[]} 可以被激活的元素集合
		 */
		isItemActived : function(item){
			return item.get('actived');
		},
		/**
		 * @protected
		 * 设置激活状态
		 * @param {BUI.Chart.Actived} item 可以被激活的元素
		 * @param {Boolean} actived 是否激活
		 */
		setItemActived : function(item,actived){
			var _self = this,
				marker = _self.get('marker'),
				activedCfg = _self.get('actived');
			if(actived){
				item.attr(activedCfg);
				item.set('actived',true);
			}else{
				item.attr(marker);
				item.set('actived',false);
			}
		},
		_drawMarkers : function(){
			var _self = this,
				items = _self.get('items'),
				xCache = _self.get('xCache'),
				marker = _self.get('marker'),
				cfg;
			BUI.each(items,function(item,index){
				cfg = BUI.merge(marker,item);
				_self.addShape('marker',cfg);
				xCache.push(parseInt(item.x));
			});
		},
		/**
		 * 获取逼近的marker
		 * @return {BUI.Graphic.Shape} marker
		 */
		getSnapMarker : function(point,tolerance){
			var _self = this,
				xCache = _self.get('xCache'),
				offset = BUI.isObject(point) ? point.x : point;

			var	snap = Util.snapTo(xCache,offset,tolerance),
				index = BUI.Array.indexOf(snap,xCache);
			return _self.getChildAt(index);
		}
	});

	return Markers;
});