/**
 * @fileOverview 图表控件
 * @ignore
 */
define('bui/chart/chart',['bui/common','bui/graphic','bui/chart/plotback','bui/chart/theme','bui/chart/seriesgroup'],function (require) {
  
  var BUI = require('bui/common'),
    PlotBack = require('bui/chart/plotback'),
    Graphic = require('bui/graphic'),
    SeriesGroup = require('bui/chart/seriesgroup'),
    Theme = require('bui/chart/theme');

  function mixIf(obj1,obj2){
    var rst = {},
      isMerge = false;
    BUI.each(obj1,function(v,k){
      rst[k] = obj2[k];
      if(BUI.isObject(rst[k])){
        BUI.mix(true,rst[k],obj1[k]);
      }else{
        rst[k] = obj1[k];
      }
      
    });
    if(!isMerge){
      rst['lineCfg'] = obj2['lineCfg'];
    }
    return rst;

  }

  /**
   * @class BUI.Chart.Chart
   * 图，里面包括坐标轴、图例等图形
   * @extends BUI.Component.Controller
   * @mixins BUI.Component.UIBase.Bindable
   */
  var Chart = BUI.Component.Controller.extend([BUI.Component.UIBase.Bindable],{

    renderUI : function(){
      var _self = this;

      _self.paint();
    },
    /**
     * 清除图形
     */
    clear : function(){
      var _self = this,
        canvas = _self.get('canvas');
      canvas.destroy();
      _self.set('isPaint',false);
    },
    /**
     * 绘制整个图
     */
    paint : function(){
      var _self = this;
      if(!_self.get('isPaint')){
        _self._renderCanvas();
        _self._renderPlot();
        _self._renderTitle();
        _self._renderSeries();
        _self.get('canvas').sort();
      }
    },
    //渲染画板
    _renderCanvas : function(){
      var _self = this,
        el = _self.get('el'),
        width = _self.get('width') || el.width(),
        height = _self.get('height') || el.height(),
        canvas = new Graphic.Canvas({
          width : width,
          height :height,
          render : el
        });
      canvas.chart = _self;
      _self.set('canvas',canvas);
    },
    //渲染背景、边框等
    _renderPlot : function(){
      var _self = this,
        plotCfg = _self.get('plotCfg'),
        canvas = _self.get('canvas'),
        theme = _self.get('theme'),
        plotBack,
        plotRange;

      plotCfg = BUI.mix({},theme.plotCfg,plotCfg);
      plotBack = canvas.addGroup(PlotBack,plotCfg),
      plotRange = plotBack.get('plotRange');

      _self.set('plotRange',plotRange);

    },
    //渲染title
    _renderTitle : function(){
      var _self = this,
        title = _self.get('title'),
        subTitle = _self.get('subTitle'),
        theme = _self.get('theme'),
        canvas = _self.get('canvas');
      if(title){
        if(title.x == null){
          title.x = canvas.get('width')/2;
          title.y = title.y || 15;
        }
        title = BUI.mix({},theme.title,title);
        canvas.addShape('label',title);
      }
      if(subTitle){
        if(subTitle.x == null){
          subTitle.x = canvas.get('width')/2;
          subTitle.y = subTitle.y || 35;
        }
        subTitle = BUI.mix({},theme.subTitle,subTitle);
        canvas.addShape('label',subTitle);
      }
    },
    _getDefaultType : function(){
      var _self = this,
        seriesOptions = _self.get('seriesOptions'),
        rst = 'line'; //默认类型是线
      BUI.each(seriesOptions,function(v,k){
        rst = k.replace('Cfg','');
        return false;
      });
      return rst;
    },
    //渲染数据图序列
    _renderSeries : function(){
      var _self = this,
        theme = _self.get('theme'),
        cfg = {},
        attrs = _self.getAttrVals(),
        defaultType = _self._getDefaultType(),
        seriesGroup;

      BUI.each(attrs.series,function(item){
        if(!item.type){
          item.type = defaultType;
        }
      });
      BUI.mix(true,cfg,theme,{
        colors :  attrs.colors,
        data : attrs.data,
        fields : attrs.fields,
        plotRange : attrs.plotRange,
        series : attrs.series,
        seriesOptions : attrs.seriesOptions,
        tooltip : attrs.tooltip,
        legend : attrs.legend,
        xAxis : attrs.xAxis
      });

      if(BUI.isObject(attrs.yAxis)){
        BUI.mix(true,cfg,{
          yAxis : attrs.yAxis
        });
      }else if(BUI.isArray(attrs.yAxis)){
        attrs.yAxis[0] = BUI.merge(true,theme.yAxis,attrs.yAxis[0]);
        cfg.yAxis = attrs.yAxis;
      }


      seriesGroup = _self.get('canvas').addGroup(SeriesGroup,cfg);
      _self.set('seriesGroup',seriesGroup);

    },
    /**
     * 重绘整个图
     */
    repaint : function(){
      var _self = this;
      _self.get('seriesGroup').repaint();
    },
    /**
     * 获取所有的数据序列
     * @return {Array} 所有的数据序列数组
     */
    getSeries : function(){
      return this.get('seriesGroup').getSeries();
    },
     /**
     * 改变数据
     * @param  {Array} data 数据
     */
    changeData : function(data){
      var _self = this,
        group = _self.get('seriesGroup');
      if(data !== _self.get('data')){
        _self.set('data',data);
      }
      group.changeData(data);
    },
    //加载完成数据
    onLoad : function(){
      var _self = this,
        store = _self.get('store'),
        data = store.getResult();
      _self.changeData(data);
    },
    //添加数据
    onAdd : function(e){
      this.onLoad();
    },
    //移除数据
    onRemove : function(e){
      this.onLoad();
    },
    onUpdate : function(e){
      this.onLoad();
    },
    onLocalSort : function(e){
      this.onLoad();
    },
    destructor : function(){
      var _self = this;

      _self.clear();
    }
  },{
    ATTRS : {

      /**
       * 画板
       * <code>
       *  var canvas =  chart.get('canvas');
       * </code>
       * @type {BUI.Graphic.Canvas}
       */
      canvas : {

      },
      /**
       * 数据图例默认的颜色顺序
       * @type {Array}
       */
      colors : {

      },
      /**
       * 显示的数据
       * @type {Array}
       */
      data : {

      },
      /**
       * 标示每个图例颜色的配置项
       * @type {Object}
       */
      legend : {

      },
      /**
       * 菜单的配置项
       * @type {Object}
       */
      menu : {

      },
      /**
       * 绘图的配置，包括背景、边框等配置信息
       * @type {Object}
       */
      plotCfg : {

      },
      /**
       * @protected
       * 绘制图形的区域
       * @type {Object}
       */
      plotRange : {

      },
      /**
       * 数据图序列集合
       * @type {Array}
       */
      series : {

      },
      /**
       * 数据图序列默认的配置项
       * @type {Object}
       */
      seriesOptions : {

      },
      /**
       * 子标题
       * @type {String}
       */
      subTitle : {

      },
      /**
       * 标题
       * @type {String}
       */
      title : {

      },
      /**
       * 提示信息
       * @type {Object}
       */
      tooltip : {

      },
      /**
       * x 轴坐标
       * @type {Object|Array}
       */
      xAxis : {

      },

      /**
       * Y 轴坐标
       * @type {Object|Array}
       */
      yAxis : {

      },
      /**
       * 数据中使用的字段，用于转换数据使用例如： 
       *  - fields : ['intelli','force','political','commander']
       *  - 数据：
       * <pre><code>
       * [
       *  {"name" : "张三","intelli":52,"force":90,"political":35,"commander" : 85},
       *   {"name" : "李四","intelli":95,"force":79,"political":88,"commander": 72},
       *  {"name" : "王五","intelli":80,"force":42,"political":92,"commander": 50}
       * ]
       * </code></pre>
       *  - 转换成
       *  <pre><code>
       * [
       *   [52,90,35,85],
       *   [95,79,88,72],
       *   [80,42,92,50]
       * ]
       * </code></pre>
       * @type {Array}
       */
      fields : {
        
      },
      /**
       * 应用的样式
       * @type {Object}
       */
      theme : {
        value : Theme.Base
      }
      /**
       * @event seriesactived
       * 数据序列激活
       * @param {Object} ev 事件对象
       * @param {BUI.Chart.Series} ev.series 数据序列对象
       */
      
      /**
       * @event seriesunactived
       * 数据序列取消激活
       * @param {Object} ev 事件对象
       * @param {BUI.Chart.Series} ev.series 数据序列对象
       */
      
      /**
       * @event seriesitemactived
       * 数据序列的子项激活，一般用于饼图和柱状图
       * @param {Object} ev 事件对象
       * @param {BUI.Chart.Series} ev.seriesItem 数据序列子项
       * @param {BUI.Chart.Series} ev.series 数据序列对象
       */
      
      /**
       * @event seriesitemunactived
       * 数据序列的子项取消激活，一般用于饼图和柱状图
       * @param {Object} ev 事件对象
       * @param {BUI.Chart.Series} ev.seriesItem 数据序列子项
       * @param {BUI.Chart.Series} ev.series 数据序列对象
       */
      
      /**
       * @event seriesitemclick
       * 数据序列的子项的点击，一般用于饼图和柱状图
       * @param {Object} ev 事件对象
       * @param {BUI.Chart.Series} ev.seriesItem 数据序列子项
       * @param {BUI.Chart.Series} ev.series 数据序列对象
       */
      
      /**
       * @event seriesitemselected
       * 数据序列的子项选中，一般用于饼图和柱状图
       * @param {Object} ev 事件对象
       * @param {BUI.Chart.Series} ev.seriesItem 数据序列子项
       * @param {BUI.Chart.Series} ev.series 数据序列对象
       */
      
      /**
       * @event seriesitemunselected
       * 数据序列的子项取消选中，一般用于饼图和柱状图
       * @param {Object} ev 事件对象
       * @param {BUI.Chart.Series} ev.seriesItem 数据序列子项
       * @param {BUI.Chart.Series} ev.series 数据序列对象
       */
      
    }
  },{
    xclass : 'chart'
  });

  return Chart;
});