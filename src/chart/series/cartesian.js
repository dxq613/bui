/**
 * @fileOverview 在x,y坐标轴中渲染的数据序列
 * @ignore
 */

define('bui/chart/cartesianseries',['bui/chart/baseseries','bui/graphic'],function (require) {

  var BUI = require('bui/common'),
    BaseSeries = require('bui/chart/baseseries'),
    Util = require('bui/graphic').Util;

   function date2number(value){
    if(BUI.isNumber(value)){
      return value;
    }
    if(BUI.isString(value)){
      value = value.replace(/'-'/ig,'/');
      value = new Date(value).getTime();
    }else if(BUI.isDate(value)){
      value = value.getTime();
    }
    return value;
  }

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
        yAxis = _self.get('yAxis'),
        yValue = _self.parseYValue(y);

      return {
        x : xAxis.getOffset(x),
        y : yAxis.getOffset(yValue)
      };
    },
    /**
     * 根据对象获取值
     * @protected
     * @return {Object} 点的集合
     */
    getPointByObject : function(item,index){
      var _self = this,
        xField = _self.get('xField'),
        yField = _self.get('yField'),
        point = _self.getPoint(item[xField],item[yField]);

      point.value = item[yField];
      point.xValue = item[xField];
      point.yValue = _self.parseYValue(item[yField]);
      point.obj = item; //如果是记录
      
      return point;
    },
    /**
     * @protected
     * 根据指定的值获取点的信息
     * @param  {Number} value 在x轴上的值
     * @return {Object} 点的信息
     */
    getPointByValue : function(xValue,value){
      
      var _self = this,
        xAxis = _self.get('xAxis'),
        yAxis = _self.get('yAxis'),
        x,y,
        yValue;

      if(xAxis.get('type') == 'time'){
        xValue = date2number(xValue);
      }
      x = xAxis.getOffset(xValue);
      yValue = _self.parseYValue(value);
      y = yAxis.getOffset(yValue);

      return {
        x : x,
        y : y,
        xValue : xValue,
        yValue : yValue,
        value : value
      };
    },
    /**
     * @protected
     * 转换显示的值，一般用于层叠的数据序列中
     */
    parseYValue : function(value){
      return value;
    },
    /**
     * @protected
     * 判断是否近似相等
     */
    snapEqual : function(value1,value2){
      var _self = this,
        xAxis = _self.get('xAxis');
      
    
      if(BUI.isString(value1)){
        return value1 == value2;
      }
      var pointInterval = _self.get('pointInterval');
      if(pointInterval){
        return Math.abs(value1 - value2) < pointInterval / 2;
      }

      return value1 == value2;
      
    },
    /**
     * 获取对应坐标轴上的数据，一般用于计算坐标轴
     * @return {Array} 
     */
    getData : function(type){
      var _self = this,
        data = _self.get('data'),
        pointsCache = _self.get('pointsCache'),
        first = data[0],
        rst = [];

      type = type || 'yAxis';
      if(pointsCache[type]){
        return pointsCache[type];
      }
      //如果是x轴，并且指定了开始节点
      if(type == 'xAxis' && _self.get('pointStart') != null){
        var pointStart = _self.get('pointStart'),
          pointInterval = _self.get('pointInterval');
          rst.push(pointStart);
          rst.push(pointStart + (data.length - 1) * pointInterval);
      }else{ 
        var xField = _self.get('xField'),
          yField = _self.get('yField');

        //遍历所有节点
        BUI.each(data,function(item){
          //数字和字符串直接填入
          if(BUI.isNumber(item) || BUI.isString(item)){
            rst.push(item);
          }else if(BUI.isArray(item)){ //数组，0标示x,1标示y
            var value = type == 'yAxis' ? item[1] : item[0];
            rst.push(value);
          }else if(item){ //根据xField,yField取值
            var value = type == 'yAxis' ? item[yField] : item[xField];
            rst.push(value);
          }
        });
      }

      pointsCache[type] = rst;
      return rst;
      
    },
    /**
     * 根据索引获取值
     * @protected
     * @return {Object} 点的集合
     */
    getPointByIndex : function(value,index){
      var _self = this,
        xAxis = _self.get('xAxis'),
        yAxis = _self.get('yAxis'),
        x,
        yValue = _self.parseYValue(value),
        y = yAxis.getOffset(yValue),
        originValue,
        xValue;

      if(xAxis.get('type') == 'number' || xAxis.get('type') == 'time'){

        var pointStart = _self.get('pointStart'),
          pointInterval = _self.get('pointInterval');
        x = xAxis.getOffset(pointStart + pointInterval * index);
      }else{
        x = xAxis.getOffsetByIndex(index);
      }

      originValue = xAxis.getValue(x);
      if(pointInterval){
        originValue = Util.tryFixed(originValue,pointInterval);
      }
      return {
        x : x,
        y : y,
        xValue : originValue,
        yValue : yValue,
        value : value
      };
    },
    /**
     * 获取鼠标移动与该series的焦点
     */
    getTrackingInfo : function(point){
      var _self = this,
        xAxis = _self.get('xAxis'),
        yAxis = _self.get('yAxis'),
        xValue = xAxis.getValue(point.x);

      return _self.findPointByValue(xValue);
    },
    /**
     * 获取最底层的点的值
     * @return {Number} 最底层点的值
     */
    getBaseValue : function(){
      var _self = this,
        yAxis = _self.get('yAxis'),
        value0 = yAxis.getOffset(0) || yAxis.getStartOffset();
      return value0;
    }

  });

  return Cartesian;

});