/**
 * @fileOverview 散列图,用于标示点的分步
 * @ignore
 */

define('bui/chart/scatterseries',['bui/chart/cartesianseries','bui/chart/activedgroup'],function (require) {
  
  var BUI = require('bui/common'),
    Cartesian = require('bui/chart/cartesianseries'),
    ActiveGroup = require('bui/chart/activedgroup');

  function trySet(obj,name,value){
    if(obj && !obj[name]){
      obj[name] = value;
    }
  }
  /**
   * @class BUI.Chart.Series.Scatter
   * 散点图序列
   * @extends BUI.Chart.Series.Cartesian
   */
  var Scatter = function(cfg){
    Scatter.superclass.constructor.call(this,cfg);

  };

  Scatter.ATTRS = {
    elCls : {
      value : 'x-chart-scatter'
    },
    stickyTracking : {
      value : false
    },
    /**
     * 生成时不执行动画
     * @type {Object}
     */
    animate : {
      value : false
    }
  };

  BUI.extend(Scatter,Cartesian);

  BUI.augment(Scatter,{

    /**
     * @protected
     * 处理颜色
     */
    processColor : function(){
      var _self = this,
        color = _self.get('color');
      if(color){
        var  markers = _self.get('markers');
        if(markers){
          trySet(markers.marker,'stroke',color);
          trySet(markers.marker,'fill',color);
        }
      }
    },
    //绘制点
    draw : function(points){
      var _self = this

      BUI.each(points,function(point){
        _self.addMarker(point);
      });
    },
    //鼠标hover
    onMouseOver : function(){
      var _self = this,
        markersGroup = _self.get('markersGroup');

      if(markersGroup){
        markersGroup.on('mouseover',function(ev){
          var target = ev.target,
            shape = target.shape;
          if(shape){
            markersGroup.setActivedItem(shape);
          }
        });
      }
    },
    //获取当前定位的点
    getTrackingInfo : function(){
      var _self = this,
        markersGroup = _self.get('markersGroup'),
        activeMarker,
        rst,
        point;
      if(markersGroup){
        activeMarker = markersGroup.getActived();
        if(activeMarker){
          rst = activeMarker.get('point');
        }
      }
      return rst;
    },
    //鼠标移出
    onMouseOut : function(){
      var _self = this,
        markersGroup = _self.get('markersGroup');

      if(markersGroup){
        markersGroup.on('mouseout',function(ev){
          var target = ev.target,
            shape = target.shape;
          if(shape){
            markersGroup.clearActivedItem(shape);
          }
        });
      }
    }

  });

  return Scatter;
});