/**
 * @fileOverview 时间坐标轴
 * @ignore
 */

define('bui/chart/timeaxis',['bui/common','bui/chart/numberaxis'],function (require) {

  var BUI = require('bui/common'),
    NAixs = require('bui/chart/numberaxis');

  function parseTime(d){
    if(d instanceof Date){
      return d.getTime();
    }
    if(BUI.isNumber(d)){
      return d;
    }
    var date = d;
    if(BUI.isString(d)){
      date = d.replace('-','\/');
      date = new Date(date).getTime();
    }
    return date;
  }

  /**
   * @class BUI.Chart.Axis.Time
   * 时间坐标轴
   */
  var Time = function(cfg){
    Time.superclass.constructor.call(this,cfg)
  };

  Time.ATTRS = {

    /**
     * 开始日期时间
     * @type {Date}
     */
    startDate : {

    },
    dateFormat : {

    },
    /**
     * 结束日期时间
     * @type {Date}
     */
    endDate : {

    }
  };

  BUI.extend(Time,NAixs);

  BUI.augment(Time,{
    //渲染控件前
    beforeRenderUI : function(){
      var _self = this;
      
      
      var startTime = parseTime(_self.get('startDate')),
        endTime = parseTime(_self.get('endDate'));
      if(startTime && !_self.get('min')){
        _self.set('min',startTime);
      }
      if(endTime && !_self.get('max')){
        _self.set('max',endTime);
      }

      Time.superclass.beforeRenderUI.call(_self);

    }
  });

  return Time;
});