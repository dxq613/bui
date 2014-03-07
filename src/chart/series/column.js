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
        'stroke-width': 1
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
    draw : function(points){
      var _self = this;
      _self.resetWidth();

      BUI.each(points,function(point,index){
        var shape = _self.addItem(point,index);
        if(_self.get('labels')){
          var label = _self.addLabel(point.value,point);
          shape.set('label',label);
        }
      });
      if(_self.get('animate')){
        _self.animateItems();
      }
      _self.sort();
    },
    resetWidth : function(){
      var _self = this,
        parent = _self.get('parent'),
        series = parent.getSeries(),
        curIndex,
        xAxis = _self.get('xAxis'),
        tickLength = xAxis.getTickAvgLength(),
        count,
        margin = 10,
        width,
        offset;
      if(!_self.isStacked()){ //非层叠的数据序列
        var columns = [];
        BUI.each(series,function(item){
          if(item.get('visible') && item.get('type') == 'column'){
            columns.push(item);
          }
        });

        count = columns.length;
        curIndex = BUI.Array.indexOf(_self,columns);

      }else{ //层叠的进行
        count = 1;
        curIndex = 0;
      }

      width = (tickLength/2)/count;
      margin = 1/2 * width;
      offset = 1/2 * (tickLength - (count) * width - (count - 1) * margin) + ((curIndex + 1) * width + curIndex * margin) - 1/2 * width - 1/2 * tickLength ;
      _self.set('columnWidth',width);
      _self.set('columnOffset',offset)

    },
    changeShapes : function(){
      var _self = this,
        items = _self.getItems(),
        points = _self.get('points');
      _self.resetWidth();
      BUI.each(items,function(item,index){
        var point = points[index],
          path = _self.pointToPath(point);

        item.set('point',point);
        item.animate({
          path : path
        },_self.get('changeDuration'));
      });
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
        color = _self.get('color');

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
     * 鼠标在画布上移动
     */
    onStickyTracking : function(ev){
      var _self = this,
        point = _self.getTrackingInfo(ev.point),
        items = _self.getItems();
      if(point){
        BUI.each(items,function(item){
          if(item.get('point').x == point.x){
            _self.setActived(item);
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
        width = _self.get('columnWidth'), //宽度
        offset = _self.get('columnOffset'),
        height,
        value0,
        stackPadding = 0,
        baseValue =  _self.getBaseValue(),
        path = []; //
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