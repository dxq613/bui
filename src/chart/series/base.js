/**
 * @fileOverview 所有数据序列的基类
 * @ignore
 */

define('bui/chart/baseseries',['bui/chart/plotitem','bui/chart/showlabels','bui/chart/markers'],function (require) {
	
	var BUI = require('bui/common'),
		Item = require('bui/chart/plotitem'),
		ShowLabels = require('bui/chart/showlabels'),
		Markers = require('bui/chart/markers');

	/**
	 * @class BUI.Chart.Series
	 * 数据序列的基类，是一个抽象类，不能直接实例化
	 */
	var Series = function(cfg){
		Series.superclass.constructor.call(this,cfg);
	};

	BUI.extend(Series,Item);

	BUI.mixin(Series,[ShowLabels]);

	Series.ATTRS = {

		/**
		 * 标志数据序列上的点的配置
		 *
		 *  - type 默认类型是path,可以是任意基本图形
		 * @type {Object}
		 */
		markers : {

		},
		/**
		 * 显示对应点的文本的配置项
		 * @type {BUI.Chart.Labels}
		 */
		labels : {

		},
		/**
		 * 是否显示在图例中
		 * @type {Boolean}
		 */
		inLegend : {
			value : true
		},
		/**
		 * 显示的数据
		 * @type {Array}
		 */
		data : {

		}

	};

	BUI.augment(Series,{

		renderUI : function(){
			var _self = this,
				points;
        Series.superclass.renderUI.call(_self);

       _self.draw();
      points = _self.getPoints();

      BUI.each(points,function(point){
      	if(_self.get('markers')){
      		_self.addMarker(point);
      	}
      	if(_self.get('labels')){
      		_self.addLabel(point.value,point);
      	}

      });
      _self.renderLabels();
      _self.renderMarkers();
		},
		/**
		 * 获取点的集合用于显示Marker和label
		 * @return {Array} 点的集合
		 */
		getPoints : function(){
			var _self = this,
				points = _self.get('points');
			if(!points){
				points = _self._getPoints();
				_self.set('points',points);
			}
			return points;
		},
		/**
		 * @private
		 * 获取点
		 */
		_getPoints : function(){
			var _self = this,
				data = _self.get('data'),
				points = [];
			BUI.each(data,function(item,index){
				var point;
				if(BUI.isObject(item)){
					point = _self.getPointByObject(item);
				}else{
					point = _self.getPointByIndex(item,index);
				}
				
				points.push(point);
			});

			return points;
		},
		/**
		 * 根据对象获取值
		 * @protected
		 * @return {Object} 点的集合
		 */
		getPointByObject : function(item){

		},
		/**
		 * 根据索引获取值
		 * @protected
		 * @return {Object} 点的集合
		 */
		getPointByIndex : function(){

		},
		/**
		 * @protected
		 * 画对应的图形
		 */
		draw : function(){

		},
		/**
		 * @protected
		 * 添加marker配置项
		 */
		addMarker : function(offset){
			var _self = this,
          markers = _self.get('markers'),
          marker = {};
      if(!markers.items){
          markers.items = [];
      }
      marker.x = offset.x;
      marker.y = offset.y;

      markers.items.push(marker);
		},
		//渲染标记
		renderMarkers : function(){
			var _self = this,
			 	markers = _self.get('markers'),
			 	markersGroup;
			if(markers){
				markersGroup = _self.addGroup(Markers,markers);
				_self.set('markersGroup',markersGroup);
			}
		},
		//删除标记
		removeMarkers : function(){
			var _self = this,
				markersGroup = _self.get('markersGroup');

			markersGroup && markersGroup.remove();
		},
		//获取激活的属性
		getActiveAtrrs : function(){

		},
		//获取解除激活的属性
		getUnActiveAttrs : function(){

		},
		/**
		 * @protected
		 * 设置图形的激活状态
		 * @param {Boolean} actived 是否激活
		 */
		setActiveStatus : function(actived){

		},
		remove : function(){
			var _self = this;
			_self.removeMarkers();
			_self.removeLabels();
      Series.superclass.remove.call(this);
		}
	});


	return Series;
});