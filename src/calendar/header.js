/**
 * @fileOverview 日期控件来选择年月的部分
 * @ignore
 */

define('bui/calendar/header',['bui/common'],function (require) {
  
  var BUI = require('bui/common'),
    PREFIX = BUI.prefix,
    Component = BUI.Component,
    CLS_TEXT_YEAR = 'year-text',
    CLS_TEXT_MONTH = 'month-text',
    CLS_ARROW = 'x-datepicker-arrow',
    CLS_PREV = 'x-datepicker-prev',
    CLS_NEXT = 'x-datepicker-next';
      
  /**
   * 日历控件显示选择年月
   * xclass:'calendar-header'
   * @class BUI.Calendar.Header
   * @private
   * @extends BUI.Component.Controller
   */
  var header = Component.Controller.extend({

    bindUI : function(){
      var _self = this,
        el = _self.get('el');
		
      el.delegate('.' + CLS_ARROW,'click',function(e){
        e.preventDefault();
        var sender = $(e.currentTarget);
        if(sender.hasClass(CLS_NEXT)){
          _self.nextMonth();
        }else if(sender.hasClass(CLS_PREV)){
          _self.prevMonth();
        }
      });

      el.delegate('.x-datepicker-month','click',function(){
        _self.fire('headerclick');
      });
	  
    },
    /**
     * 设置年月
     * @ignore
     * @param {Number} year  年
     * @param {Number} month 月
     */
    setMonth : function(year,month){
      var _self = this,
        curYear = _self.get('year'),
        curMonth = _self.get('month');
      if(year !== curYear || month !== curMonth){
        _self.set('year',year);
        _self.set('month',month);
        _self.fire('monthchange',{year:year,month:month});
      }
    },
    /**
     * 下一月
     * @ignore
     */
    nextMonth : function(){
      var _self = this,
        date = new Date(_self.get('year'),_self.get('month') + 1);

      _self.setMonth(date.getFullYear(),date.getMonth());
    },
    /**
     * 上一月
     * @ignore
     */
    prevMonth : function(){
      var _self = this,
        date = new Date(_self.get('year'),_self.get('month') - 1);

       _self.setMonth(date.getFullYear(),date.getMonth());
    },
    _uiSetYear : function(v){
      var _self = this;
      _self.get('el').find('.' + CLS_TEXT_YEAR).text(v);
    },
    _uiSetMonth : function(v){
        var _self = this;
      _self.get('el').find('.' + CLS_TEXT_MONTH).text(v+1);
    }

  },{
    ATTRS : {
      /**
       * 年
       * @type {Number}
       */
      year:{
        sync:false
      },
      /**
       * 月
       * @type {Number}
       */
      month:{
        sync:false,
        setter:function(v){
          this.set('monthText',v+1);
        }
      },
      /**
       * @private
       * @type {Object}
       */
      monthText : {
        
      },
      tpl:{
        view:true,
        value:'<div class="'+CLS_ARROW+' ' + CLS_PREV + '"><span class="icon icon-white icon-caret  icon-caret-left"></span></div>'+
          '<div class="x-datepicker-month">'+
            '<div class="month-text-container">'+
              '<span><span class="year-text">{year}</span>年 <span class="month-text">{monthText}</span>月</span>'+
              '<span class="' + PREFIX + 'caret ' + PREFIX + 'caret-down"></span>'+
            '</div>'+
          '</div>' +
          '<div class="'+CLS_ARROW+' ' + CLS_NEXT + '"><span class="icon icon-white icon-caret  icon-caret-right"></span></div>'
      },
      elCls:{
        view:true,
        value:'x-datepicker-header'
      },
  	  events:{
    		value:{
          /**
           * 月发生改变，年发生改变也意味着月发生改变
           * @event
           * @param {Object} e 事件对象
           * @param {Number} e.year 年
           * @param {Number} e.month 月
           */
    			'monthchange' : true
    		}
  	  }
    }
  },{
    xclass:'calendar-header'
  });

  return header;

});