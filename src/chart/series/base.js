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
    zIndex : {
      value : 5
    },
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
     * 创建序列时是否触发动画
     * @type {Boolean}
     */
    animate : {
      value : false
    },
    /**
     * 动画的时间间隔
     * @type {Number}
     */
    duration : {
      value : 400
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

    },
    /**
     * 渲染时就绘制图形
     * @type {Boolean}
     */
    autoPaint : {
      value : true
    },
    /**
     * 鼠标移动到数据序列图中是否触发事件
     * @type {Boolean}
     */
    enableMouseTracking : {
      value : true
    },
    /**
     * 是否随着鼠标在画板上移动触发相应的事件
     *
     * - true ，则鼠标从序列图中移出时不会触发移出的事件，当鼠标在画板上移动时序列图会做出对应的动作
     * 
     * @type {Boolean}
     */
    stickyTracking : {
      value : true
    }

  };

  BUI.augment(Series,{

    renderUI : function(){
      var _self = this;
      
      Series.superclass.renderUI.call(_self);
      
      _self.processColor();
      _self.renderLabels();
      _self.renderMarkers();
      if(_self.get('autoPaint')){
        _self.paint();
      }

    },
    bindUI : function(){
      var _self = this;
      Series.superclass.bindUI.call(_self);
      if(_self.get('enableMouseTracking')){
        _self.onMouseOver();
      }
      if(!_self.get('stickyTracking')){
        _self.onMouseOut();
      }
    },
   
    /**
     * 获取对应坐标轴上的数据
     * @return {Array} 
     */
    getData : function(type){

    },
    /**
     * @protected
     * 鼠标进入事件
     */
    onMouseOver : function(ev){
      
    },
    /**
     * @protected
     * 鼠标移出
     */
    onMouseOut : function(ev){

    },
    /**
     * 鼠标在画布上移动
     */
    onStickyTracking : function(ev){

    },
    /**
     * @protected
     * 处理颜色
     */
    processColor : function(){

    },
    /**
     * 获取鼠标移动与该series的焦点
     */
    getTrackingInfo : function(point){

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
        }else if(BUI.isArray(item)){
          point = _self.getPointByValue(item[0],item[1]);
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
     * @return {Object} 点的信息
     */
    getPointByObject : function(item){

    },
    /**
     * 根据索引获取值
     * @protected
     * @return {Object} 点的信息
     */
    getPointByIndex : function(item,index){

    },
    /**
     * @protected
     * 根据指定的值获取点的信息
     * @param  {Number} value 在x轴上的值
     * @return {Object} 点的信息
     */
    getPointByValue : function(xValue,value){

    },
    //根据x轴上的值获取y轴上的值
    findPointByValue : function(value){
      var _self = this,
        points = _self.get('points'),
        rst;

      BUI.each(points,function(point){
        if(_self.snapEqual(point.originValue,value)){
          rst = point;
          return false;
        }
      });

      return rst;
    },
    /**
     * @protected
     * 判断是否近似相等
     */
    snapEqual : function(value1,value2){
      return value1 == value2;
    },
    /**
     * @protected
     * 画对应的图形
     */
    draw : function(points){

    },
    /**
     * 绘制数据序列
     */
    paint : function(){
      var _self = this,
        points = _self.getPoints();

      if(_self.get('isPaint')){
        return;
      }
      _self.draw(points,function(){
        _self.sort();
      });
      _self.set('isPaint',true);
    },
    /**
     * 重绘
     */
    repaint : function(){
      var _self = this,
        labels = _self.get('labels'),
        markers = _self.get('markers'),
        points;

      _self.set('points',null);
      points = _self.getPoints();

      if(labels){
        labels.items = [];
      }
      if(markers){
        markers.items = [];
      }
      _self.changeShapes(points);
      BUI.each(points,function(point){
        if(labels){
          labels.items.push(point.value,point);
        }
        if(markers){
          markers.items.push(point);
        }
      });

      _self._changeMarkers();
      _self._changeLabels();
    },
    /**
     * @protected
     * 序列变化时改变内部图形
     */
    changeShapes : function(points){

    },
    /**
     * @protected
     * 添加marker配置项
     */
    addMarker : function(offset){
      var _self = this,
          markersGroup = _self.get('markersGroup'),
          marker = {};
      if(markersGroup){
        marker.x = offset.x;
        marker.y = offset.y;

        markersGroup.addMarker(marker);
      }
    },
    //渲染标记
    renderMarkers : function(){
      var _self = this,
        markers = _self.get('markers'),
        markersGroup;
      if(markers){
        if(!markers){
          markers.items = [];
        }
        markersGroup = _self.addGroup(Markers,markers);
        _self.set('markersGroup',markersGroup);
      }
    },
    _changeMarkers : function(){
      var _self = this,
        markers = _self.get('markers'),
        markersGroup;
      if(markers){
        markersGroup = _self.get('markersGroup');
        markersGroup.change(markers.items);
      }
    },
    _changeLabels : function(){
      this.resetLabels();
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