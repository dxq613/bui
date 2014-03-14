/**
 * @fileOverview 图表控件
 * @ignore
 */
define('bui/chart/chart',['bui/common','bui/graphic','bui/chart/plotback','bui/chart/theme'],function (require) {
  
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
   */
  var Chart = BUI.Component.Controller.extend({

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
          title.y = 15;
        }
        title = BUI.mix({},theme.title,title);
        canvas.addShape('label',title);
      }
      if(subTitle){
        if(subTitle.x == null){
          subTitle.x = canvas.get('width')/2;
          subTitle.y = 35;
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
       * 应用的样式
       * @type {Object}
       */
      theme : {
        value : Theme.Base
      }
    }
  },{
    xclass : 'chart'
  });

  return Chart;
});