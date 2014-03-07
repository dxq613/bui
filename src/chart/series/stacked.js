/**
 * @fileOverview 处理层叠的数据序列的扩展
 * @ignore
 */

define('bui/chart/series/stacked',function (require) {
  
  var BUI = require('bui/common');

  /**
   * @class BUI.Chart.Series.Stacked
   * @protected
   * 此类是一个扩展，不应该直接实例化,主要用于区域图，柱状图层叠的场景
   */
  var Stacked = function(){

  };

  Stacked.ATTRS = {
    /**
     * 数据序列层叠的类型
     *   - none : 不进行层叠
     *   - normal : 一般的层叠方式，后面的数据序列的y值在前一个数据序列基础上显示
     *   - percent : 按照百分比进行层叠展示
     * @type {String}
     */
    stackType : {
      value : 'none'
    }
  };

  BUI.augment(Stacked,{

    processStackedPoint : function(point,index){
      var _self = this,   
        pre = _self.getVisiblePrev();

      if(pre){
        var prePoint = pre.getPoints()[index],
          baseValue = _self.getBaseValue();
        point.y = point.y + prePoint.y - baseValue;
        point.lowY = prePoint.y;
      }
    },
    /**
     * @protected
     * 获取数据中的比例
     */
    getStackedPercent : function(value,index){
      var _self = this,
        data = _self.get('parent').getStackedData(_self.get('yAxis'),'yAxis'),
        total = data[index];
      if(total){
        return value/total;
      }
      return NaN;
    },  
    /**
     * @protected
     * 转换显示的值，一般用于层叠的数据序列中
     */
    parseYValue : function(value){
      var _self = this,
        stackType = _self.get('stackType'),
        data = _self.get('data'),
        index = BUI.Array.indexOf(value,data),
        percentValue;
      if(stackType == 'percent'){
        percentValue = _self.getStackedPercent(value,index);
        value = percentValue * 100;
      }
      return value;
    },
    /**
     * @protected
     * 获取显示的前一个序列
     */
    getVisiblePrev : function(){
      var _self = this,
        parent = _self.get('parent'),
        yAxis = _self.get('yAxis'),
        children = parent.get('children'),
        pre;

      BUI.each(children,function(series,i){
        if(series == _self){
          return false;
        }
        if(series.get('visible') && series.get('yAxis') == yAxis){ //获取前一个显示的数据序列
          pre = series;
        }
      });
      return pre;
    },
    /**
     * 是否是层叠的数据序列
     * @return {Boolean} 
     */
    isStacked : function(){
      var _self = this,
        stackType = _self.get('stackType');
      return stackType && stackType !== 'none';
    }

  });

  return Stacked;
});