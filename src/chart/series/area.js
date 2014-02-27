/**
 * @fileOverview 区域图序列
 * @ignore
 */

define('bui/chart/areaseries',['bui/common','bui/chart/lineseries'],function (require) {
  
  var BUI = require('bui/common'),
    Line = require('bui/chart/lineseries');

   function trySet(obj,name,value){
    if(obj && !obj[name]){
      obj[name] = value;
    }
  }
  /**
   * @class BUI.Chart.Series.Area
   * 区域图的数据序列
   * @extends BUI.Chart.Series.Line
   */
  var Area = function(cfg){
    Area.superclass.constructor.call(this,cfg);
  };

  Area.ATTRS = {

    /**
     * 区域的配置信息
     * @type {Object}
     */
    area : {
      shared : false,
      value : {
        stroke : '',
        'fill-opacity' : '0.70'
      }
    }

  };

  BUI.extend(Area,Line);

  BUI.augment(Area,{
    processColor : function(){
      Area.superclass.processColor.call(this);
      var _self = this,
        color = _self.get('color'),
        area = _self.get('area');

      trySet(area,'fill',color);
    },
    /**
     * @protected
     * 绘制内部内容
     */
    drawInner : function(points){
      var _self = this,
        areaShape = _self.get('areaShape');
      if(!areaShape){
        _self.drawArea(points);
      }else{
        var path = _self.points2area(points);
        areaShape.attr('path',path);
      }

    },
    //绘制区域
    drawArea : function(points){
      var _self = this,
        area = _self.get('area'),
        path = _self.points2area(points),
        cfg = BUI.mix({path :path},area),
        areaShape;


      areaShape = _self.addShape('path',cfg);

      _self.set('areaShape',areaShape);
    },
    //点转换成区域的path
    points2area : function(points){
      var _self = this,
        length = points.length,
        yAxis = _self.get('yAxis'),
        value0 = yAxis.getOffset(0),
        first = points[0],
        last = points[length - 1],
        linePath,
        path = '';
     
      if(length){
        linePath = _self.points2path(points);
        path = 'M ' + first.x + ' '+ value0 + linePath.replace('M','L');
        path = path + 'L '+ last.x + ' '+value0+'z';
      }
      return path;
    }
  });
  return Area;
});