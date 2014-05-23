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
    Series = require('bui/chart/series'),
    maxPixel = 120, //坐标轴上的最大间距
    minPixel = 80; //坐标轴上最小间距

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

    },
    /**
     * @private
     * 缓存的层叠数据
     * @type {Array}
     */
    stackedData : {

    },
    /**
     * 可以设置数据序列共同的数据源
     * @type {Array}
     */
    data : {

    },
    /**
     * 活动子项的名称，用于组成 itemactived,itemunactived的事件
     * @protected
     * @type {String}
     */
    itemName : {
      value : 'series'
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
        triggerEvent = _self.get('tipGroup').get('triggerEvent'),
        canvas = _self.get('canvas');

      if (triggerEvent == 'click') {
        function __documentClick(ev){
          if(!$.contains(canvas.get('node'), ev.target)&&canvas.get('node') != ev.target){
            _self.onTriggerOut(ev);
            $(document).off('click', __documentClick);
          }
        }
        canvas.on('click',function(ev){
          _self.onCanvasMove(ev);
          setTimeout(function(){
            $(document).off('click', __documentClick).on('click', __documentClick);
          })
        });

      } else {
        canvas.on('mousemove',BUI.wrapBehavior(_self,'onCanvasMove'));
        canvas.on('mouseout',BUI.wrapBehavior(_self,'onMouseOut'));
      }
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
        _self.onMouseOut();
      }
    },
    // 处理隐藏tip事件
    onTriggerOut : function(ev){
      var _self = this,
        tipGroup = _self.get('tipGroup');
      _self.clearActivedItem();
      //标志从显示到隐藏
      if(tipGroup.get('visible')){
        if(tipGroup.get('shared')){
          BUI.each(_self.getVisibleSeries(),function(series){
            var markers = series.get('markersGroup');
            markers && markers.clearActivedItem();
          });
        }
        _self._hideTip();
      }
    },

    onMouseOut : function(ev){
      var _self = this;
      if(ev && ev.target != _self.get('canvas').get('none')){
        return;
      }
      _self.onTriggerOut(ev);

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
        sArray = _self.getSeries();
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
      var count = 0,
        renderer = this.get('tipGroup').get('pointRenderer');
      BUI.each(sArray,function(series,index){
        var info = series.getTrackingInfo(point),
            item = {},
            title;

        if(info){
          if(series.get('visible')){
            count = count + 1;
            item.name = series.get('name');
            item.value = renderer ? renderer(info,series) : series.getTipItem(info);
            item.color = info.color || series.get('color');
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
            title = series.get('xAxis').formatPoint(info.xValue);
          }else{
            title = info.xValue;
          }
          if(count == 1){
            rst.title =  title;
            if(info.x){
              rst.point.x = info.x;
              if(sArray.length == 1){
                rst.point.y = info.y;
              }else{
                rst.point.y = point.y;
              }
            }else{
              rst.point.x = point.x;
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
        tooltip.setPosition(point.x,point.y);
        _self.set('prePoint',point);
        if(!tooltip.get('visible')){
          tooltip.show();
        }
        tooltip.setTitle(title);
        tooltip.setItems(items);
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
      }else if(yAxis && !yAxis.isGroup){
        if(xAxis && xAxis.get('type') == 'circle'){
          yAxis.type = 'radius';
          yAxis.circle = xAxis;
        }
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
      }else if(!axis.ticks && type != 'circle'){
        axis.autoTicks = true; //标记是自动计算的坐标轴
      }
      if(type == 'category' && !axis.categories){
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
      if(axis.get('type') == 'category'){
        return this._caculateCategories(axis,name);
      }
      var _self = this,
        data = [],
        type = axis.get('type'),
        length = axis.getLength(),
        minCount = Math.floor(length / maxPixel),
        maxCount = Math.ceil(length / minPixel),
        stackType,
        series,
        min,
        max,
        interval,
        autoUtil,
        rst;
        if(type == 'number' || type == 'radius') {
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

      series = _self.getSeries();

      var cfg = {
        min : min,
        max : max,

        interval: interval
      };
      if(name == 'yAxis'){
        cfg.maxCount = maxCount;
        cfg.minCount = minCount;
        stackType = series[0].get('stackType');
      }
      if(stackType && stackType != 'none'){
        data = _self.getStackedData(axis,name);
      }else{
        data = _self.getSeriesData(axis,name);
      }
      if(data.length){
        cfg.data = data;

        rst =  autoUtil.caculate(cfg,stackType);
      }else{
        rst = {
          ticks : []
        };
      }


      return rst;

    },
    _caculateCategories : function(axis,name){
      var _self = this,
        data = _self.getSeriesData(axis,name),
        categories = [];
        if(data.length){
          categories = categories.concat(data[0]);
        }
      if(data.length > 1 && !_self.get('data')){ //不共享data时
        for (var i = 1; i < data.length; i++) {
          var arr = data[i];
          BUI.each(arr,function(value){
            if(!BUI.indexOf(value)){
              categories.push(value);
            }
          });
        };
      }
      return {
        categories : categories
      };
    },
    /**
     * 获取数据序列的数据
     * @protected
     * @param  {BUI.Chart.Axis} axis 坐标轴
     * @param  {String} name 坐标轴名称
     * @return {Array} 数据集合
     */
    getSeriesData : function(axis,name){
      var _self = this,
        data = [],
        series = _self.getVisibleSeries();
      axis = axis || _self.get('yAxis');
      name = name || 'yAxis';

      BUI.each(series,function(item){
        if(item.get(name) == axis){
          var arr = item.getData(name);
          if(arr.length){
            data.push(arr);
          }

        }
      });

      return data;
    },
    //转换数据,将json转换成数组
    _parseData : function(obj,fields){
      var rst = [];
      BUI.each(fields,function(key){
        rst.push(obj[key]);
      });
      return rst;
    },
    /**
     * @protected
     * 获取层叠数据
     * @param  {String} stackType 层叠类型
     * @param  {BUI.Chart.Axis} axis 坐标轴
     * @param  {String} name 坐标轴名称
     * @return {Array} 数据集合
     */
    getStackedData : function(axis,name){
      var _self = this,
        data,
        first
        stackedData = _self.get('stackedData'),
        arr = [];
      if(stackedData){
        arr = stackedData;
      }else{
        data = _self.getSeriesData(axis,name);
        first = data[0],
        min = null;

        BUI.each(first,function(value,index){
          var temp = value;
          for(var i = 1 ; i< data.length; i++){
            var val = data[i][index];
            temp += val;
            if(min == null || val < min){
              min = val;
            }
          }
          arr.push(temp);
        });
        arr.push(min);
        _self.set('stackedData',arr);
      }

      return arr;
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
        if(_self._hasRelativeSeries(item,name)){
          if(item.get('autoTicks')){
            var info = _self._caculateAxisInfo(item,name);
            item.changeInfo(info);

          }

          item.paint();
        }

      });

    },
    //是否存在关联的数据序列
    _hasRelativeSeries : function(axis,name){
      var _self = this,
        series = _self.getVisibleSeries(),
        rst = false;

      BUI.each(series,function(item){
        if(item.get(name) == axis){
          rst = true;
          return false;
        }
      });
      return rst;

    },
    //数据变化或者序列显示隐藏引起的坐标轴变化
    _resetAxis : function(axis,type){

      if(!axis.get('autoTicks')){
        return;
      }
      type = type || 'yAxis';

      this.set('stackedData',null);

      var _self = this,
        info = _self._caculateAxisInfo(axis,type),
        series = _self.getSeries();

      //如果是非自动计算坐标轴，不进行重新计算

      axis.change(info);
    },
    _resetSeries : function(){
      var _self = this,
        series = _self.getSeries();
      BUI.each(series,function(item){
        if(item.get('visible')){
          item.repaint();
        }
      });
    },
    /**
     * 重新绘制数据序列
     */
    repaint : function(){
      var _self = this,
        xAxis = _self.get('xAxis'),
        yAxis = _self.get('yAxis');
      xAxis && _self._resetAxis(xAxis,'xAxis');
      if(yAxis){
        if(BUI.isArray(yAxis)){
          BUI.each(yAxis,function(axis){
            _self._resetAxis(axis,'yAxis');
          });
        }else{
          _self._resetAxis(yAxis,'yAxis');
        }
      }
      _self._resetSeries();
    },
    /**
     * 改变数据
     * @param  {Array} data 数据
     */
    changeData : function(data){
      var _self = this,
        series = _self.getSeries(),
        fields = _self.get('fields');

      _self.set('data',data);

      BUI.each(series,function(item,index){
        if(fields){
          var arr = _self._getSeriesData(item.get('name'),index);
          item.changeData(arr);
        }else{
          item.changeData(data);
        }
      });
      _self.repaint();
    },
    //根据series获取data
    _getSeriesData : function(name,index){
      var _self = this,
        data = _self.get('data'),
        fields = _self.get('fields'),
        obj = data[index];
      if(name){
        BUI.each(data,function(item){
          if(item.name == name){
            obj = item;
            return false;
          }
        });
      }
      return _self._parseData(obj,fields);
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
    /**
     * 获取显示的数据序列
     * @return {BUI.Chart.Series[]} 数据序列集合
     */
    getVisibleSeries : function(){
      var _self = this,
        series = _self.getSeries();
      return BUI.Array.filter(series,function(item){
        return item.get('visible');
      });
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
        series = _self.getSeries();

      BUI.each(series,function(item){
        item.paint();
      });
    },
    _addSeriesAxis : function(){
      var _self = this,
        series = _self.getSeries();

      BUI.each(series,function(item){
        if(item.get('type') == 'pie'){
          return true;
        }
        //x轴
        if(!item.get('xAxis')){
          item.set('xAxis', _self.get('xAxis'));
        }
        //y轴
        var yAxis = _self.get('yAxis');

        if(item.get('yAxis') == null){
          if(BUI.isArray(yAxis)){
            item.set('yAxis',yAxis[0]);
          }else{
            item.set('yAxis',yAxis);
          }
        }
        //多个y轴时
        if(BUI.isNumber(item.get('yAxis'))){
          item.set('yAxis',yAxis[item.get('yAxis')]);
        }
      });

    },
    /**
     * 显示series
     * @param  {BUI.Chart.Series} series 数据序列对象
     */
    showSeries : function(series){
      var _self = this,
        yAxis = _self.get('yAxis');
      if(!series.get('visible')){
        series.show();
        if(yAxis){
          _self._resetAxis(yAxis);
          _self._resetSeries();
        }
      }
    },
    /**
     * 隐藏series
     * @param  {BUI.Chart.Series} series 数据序列对象
     */
    hideSeries : function(series){
      var _self = this,
        yAxis = _self.get('yAxis');
      if(series.get('visible')){
        series.hide();
        if(yAxis){
          _self._resetAxis(yAxis);
          _self._resetSeries();
        }
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
        data = _self.get('data'),
        fields = _self.get('fields'),
        symbols = _self.get('symbols');

      item = BUI.mix(true,{},seriesCfg[type + 'Cfg'],item);

      //颜色
      if(!item.color && colors.length){
        item.color = colors[index % (colors.length)];
      }
      //marker的形状
      if(item.markers && item.markers.marker && !item.markers.marker.symbol){
        item.markers.marker.symbol = symbols[index % symbols.length];
      }
      if(data && !item.data){
        if(fields){
          item.data = _self._getSeriesData(item.name,index);
        }else{
          item.data = data;
        }

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
      canvas.off('mouseout',BUI.getWrapBehavior(_self,'onMouseOut'));

      Group.superclass.remove.call(_self);
    }

  });

  return Group;
});
