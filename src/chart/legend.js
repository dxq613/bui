/**
 * @fileOverview 图例，用于标志具体的数据序列，并跟数据序列进行交互
 * @ignore
 */

define('bui/chart/legend',['bui/common','bui/chart/plotitem','bui/chart/legenditem'],function (require) {

  var BUI = require('bui/common'),
    PlotItem = require('bui/chart/plotitem'),
    Item = require('bui/chart/legenditem'),
    LINE_HEIGHT = 15,
    PADDING = 5;

  function min(x,y){
    return x > y ? y : x;
  }
  function max(x,y){
    return x > y ? x : y;
  }

  /**
   * @class BUI.Chart.Legend
   * 图例
   * @extends BUI.Chart.PlotItem
   * @mixins BUI.Chart.ActivedGroup
   */
  var Legend = function(cfg){
    Legend.superclass.constructor.call(this,cfg);
  };

  Legend.ATTRS = {
    zIndex : {
      value : 8
    },
    elCls : {
      value : 'x-chart-legend'
    },
    /**
     * 子项的配置项
     * @type {Array}
     */
    items : {

    },
    /**
     * 布局方式： horizontal，vertical
     * @type {String}
     */
    layout : {
      value : 'horizontal'
    },
    /**
     * 对齐位置的偏移量x
     * @type {Number}
     */
    dx : {
      value : 0
    },
    /**
     * 对齐位置的偏移量y
     * @type {Number}
     */
    dy : {
      value : 0
    },
    /**
     * 对齐方式,top,left,right,bottom
     * @type {String}
     */
    align : {
      value : 'bottom'
    },
    /**
     * 边框的配置项，一般是一个正方形
     * @type {Object}
     */
    back : {
      value : {
        stroke : '#909090',
        fill : '#fff'
      }
    }

  }

  BUI.extend(Legend,PlotItem);

  BUI.augment(Legend,{

    renderUI : function(){
      var _self = this
      Legend.superclass.renderUI.call(_self);
      _self._renderItems();
      _self._renderBorder();    
    },
    bindUI : function(){
      Legend.superclass.bindUI.call(_self);
      var _self = this;
      _self.on('mousemove',function(ev){
        ev.stopPropagation();
      });
    },
    _renderItems : function(){
      var _self = this,
        items = _self.get('items'),
        itemsGroup = _self.addGroup();

      _self.set('itemsGroup',itemsGroup);

      BUI.each(items,function(item,index){
        _self._addItem(item,index);
      });
    },
    /**
     * 添加图例
     * @param {Object} item 图例项的配置信息
     */
    addItem : function(item){
      var _self = this,
        items = _self.get('items');

      _self._addItem(item,items.length);
      _self.resetBorder();
      _self.resetPosition();
    },
    //添加图例
    _addItem : function(item,index){
      var _self = this,
        itemsGroup = _self.get('itemsGroup'),
        x = _self._getNextX(),
        y = _self._getNextY(),
        cfg = BUI.mix({x : x,y : y},item);

      cfg.legend = _self;
      itemsGroup.addGroup(Item,cfg);
    },

    //生成边框
    _renderBorder : function(){
      var _self = this,
        border = _self.get('back'),
        width,
        height,
        cfg,
        shape;

      if(border){
        width = _self._getTotalWidth();
        height = _self._getTotalHeight();

        cfg = BUI.mix({
          r: 5,
          width : width,
          height : height
        },border);

        shape = _self.addShape('rect',cfg);
        shape.toBack();
        _self.set('borderShape',shape);
      }
    },
    //重置边框
    resetBorder : function(){
      var _self = this,
        borderShape = _self.get('borderShape');
      if(borderShape){
        borderShape.attr({
          width : _self._getTotalWidth(),
          height : _self._getTotalHeight()
        });
      }
    },
    //定位
    resetPosition : function(){
      var _self = this,
        align = _self.get('align'),
        plotRange = _self.get('plotRange'),
        top = plotRange.tl,
        end = plotRange.br,
        dx = _self.get('dx'),
        dy = _self.get('dy'),
        width = _self._getTotalWidth(),
        x,y;
      switch(align){
        case 'top' :
          x = top.x;
          y = top.y;
          break;
        case 'left':
          x = top.x - width;
          y = (top.y + end.y)/2;
          break;
        case 'right':
          x = end.x;
          y = (top.y + end.y)/2;
          break;
        case 'bottom':
          x = (top.x + end.x) /2 - width/2;
          y = end.y;
        default : 
          break;
      }

     _self.move(x+dx,y+dy);

    },
    //获取总的个数
    _getCount : function(){

      return this.get('itemsGroup').get('children').length;
    },
    //获取下一个图例项的x坐标
    _getNextX : function(){
      var _self = this,
        layout = _self.get('layout'),
        
        nextX = PADDING;
      if(layout == 'horizontal'){
        var children = _self.get('itemsGroup').get('children');
        BUI.each(children,function(item){
          if(item.isGroup){
            nextX += (item.getWidth() + PADDING);
          }
        });
      }
      return nextX;
    },
    //获取下一个图例项的y坐标
    _getNextY : function(){
      var _self = this,
        layout = _self.get('layout');
      if(layout == 'horizontal'){
        return PADDING;
      }else{
        return LINE_HEIGHT * _self._getCount() + PADDING ;
      }
    },
    //获取总的宽度
    _getTotalWidth : function(){
      var _self = this;
      if(_self.get('layout') == 'horizontal'){
        return this._getNextX();
      }else{
        var children = _self.get('itemsGroup').get('children'),
          max = PADDING;
        BUI.each(children,function(item){
          var width = item.getWidth();
          if(item.isGroup && width > max){
            max = width;
          }
        });
        return max + PADDING * 2;
      }
      
    },
    //获取整体的高度
    _getTotalHeight : function(){
      var _self = this,
        nextY = _self._getNextY();

      if(_self.get('layout') == 'horizontal'){
        return LINE_HEIGHT + PADDING * 2;
      }
      return nextY + PADDING;
    }
  });

  return Legend;
});
