/**
 * @fileOverview 圆形的坐标，用于雷达图或者圆形仪表盘
 * @ignore
 */

define('bui/chart/circleaxis',['bui/common','bui/graphic','bui/chart/abstractaxis'],function (require) {
  
  var BUI = require('bui/common'),
    Util = require('bui/graphic').Util,
    Abstract = require('bui/chart/abstractaxis');

  var RAD = Math.PI / 180;

  //获取圆上的点
  function getPoint(self,r,angle){
    var center = self.getCenter(),
      rst = {};
      rst.x = center.x + r * Math.sin(angle * RAD);
      rst.y = center.y - r * Math.cos(angle * RAD);
    return rst;
  }


  /**
   * @class BUI.Chart.Axis.Circle
   * 圆形的坐标
   * @extends BUI.Chart.Axis.Abstract
   */
  var Circle = function(cfg){
    Circle.superclass.constructor.call(this,cfg);
  };

  BUI.extend(Circle,Abstract);


  Circle.ATTRS = {

    type : {
      value : 'circle'
    },
    /**
     * 起始角度，0-360度
     * @type {Number}
     */
    startAngle : {
      value : 0
    },
    /**
     * 结束的角度
     * @type {Number}
     */
    endAngle : {
      value : 360
    },
    /**
     * 与绘图区域的边距
     * @type {Number}
     */
    margin : {
      value : 20
    },
    /**
     * 半径长度,一般根据绘图区域自动计算
     * @type {Number}
     */
    radius : {

    },
    /**
     * 指定角度值，将圆分成几部分，一定是能够将圆平分的角度值
     * @type {Number}
     */
    tickInterval : {

    },
    grid : {
      shared : false,
      value :{

        line : {
          'stroke-width' : 1,
          'stroke' : '#C0D0E0'
        }
      } 
    },
    formatter : {
      value : function(value){
        var _self = this,
          ticks = _self.get('ticks');
        if(BUI.isNumber(value)){
          var index = BUI.Array.indexOf(value,ticks);
          if(index == -1){
            var avg = _self.getTickAvgAngle();
            index =parseInt(value / avg,10) ;
            value = ticks[index];
          }
        }
        return value;
      }
    }
  };

  BUI.augment(Circle,{

    beforeRenderUI : function(){
      var _self = this;
      Circle.superclass.beforeRenderUI.call(_self);
      
      var tickInterval = _self.get('tickInterval'),
        ticks = _self.get('ticks'),
        startAngle = _self.get('startAngle'),
        endAngle = _self.get('endAngle'),
        count;

      if(tickInterval && !ticks){
        ticks = [];
        count = (endAngle - startAngle)/tickInterval
        for (var i = 0; i < count; i++) {
          ticks.push(startAngle + tickInterval * i);
        };
        _self.set('ticks',ticks);

      }
    },
    /**
     * 获取中心点
     * @return {Number} 中心点
     */
    getCenter : function(){
      var _self = this,
        plotRange = _self.get('plotRange');
      return plotRange.cc;
    },
    /**
     * 获取半径
     * @return {Number} 半径
     */
    getRadius : function(){
      var _self = this,
        radius = _self.get('radius'),
        plotRange = _self.get('plotRange');
      if(!radius){
        //半径等于宽高比较小的1/2，以及20像素的边框
        radius = Math.min(plotRange.getWidth(),plotRange.getHeight())/2 - _self.get('margin');
        _self.set('radius',radius);
      }
      return radius;
    },
    /**
     * 获取坐标点间的平均角度
     * @return {Number} 角度值
     */
    getTickAvgAngle : function(){
      var _self = this,
        ticks = _self.get('ticks'),
        startAngle = _self.get('startAngle'),
        endAngle = _self.get('endAngle');
      return (endAngle - startAngle) / ticks.length;
    },
    /**
     * @protected
     * 获取坐标轴的path
     * @return {String|Array} path
     */
    getLinePath : function(){
      var _self = this,
        center = _self.getCenter(),
        x = center.x,
        y = center.y,
        rx =  _self.getRadius(),
        ry = rx;

      return [["M", x, y], ["m", 0, -ry], ["a", rx, ry, 0, 1, 1, 0, 2 * ry], ["a", rx, ry, 0, 1, 1, 0, -2 * ry], ["z"]];
    },
    //获取坐标轴上的节点位置
    getOffsetPoint : function(index){
      var _self = this,
        angle = _self.getOffsetByIndex(index),
        radius = _self.getRadius();
      return _self.getCirclePoint(angle,radius);
    },
    /**
     * 根据半径和角度获取对应的点
     * @param  {Number} angle 角度
     * @param  {Number} r 半径,可以为空，默认为圆的半径
     * @return {Object} 坐标点
     */
    getCirclePoint : function(angle,r){
      if(r == null){
        r = this.getRadius();
      }
      
      return getPoint(this,r,angle);
    },
    /**
     * 获取点到圆心的距离
     * @param  {Number} x x坐标
     * @param  {Number} y y坐标
     * @return {Number} 距离
     */
    getDistance : function(x,y){
      var _self = this,
        center = _self.getCenter();
      return Math.sqrt(Math.pow(x - center.x,2) + Math.pow(y - center.y,2));
    },
    /**
     * 获取点对应的角度，0 - 360
     * @param  {Number} x x坐标
     * @param  {Number} y y坐标
     * @return {Number} 获取点的角度
     */
    getCircleAngle : function(x,y){
      var _self = this,
        center = _self.getCenter(),
        r = _self.getDistance(x,y),
        angle = (Math.asin(Math.abs(x - center.x) / r) / Math.PI) * 180;

      if(x >= center.x && y <= center.y){//第一象限
        return angle;
      }


      if(x >= center.x && y >= center.y){ //第四象限
        return 180 - angle;
      }

      if(x <= center.x && y >= center.y){//第三象限
        return angle + 180;
      } 

      return 360 - angle; //第四象限
    },
    /**
     * 圆的坐标轴来说，根据索引获取对应的角度
     * @param  {Number} index 顺序 
     * @return {Number} 节点坐标点（单一坐标）x轴的坐标点或者y轴的坐标点
     */
    getOffsetByIndex : function(index){
      var _self = this,
        ticks = _self.get('ticks'),
        length = ticks.length,
        startAngle = _self.get('startAngle'),
        endAngle = _self.get('endAngle');
      return startAngle + ((endAngle - startAngle) / length) * index;
    },
    /**
     * 圆形坐标轴上，存在坐标点的值，例如，存在 0，45，90 ... 360，那么 80将返回90
     * @param  {Number} offset 
     * @return {Number} 点在坐标轴上角度
     */
    getValue : function(offset){
      return this.getSnapValue(offset);
    },
     /**
     * 获取逼近坐标点的值
     * @param  {Number} offset 画布上的点在坐标轴上的对应值
     * @return {Number} 坐标轴上的值
     */
    getSnapValue : function(offset,tolerance){
      
      //tolerance = tolerance || this.getTickAvgAngle() / 2;
      var _self = this,
            pointCache = _self.get('pointCache');
        return Util.snapFloor(pointCache,offset);
    },
    /**
     * 获取栅格项的配置信息，一般是起始点信息
     * @protected
     */
    getGridItemCfg : function(point){
      var _self = this,
        center = _self.getCenter();
      return{
        x1 : center.x,
        y1 : center.y,
        x2 : point.x,
        y2 : point.y
      };
    },
    //重置点的位置
    addLabel : function(text,point,angle){

      var _self = this,
        margin = _self.get('margin'),
        radius = _self.getRadius();

      point = _self.getCirclePoint(angle,radius + margin);

      Circle.superclass.addLabel.call(_self,text,point);
    },
    /**
     * @protected
     * 获取标示坐标点的线的终点
     */
    getTickEnd : function(start,angle){
      var _self = this,
        radius = _self.getRadius(),
        tickLine = _self.get('tickLine'),
        length = tickLine.value,
        point = _self.getCirclePoint(angle,radius + length);
      return {
        x2 : point.x,
        y2 : point.y
      };
    }

  });

  return Circle;
});