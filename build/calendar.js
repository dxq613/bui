/*! BUI - v0.1.0 - 2013-11-18
* https://github.com/dxq613/bui
* Copyright (c) 2013 dxq613; Licensed MIT */
define('bui/calendar',['bui/common','bui/calendar/calendar','bui/calendar/monthpicker','bui/calendar/datepicker'],function (require) {
  var BUI = require('bui/common'),
    Calendar = BUI.namespace('Calendar');
  BUI.mix(Calendar,{
    Calendar : require('bui/calendar/calendar'),
    MonthPicker : require('bui/calendar/monthpicker'),
    DatePicker : require('bui/calendar/datepicker')
  });

  return Calendar;
});
define('bui/calendar/monthpicker',['bui/common','bui/overlay','bui/list','bui/toolbar'],function (require){
  var BUI = require('bui/common'),
    Component = BUI.Component,
    Overlay = require('bui/overlay').Overlay,
    List = require('bui/list').SimpleList,
    Toolbar = require('bui/toolbar'),
	  PREFIX = BUI.prefix,
    CLS_MONTH = 'x-monthpicker-month',
    DATA_MONTH = 'data-month',
    DATA_YEAR = 'data-year',
    CLS_YEAR = 'x-monthpicker-year',
    CLS_YEAR_NAV = 'x-monthpicker-yearnav',
    CLS_SELECTED = 'x-monthpicker-selected',
    CLS_ITEM = 'x-monthpicker-item',
    months = ['\u4e00\u6708','\u4e8c\u6708','\u4e09\u6708','\u56db\u6708','\u4e94\u6708','\u516d\u6708','\u4e03\u6708','\u516b\u6708','\u4e5d\u6708','\u5341\u6708','\u5341\u4e00\u6708','\u5341\u4e8c\u6708'];

  function getMonths(){
    return $.map(months,function(month,index){
      return {text:month,value:index};
    });
  }

  var MonthPanel = List.extend({

    
    bindUI : function(){
      var _self = this;
      _self.get('el').delegate('a','click',function(ev){
        ev.preventDefault();
      }).delegate('.' + CLS_MONTH,'dblclick',function(){
        _self.fire('dblclick');
      });
    }
  },{
    ATTRS:{
      itemTpl:{
        view:true,
        value : '<li class="'+CLS_ITEM+' x-monthpicker-month"><a href="#" hidefocus="on">{text}</a></li>'
      },
      
      itemCls : {
        value : CLS_ITEM
      },
      items:{
        view:true,
        value:getMonths()
      },
      elCls : {
        view:true,
        value:'x-monthpicker-months'
      }
    }
  },{
    xclass:'calendar-month-panel'
  });


  var YearPanel = List.extend({

    bindUI : function(){
      var _self = this,
        el = _self.get('el');
      el.delegate('a','click',function(ev){
        ev.preventDefault();
      });

      el.delegate('.' + CLS_YEAR,'dblclick',function(){
        _self.fire('dblclick');
      });

      el.delegate('.x-icon','click',function(ev){
        var sender = $(ev.currentTarget);

        if(sender.hasClass(CLS_YEAR_NAV + '-prev')){
          _self._prevPage();
        }else if(sender.hasClass(CLS_YEAR_NAV + '-next')){
          _self._nextPage();
        }
      });
      _self.on('itemselected',function(ev){
        if(ev.item){
          _self.setInternal('year',ev.item.value);
        }
        
      });
    },
    _prevPage : function(){
      var _self = this,
        start = _self.get('start'),
        yearCount = _self.get('yearCount');
      _self.set('start',start - yearCount);
    },
    _nextPage : function(){
      var _self = this,
        start = _self.get('start'),
        yearCount = _self.get('yearCount');
      _self.set('start',start + yearCount);
    },
    _uiSetStart : function(){
      var _self = this;
      _self._setYearsContent();
    },
    _uiSetYear : function(v){
      var _self = this,
        item = _self.findItemByField('value',v);
      if(item){
        _self.setSelectedByField(v);
      }else{
        _self.set('start',v);
      }
    },
    _setYearsContent : function(){
      var _self = this,
        year = _self.get('year'),
        start = _self.get('start'),
        yearCount = _self.get('yearCount'),
        items = [];

      for(var i = start;i< start + yearCount;i++){
        var text = i.toString();

        items.push({text:text,value:i});
      }
      _self.set('items',items);
      _self.setSelectedByField(year);
    }

  },{
    ATTRS:{
      items:{
        view:true,
        value:[]
      },
      elCls : {
        view:true,
        value:'x-monthpicker-years'
      },
      itemCls : {
        value : CLS_ITEM
      },
      year:{

      },
      /**
       * \u8d77\u59cb\u5e74
       * @private
       * @ignore
       * @type {Number}
       */
      start:{
        value: new Date().getFullYear()
      },
      /**
       * \u5e74\u6570
       * @private
       * @ignore
       * @type {Number}
       */
      yearCount:{
        value:10
      },
      itemTpl : {
        view:true,
        value : '<li class="'+CLS_ITEM+' '+CLS_YEAR+'"><a href="#" hidefocus="on">{text}</a></li>'
      },
      tpl : {
        view:true,
        value:'<div class="'+CLS_YEAR_NAV+'">'+
              '<span class="'+CLS_YEAR_NAV+'-prev x-icon x-icon-normal x-icon-small"><span class="icon icon-caret icon-caret-left"></span></span>'+
              '<span class="'+CLS_YEAR_NAV+'-next x-icon x-icon-normal x-icon-small"><span class="icon icon-caret icon-caret-right"></span></span>'+
              '</div>'+
              '<ul></ul>'
      }
    }
  },{
    xclass:'calendar-year-panel'
  });
  
  /**
   * \u6708\u4efd\u9009\u62e9\u5668
   * xclass : 'calendar-monthpicker'
   * @class BUI.Calendar.MonthPicker
   * @extends BUI.Overlay.Overlay
   */
  var monthPicker = Overlay.extend({

    initializer : function(){
      var _self = this,
        children = _self.get('children'),
        monthPanel = new MonthPanel(),
        yearPanel = new YearPanel(),
        footer = _self._createFooter();

      children.push(monthPanel);
      children.push(yearPanel);
      children.push(footer);

      _self.set('yearPanel',yearPanel);
      _self.set('monthPanel',monthPanel);
    },
    bindUI : function(){
      var _self = this;

      _self.get('monthPanel').on('itemselected',function(ev){
        if(ev.item){
          _self.setInternal('month',ev.item.value);
        }
      }).on('dblclick',function(){
        _self._successCall();
      });

      _self.get('yearPanel').on('itemselected',function(ev){
        if(ev.item){
          _self.setInternal('year',ev.item.value);
        }
      }).on('dblclick',function(){
        _self._successCall();
      });

    },
    _successCall : function(){
      var _self = this,
        callback = _self.get('success');

      if(callback){
        callback.call(_self);
      }
    },
    _createFooter : function(){
      var _self = this;
      return new Toolbar.Bar({
          elCls : PREFIX + 'clear x-monthpicker-footer',
          children:[
            {
              xclass:'bar-item-button',
              text:'\u786e\u5b9a',
              btnCls: 'button button-small button-primary',
              handler:function(){
                _self._successCall();
              }
            },{
              xclass:'bar-item-button',
              text:'\u53d6\u6d88',
              btnCls:'button button-small last',
              handler:function(){
                var callback = _self.get('cancel');
                if(callback){
                  callback.call(_self);
                }
              }
            }
          ]
        });
    },
    _uiSetYear : function(v){
      this.get('yearPanel').set('year',v);
    },
    _uiSetMonth:function(v){
      this.get('monthPanel').setSelectedByField(v);
    }
  },{
    ATTRS:
    /**
     * @lends BUI.Calendar.MonthPicker#
     * @ignore
     */
    {
      /**
       * \u4e0b\u90e8\u5de5\u5177\u680f
       * @private
       * @type {Object}
       */
      footer : {

      },
      align : {
        value : {}
      },
      /**
       * \u9009\u4e2d\u7684\u5e74
       * @type {Number}
       */
      year : {
        
      },
      /**
       * \u6210\u529f\u7684\u56de\u8c03\u51fd\u6570
       * @type {Function}
       */
      success:{
        value : function(){

        }
      },
      /**
       * \u53d6\u6d88\u7684\u56de\u8c03\u51fd\u6570
       * @type {Function}
       */
      cancel :{

      value : function(){} 
 
      },
      width:{
        value:180
      },
      /**
       * \u9009\u4e2d\u7684\u6708
       * @type {Number}
       */
      month:{
        
      },
      /**
       * \u9009\u62e9\u5e74\u7684\u63a7\u4ef6
       * @private
       * @type {Object}
       */
      yearPanel : {

      },
      /**
       * \u9009\u62e9\u6708\u7684\u63a7\u4ef6
       * @private
       * @type {Object}
       */
      monthPanel:{

      }

    }
  },{
    xclass :'monthpicker'
  });
  return monthPicker;

});
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
   * \u65e5\u5386\u63a7\u4ef6\u663e\u793a\u9009\u62e9\u5e74\u6708
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
     * \u8bbe\u7f6e\u5e74\u6708
     * @ignore
     * @param {Number} year  \u5e74
     * @param {Number} month \u6708
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
     * \u4e0b\u4e00\u6708
     * @ignore
     */
    nextMonth : function(){
      var _self = this,
        date = new Date(_self.get('year'),_self.get('month') + 1);

      _self.setMonth(date.getFullYear(),date.getMonth());
    },
    /**
     * \u4e0a\u4e00\u6708
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
       * \u5e74
       * @type {Number}
       */
      year:{
        sync:false
      },
      /**
       * \u6708
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
              '<span><span class="year-text">{year}</span>\u5e74 <span class="month-text">{monthText}</span>\u6708</span>'+
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
           * \u6708\u53d1\u751f\u6539\u53d8\uff0c\u5e74\u53d1\u751f\u6539\u53d8\u4e5f\u610f\u5473\u7740\u6708\u53d1\u751f\u6539\u53d8
           * @event
           * @param {Object} e \u4e8b\u4ef6\u5bf9\u8c61
           * @param {Number} e.year \u5e74
           * @param {Number} e.month \u6708
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
define('bui/calendar/panel',['bui/common'],function (require) {

  var BUI = require('bui/common'),
    Component = BUI.Component,
    DateUtil = BUI.Date,
    CLS_DATE = 'x-datepicker-date',
    CLS_TODAY = 'x-datepicker-today',
    CLS_DISABLED = 'x-datepicker-disabled',
    CLS_ACTIVE = 'x-datepicker-active',
    DATA_DATE = 'data-date',//\u5b58\u50a8\u65e5\u671f\u5bf9\u8c61
    DATE_MASK = 'isoDate',
    CLS_SELECTED = 'x-datepicker-selected',
    SHOW_WEEKS = 6,//\u5f53\u524d\u5bb9\u5668\u663e\u793a6\u5468
    dateTypes = {
      deactive : 'prevday',
      active : 'active',
      disabled : 'disabled'
    },
    weekDays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

  /**
   * \u65e5\u5386\u9762\u677f\u7684\u89c6\u56fe\u7c7b
   * @class BUI.Calendar.PanelView
   * @extends BUI.Component.View
   * @private
   */
  var panelView = Component.View.extend({

    renderUI : function(){
      this.updatePanel();
    },

    //\u66f4\u65b0\u5bb9\u5668\uff0c\u5f53\u6708\u3001\u5e74\u53d1\u751f\u6539\u53d8\u65f6
    updatePanel : function(){
      var _self = this,
        el = _self.get('el'),
        bodyEl = el.find('tbody'),
        innerTem = _self._getPanelInnerTpl();

      bodyEl.empty();
      $(innerTem).appendTo(bodyEl);
    },
    //\u83b7\u53d6\u5bb9\u5668\u5185\u5bb9
    _getPanelInnerTpl : function(){
      var _self = this,
        startDate = _self._getFirstDate(),
        temps = [];

      for (var i = 0; i < SHOW_WEEKS; i++) {
        var weekStart = DateUtil.addWeek(i,startDate);
        temps.push(_self._getWeekTpl(weekStart));
      };

      return temps.join('');
    },
    //\u83b7\u53d6\u5468\u6a21\u7248
    _getWeekTpl : function(startDate){
      var _self = this,
        weekTpl = _self.get('weekTpl'),
        daysTemps = [];
      for (var i = 0; i < weekDays.length; i++) {
        var date = DateUtil.addDay(i,startDate);
        daysTemps.push(_self._getDayTpl(date));  
      }

      return BUI.substitute(weekTpl,{
        daysTpl:daysTemps.join('')
      });
    },
    //\u83b7\u53d6\u65e5\u6a21\u7248
    _getDayTpl : function(date){
      var _self = this,
        dayTpl = _self.get('dayTpl'),
        day = date.getDay(),
        todayCls = _self._isToday(date) ? CLS_TODAY:'',
        dayOfWeek = weekDays[day],
        dateNumber = date.getDate(),
        //\u4e0d\u662f\u672c\u6708\u5219\u5904\u4e8e\u4e0d\u6d3b\u52a8\u72b6\u6001
        //\u4e0d\u5728\u6307\u5b9a\u7684\u6700\u5927\u6700\u5c0f\u8303\u56f4\u5185\uff0c\u7981\u6b62\u9009\u4e2d
        dateType = _self._isInRange(date) ? (_self._isCurrentMonth(date) ? dateTypes.active : dateTypes.deactive) : dateTypes.disabled;

      return BUI.substitute(dayTpl,{
        dayOfWeek : dayOfWeek,
        dateType : dateType,
        dateNumber : dateNumber,
        todayCls : todayCls,
        date : DateUtil.format(date,DATE_MASK)
      });
    },
    //\u83b7\u53d6\u5f53\u524d\u5bb9\u5668\u7684\u7b2c\u4e00\u5929
    _getFirstDate : function(year,month){
      var _self = this,
        monthFirstDate = _self._getMonthFirstDate(year,month),
        day = monthFirstDate.getDay();
      return DateUtil.addDay(day * -1,monthFirstDate);
    },
    //\u83b7\u53d6\u5f53\u6708\u7684\u7b2c\u4e00\u5929
    _getMonthFirstDate : function(year,month){
      var _self = this,
        year = year || _self.get('year'),
        month = month || _self.get('month');
      return new Date(year,month);
    },
    //\u662f\u5426\u662f\u5f53\u524d\u663e\u793a\u7684\u6708
    _isCurrentMonth : function(date){
      return date.getMonth() === this.get('month');
    },
    //\u662f\u5426\u662f\u4eca\u5929
    _isToday : function(date){
      var tody = new Date();
      return tody.getFullYear() === date.getFullYear() && tody.getMonth() === date.getMonth() && tody.getDate() === date.getDate();
    },
    //\u662f\u5426\u5728\u5141\u8bb8\u7684\u8303\u56f4\u5185
    _isInRange : function(date){
      var _self = this,
        maxDate = _self.get('maxDate'),
        minDate = _self.get('minDate');

      if(minDate && date < minDate){
        return false;
      }
      if(maxDate && date > maxDate){
        return false;
      }
      return true;
    },
    //\u6e05\u9664\u9009\u4e2d\u7684\u65e5\u671f
    _clearSelectedDate : function(){
      var _self = this;
      _self.get('el').find('.'+CLS_SELECTED).removeClass(CLS_SELECTED);
    },
    //\u67e5\u627e\u65e5\u671f\u5bf9\u5e94\u7684DOM\u8282\u70b9
    _findDateElement : function(date){
      var _self = this,
        dateStr = DateUtil.format(date,DATE_MASK),
        activeList = _self.get('el').find('.' + CLS_DATE),
        result = null;
      if(dateStr){
        activeList.each(function(index,item){
          if($(item).attr('title') === dateStr){
            result = $(item);
            return false;
          }
        });
      }
      return result;
    },
    //\u8bbe\u7f6e\u9009\u4e2d\u7684\u65e5\u671f
    _setSelectedDate : function(date){
      var _self = this,
        dateEl = _self._findDateElement(date);

      _self._clearSelectedDate();
      if(dateEl){
        dateEl.addClass(CLS_SELECTED);
      }
    }
  },{
    ATTRS : {

    }
  });
  
  /**
   * \u65e5\u5386\u63a7\u4ef6\u663e\u793a\u65e5\u671f\u7684\u5bb9\u5668
   * xclass:'calendar-panel'
   * @class BUI.Calendar.Panel
   * @private
   * @extends BUI.Component.Controller
   */
  var panel = Component.Controller.extend(
  /**
  * @lends  BUI.Calendar.Panel.prototype 
  * @ignore
  */
  {

    /**
     * \u8bbe\u7f6e\u9ed8\u8ba4\u5e74\u6708
     * @protected
     */
    initializer : function(){
      var _self = this,
        now = new Date();
      if(!_self.get('year')){
        _self.set('year',now.getFullYear());
      }

      if(!_self.get('month')){
        _self.set('month',now.getMonth());
      }
    },
    /**
     * @protected
     * @ignore
     */
    bindUI : function(){
      var _self = this,
        el = _self.get('el');
      el.delegate('.' + CLS_DATE,'click',function(e){
        e.preventDefault();
      });
      //\u963b\u6b62\u7981\u7528\u7684\u65e5\u671f\u88ab\u9009\u62e9
      el.delegate('.' + CLS_DISABLED,'mouseup',function(e){
        e.stopPropagation();
      });
    },
    /**
     * @protected
     * @ignore
     */
    performActionInternal : function(ev){
      var _self = this,
        sender = $(ev.target).closest('.' + CLS_DATE);
      if(sender){
        var date = sender.attr('title');
        if(date){
          date = DateUtil.parse(date);
          if(_self.get('view')._isInRange(date)){
            _self.set('selected',date);
          }
          //_self.fire('click',{date:date});
        }
      }
    },
    /**
     * \u8bbe\u7f6e\u5e74\u6708
     * @param {Number} year  \u5e74
     * @param {Number} month \u6708
     */
    setMonth : function(year,month){
      var _self = this,
        curYear = _self.get('year'),
        curMonth = _self.get('month');
      if(year !== curYear || month !== curMonth){
        _self.set('year',year);
        _self.set('month',month);
    		//if(_self.get('rendered')){
    			_self.get('view').updatePanel();
    		//}
      }
    },
    //\u9009\u4e2d\u65e5\u671f
    _uiSetSelected : function(date,ev){
      var _self = this;
      
      if(!(ev && ev.prevVal && DateUtil.isDateEquals(date,ev.prevVal))){
        _self.setMonth(date.getFullYear(),date.getMonth());
        _self.get('view')._setSelectedDate(date);
        _self.fire('selectedchange',{date:date});
      } 
    },
    //\u8bbe\u7f6e\u6700\u65e5\u671f
    _uiSetMaxDate : function(v){
      if(v){
        this.get('view').updatePanel();
      }
    },
    //\u8bbe\u7f6e\u6700\u5c0f\u65e5\u671f
    _uiSetMinDate : function(v){
      if(v){
        this.get('view').updatePanel();
      }
    }
  },{
    ATTRS:
    /**
     * @lends BUI.Calendar.Panel#
     * @ignore
     */
    {
      /**
       * \u5c55\u793a\u7684\u6708\u6240\u5c5e\u5e74
       * @type {Number}
       */
      year : {
        view :true
      },
      /**
       * \u5c55\u793a\u7684\u6708
       * @type {Number}
       */
      month:{
        view :true
      },
      /**
       * \u9009\u4e2d\u7684\u65e5\u671f
       * @type {Date}
       */
      selected : {

      },
      focusable:{
        value:true
      },
      /**
       * \u65e5\u671f\u7684\u6a21\u677f
       * @private
       * @type {Object}
       */
      dayTpl:{
        view : true,
        value:'<td class="x-datepicker-date x-datepicker-{dateType} {todayCls} day-{dayOfWeek}" title="{date}">'+
                '<a href="#" hidefocus="on" tabindex="1">'+
                  '<em><span>{dateNumber}</span></em>'+
                '</a>'+
              '</td>'
      },
      events:{
        value : {
          /**
           * @event
           * @name BUI.Calendar.Panel#click
           * @param {Object} e \u70b9\u51fb\u4e8b\u4ef6
           * @param {Date} e.date
           */
          'click' : false,
          /**
           * @name BUI.Calendar.Panel#selectedchange
           * @param {Object} e \u70b9\u51fb\u4e8b\u4ef6
           * @param {Date} e.date
           */
          'selectedchange' : false
        }
      },
      /**
       * \u6700\u5c0f\u65e5\u671f
       * @type {Date | String}
       */
      maxDate : {
        view : true,
        setter : function(val){
          if(val){
            if(BUI.isString(val)){
              return DateUtil.parse(val);
            }
            return val;
          }
        }
      },
      /**
       * \u6700\u5c0f\u65e5\u671f
       * @type {Date | String}
       */
      minDate : {
        view : true,
        setter : function(val){
          if(val){
            if(BUI.isString(val)){
              return DateUtil.parse(val);
            }
            return val;
          }
        }
      },
      /**
       * \u5468\u7684\u6a21\u677f
       * @private
       * @type {Object}
       */
      weekTpl:{
        view : true,
        value : '<tr>{daysTpl}</tr>'
      },
      tpl:{
        view:true,
        value:'<table class="x-datepicker-inner" cellspacing="0">' +
                '<thead>' +
                   '<tr>' +
                    '<th  title="Sunday"><span>\u65e5</span></th>' +
                    '<th  title="Monday"><span>\u4e00</span></th>' +
                    '<th  title="Tuesday"><span>\u4e8c</span></th>' +
                    '<th  title="Wednesday"><span>\u4e09</span></th>' +
                    '<th  title="Thursday"><span>\u56db</span></th>' +
                    '<th  title="Friday"><span>\u4e94</span></th>' +
                    '<th  title="Saturday"><span>\u516d</span></th>' +
                  '</tr>' +
                '</thead>' +
                '<tbody class="x-datepicker-body">' +
                '</tbody>' +
              '</table>'
      },
      xview : {value : panelView}
    }
  },{
    xclass:'calendar-panel',
    priority:0
  });

  return panel;
});
define('bui/calendar/calendar',['bui/picker','bui/calendar/monthpicker','bui/calendar/header','bui/calendar/panel','bui/toolbar'],function(require){

  var BUI = require('bui/common'),
    PREFIX = BUI.prefix,
    CLS_PICKER_TIME = 'x-datepicker-time',
    CLS_PICKER_HOUR = 'x-datepicker-hour',
    CLS_PICKER_MINUTE = 'x-datepicker-minute',
    CLS_PICKER_SECOND = 'x-datepicker-second',
    CLS_TIME_PICKER = 'x-timepicker',
    Picker = require('bui/picker').ListPicker,
    MonthPicker = require('bui/calendar/monthpicker'),
    Header = require('bui/calendar/header'),
    Panel = require('bui/calendar/panel'),
    Toolbar = require('bui/toolbar'),
    Component = BUI.Component,
    DateUtil = BUI.Date;

  function today(){
    var now = new Date();
    return new Date(now.getFullYear(),now.getMonth(),now.getDate());
  }

  function fixedNumber(n){
    if( n< 10 ){
      return '0'+n;
    }
    return n.toString();
  }
  function getNumberItems(end){
    var items = [];
    for (var i = 0; i < end; i++) {
      items.push({text:fixedNumber(i),value:fixedNumber(i)});
    }
    return items;
  }

  function getTimeUnit (self,cls){
    var inputEl = self.get('el').find('.' + cls);
    return parseInt(inputEl.val(),10);

  }

  function setTimeUnit (self,cls,val){
    var inputEl = self.get('el').find('.' + cls);
    if(BUI.isNumber(val)){
      val = fixedNumber(val);
    }
    inputEl.val(val);
  }



  /**
   * \u65e5\u671f\u63a7\u4ef6
   * <p>
   * <img src="../assets/img/class-calendar.jpg"/>
   * </p>
   * xclass:'calendar'
   * <pre><code>
   *  BUI.use('bui/calendar',function(Calendar){
   *    var calendar = new Calendar.Calendar({
   *      render:'#calendar'
   *    });
   *    calendar.render();
   *    calendar.on('selectedchange',function (ev) {
   *      alert(ev.date);
   *    });
   * });
   * </code></pre>
   * @class BUI.Calendar.Calendar
   * @extends BUI.Component.Controller
   */
  var calendar = Component.Controller.extend({

    //\u8bbe\u7f6e\u5185\u5bb9
    initializer: function(){
      var _self = this,
        children = _self.get('children'),
        header = new Header(),
        panel = new Panel(),
        footer = _self.get('footer') || _self._createFooter();/*,
        monthPicker = _self.get('monthPicker') || _self._createMonthPicker();*/


      //\u6dfb\u52a0\u5934
      children.push(header);
      //\u6dfb\u52a0panel
      children.push(panel);
      children.push(footer);
      //children.push(monthPicker);

      _self.set('header',header);
      _self.set('panel',panel);
      _self.set('footer',footer);
      //_self.set('monthPicker',monthPicker);
    },
    renderUI : function(){
      var _self = this,
      children = _self.get('children');
      if(_self.get('showTime')){
        var  timepicker = _self.get('timepicker') || _self._initTimePicker();
        children.push(timepicker);
        _self.set('timepicker',timepicker);
      }
    },
    //\u7ed1\u5b9a\u4e8b\u4ef6
    bindUI : function(){
      var _self = this,
        header = _self.get('header'),
        panel = _self.get('panel');

      panel.on('selectedchange',function(e){
        var date = e.date;
        if(!DateUtil.isDateEquals(date,_self.get('selectedDate'))){
          _self.set('selectedDate',date);
        }
      });
      if(!_self.get('showTime')){
        panel.on('click',function(){
          _self.fire('accept');
        });
      }else{
        _self._initTimePickerEvent();
      }

      header.on('monthchange',function(e){
        _self._setYearMonth(e.year,e.month);
      });

      header.on('headerclick',function(){
        var monthPicker = _self.get('monthpicker') || _self._createMonthPicker();
        monthPicker.set('year',header.get('year'));
        monthPicker.set('month',header.get('month'));
        monthPicker.show();
      });
    },
    _initTimePicker : function(){
      var _self = this,
        lockTime = _self.get('lockTime'),
        _timePickerEnum={hour:CLS_PICKER_HOUR,minute:CLS_PICKER_MINUTE,second:CLS_PICKER_SECOND};
      if(lockTime){
          for(var key in lockTime){
              var noCls = _timePickerEnum[key.toLowerCase()];
              _self.set(key,lockTime[key]);
              _self.get('el').find("."+noCls).attr("disabled","");
          }
      }
      var  picker = new Picker({
          elCls : CLS_TIME_PICKER,
          children:[{
            itemTpl : '<li><a href="#">{text}</a></li>'
          }],
          autoAlign : false,
          align : {
            node : _self.get('el'),
            points:['bl','bl'],
            offset:[0,-30]
          },
          trigger : _self.get('el').find('.' +CLS_PICKER_TIME)
        });
      picker.render();
      _self._initTimePickerEvent(picker);
      return picker;
    },
    _initTimePickerEvent : function(picker){
      var _self = this,
        picker= _self.get('timepicker');

      if(!picker){
        return;
      }

      picker.get('el').delegate('a','click',function(ev){
        ev.preventDefault();
      });
      picker.on('triggerchange',function(ev){
        var curTrigger = ev.curTrigger;
        if(curTrigger.hasClass(CLS_PICKER_HOUR)){
          picker.get('list').set('items',getNumberItems(24));
        }else{
          picker.get('list').set('items',getNumberItems(60));
        }
      });

      picker.on('selectedchange',function(ev){
        var curTrigger = ev.curTrigger,
          val = ev.value;
        if(curTrigger.hasClass(CLS_PICKER_HOUR)){
          _self.setInternal('hour',val);
        }else if(curTrigger.hasClass(CLS_PICKER_MINUTE)){
          _self.setInternal('minute',val);
        }else{
          _self.setInternal('second',val);
        }
      });
    },
    //\u66f4\u6539\u5e74\u548c\u6708
    _setYearMonth : function(year,month){
      var _self = this,
        selectedDate = _self.get('selectedDate'),
        date = selectedDate.getDate();
      if(year !== selectedDate.getFullYear() || month !== selectedDate.getMonth()){
        _self.set('selectedDate',new Date(year,month,date));
      }
    },
    //\u521b\u5efa\u9009\u62e9\u6708\u7684\u63a7\u4ef6
    _createMonthPicker: function(){
      var _self = this,
        monthpicker;
      monthpicker = new MonthPicker({
        render : _self.get('el'),
        effect : {
          effect:'slide',
          duration:300
        },
        visibleMode:'display',
        success : function(){
          var picker = this;
          _self._setYearMonth(picker.get('year'),picker.get('month'));
          picker.hide();
        },
        cancel : function(){
          this.hide();
        }
      });
      _self.set('monthpicker',monthpicker);
      _self.get('children').push(monthpicker);
      return monthpicker;
    },
    //\u521b\u5efa\u5e95\u90e8\u6309\u94ae\u680f
    _createFooter : function(){
      var _self = this,
        showTime = this.get('showTime'),
        items = [];

      if(showTime){
        items.push({
          content : _self.get('timeTpl')
        });
        items.push({
          xclass:'bar-item-button',
          text:'\u786e\u5b9a',
          btnCls: 'button button-small button-primary',
          listeners:{
            click:function(){
              _self.fire('accept');
            }
          }
        });
      }else{
        items.push({
          xclass:'bar-item-button',
          text:'\u4eca\u5929',
          btnCls: 'button button-small',
		      id:'todayBtn',
          listeners:{
            click:function(){
              var day = today();
              _self.set('selectedDate',day);
              _self.fire('accept');
            }
          }
        });
      }

      return new Toolbar.Bar({
          elCls : PREFIX + 'calendar-footer',
          children:items
        });
    },
	//\u66f4\u65b0\u4eca\u5929\u6309\u94ae\u7684\u72b6\u6001
    _updateTodayBtnAble: function () {
            var _self = this;
            if (!_self.get('showTime')) {
                var footer = _self.get("footer"),
                    panelView = _self.get("panel").get("view"),
                    now = today(),
                    btn = footer.getItem("todayBtn");
                panelView._isInRange(now) ? btn.enable() : btn.disable();
            }
    },
    //\u8bbe\u7f6e\u6240\u9009\u65e5\u671f
    _uiSetSelectedDate : function(v){
      var _self = this,
        year = v.getFullYear(),
        month = v.getMonth();

      _self.get('header').setMonth(year,month);
      _self.get('panel').set('selected',v);
      _self.fire('datechange',{date:v});
    },
    _uiSetHour : function(v){
      setTimeUnit(this,CLS_PICKER_HOUR,v);
    },
    _uiSetMinute : function(v){
      setTimeUnit(this,CLS_PICKER_MINUTE,v);
    },
    _uiSetSecond : function(v){
      setTimeUnit(this,CLS_PICKER_SECOND,v);
    },
    //\u8bbe\u7f6e\u6700\u5927\u503c
    _uiSetMaxDate : function(v){
      var _self = this;
      _self.get('panel').set('maxDate',v);
	  _self._updateTodayBtnAble();
    },
    //\u8bbe\u7f6e\u6700\u5c0f\u503c
    _uiSetMinDate : function(v){
      var _self = this;
      _self.get('panel').set('minDate',v);
	  _self._updateTodayBtnAble();
    }

  },{
    ATTRS :
    /**
     * @lends BUI.Calendar.Calendar#
     * @ignore
     */
    {
      /**
       * \u65e5\u5386\u63a7\u4ef6\u5934\u90e8\uff0c\u9009\u62e9\u5e74\u6708
       * @private
       * @type {Object}
       */
      header:{

      },

      /**
       * \u65e5\u5386\u63a7\u4ef6\u9009\u62e9\u65e5
       * @private
       * @type {Object}
       */
      panel:{

      },
      /**
       * \u6700\u5927\u65e5\u671f
       * <pre><code>
       *   calendar.set('maxDate','2013-07-29');
       * </code></pre>
       * @type {Date}
       */
      maxDate : {

      },
      /**
       * \u6700\u5c0f\u65e5\u671f
       * <pre><code>
       *   calendar.set('minDate','2013-07-29');
       * </code></pre>
       * @type {Date}
       */
      minDate : {

      },
      /**
       * \u9009\u62e9\u6708\u4efd\u63a7\u4ef6
       * @private
       * @type {Object}
       */
      monthPicker : {

      },
      /**
       * \u9009\u62e9\u65f6\u95f4\u63a7\u4ef6
       * @private
       * @type {Object}
       */
      timepicker:{

      },
      width:{
        value:180
      },
      events:{
        value:{
           /**
           * @event
           * @name BUI.Calendar.Calendar#click
           * @param {Object} e \u70b9\u51fb\u4e8b\u4ef6
           * @param {Date} e.date
           */
          'click' : false,
          /**
           * \u786e\u8ba4\u65e5\u671f\u66f4\u6539\uff0c\u5982\u679c\u4e0d\u663e\u793a\u65e5\u671f\u5219\u5f53\u70b9\u51fb\u65e5\u671f\u6216\u8005\u70b9\u51fb\u4eca\u5929\u6309\u94ae\u65f6\u89e6\u53d1\uff0c\u5982\u679c\u663e\u793a\u65e5\u671f\uff0c\u5219\u5f53\u70b9\u51fb\u786e\u8ba4\u6309\u94ae\u65f6\u89e6\u53d1\u3002
           * @event
           */
          'accept' : false,
          /**
           * @event
           * @name BUI.Calendar.Calendar#datechange
           * @param {Object} e \u9009\u4e2d\u7684\u65e5\u671f\u53d1\u751f\u6539\u53d8
           * @param {Date} e.date
           */
          'datechange' : false,
           /**
           * @event
           * @name BUI.Calendar.Calendar#monthchange
           * @param {Object} e \u6708\u4efd\u53d1\u751f\u6539\u53d8
           * @param {Number} e.year
           * @param {Number} e.month
           */
          'monthchange' : false
        }
      },
      /**
       * \u662f\u5426\u9009\u62e9\u65f6\u95f4,\u6b64\u9009\u9879\u51b3\u5b9a\u662f\u5426\u53ef\u4ee5\u9009\u62e9\u65f6\u95f4
       *
       * @cfg {Boolean} showTime
       */
      showTime : {
        value : false
      },
      /**
      * \u9501\u5b9a\u65f6\u95f4\u9009\u62e9
      *<pre><code>
      *  var calendar = new Calendar.Calendar({
      *  render:'#calendar',
      *  lockTime : {hour:00,minute:30} //\u8868\u793a\u9501\u5b9a\u65f6\u4e3a00,\u5206\u4e3a30\u5206,\u79d2\u65e0\u9501\u7528\u6237\u53ef\u9009\u62e9
      * });
      * </code></pre>
       *
       * @type {Object}
      */
      lockTime :{
      },
      timeTpl : {
        value : '<input type="text" readonly class="' + CLS_PICKER_TIME + ' ' + CLS_PICKER_HOUR + '" />:<input type="text" readonly class="' + CLS_PICKER_TIME + ' ' + CLS_PICKER_MINUTE + '" />:<input type="text" readonly class="' + CLS_PICKER_TIME + ' ' + CLS_PICKER_SECOND + '" />'
      },
      /**
       * \u9009\u62e9\u7684\u65e5\u671f,\u9ed8\u8ba4\u4e3a\u5f53\u5929
       * <pre><code>
       *  var calendar = new Calendar.Calendar({
       *  render:'#calendar',
       *   selectedDate : new Date('2013/07/01') //\u4e0d\u80fd\u4f7f\u7528\u5b57\u7b26\u4e32
       * });
       * </code></pre>
       * @cfg {Date} selectedDate
       */
      /**
       * \u9009\u62e9\u7684\u65e5\u671f
       * <pre><code>
       *   calendar.set('selectedDate',new Date('2013-9-01'));
       * </code></pre>
       * @type {Date}
       * @default today
       */
      selectedDate : {
        value : today()
      },
      /**
       * \u5c0f\u65f6,\u9ed8\u8ba4\u4e3a\u5f53\u524d\u5c0f\u65f6
       * @type {Number}
       */
      hour : {
        value : new Date().getHours()
      },
      /**
       * \u5206,\u9ed8\u8ba4\u4e3a\u5f53\u524d\u5206
       * @type {Number}
       */
      minute:{
        value : new Date().getMinutes()
      },
      /**
       * \u79d2,\u9ed8\u8ba4\u4e3a\u5f53\u524d\u79d2
       * @type {Number}
       */
      second : {
        value : 0
      }
    }
  },{
    xclass : 'calendar',
    priority : 0
  });

  return calendar;
});
define('bui/calendar/datepicker',['bui/common','bui/picker','bui/calendar/calendar'],function(require){
  
  var BUI = require('bui/common'),
    Picker = require('bui/picker').Picker,
    Calendar = require('bui/calendar/calendar'),
    DateUtil = BUI.Date;

  /**
   * \u65e5\u671f\u9009\u62e9\u5668\uff0c\u53ef\u4ee5\u7531\u8f93\u5165\u6846\u7b49\u89e6\u53d1
   * <p>
   * <img src="../assets/img/class-calendar.jpg"/>
   * </p>
   * xclass : 'calendar-datepicker'
   * <pre><code>
   *   BUI.use('bui/calendar',function(Calendar){
   *      var datepicker = new Calendar.DatePicker({
   *        trigger:'.calendar',
   *        //delegateTigger : true, //\u5982\u679c\u8bbe\u7f6e\u6b64\u53c2\u6570\uff0c\u90a3\u4e48\u65b0\u589e\u52a0\u7684.calendar\u5143\u7d20\u4e5f\u4f1a\u652f\u6301\u65e5\u5386\u9009\u62e9
   *        autoRender : true
   *      });
   *    });
   * </code></pre>
   * @class BUI.Calendar.DatePicker
   * @extends BUI.Picker.Picker
   */
  var datepicker = Picker.extend({

    initializer:function(){
      
    },
    /**
     * @protected
     * \u521d\u59cb\u5316\u5185\u90e8\u63a7\u4ef6
     */
    createControl : function(){
      var _self = this,
        children = _self.get('children'),
        calendar = new Calendar({
          render : _self.get('el'),
          showTime : _self.get('showTime'),
          lockTime : _self.get('lockTime'),
          minDate: _self.get('minDate'),
          maxDate: _self.get('maxDate'),
          autoRender : true
        });

      if (!_self.get('dateMask')) {
        if (_self.get('showTime')) {
            _self.set('dateMask', 'yyyy-mm-dd HH:MM:ss');
        } else {
            _self.set('dateMask', 'yyyy-mm-dd');
        }
       }  
      children.push(calendar);
      _self.set('calendar',calendar);
      return calendar;
    },
    /**
     * \u8bbe\u7f6e\u9009\u4e2d\u7684\u503c
     * <pre><code>
     *   datePicker.setSelectedValue('2012-01-1');
     * </code></pre>
     * @param {String} val \u8bbe\u7f6e\u503c
     * @protected
     */
    setSelectedValue : function(val){
      if(!this.get('calendar')){
        return;
      }
      var _self = this,
        calendar = this.get('calendar'),
        date = DateUtil.parse(val,_self.get("dateMask"));
      date = date || new Date(new Date().setSeconds(0));
      calendar.set('selectedDate',DateUtil.getDate(date));
      if(_self.get('showTime')){
          var lockTime = this.get("lockTime"),
              hour = lockTime&&lockTime['hour']?lockTime['hour']:date.getHours(),
              minute = lockTime&&lockTime['minute']?lockTime['minute']:date.getMinutes(),
              second = lockTime&&lockTime['second']?lockTime['second']:date.getSeconds();
        calendar.set('hour',hour);
        calendar.set('minute',minute);
        calendar.set('second',second);
      }
    },
    /**
     * \u83b7\u53d6\u9009\u4e2d\u7684\u503c
     * @protected
     * @return {String} \u9009\u4e2d\u7684\u503c
     */
    getSelectedValue : function(){
      if(!this.get('calendar')){
        return null;
      }
      var _self = this, 
        calendar = _self.get('calendar'),
      date =  DateUtil.getDate(calendar.get('selectedDate'));
      if(_self.get('showTime')){
        date = DateUtil.addHour(calendar.get('hour'),date);
        date = DateUtil.addMinute(calendar.get('minute'),date);
        date = DateUtil.addSecond(calendar.get('second'),date);
      }
      return date;
    },
    /**
     * \u83b7\u53d6\u9009\u4e2d\u9879\u7684\u6587\u672c\uff0c\u591a\u9009\u72b6\u6001\u4e0b\uff0c\u6587\u672c\u4ee5','\u5206\u5272
     * @protected
     * @return {String} \u9009\u4e2d\u7684\u6587\u672c
     */
    getSelectedText : function(){
      if(!this.get('calendar')){
        return '';
      }
      return DateUtil.format(this.getSelectedValue(),this._getFormatType());
    },
    _getFormatType : function(){
      return this.get('dateMask');
    },
    //\u8bbe\u7f6e\u6700\u5927\u503c
    _uiSetMaxDate : function(v){
      if(!this.get('calendar')){
        return null;
      }
      var _self = this;
      _self.get('calendar').set('maxDate',v);
    },
    //\u8bbe\u7f6e\u6700\u5c0f\u503c
    _uiSetMinDate : function(v){
      if(!this.get('calendar')){
        return null;
      }
      var _self = this;
      _self.get('calendar').set('minDate',v);
    }

  },{
    ATTRS : 
    /**
     * @lends BUI.Calendar.DatePicker#
     * @ignore
     */
    {
      /**
       * \u662f\u5426\u663e\u793a\u65e5\u671f
       * <pre><code>
       *  var datepicker = new Calendar.DatePicker({
       *    trigger:'.calendar',
       *    showTime : true, //\u53ef\u4ee5\u9009\u62e9\u65e5\u671f
       *    autoRender : true
       *  });
       * </code></pre>
       * @type {Boolean}
       */
      showTime : {
        value:false
      },
       /**
       * \u9501\u5b9a\u65f6\u95f4\u9009\u62e9
       *<pre><code>
       *  var calendar = new Calendar.Calendar({
       *  render:'#calendar',
       *  lockTime : {hour:00,minute:30} //\u8868\u793a\u9501\u5b9a\u65f6\u4e3a00,\u5206\u4e3a30\u5206,\u79d2\u65e0\u9501\u7528\u6237\u53ef\u9009\u62e9
       * });
       * </code></pre>
       *
       * @type {Object}
       */
      lockTime :{
      },
      /**
       * \u6700\u5927\u65e5\u671f
       * <pre><code>
       *   var datepicker = new Calendar.DatePicker({
       *     trigger:'.calendar',
       *     maxDate : '2014-01-01',
       *     minDate : '2013-7-25',
       *     autoRender : true
       *   });
       * </code></pre>
       * @type {Date}
       */
      maxDate : {

      },
      /**
       * \u6700\u5c0f\u65e5\u671f
       * <pre><code>
       *   var datepicker = new Calendar.DatePicker({
       *     trigger:'.calendar',
       *     maxDate : '2014-01-01',
       *     minDate : '2013-7-25',
       *     autoRender : true
       *   });
       * </code></pre>
       * @type {Date}
       */
      minDate : {

      },
	  /**
       * \u8fd4\u56de\u65e5\u671f\u683c\u5f0f\uff0c\u5982\u679c\u4e0d\u8bbe\u7f6e\u9ed8\u8ba4\u4e3a yyyy-mm-dd\uff0c\u65f6\u95f4\u9009\u62e9\u4e3atrue\u65f6\u4e3a yyyy-mm-dd HH:MM:ss
       * <pre><code>
       *   calendar.set('dateMask','yyyy-mm-dd');
       * </code></pre>
       * @type {String}
      */
      dateMask: {

      },
      changeEvent:{
        value:'accept'
      },
      hideEvent:{
        value:'accept'
      },
      /**
       * \u65e5\u5386\u5bf9\u8c61,\u53ef\u4ee5\u8fdb\u884c\u66f4\u591a\u7684\u64cd\u4f5c\uff0c\u53c2\u770b{@link BUI.Calendar.Calendar}
       * @type {BUI.Calendar.Calendar}
       */
      calendar:{

      }
    }
  },{
    xclass : 'datepicker',
    priority : 0
  });
  return datepicker;
  
});