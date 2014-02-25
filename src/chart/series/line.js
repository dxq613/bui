/**
 * @fileOverview 线形式的数据图序列
 * @ignore
 */

define('bui/chart/lineseries',['bui/chart/cartesianseries','bui/graphic','bui/chart/actived'],function (require) {
  
  var BUI = require('bui/common'),
    Cartesian = require('bui/chart/cartesianseries'),
    Util = require('bui/graphic').Util,
    Actived = require('bui/chart/actived');

  function trySet(obj,name,value){
    if(obj && !obj[name]){
      obj[name] = value;
    }
  }

  function date2number(value){
    if(BUI.isNumber(value)){
      return value;
    }
    if(BUI.isString(value)){
      value = value.replace('-','/');
      value = new Date(value).getTime();
    }else if(BUI.isDate(value)){
      value = value.getTime();
    }
    return value;
  }

  /**
   * @class BUI.Chart.Series.Line
   * 使用线连接数据的数据图序列
   * @extends BUI.Chart.Series.Cartesian
   */
  function Line(cfg){
    Line.superclass.constructor.call(this,cfg);
  }

  BUI.extend(Line,Cartesian);

  BUI.mixin(Line,[Actived]);

  Line.ATTRS = {

    type : {
      value : 'line'
    },
    elCls : {
      value : 'x-chart-line-series'
    },
    /**
     * 线的配置
     * @type {Object}
     */
    line : {

    },
    /**
     * 处于触发状态的线的配置项
     * @type {Object}
     */
    lineActived : {

    },
    /**
     * 如果横坐标是数字类型，则通过点的间距来决定点
     * @type {Number}
     */
    pointInterval : {
      value : 1
    },
    /**
     * 如果横坐标是数字类型,点的起始值
     * @type {Number}
     */
    pointStart : {
      value : 0
    },
    /**
     * 增大线的触发范围
     * @type {Number}
     */
    tolerance : {
      value : 20
    },
    /**
     * 是否平滑的线
     * @type {Boolean}
     */
    smooth : {
      value : false
    }
  };

  BUI.augment(Line,{

    /**
     * @protected
     * 处理颜色
     */
    processColor : function(){
      var _self = this,
        color = _self.get('color');
      if(color){
        var line = _self.get('line'),
          markers = _self.get('markers');
        trySet(line,'stroke',color);
        if(markers){
          trySet(markers.marker,'stroke',color);
          trySet(markers.marker,'fill',color);
        }
      }
    },
    /**
     * @protected
     * 鼠标进入事件
     */
    onMouseOver : function(){
      var _self = this,
        parent = _self.get('parent');
      _self.on('mouseover',function(){
        if(parent.setActived){
          parent.setActived(_self);
        }
      });
    },
    /**
     * @protected
     * 鼠标在画布上移动
     */
    onStickyTracking : function(ev){
      var _self = this,
        point = ev.point,
        markersGroup = _self.get('markersGroup'),
        marker = _self.getSnapMarker(point.x);
      markersGroup && markersGroup.setActived(marker);
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
     * @protected
     * 内部图形发生改变
     */
    changeShapes : function(){
      var _self = this,
        points = _self.getPoints(),
        lineShape = _self.get('lineShape'),
        path = _self.points2path(points);
      if(lineShape){
        if(Util.svg && _self.get('smooth')){ //曲线图，先获取到达的path
          var prePath = lineShape.getPath();
          lineShape.attr('path',path);
          path = lineShape.attr('path');
          lineShape.attr('path',prePath);
        }
        Util.animPath(lineShape,path);
      }
    },
    /**
     * @protected
     * @ignore
     */
    draw : function(points,callback){

      var _self = this,
        animate = _self.get('animate'),
        duration = _self.get('duration'),
        lineShape,
        path = '';

      if(!animate){
        path = _self.points2path(points);
        lineShape = _self._createLine(path);
        BUI.each(points,function(point){
          _self._drawPoint(point);
        });
        after();
      }else{
        lineShape = _self._createLine(path);
        var cur = 0,
          sub = [],
          count = points.length;
        //动画生成线和对应的点
        Util.animStep(duration,function(factor){
          var pre = cur;
          cur = parseInt((factor) * count,10);
          if(cur > count - 1){
            cur = count - 1;
          }
          
          if(cur != pre){
            sub = points.slice(0,cur + 1);
            path = _self.points2path(sub);
            lineShape.attr('path',path);
            for(var i = pre; i< cur; i++){
              _self._drawPoint(points[i]);
            }
            
          }
          if(factor == 1){
            _self._drawPoint(points[cur]);
          }
        },after);
      }
      //_self.set('lineShape',lineShape);
      /**
       * @private
       */
      function after(){
        
        _self.drawTracker(points);
        callback && callback();
      }
      
    },
    //绘制节点相关的label,marker
    _drawPoint : function(point){
      var _self = this;
      if(_self.get('markers') && !_self.get('markersGroup').get('single')){ //如果只有一个marker暂时不生成
        _self.addMarker(point);
      }
      if(_self.get('labels')){
        _self.addLabel(point.value,point);
      }
    },
    //创建折线
    _createLine : function(path){
      var _self = this,
        lineAttrs = _self.get('line'),
        cfg = BUI.mix({},lineAttrs);
      cfg.path = path;
      lineShape = _self.addShape('path',cfg);
      _self.set('lineShape',lineShape);
      return lineShape;
    },
    //绘制触发事件的path
    drawTracker : function(points){
      var _self = this,
        lineAttrs = _self.get('line'),
        tolerance = _self.get('tolerance'),
        path = _self.points2tracker(points),
        cfg = BUI.mix({},lineAttrs),
        preWidth = Number(lineAttrs['stroke-width']),
        shape;

      cfg['stroke-width'] = preWidth + tolerance;
      cfg['stroke-opacity'] = 0.001;
      cfg.path = path;
      shape = _self.addShape('path',cfg);
      _self.set('trackerShape',shape);
    },
    //将点转换成Path
    points2path : function(points){
      var _self = this,
        smooth = _self.get('smooth'),
        path = '';
      if(points.length <= 2){ //少于3个点不能使用smooth
        smooth = false;
      }
      BUI.each(points,function(item,index){
        var str = index == 0 ? (smooth ? 'M{x} {y} R' : 'M{x} {y}') : (smooth ? ' {x} {y}' : 'L{x} {y}');
        path += BUI.substitute(str,item);
      });
      return path;
    },
    //获取tracker的路径，增加触发事件的范围
    points2tracker : function(points){
      var _self = this,
        tolerance = _self.get('tolerance'),
        first = points[0],
        path = 'M' + (points[0].x - tolerance) + ' ' + points[0].y;
      BUI.each(points,function(item,index){
        var str = 'L{x} {y}';
        path += BUI.substitute(str,item);
      });
      return path;
    },
    /**
     * @protected
     * 设置图形的激活状态
     * @param {Boolean} actived 是否激活
     */
    setActiveStatus : function(actived){
      var _self = this,
        line = _self.get('line'),
        lineShape = _self.get('lineShape'),
        lineActived = _self.get('lineActived');
      if(actived){
        lineActived && lineShape.attr(lineActived);
      }else{
        line && lineShape.attr(line);
        var markersGroup = _self.get('markersGroup');
        markersGroup && markersGroup.clearActived();
      }
    },
    /**
     * @protected
     * 判断是否近似相等
     */
    snapEqual : function(value1,value2){
      var _self = this,
        xAxis = _self.get('xAxis');
      if(xAxis.get('type') == 'time'){

      }
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
     * 根据对象获取值
     * @protected
     * @return {Object} 点的集合
     */
    getPointByObject : function(item){
      var _self = this,
        xField = _self.get('xField'),
        yField = _self.get('yField'),
        point = _self.getPoint(item[xField],item[yField]);

      point.value = item[yField];
      
      return point;
    },

    /**
     * 获取逼近的marker
     * @return {BUI.Graphic.Shape} 逼近的marker
     */
    getSnapMarker : function(offsetX){
      var _self = this,
        markersGroup = _self.get('markersGroup'),
        rst = null;
      if(markersGroup){
        rst = markersGroup.getSnapMarker(offsetX);
      }
      return rst;
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
        x,y;

      if(xAxis.get('type') == 'time'){
        xValue = date2number(xValue);
      }
      x = xAxis.getOffset(xValue);
      y = yAxis.getOffset(value);

      return {
        x : x,
        y : y,
        originValue : xValue,
        value : value
      };
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
        y = yAxis.getOffset(value),
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
        originValue : originValue,
        value : value
      };
    }
  });

  return Line;
});