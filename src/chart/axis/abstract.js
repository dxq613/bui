/**
 * @fileOverview 抽象的坐标轴
 * @ignore
 */

define('bui/chart/abstractaxis',function (require) {
  
  var BUI = require('bui/common'),
    Item = require('bui/chart/plotitem'),
    Grid = require('bui/chart/grid'),
    Util = require('bui/graphic').Util,
    ShowLabels = require('bui/chart/showlabels'),
    CLS_AXIS = 'x-chart-axis';

  /**
   * @class BUI.Chart.Axis.Abstract
   * 抽象的坐标轴类
   * @extends BUI.Chart.PlotItem
   * @mixin BUI.Chart.ShowLabels
   */
  var Abstract = function(cfg){
    Abstract.superclass.constructor.call(this,cfg);
  };

  Abstract.ATTRS = {

    /**
     * 坐标轴上的坐标点
     * @type {Number}
     */
    ticks : {

    },
    /**
     * 显示数据的图形范围
     */
    plotRange : {

    },
    /**
     * 坐标轴线的配置信息,如果设置成null，则不显示轴线
     * @type {Object}
     */
    line : {
        
    },
    /**
     * 标注坐标线的配置
     * @type {Object}
     */
    tickLine : {
        
    },
    /**
     * 栅格配置
     * @type {Object}
     */
    grid : {

    },
    /**
     * 坐标轴上的文本
     * @type {Object}
     */
    labels : {

    },
    /**
     * 是否自动绘制
     * @type {Object}
     */
    autoPaint : {
        value : true
    },
    /**
     * 格式化坐标轴上的节点
     * @type {Function}
     */
    formatter : {

    }
  }

  BUI.extend(Abstract,Item);

  BUI.mixin(Abstract,[ShowLabels]);

  BUI.augment(Abstract,{
    beforeRenderUI : function(){
      Abstract.superclass.beforeRenderUI.call(this);
      this.set('pointCache',[]);
    },
     /**
     * @protected
     * 渲染控件
     */
    renderUI : function(){
        var _self = this;
        Abstract.superclass.renderUI.call(_self);

        _self.renderLabels();
        
        if(_self.get('title')){
            _self._renderTitle();
        }
        if(_self.get('autoPaint')){
            _self.paint();
        }
    },
    /**
     * 绘制坐标轴
     */
    paint : function(){
        var _self = this;
        _self._drawLines();
        _self._renderTicks();
        _self._renderGrid(); 
    },
    //渲染标题
    _renderTitle : function(){
        

    },
    //渲染栅格
    _renderGrid : function(){
        var _self = this,
            grid = _self.get('grid'),
            gridGroup,
            plotRange;
        if(!grid){
            return;
        }
        gridGroup = _self.get('parent').addGroup(Grid,grid);
        _self.set('gridGroup',gridGroup);
    },
    /**
     * 是否在坐标轴内
     * @return {Boolean} 是否在坐标轴内
     */
    isInAxis : function(x,y){
      var _self = this,
        plotRange = _self.get('plotRange');
    
      return plotRange && plotRange.isInRange(x,y);
    },
    /**
     * @protected
     * 获取坐标轴的path
     * @return {String|Array} path
     */
    getLinePath : function(){

    },
    //获取坐标轴上的节点位置
    getOffsetPoint : function(index){

    },
    /**
     * 根据画板上的点获取坐标轴上的值，用于将cavas上的点的坐标转换成坐标轴上的坐标
     * @param  {Number} offset 
     * @return {Number} 点在坐标轴上的值
     */
    getValue : function(offset){

    },
    /**
     * 获取逼近坐标点的值
     * @param  {Number} offset 画布上的点在坐标轴上的对应值
     * @param {Number} [tolerance] 容忍的区间
     * @return {Number} 坐标轴上的值
     */
    getSnapValue : function(offset,tolerance){
        var _self = this,
            pointCache = _self.get('pointCache');
        return Util.snapTo(pointCache,offset);
            
    },
    /**
     * 获取坐标点的个数
     * @return {Number} 坐标点的个数
     */
    getTicksCount : function(){
      return this.get('ticks').length;
    },
    /**
     * @protected
     * 获取显示坐标点的位置
     */
    getTickOffsetPoint : function(index){
        return this.getOffsetPoint(index);
    },
    /**
     * 将指定的节点转换成对应的坐标点
     * @param  {Number} index 顺序 
     * @return {Number} 节点坐标点（单一坐标）x轴的坐标点或者y轴的坐标点
     */
    getOffsetByIndex : function(index){
       
    },
    _drawLines : function(){
      var _self = this,
          lineAttrs = _self.get('line'),
          ticks = _self.get('ticks'),
          path;

      if(lineAttrs){
          path = _self.getLinePath();
          lineAttrs = BUI.mix({
            path : path
          },lineAttrs);
          var lineShape = _self.addShape({
              type :'path',
              elCls : CLS_AXIS + '-line',
              attrs :lineAttrs
          });
          _self.set('lineShape',lineShape);
      }
       _self._processTicks(ticks);
    },
    
    //处理节点
    _processTicks : function(ticks,reset){
       var _self = this,
          pointCache = _self.get('pointCache'),
          labels = _self.get('labels');

      ticks = ticks || _self.get('ticks');
      BUI.each(ticks,function(tick,index){
        var tickOffsetPoint = _self.getTickOffsetPoint(index),
              offsetPoint = _self.getOffsetPoint(index),
              offset = _self.getOffsetByIndex(index);

          pointCache.push(offset);
          if(_self.get('tickLine')){
              _self._addTickItem(tickOffsetPoint,offset);
          }
          if(_self.get('grid')){
              _self._addGridItem(tickOffsetPoint);
          }
          if(labels){
            if(!reset){
                _self.addLabel(_self.formatPoint(tick),offsetPoint,offset);
            }else{
              labels.items.push({
                  text : _self.formatPoint(tick),
                  x : offsetPoint.x,
                  y : offsetPoint.y
              });
            }
              
          }
      });
    },
    
    //渲染ticks
    _renderTicks : function(){
      var _self = this,
          tickItems = _self.get('tickItems'),
          lineAttrs = _self.get('tickLine'),
          path = '',
          cfg = BUI.mix({},lineAttrs);
      if(tickItems){
          BUI.each(tickItems,function(item){
              var subPath = BUI.substitute('M{x1} {y1}L{x2} {y2}',item);
              path += subPath;
          });
          
          delete cfg.value;
          cfg.path = path;

          var tickShape =  _self.addShape({
              type : 'path',
              elCls : CLS_AXIS + '-ticks',
              attrs : cfg
          });
          _self.set('tickShape',tickShape);
          
          
      }
    },
    //添加坐标轴上的坐标点
    _addTickItem : function(offsetPoint,offset){
        var _self = this,
            tickItems = _self.get('tickItems'),
            cfg = {
                x1 : offsetPoint.x,
                y1 : offsetPoint.y
            },
            end = _self.getTickEnd(cfg,offset);
        
        if(!tickItems){
            tickItems = [];
            _self.set('tickItems',tickItems);
        }
        BUI.mix(cfg,end);
        tickItems.push(cfg);
    },
    /**
     * @protected
     * 获取标示坐标点的线的终点
     */
    getTickEnd : function(start,offset){

    },
    /**
     * 格式化坐标轴上的节点，用于展示
     * @param  {*} value 格式化文本
     * @return {String}  格式化后的信息
     */
    formatPoint : function(value){
        var _self = this,
            formatter = _self.get('formatter');
        if(formatter){
            value = formatter.call(this,value);
        }
        return value;
    },
    //添加栅格节点
    _addGridItem : function(offsetPoint){
      var _self = this,
          grid = _self.get('grid'),
          plotRange = _self.get('plotRange'),
          item = {},
          cfg;
      if(!grid.items){
          grid.items = [];
      }
      cfg = _self.getGridItemCfg(offsetPoint);
      BUI.mix(item,cfg);
      grid.items.push(item);
    },
    /**
     * 获取栅格项的配置信息，一般是起始点信息
     * @protected
     */
    getGridItemCfg : function(offsetPoint){

    },
    //移除控件前移除对应的grid和labels
    remove : function(){
        
        var _self = this,
            gridGroup = _self.get('gridGroup'),
            labelsGroup = _self.get('labelsGroup');
        gridGroup && gridGroup.remove();
        _self.removeLabels();
        Abstract.superclass.remove.call(this);
    }
  });

  return Abstract;
});