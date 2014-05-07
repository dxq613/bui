/**
 * @fileOverview 饼图
 * @ignore
 */

define('bui/chart/pieseries',['bui/common','bui/graphic','bui/chart/baseseries','bui/chart/series/itemgroup'],function (require) {

  var BUI = require('bui/common'),
    ItemGroup = require('bui/chart/series/itemgroup'),
    ActiveGroup = require('bui/chart/activedgroup'),
    Util = require('bui/graphic').Util,
    Base = require('bui/chart/baseseries');

  //决定x坐标
  function ensureX(self,x){
    if(BUI.isNumber(x)){
      return x;
    }

    var plotRange = getPlotRange(self),
      xPercent = parsePercent(x),
      width = plotRange.getWidth();
    return plotRange.tl.x + width * xPercent;
  }

  //决定y坐标
  function ensureY(self,y){
    if(BUI.isNumber(y)){
      return y;
    }

    var plotRange = getPlotRange(self),
      yPercent = parsePercent(y),
      height = plotRange.getHeight();
    return plotRange.tl.y + height * yPercent;
  }
  //处理百分比
  function parsePercent(v){
    return parseFloat(v) * 0.01;
  }
  //获取range
  function getPlotRange(self){
    return self.get('parent').get('plotRange');
  }

  function resetItem(item,h,endAngle,r,center){
      var angle = endAngle - (Math.acos((r-h)/r)/Math.PI * 180);

        item.orignAngle = item.angle;
        item.angle =  angle;
        item.orignX = item.x;
        item.orignY = item.y;

        //增加5像素，用于连接线
        item.x = center.x + (r + 5) * Math.cos(item.angle * RAD);
        item.y = center.y + (r + 5) * Math.sin(item.angle * RAD);
  }

  function alignLables(center,r,arr,endAngle,factor){
    var count = parseInt(r * 2 / LINE_HEIGHT,10),//理论上，最大显示的条数
      maxY = center.y + r,
      minY = center.y - r;
    if(count < arr.length){ //忽略掉不能显示的条数
      //arr = arr.slice(0,count - 1);
      arr.splice(count,arr.length - count);
    }

    var conflictIndex = 0, //从该点开始存在冲突，需要调整位置
      length = arr.length,
      leftAvg,
      leftCount;
    //查找第一个容放不下后面节点的位置
    for (var i = 0; i < length; i++) {
      var label = arr[i],
        angle = label.angle,
        y = label.y;

      leftCount = length - i;
      leftAvg = factor > 0 ? (maxY - y) / leftCount : (y - minY) / leftCount;
      conflictIndex = i;
      
      if(leftAvg < LINE_HEIGHT){
        conflictIndex = i + 1;
        break;
      }
    }

    

    if(conflictIndex && conflictIndex < length - 1){ //说明存在冲突，因为已经调整过，所以conflictIndex > 0
      var start = conflictIndex - 1,
        startLabel = arr[start],
        y =  startLabel.y, //start == 0 ? (factor > 0 ? minY : maxY) :
        endY = factor > 0 ? maxY : minY;

      leftCount = length - start - 1;
      leftAvg = Math.abs(endY - y) / leftCount;
      if(leftAvg < LINE_HEIGHT){
        leftAvg = LINE_HEIGHT;
      }
      //调整后面的文本
      for (var i = length - 1; i >= start; i--) {
        var h = (length - 1 - i) * leftAvg;
        resetItem(arr[i],h,endAngle,r,center);
       
      };

      var startY = factor > 0 ? minY : maxY,
        adjust = false;
      //调整前面的文本
      for(var i = start -1; i > 0 ;i--){
        var item = arr[i];
        if(!adjust && Math.abs(startY - item.y) / (i + 1) < LINE_HEIGHT){
          adjust = true;
        }
        if(adjust){
          var h = Math.abs(arr[i + 1].y - endY) + LINE_HEIGHT;
          resetItem(arr[i],h,endAngle,r,center);
        }
      }
      
    }

  }


  var RAD = Math.PI / 180,
    MARGIN = 5,
    LINE_HEIGHT = 16; //最小行高

  /**
   * @class BUI.Chart.Series.Pie
   * 饼图数据序列
   * @extends BUI.Chart.Series
   * @mixins BUI.Chart.Series.ItemGroup
   */
  var Pie = function(cfg){
    Pie.superclass.constructor.call(this,cfg);
  };

  Pie.ATTRS = {

    /**
     * 大小所占的比例，用于计算半径
     * @type {String}
     */
    size : {
      value : '80%'
    },
    /**
     * 内部的大小，用于计算开始的位置
     * @type {String}
     */
    innerSize : {

    },
    /**
     * 圆心的位置，如果数组中是数字则是相对于cavas的位置，如果是字符串，则按照百分比进行
     * @type {Array}
     */
    center : {
      value : ['50%','50%']
    },
    /**
     * 颜色集合
     * @type {Array}
     */
    colors : {

    },
    /**
     * 将指定的颜色进行调节亮度
     * @type {Number}
     */
    colorHighlight : {
      value : 0
    },
    /**
     * 如果设置了size，通过计算得出
     * @type {Number}
     */
    radius : {

    },
    /**
     * 开始的角度，-180-180
     * @type {Number}
     */
    startAngle : {
      value : -90
    },
    /**
     * 结束的角度，默认 360，但是，endAngle - startAngle <= 360
     * @type {Number}
     */
    endAngle : {
      value : 270
    },
    
    xField : {
      value : 'name'
    },
    stickyTracking : {
      value : false
    },
    animate : {
      value : true
    },
    duration : {
      value : 1000
    }
  };

  BUI.extend(Pie,Base);

  BUI.mixin(Pie,[ItemGroup,ActiveGroup]);

  BUI.augment(Pie,{

    draw : function(points){

      var _self = this,
        selectedPoint;
      BUI.each(points,function(point,index){
        _self.formatPoint(point,index);
        var item = _self.addItem(point,index);
        if(point.obj && point.obj.selected){
          selectedPoint = item;
        }
      });
      if(_self.get('animate')){
        _self.animateItems(after);
      }else{
        after();
      }
      if(_self.get('labelsGroup')){
        _self.processLabels(points);
        _self.get('labelsGroup').toFront();
      }

      function after(){
        if(selectedPoint){
          _self.setSelected(selectedPoint);
        }
      }
    },
    /**
     * @protected
     * 内部图形发生改变
     */
    changeShapes : function(points,animate){
      var _self = this;

      BUI.each(points,function(point,index){
        _self.formatPoint(point,index);
      });

      _self.changePoints(points);

    },
    //处理labels
    processLabels : function(points){
      var _self = this,
        labelsGroup = _self.get('labelsGroup'),
        distance = labelsGroup.get('distance'),
        leftArray = [],
        center = _self.getCenter(),
        r = _self.getRadius(),
        rAppend = r + distance,
        startAngle = _self.get('startAngle'),
        endAngle = _self.get('endAngle'),
        rightArray = [];

      BUI.each(points,function(point){
        var cfg = _self._getLabelCfg(point,distance,rAppend);
        if(distance < 0){
          labelsGroup.addLabel(cfg);
        }else{
          if(cfg.factor > 0){
            rightArray.push(cfg);
          }else{
            leftArray.push(cfg);
          }
        }
      });
      if(leftArray.length){
        var end;
        if(startAngle >= -90){
          end = 270;
        }else{
          end = -90;
        }
        alignLables(center,rAppend,leftArray,end,-1);
        BUI.each(leftArray,function(label){
          labelsGroup.addLabel(label);
          _self.lineToLabel(label,r,distance);
        });
      }
      if(rightArray.length){

        alignLables(center,rAppend,rightArray,90,1);
        BUI.each(rightArray,function(label){
          labelsGroup.addLabel(label);
          _self.lineToLabel(label,r,distance);
        });
      }
      
    },
    /**
     * 设置labels
     * @param  {Array} items items的配置信息
     */
    resetLabels : function(){
      var _self = this,
        labelsGroup = _self.get('labelsGroup'),
        lineGroup = _self.get('lineGroup');
      if(labelsGroup){
        labelsGroup.clear();
        lineGroup && lineGroup.clear();
        _self.processLabels(_self.getPoints());
      }
    },
    lineToLabel : function(label,r,distance){
      var _self = this,
        angle = label.orignAngle || label.angle,
        center = _self.getCenter(),
        start = _self._getOffset(angle,r + MARGIN /2 ),
        inner,
        lineGroup = _self.get('lineGroup'),
        path = [];

      path.push(['M',center.x + start.x,center.y + start.y]);
      if(label.orignX != null){
        inner = _self._getOffset(angle,r + distance/2);
        path.push(['R',center.x  + inner.x,center.y + inner.y,label.x,label.y]);
      }else{
        path.push(['L',label.x,label.y]);
      }

      if(!lineGroup){
        lineGroup = _self.addGroup();
        _self.set('lineGroup',lineGroup);
      }
      lineGroup.addShape('path',{
        path : path,
        fill : null,
        stroke : label.color
      });


    },
    bindUI : function(){
      Pie.superclass.bindUI.call(this);
      this.bindItemClick();
    },
   
    //鼠标移动
    onMouseOver : function(){
      var _self = this;

      _self.on('mouseover',function(ev){
        var target = ev.target,
          shape = target.shape;
        shape && _self.setActivedItem(shape);
      });
    },
    _getLabelCfg : function(point,distance,rAppend){
      var _self = this,
        middleAngle = point.startAngle + (point.endAngle - point.startAngle)/2,
        center = _self.getCenter(),
        x = center.x + (rAppend + MARGIN) * Math.cos(middleAngle * RAD),
        y = center.y + (rAppend + MARGIN) * Math.sin(middleAngle * RAD),
        rst = {},
        factor = 1;

      rst.x = x;
      rst.y = y;

      if(distance < 0){ //圆内显示文本
        if(middleAngle > -90 && middleAngle <= 90){
          rst['text-anchor'] = 'end';
          rst.rotate = middleAngle;
        }else{
          rst['text-anchor'] = 'start';
          rst.rotate = middleAngle - 180;
        }

      }else{
        if(middleAngle > -90 && middleAngle <= 90){
          rst['text-anchor'] = 'start';
          factor = 1;
        }else{
          factor = -1;
          rst['text-anchor'] = 'end';
        }
      }
      rst.factor = factor;
      rst.angle = middleAngle;
      rst.color = point.color;
      rst.point = point;
      rst.text = point.xValue;
      return rst;
    },
    getActiveItems : function(){
      return this.getItems();
    },
    //设置激活状态
    setItemActived : function(item,actived){
      var _self = this,
        color = item.getCfgAttr('attrs').fill;
      if(actived){
        item.attr({fill : Util.highlight(color,.1)});
        item.set('actived',true);
      }else{
        item.attr({fill : color});
        item.set('actived',false);
      }
    },
    //获取当前定位的点
    getTrackingInfo : function(){
      var _self = this,
        item = _self.getActived();
      return item && item.get('point');
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
     * 获取半径
     * @return {Number} 半径
     */
    getRadius : function(){
      var _self = this,
        radius = _self.get('radius');
      if(!radius){
        radius = _self.calculateRadius(_self.get('size'));
        _self.set('radius',radius);
      }
      return radius;
    },
    /**
     * 获取内部的半径，空白部分
     * @return {Number} 内部的半径
     */
    getInnerRadius : function(){
      var _self = this,
        innerRadius = _self.get('innerRadius'),
        innerSize = _self.get('innerSize');
      if(!innerRadius && innerSize){
        innerRadius = _self.calculateRadius(innerSize);
        _self.set('innerRadius',innerRadius);
      }
      return innerRadius;
    },
    //计算半径
    calculateRadius : function(size){
      var _self = this,
        plotRange = _self.get('parent').get('plotRange'),
        percent = parsePercent(size);
      return Math.min(plotRange.getWidth(),plotRange.getHeight())/2 * percent;
    },
    //获取中心点
    getCenter : function(){
      var _self = this,
        centerPoint = _self.get('centerPoint'),
        center;
      if(!centerPoint){
        centerPoint = {};
        center = _self.get('center');
        
        centerPoint.x = ensureX(_self,center[0]);
        centerPoint.y = ensureY(_self,center[1]);
        _self.set('centerPoint',centerPoint);
      }
      return centerPoint;
    },
    /**
     * @protected
     * 获取子项的配置信息
     * @param  {Object} item 信息
     */
    getItemCfg : function(point,index){
      var _self = this,
        item = _self.get('item'),
        cfg = point.obj,
        rst = {};

      BUI.mix(rst,item);
      if(cfg && cfg.attrs){
        BUI.mix(rst,cfg.attrs);
      }
      //if(!rst.fill){
        rst.fill = point.color;
      //}
      if(_self.get('allowPointSelect')){
        rst.cursor = 'pointer';
      }
      return rst;
    },
    //获取颜色
    _getColor : function(index){
      var _self = this,
        colors = _self.get('colors'),
        colorHighlight = _self.get('colorHighlight'),
        color;
      index = index % colors.length;
      color = colors[index];
      if(colorHighlight){
        color = Util.highlight(colorHighlight);
      }
      return color;
    },
    //格式化节点
    formatPoint : function(point,index){
      var _self = this,
        points = _self.getVisiblePoints(),
        percent = _self._getPiePercent(point,points),
        startAngle = _self.get('startAngle'),
        endAngle = _self.get('endAngle'),
        totalAngle = endAngle - startAngle,
        rst = {};
      point.percent = percent.percent;
      if(point.obj && point.obj.attrs){
        point.color = point.obj.attrs.fill;
      }
      point.color =  point.color || _self._getColor(index);
      point.prePercent = percent.prePercent;
      point.startAngle = startAngle + totalAngle * percent.prePercent;
      point.endAngle = startAngle + totalAngle * (point.prePercent + point.percent);

    },
    getPointByValue : function(xValue,value){
      return {
        xValue : xValue,
        value : value
      };
    },
    //获取当前节点占用的比例和开始点的比例
    _getPiePercent : function(point,points){
      var _self = this,
        total = 0,
        pre = 0,
        curIndex = BUI.Array.indexOf(point,points),
        rst = {};
      BUI.each(points,function(point,index){
        if(index < curIndex){
          pre += point.value;
        }
        total += point.value;
      });

      rst.percent = point.value / total;
      rst.prePercent = pre / total;
      return rst;
    },
    getVisiblePoints : function(){
      var _self = this,
        visiblePoints;

      return _self.getPoints();
      //未渲染，则调用初始化时的点信息
      /*if(!_self.get('isPaint')){
        
      }

      visiblePoints = _self.get('visiblePoints');
      if(visiblePoints){
        return visiblePoints;
      }
      var points = [],
        items = _self.getItems();
      BUI.each(items,function(item){
        if(item.get('visible')){
          points.push(item.get('point'));
        }
      });
      _self.set('visiblePoints',points);
      return points;
      */
    },
    /**
     * 执行单个点的动画
     * @protected
     */
    animateItem : function(item,prePoint){
      var _self = this,
        curPoint = item.get('point'),
        startAngle = curPoint.startAngle,
        endAngle = curPoint.endAngle,
        isPre = prePoint == item.get('prePoint'),
        preStart = isPre ? prePoint.startAngle : prePoint.endAngle,
        preEnd = isPre ? prePoint.endAngle : prePoint.endAngle;
      var animHadler = item.get('animHadler');
      if(animHadler){
        Util.stopStep(animHadler);
      }
      animHadler = Util.animStep(_self.get('changeDuration'),function(factor){
        var path,
          curStart,
          curEnd;
        if(isPre){
          curStart = preStart + (startAngle - preStart) * factor;
          curEnd = preEnd + (endAngle - preEnd) * factor
          
        }else{
          curStart = preStart - (preStart - startAngle) * factor;
          curEnd = preEnd - (preEnd - endAngle) * factor;
        }
        path = _self._getPiePath(curStart,curEnd);
       
        item.attr('path',path);
        if(_self.isSelected(item)){
          var offset = _self._getOffset(curStart,curEnd,10);
          item.attr('transform' ,'t'+ offset.x +' '+offset.y);
        }
      });
      item.set('animHadler',animHadler);
    },
    /**
     * @protected
     * 动画过程中根据比例获取path
     * @param  {Object} point  子项的节点信息
     * @param  {Number} factor 比例
     * @return {Array}  path
     */
    pointToFactorPath : function(point,factor){
      var _self = this,
        startAngle = _self.get('startAngle'),
        pStart, //当前点的起始
        pEnd; //当前点的结束

      pStart = point.startAngle;
      pEnd = point.endAngle;

      return _self._getPiePath(startAngle + (pStart - startAngle) * factor,startAngle + (pEnd - startAngle) * factor);
    },
    //获取路径
    _getPiePath : function(startAngle, endAngle) {
      var _self = this,
        center = _self.getCenter(),
        
        path,
        cx = center.x,
        cy = center.y,
        r = _self.getRadius(),
        ir = _self.getInnerRadius(), //内部圆的半径
        x1 = cx + r * Math.cos(startAngle * RAD),
        x2 = cx + r * Math.cos(endAngle * RAD),
        y1 = cy + r * Math.sin(startAngle * RAD),
        y2 = cy + r * Math.sin(endAngle * RAD);

      //不存在内部圆
      if (!ir) {
        if (endAngle - startAngle == 360) {
          // 如果只有一个图形100%.
          path = [['M', cx, cy - r], ['a', r, r, 0, 1, 1, 0, 2 * r], ['a', r, r, 0, 1, 1, 0, -2 * r], ['z']];
        } else {
          path =  ["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 1, x2, y2, "z"];
        }
      } else {
        // 圆环
        var ix1 = cx + ir * Math.cos(startAngle * RAD),
          ix2 = cx + ir * Math.cos(endAngle * RAD),
          iy1 = cy + ir * Math.sin(startAngle * RAD),
          iy2 = cy + ir * Math.sin(endAngle * RAD);

        path = [];

        if (endAngle - startAngle == 360) {
          // 如果只有一个图形100%.
          // path = [['M', cx, cy - r], ['a', r, r, 0, 1, 1, 0, 2 * r], ['a', r, r, 0, 1, 1, 0, -2 * r], ['z']];
          path.push(['M', cx, cy - r]);
          path.push(["a", r, r, 0, 1, 1, 0, 2 * r]);
          path.push(["a", r, r, 0, 1, 1, 0, -2 * r]);
          // 这里如果用L就会有一根白线.
          path.push(['M', cx, cy - ir]);
          path.push(["a", ir, ir, 0, 1, 0, 0, 2 * ir]);
          path.push(["a", ir, ir, 0, 1, 0, 0, -2 * ir]);
          path.push(['z']);
        } else {
          path.push(['M',ix1,iy1]);
          path.push(['L',x1, y1]);
          path.push(["A", r, r, 0, +(endAngle - startAngle > 180), 1, x2, y2]);
          path.push(['L',ix2,iy2]);
          path.push(['A',ir,ir,0,+(endAngle - startAngle > 180),0,ix1,iy1]);
          path.push(['z']);
        }

        



      }
      return path;
    },
    _getOffset : function(startAngle,endAngle,distance){

      var _self = this,
        middleAngle,
        rst = {};
      if(distance == null){ //只有2个参数时
        middleAngle = startAngle;
        distance = endAngle;
      }else{
        middleAngle = startAngle + (endAngle - startAngle)/2;
      }
     
      rst.x = distance * Math.cos(middleAngle * RAD);
      rst.y = distance * Math.sin(middleAngle * RAD);
      return rst;
    },
    /**
     * @protected
     * 覆写方法
     * @ignore
     */
    setItemSelected : function(item,selected){

      var _self = this,
        point = item.get('point'),
        duration = _self.get('changeDuration'),
        //selectedItem,
        offset;
      if(selected){
        /*selectedItem = _self.getSelected();
        if(selectedItem && selectedItem != item){
          _self.setItemSelected(selectedItem,false);
        }*/
        offset = _self._getOffset(point.startAngle,point.endAngle,10);
        item.animate({
          transform : 't'+ offset.x +' '+offset.y
        },duration);
      }else{
        item.animate({
          transform : 't0 0'
        },duration);
      }
      item.set('selected',selected);
    }
  });

  return Pie;
});
