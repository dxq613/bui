/**
 * @fileOverview 坐标轴的基类
 * @ignore
 */

define('bui/chart/pie',['bui/common','bui/graphic','bui/chart/plotitem','bui/chart/grid','bui/chart/showlabels'],function(require) {

  var BUI = require('bui/common'),
    Item = require('bui/chart/plotitem'),
    Grid = require('bui/chart/grid'),
    Util = require('bui/graphic').Util,
    ShowLabels = require('bui/chart/showlabels'),
    CLS_Pie = 'x-chart-Pie';

  /**
   * @class BUI.Chart.Pie
   * 饼图
   * @extends BUI.Chart.PlotItem
   */
  function Pie(cfg){
    Pie.superclass.constructor.call(this,cfg);
  }

  Pie.ATTRS = {
    zIndex : {
      value : 4
    },
    /**
     * 显示数据的图形范围
     */
    data:[]

  };

  BUI.extend(Pie,Item);

  // BUI.mixin(Pie,[ShowLabels]);

  BUI.augment(Pie,{
    beforeRenderUI : function(){
      // alert("asdf")
    },
    renderUI : function(){
      var _self = this;

      Pie.superclass.renderUI.call(_self);

    },
    showDatas : function(){
      var _self = this;
      return _self.get('data');
    }
  });

  return Pie;
});