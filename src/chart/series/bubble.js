/**
 * @fileOverview 气泡图
 * @ignore
 */

define('bui/chart/bubbleseries',['bui/common','bui/chart/cartesianseries','bui/graphic','bui/chart/activedgroup'],function (require) {
  
  var BUI = require('bui/common'),
    Cartesian = require('bui/chart/cartesianseries'),
    ActiveGroup = require('bui/chart/activedgroup'),
    Util = require('bui/graphic').Util;

  /**
   * @class BUI.Chart.Series.Bubble
   * 冒泡图
   */
  var Bubble = function(cfg){
    Bubble.superclass.constructor.call(this,cfg);
  };

  Bubble.ATTRS = {
    elCls : {
      value : 'x-chart-bubble'
    },
    type : {
      value : 'buble'
    },
    /**
     * 气泡的配置信息
     * @type {Object}
     */
    circle : {
      shared : false,
      value : {
        
      }
    },
    /**
     * 激活气泡的状态
     * @type {Object}
     */
    activeCircle : {
      value : {
      }
    },
    animate : {
      value : true
    },
    stickyTracking : {
      value : false
    }
  };

  BUI.extend(Bubble,Cartesian);

  BUI.mixin(Bubble,[ActiveGroup]);

  BUI.augment(Bubble,{

    /**
     * @protected
     * 处理颜色
     */
    processColor : function(){
      var _self = this,
        color = _self.get('color');
      if(color){
        var  circle = _self.get('circle');
        if(circle){
          Util.trySet(circle,'stroke',color);
          Util.trySet(circle,'fill',color);
        }
      }
    },
    renderUI : function(){
      Bubble.superclass.renderUI.call(this);
      this._renderGroup();
    },
    //渲染圆
    draw : function(points){
      var _self = this;
      
      BUI.each(points,function(point){
        _self.addBubble(point);
      });
    },
    /**
     * @protected
     * 内部图形发生改变
     */
    changeShapes : function(){
      var _self = this,
        points = _self.getPoints(),
        items = _self.getItems();

      BUI.each(items,function(item,index){
        var point = points[index];
        item.animate({
          cx : point.x,
          cy : point.y
        },_self.get('changeDuration'));
        item.set('point',point);
      });

    },
    /**
     * 获取内部的圆
     * @return {Array} 图形圆的集合
     */
    getItems : function(){
      return this.get('group').get('children');
    },
    /**
     * @protected
     * 获取可以被激活的元素
     * @return {BUI.Chart.Actived[]} 可以被激活的元素集合
     */
    getActiveItems : function(){
      return this.getItems();
    },
    _renderGroup : function(){
      var _self = this,
        group = _self.addGroup();
      _self.set('group',group);
    },
    //设置激活状态
    setItemActived : function(item,actived){
      var _self = this,
        circle = _self.get('circle'),
        activedCfg = _self.get('activeCircle');
      if(actived){
        item.attr(activedCfg);
        item.set('actived',true);
      }else{
        item.attr(circle);
        item.set('actived',false);
      }
    },
    //获取当前定位的点
    getTrackingInfo : function(){
      var _self = this,
        activedCircle = _self.getActived();
      return activedCircle && activedCircle.get('point');
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
    //添加冒泡
    addBubble : function(point){
      var _self = this,
        circle = _self.get('circle'),
        r = 5, //默认5
        radius,
        cfg = BUI.mix({},circle),
        shape;
      if(point.obj){
        r = point.obj['r'];
      }
      if(point.arr){
        r = point.arr[2];
      }
      radius = _self._getRadius(r);
      
      cfg.cx = point.x;
      cfg.cy = point.y;
      if(_self.get('animate') && Util.svg){
        cfg.r = 0;
        shape = _self.get('group').addShape('circle',cfg);
        shape.animate({
          r : radius
        },_self.get('duration'));
      }else{
        cfg.r = radius;
        shape = _self.get('group').addShape('circle',cfg);
      }

      shape.set('point',point);
      
    },
    _getRadius : function(r){
      return Math.pow(r,.75);
    },
     //鼠标hover
    onMouseOver : function(){
      var _self = this
      
      _self.get('group').on('mouseover',function(ev){
        var target = ev.target,
          shape = target.shape;
        _self.setItemActived(shape,true);
      });
    }, 
    //鼠标hover
    onMouseOut : function(){
      var _self = this
      
      _self.get('group').on('mouseout',function(ev){
        var target = ev.target,
          shape = target.shape;
        _self.setItemActived(shape,false);
      });
    }
  });

  return Bubble;
});