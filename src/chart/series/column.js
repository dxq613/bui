/**
 * @fileOverview 柱状图
 * @ignore
 */

define('bui/chart/columnseries',['bui/common','bui/graphic','bui/chart/activedgroup','bui/chart/series/stacked'],function (require) {
  
  var BUI = require('bui/common'),
    Util = require('bui/graphic').Util,
    Cartesian = require('bui/chart/cartesianseries'),
    ActiveGroup = require('bui/chart/activedgroup'),
    Stacked = require('bui/chart/series/stacked'),
    Group = require('bui/chart/series/itemgroup');

  function highlight(c,percent){
    var color = Raphael.color(c),
      l = color.l * (1 + percent);
    return Raphael.hsl2rgb(color.h,color.s,l).hex;
  }
  
  function getPiePath (startAngle, endAngle,r,ir,circle) {
      var center = circle.getCenter(),
        path,
        cx = center.x,
        cy = center.y,
        start = circle.getCirclePoint(startAngle,r),
        end = circle.getCirclePoint(endAngle,r);

      //不存在内部圆
      if(!ir){
        path =  ["M", cx, cy, "L", start.x, start.y, "A", r, r, 0, +(endAngle - startAngle > 180), 1, end.x, end.y, "z"];
      }else{
        var iStart = circle.getCirclePoint(startAngle,ir),
          iEnd = circle.getCirclePoint(endAngle,ir);

        path = [];

        path.push(['M',iStart.x,iStart.y]);
        path.push(['L',start.x, start.y]);
        path.push(["A", r, r, 0, +(endAngle - startAngle > 180), 1, end.x, end.y]);
        path.push(['L',iEnd.x,iEnd.y]);
        path.push(['A',ir,ir,0,+(endAngle - startAngle > 180),0,iStart.x,iStart.y]);
        path.push(['z']);
      }
      return path;
    }

  /**
   * @class BUI.Chart.Series.Column
   * 柱状图
   * @extends BUI.Chart.Series.Cartesian
   * @mixins BUI.Chart.Series.ItemGroup
   */
  var Column = function(cfg){
    Column.superclass.constructor.call(this,cfg);
  };


  Column.ATTRS = {
    type : {
      value : 'column'
    },
    elCls : {
      value : 'x-chart-column'
    },
    /**
     * 每一个子项的宽度,自动计算得出
     * @type {Number}
     */
    columnWidth : {
      //value : 25
    },
    /**
     * 自动计算得出
     * @type {Object}
     */
    columnOffset : {
      value : 0
    },
    /**
     * 是否允许取消选中，选中状态下，继续点击则会取消选中
     * @type {Boolean}
     */
    cancelSelect : {
      value : false
    },
    /**
     * 发生层叠时，层叠之间的间距
     * @type {Object}
     */
    stackPadding : {
      value : 1
    },
    animate : {
      value : true
    },
    duration : {
      value : 1000
    },
    item : {
      shared : false,
      value : {
        'stroke': 'none',
        'stroke-width': 1,
        'fill-opacity':.75
      }
    }

  };

  BUI.extend(Column,Cartesian);


  BUI.mixin(Column,[Group,ActiveGroup,Stacked]);


  BUI.augment(Column,{
    /**
     * @protected
     * 处理颜色
     */
    processColor : function(){
      var _self = this,
        color = _self.get('color');
      if(color){
        var item = _self.get('item');
        if(!item.fill){
          item.fill = color;
        }
      }
    },
    bindUI : function(){
      Column.superclass.bindUI.call(this);
      this.bindItemClick();
    },
    //渲染
    draw : function(points){
      var _self = this;
      _self.resetWidth();

      BUI.each(points,function(point,index){
        _self._drawPoint(point,index);
      });
      if(_self.get('animate')){
        _self.animateItems();
      }
      _self.sort();
    },
    _drawPoint : function(point,index){
      var _self = this,
        shape = _self.addItem(point,index);

      if(_self.get('labels')){
        var label = _self.addLabel(point.value,point);
        shape.set('label',label);
      }
    },
    //覆写添加节点的方法
    addPoint : function(point,shift,redraw){
      var _self = this,
        data = _self.get('data');
      data.push(point);
      
      if(shift){
        data.shift();
        redraw &&  _self.shiftPoint();
      }
      _self.changeData(data,redraw);
    },
    shiftPoint : function(){
      var _self = this,
        firstItem = _self.getItems()[0];
      firstItem && firstItem.remove();
      Column.superclass.shiftPoint.call(this);
    },
    //重置宽度
    resetWidth : function(){
      if(this.isInCircle()){
        this.resetCircleWidth();
        return ;
      }
      var _self = this,
        curIndex,
        xAxis = _self.get('xAxis'),
        tickLength = xAxis.getTickAvgLength(),
        count,
        margin = 10,
        width,
        offset,
        info = _self._getIndexInfo();

      count = info.count;
      curIndex = info.curIndex;

      width = (tickLength/2)/count;
      margin = 1/2 * width;
      offset = 1/2 * (tickLength - (count) * width - (count - 1) * margin) + ((curIndex + 1) * width + curIndex * margin) - 1/2 * width - 1/2 * tickLength ;
      _self.set('columnWidth',width);
      _self.set('columnOffset',offset)

    },
    //获取index相关信息
    _getIndexInfo : function(){
      var _self = this,
        parent = _self.get('parent'),
        series = parent.getSeries(),
        curIndex,
        count,
        columns = [];
      if(!_self.isStacked()){
        BUI.each(series,function(item){
          if(item.get('visible') && item.get('type') == 'column'){
            columns.push(item);
          }
        });

        count = columns.length;
        curIndex = BUI.Array.indexOf(_self,columns);
      }else{
        count = 1;
        curIndex = 0;
      }
      
      return {
        curIndex : curIndex,
        count : count
      };
    },
    //重置圆中的宽度
    resetCircleWidth : function(){
      var _self = this,
        curIndex,
        xAxis = _self.get('xAxis'),
        avgAngle = xAxis.getTickAvgAngle(),
        count,
        width,
        offset;
      info = _self._getIndexInfo();

      count = info.count;
      curIndex = info.curIndex;
      width = avgAngle / count;
      offset = curIndex * width;
      _self.set('columnWidth',width);
      _self.set('columnOffset',offset)
    },
    changeShapes : function(points){
      var _self = this;

      _self.resetWidth();
      _self.changePoints(points);
    },
    getActiveItems : function(){
      return this.getItems();
    },
    /**
     * @protected
     * @ignore
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
        color = item.getCfgAttr('attrs').fill;

      if(actived){
        item.attr('fill',highlight(color,0.2));
        item.set('actived',true);
      }else{
        item.attr('fill',color);
        item.set('actived',false);
      }
    },
    /**
     * @protected
     * 设置选中
     * @param {Object} item  
     * @param {Boolean} selected 选中状态
     */
    setItemSelected : function(item,selected){
      var _self = this,
        attrs = item.getCfgAttr('attrs'),
        color = attrs.fill,
        stroke = attrs.stroke,
        strokeWidth = attrs['stroke-width'];
      if(selected){
        item.attr({'stroke': Util.dark(color,.30),'stroke-width' : 2});
        item.set('selected',true);
      }else{
        item.attr({'stroke': stroke,'stroke-width' : strokeWidth});
        item.set('selected',false);
      }
    },
    /**
     * @protected
     * 鼠标在画布上移动
     */
    onStickyTracking : function(ev){
      var _self = this,
        point = _self.getTrackingInfo(ev.point),
        items = _self.getItems();
      if(point){
        BUI.each(items,function(item){
          if(item.get('point').x == point.x && item.get('point').y == point.y){
            _self.setActivedItem(item);
          }
        });
      }
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
        item = _self.get('item'),
        width = _self.get('columnWidth'), //宽度,雷达图中表示角度
        offset = _self.get('columnOffset'),
        height,
        value0,
        stackPadding = 0,
        baseValue =  _self.getBaseValue(),
        isInCircle = _self.isInCircle(),
        path = []; //

      if(isInCircle){ //雷达图中显示
        var xAxis = _self.get('xAxis'),
          angle = point.xValue,//此时xValue指角度
          startAngle = offset + angle, //起始坐标
          endAngle = offset + angle + width,//结束角度
          r = point.r || xAxis.getDistance(point.x,point.y),
          ir = point.ir || 0; 

        r = r * factor;
        ir = ir * factor;
        path = getPiePath(startAngle,endAngle,r,ir,xAxis);

      }else{
        if(_self.isStacked() && point.lowY){
            value0 = point.lowY ;
            stackPadding = _self.get('stackPadding');
        }else{
          value0 = baseValue;
        }
        value0 = value0 - stackPadding;

        height = point.y - value0;
        path.push(['M',point.x + offset - width/2,baseValue + (value0 - baseValue) * factor]);
        path.push(['v',height * factor]);
        path.push(['h',width]);
        path.push(['v',-1 * height * factor]);
        path.push(['z']);
      }
      

      return path;
    },
    /**
     * @protected
     * 处理节点，并且添加附加信息
     */
    processPoint : function(point,index){
      var _self = this,
        stackType = _self.get('stackType');
      if(stackType && stackType != 'none'){
        _self.processStackedPoint(point,index);
      }
    }

  });

  return Column;
  

});