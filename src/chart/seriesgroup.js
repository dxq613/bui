/**
 * @fileOverview 所有数据图形序列的容器,管理这些序列的增删，active状态，事件处理等等
 * @ignore
 */

define('bui/chart/seriesgroup',['bui/common','bui/chart/plotitem','bui/chart/legend'
  ,'bui/chart/activedgroup','bui/chart/series','bui/chart/tooltip','bui/chart/axis'],function (require) {

  var BUI = require('bui/common'),
    ActivedGroup = require('bui/chart/activedgroup'),
    PlotItem = require('bui/chart/plotitem'),
    Legend = require('bui/chart/legend'),
    Tooltip = require('bui/chart/tooltip'),
    Axis = require('bui/chart/axis'),
    Series = require('bui/chart/series');

  function min(x,y){
    return x > y ? y : x;
  }
  function max(x,y){
    return x > y ? x : y;
  }

  /**
   * @class BUI.Chart.SeriesGroup
   * 数据序列的容器
   * @protected
   */
  function Group(cfg){
    Group.superclass.constructor.call(this,cfg);
  }

  Group.ATTRS = {
    elCls : {
      value : 'x-chart-series-group'
    },
    zIndex : {
      value : 5
    },
    plotRange : {

    },
    /**
     * 存在多个序列时，线的颜色，marker的颜色
     * @type {Object}
     */
    colors : {
      value : ['#2f7ed8','#0d233a','#8bbc21','#910000','#1aadce','#492970','#f28f43','#77a1e5','#c42525','#a6c96a']
    },
    /**
     * 如果使用marker，那么不同图形序列的形状
     * @type {Array}
     */
    symbols : {
      value : ['circle','diamond','square','triangle','triangle-down']
    },
    /**
     * 序列图的统一配置项，不同的序列图有不同的配置项例如： 
     *
     *  - lineCfg : 折线图的配置项
     *  - columnCfg : 柱状图的配置项
     * @type {Object}
     */
    seriesOptions : {
      value : {}
    },
    /**
     * 数据图形序列的配置项
     * @type {Array}
     */
    series : {

    },
    /**
     * 图例
     * @type {Object}
     */
    legend : {

    },
    /**
     * x 坐标轴
     * @type {BUI.Chart.Axis}
     */
    xAxis : {

    },
    /**
     * y 坐标轴
     * @type {Array|BUI.Chart.Axis}
     */
    yAxis : {

    },
    /**
     * 提示信息的配置项
     * @type {Object}
     */
    tooltip : {

    }

  };

  BUI.extend(Group,PlotItem);

  BUI.mixin(Group,[ActivedGroup]);

  BUI.augment(Group,{

    
    //渲染控件
    renderUI : function(){
      var _self = this;
      Group.superclass.renderUI.call(_self);
      //_self._renderTracer();
      _self._renderLegend();
      
      _self._renderSeries();
      _self._renderAxis();
      _self._addSeriesAxis();

      _self._paintAxis(_self.get('xAxis'),'xAxis');
      _self._paintAxis(_self.get('yAxis'),'yAxis');
      _self._paintSeries();

      _self._renderTooltip();
    },
    //绑定事件
    bindUI : function(){
      var _self = this;
      Group.superclass.bindUI.call(_self);
      _self.bindCanvasEvent();
    },
    //绑定鼠标在画板上移动事件
    bindCanvasEvent : function(){
      var _self = this,
        canvas = _self.get('canvas');
      canvas.on('mousemove',BUI.wrapBehavior(_self,'onCanvasMove'));
    },
    //处理鼠标在画板上移动
    onCanvasMove : function(ev){
      var _self = this,
        canvas = _self.get('canvas'),
        tipGroup = _self.get('tipGroup'),
        point,
        tipInfo;

      if(!tipGroup){
        return;
      }

      point = canvas.getPoint(ev.pageX,ev.pageY);
      if(_self._isInAxis(point)){
        _self._processTracking(point,tipGroup);
      }else{
        //标志从显示到隐藏
        if(tipGroup.get('visible')){
          _self.clearActived();
          if(tipGroup.get('shared')){
            BUI.each(_self.get('children'),function(series){
              var markers = series.get('markersGroup');
              markers && markers.clearActived();
            });
          }
          _self._hideTip();
        }
      }
    },
    /**
     * 获取所有的数据序列
     * @return {Array} [description]
     */
    getSeries : function(){
      return this.get('children');
    },
    //处理鼠标跟随事件
    _processTracking : function(point,tipGroup){
      var _self = this,
        sArray = [],
        //prePoint = _self.get('prePoint'),
        tipInfo;


      if(!tipGroup.get('shared')){
        var activedItem = _self.getActived();
        activedItem && sArray.push(activedItem);
      }else{
        sArray = _self.get('children');
      }

      BUI.each(sArray,function(series){
        if(series && series.get('stickyTracking') && series.get('visible')){
          series.onStickyTracking({point : point});
        }
      });
      if(sArray.length){
        tipInfo = _self._getTipInfo(sArray,point);
        if(tipInfo.items.length){
          _self._showTooltip(tipInfo.title,tipInfo.point,tipInfo.items);
        }
        
      }
    },
    //获取显示tooltip的内容
    _getTipInfo : function(sArray,point){
      var rst = {
        items : [],
        point : {}
      };

      BUI.each(sArray,function(series,index){
        var info = series.getTrackingInfo(point),
            item = {},
            title;
        
          
        if(info){
          if(series.get('visible')){
            item.name = series.get('name');
            item.value = info.value;
            item.color = series.get('color');
            rst.items.push(item);
            var markersGroup = series.get('markersGroup');
            if(markersGroup && markersGroup.get('single')){
              var marker = markersGroup.getChildAt(0);
              marker && marker.attr({
                x :info.x,
                y : info.y
              });

            }
          }
          if(series.get('xAxis')){
            title = series.get('xAxis').formatPoint(info.originValue);
          }else{
            title = info.originValue;
          }
          if(index == 0){
            rst.title =  title;
            rst.point.x = info.x;
            if(sArray.length == 1){
              rst.point.y = info.y;
            }else{
              rst.point.y = point.y;
            }
          }
        }
      });

      return rst;
    },
    //显示tooltip
    _showTooltip : function(title,point,items){
      var _self = this,
        tooltip = _self.get('tipGroup'),
        prePoint = _self.get('prePoint');
      if(!prePoint || prePoint.x != point.x || prePoint.y != point.y){
        tooltip.setTitle(title);
        tooltip.setItems(items);
        tooltip.setPosition(point.x,point.y);
        if(!tooltip.get('visible')){
          tooltip.show();
        }
        _self.set('prePoint',point);
      }
    },
    //隐藏tip
    _hideTip : function(){
      var _self = this,
        tipGroup = _self.get('tipGroup');
      if(tipGroup && tipGroup.get('visible')){
        tipGroup.hide();
        _self.set('prePoint',null);
      }
    },
    //是否在坐标系内
    _isInAxis : function(point){
      var _self = this,
        plotRange = _self.get('plotRange');

      return plotRange.isInRange(point);
    },
    //渲染所有的序列
    _renderSeries : function(){
      var _self = this,
        series = _self.get('series');

      BUI.each(series,function(item,index){
        _self.addSeries(item,index);
      });
    },
    //渲染legend
    _renderLegend : function(){
      var _self = this,
        legend = _self.get('legend'),
        legendGroup;

      if(legend){
        legend.items = legend.items || [];
        legend.plotRange = _self.get('plotRange');
        legendGroup = _self.get('parent').addGroup(Legend,legend);
        _self.set('legendGroup',legendGroup);
      }
    },
    //渲染tooltip
    _renderTooltip : function(){
      var _self = this,
        tooltip = _self.get('tooltip'),
        tipGroup;
      if(tooltip){
        tooltip.plotRange = _self.get('plotRange');
        tipGroup = _self.get('parent').addGroup(Tooltip,tooltip);
        _self.set('tipGroup',tipGroup);
      }
    },
    _renderAxis : function(){
      var _self = this,
        xAxis = _self.get('xAxis'),
        yAxis = _self.get('yAxis');
      if(xAxis && !xAxis.isGroup){
        xAxis = _self._createAxis(xAxis);
        _self.set('xAxis',xAxis);
      }

      if(BUI.isArray(yAxis) && !yAxis[0].isGroup){ //如果y轴是一个数组
        var temp = [];
        BUI.each(yAxis,function(item){
          temp.push(_self._createAxis(item));
          _self.set('yAxis',temp);
        });
      }

      if(yAxis && !yAxis.isGroup){
        
        yAxis = _self._createAxis(yAxis);
        _self.set('yAxis',yAxis);
      }
    },
    //创建坐标轴
    _createAxis : function(axis){
      var _self = this,
        type = axis.type,
        C,
        name;
      if(axis.categories){
        type = 'category';
      }else if(!axis.ticks){
        axis.autoTicks = true; //标记是自动计算的坐标轴
      }
      axis.plotRange = _self.get('plotRange');
      axis.autoPaint = false;  //暂时不绘制坐标轴，需要自动生成坐标轴

      type = type || 'number';
      name = BUI.ucfirst(type);
      C = Axis[name];
      if(C){
        return  _self.get('parent').addGroup(C,axis);
      }
      return null;
    },
    //获取y轴的坐标点
    _caculateAxisInfo : function(axis,name){
      var _self = this,
        data = [],
        type = axis.get('type'),
        series,
        min,
        max,
        interval,
        autoUtil;
        if(type == 'number') {
          min = axis.getCfgAttr('min');
          max = axis.getCfgAttr('max');
          autoUtil = Axis.Auto;
        }else if(type == 'time'){
          var startDate = axis.get('startDate'),
            endDate = axis.get('endDate');
          if(startDate){
            min = startDate.getTime();
          }
          if(endDate){
            max = endDate.getTime();
          }
          autoUtil = Axis.Auto.Time;
        }
        
        interval = axis.getCfgAttr('tickInterval');
      
      series = _self.get('children');
      BUI.each(series,function(item){
          if(item.get('visible') && item.get(name) == axis){
            data.push(_self.getSeriesData(item,name));
          }
      });

      var rst =  autoUtil.caculate({
        data : data,
        min : min,
        max : max,
        interval: interval
      });

      return rst;

    },
    getSeriesData : function(series,name){
      var _self = this,
        data,
        first;
      return series.getData(name);
    },
    //name 标示是xAxis ,yAxis and so on
    _paintAxis : function(axis,name){
      var _self = this,
        arr;

      if(BUI.isArray(axis)){
        arr = axis;
      }else{
        arr = [axis];
      }

      BUI.each(arr,function(item,index){
        if(item.get('autoTicks')){
          var info = _self._caculateAxisInfo(item,name);
          item.set('tickInterval',info.interval);
          item.set('ticks',info.ticks);
        }
        
        item.paint();
      });
      
    },
    //数据变化或者序列显示隐藏引起的坐标轴变化
    _resetAxis : function(axis){
      var _self = this,
        info = _self._caculateAxisInfo(axis,'yAxis'),
        series = _self.get('children');
      //如果是非自动计算坐标轴，不进行重新计算
      if(!axis.get('autoTicks')){
        return;
      }
      axis.change(info);
      BUI.each(series,function(item){
        if(item.get('yAxis') == axis && item.get('visible')){
          item.repaint();
        }
      });
    },
    //获取默认的类型
    _getDefaultType : function(){
      var _self = this,
        seriesCfg = _self.get('seriesOptions'),
        rst = 'line'; //默认类型是线
      BUI.each(seriesCfg,function(v,k){
        rst = k.replace('Cfg','');
        return false;
      });
      return rst;
    },
    getVisibleSeries : function(){
    },
    /**
     * 添加数据序列
     * @param {BUI.Chart.Series} item 数据序列对象
     */
    addSeries : function(item,index){
      var _self = this,
        type = item.type || _self._getDefaultType(),
        cons = _self._getSeriesClass(type),
        cfg = _self._getSeriesCfg(type,item,index),
        series ;
      cfg.autoPaint = cfg.autoPaint || false;

      series  = _self.addGroup(cons,cfg);
      _self._addLegendItem(series);
      return series;
    },
    //绘制数据线
    _paintSeries : function(){
      var _self = this,
        series = _self.get('children');

      BUI.each(series,function(item){
        item.paint();
      });
    },
    _addSeriesAxis : function(){
      var _self = this,
        series = _self.get('children');

      BUI.each(series,function(item){
        //x轴
        if(!item.get('xAxis')){
          item.set('xAxis', _self.get('xAxis'));
        }
        //y轴
        var yAxis = _self.get('yAxis');

        if(item.get('yAxis') == null){
          if(BUI.isArray(yAxis)){
            item.set('yAxis') = yAxis[0];
          }else{
            item.set('yAxis',yAxis);
          }
        }
        //多个y轴时
        if(BUI.isNumber(item.get('yAxis'))){
          item.set('yAxis',yAxis[item.yAxis]);
        }
      });
      
    },
    /**
     * 显示series
     * @param  {BUI.Chart.Series} series 数据序列对象
     */
    showSeries : function(series){
      var _self = this;
      if(!series.get('visible')){
        series.show();
        _self._resetAxis(series.get('yAxis'));
      }
    },
    /**
     * 隐藏series
     * @param  {BUI.Chart.Series} series 数据序列对象
     */
    hideSeries : function(series){
      var _self = this;
      if(series.get('visible')){
        series.hide();
        _self._resetAxis(series.get('yAxis'));
      }
    },
    _addLegendItem : function(series){
      var _self = this,
        legendGroup = _self.get('legendGroup');
      legendGroup && legendGroup.addItem({
        series : series
      });
    },
    //获取序列的配置信息
    _getSeriesCfg : function(type,item,index){
      var _self = this,
        seriesCfg = _self.get('seriesOptions'),
        colors = _self.get('colors'),
        symbols = _self.get('symbols');

      item = BUI.mix(true,{},seriesCfg[type + 'Cfg'],item);

      //颜色
      if(!item.color && colors.length){
        item.color = colors[index % (colors.length)];
      }
      //marker的形状
      if(item.markers && !item.markers.marker.symbol){
        item.markers.marker.symbol = symbols[index % symbols.length];
      }
      
      return item;
    },
    //根据类型获取构造函数
    _getSeriesClass : function(type){
      var name = BUI.ucfirst(type),
        c = Series[name] || Series;
      return c;
    },
    remove : function(){
      var _self = this,
        canvas = _self.get('canvas');
      canvas.off('mousemove',BUI.getWrapBehavior(_self,'onCanvasMove'));
      Group.superclass.remove.call(_self);
    }

  });

  return Group;
});