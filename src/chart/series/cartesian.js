/**
 * @fileOverview 在x,y坐标轴中渲染的数据序列
 * @ignore
 */

define('bui/chart/cartesianseries',['bui/chart/baseseries'],function (require) {

  var BUI = require('bui/common'),
    BaseSeries = require('bui/chart/baseseries');

  /**
   * @class BUI.Chart.Series.Cartesian
   * 使用坐标轴的数据序列，此类是一个抽象类，不要直接初始化
   * @extends BUI.Chart.Series
   */
  function Cartesian(cfg){
    Cartesian.superclass.constructor.call(this,cfg);
  }

  Cartesian.ATTRS = {

    /**
     * x坐标轴
     * @type {BUI.Chart.Axis}
     */
    xAxis : {

    },
    /**
     * y坐标轴
     * @type {BUI.Chart.Axis}
     */
    yAxis : {

    },
    /**
     * 如果传入的数据是Object，则根据对应的字段取x的值
     * @type {String}
     */
    xField : {
      value : '0'
    },
    /**
     * 如果传入的数据是Object，则根据对应的字段取y的值
     * @type {String}
     */
    yField : {
      value : '1'
    },
    pointsCache : {
      shared : false,
      value : {}
    }

  };

  BUI.extend(Cartesian,BaseSeries);

  BUI.augment(Cartesian,{

    /**
     * 获取坐标点
     * @param  {*} x x坐标系上的值
     * @param  {*} y y坐标系上的值
     * @return {Object}  坐标点
     */
    getPoint : function(x,y){
      var _self = this,
        xAxis = _self.get('xAxis'),
        yAxis = _self.get('yAxis');

      return {
        x : xAxis.getOffset(x),
        y : yAxis.getOffset(y)
      };
    },
    /**
     * 获取对应坐标轴上的数据
     * @return {Array} 
     */
    getData : function(type){
      var _self = this,
        data = _self.get('data'),
        pointsCache = _self.get('pointsCache'),
        first = data[0],
        rst;

      type = type || 'yAxis';
      if(pointsCache[type]){
        return pointsCache[type];
      }

      if(BUI.isObject(first) || BUI.isArray(first)){
        var xField = _self.get('xField'),
          yField = _self.get('yField');
        rst = $.map(data,function(item){
          if(type == 'yAxis' || !type){
            return item[yField];
          }
          return item[xField];
        });
      }else if(type == 'yAxis'){ //数据为数值时，仅代表y轴数据

        rst = data;
      }else{
        rst = [];
        var 
          pointStart = _self.get('pointStart'),
          pointInterval = _self.get('pointInterval');
        if(pointStart){
          rst.push(pointStart);
          rst.push(pointStart + (data.length - 1) * pointInterval);
        }
       
      }

      pointsCache[type] = rst;
      return rst;
      
    }

  });

  return Cartesian;

});